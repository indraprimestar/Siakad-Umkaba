<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Resources\Teacher\CourseStudentClassroomResource;
use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\Course;
use App\Models\Grade;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\StudyResult;
use App\Models\StudyResultGrade;
use Carbon\Carbon;
use App\Http\Requests\Teacher\CourseClassroomRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Traits\CalculateFinalScore;
use Throwable;

class CourseClassroomController extends Controller
{
    use CalculateFinalScore;

    public function index(Course $course, Classroom $classroom)
    {
        $schedule = Schedule::query()
            ->where('course_id', $course->id)
            ->where('classroom_id', $classroom->id)
            ->first();

        $students = Student::query()
            ->filter(request()->only(['search']))
            ->whereHas('user', function ($query) {
                $query->whereHas('roles', fn ($query) => $query->where('name', 'Mahasiswa'));
            })
            ->whereHas('studyPlans', function ($query) use ($schedule) {
                $query->where('academic_year_id', activeAcademicYear()->id)
                    ->approved()
                    ->whereHas('schedules', fn ($query) => $query->where('schedule_id', $schedule->id));
            })
            ->with([
                'user',
                'attendances' => fn ($query) => $query->where('course_id', $course->id)->where('classroom_id', $classroom->id),
                'grades' => fn ($query) => $query->where('course_id', $course->id)->where('classroom_id', $classroom->id),
            ])
            ->withCount([
                'attendances' => fn ($query) => $query->where('course_id', $course->id)->where('classroom_id', $classroom->id),
            ])
            ->withSum(['grades as tasks_count' => function ($query) use ($course, $classroom) {
                $query->where('course_id', $course->id)
                    ->where('classroom_id', $classroom->id)
                    ->where('category', 'tugas')
                    ->whereBetween('section', [0, 9]);
            }], 'grade')
            ->withSum(['grades as uts_count' => function ($query) use ($course, $classroom) {
                $query->where('course_id', $course->id)
                    ->where('classroom_id', $classroom->id)
                    ->where('category', 'uts')
                    ->whereNull('section');
            }], 'grade')
            ->withSum(['grades as uas_count' => function ($query) use ($course, $classroom) {
                $query->where('course_id', $course->id)
                    ->where('classroom_id', $classroom->id)
                    ->where('category', 'uas')
                    ->whereNull('section');
            }], 'grade')
            ->paginate(request()->per_page ?? 10)
            ->withQueryString();

        return inertia('Teachers/Classrooms/Index', [
            'page_settings' => [
                'title' => "Kelas {$classroom->name} - Mata kuliah {$course->name}",
                'subtitle' => 'Menampilkan data mahasiswa',
                'method' => 'PUT',
                'action' => route('teachers.classrooms.sync', [$course, $classroom]),
            ],
            'course' => $course,
            'classroom' => $classroom,
            'students' => CourseStudentClassroomResource::collection($students),
            'state' => [
                'search' => request()->search ?? '',
            ],
        ]);
    }

    public function calculateGPA(int $studentId)
    {
        $student = Student::query()
            ->where('id', $studentId)
            ->first();

        if (!$student) {
            return 0;
        }

        $studyResult = StudyResult::query()
            ->where('student_id', $student->id)
            ->where('academic_year_id', activeAcademicYear()->id)
            ->where('semester', $student->semester)
            ->first();

        if (!$studyResult) {
            return 0;
        }

        $studyResultGrades = StudyResultGrade::query()
            ->where('study_result_id', $studyResult->id)
            ->get();

        $totalScore = 0;
        $totalWeight = 0;

        foreach ($studyResultGrades as $grade) {
            $finalScore = min($grade->grade, 100);
            $gpaScore = ($finalScore / 100) * 4;
            $weight = $grade->weight_of_value;

            $totalScore += $gpaScore * $weight;
            $totalWeight += $weight;
        }

        if ($totalWeight > 0) {
            return min(round($totalScore / $totalWeight, 2), 4);
        }

        return 0;
    }

    public function updateGPA(int $studentId)
    {
        $student = Student::query()
            ->where('id', $studentId)
            ->first();

        if (!$student) {
            return;
        }

        $gpa = $this->calculateGPA(studentId: $student->id);

        $studyResult = StudyResult::query()
            ->where('student_id', $student->id)
            ->where('academic_year_id', activeAcademicYear()->id)
            ->where('semester', $student->semester)
            ->first();

        if ($studyResult) {
            $studyResult->update([
                'gpa' => $gpa,
            ]);
        }
    }

    public function sync(Course $course, Classroom $classroom, CourseClassroomRequest $request): RedirectResponse
    {
        try {
            \DB::beginTransaction();

            $attendances = array_map(function ($item) {
                $item['created_at'] = Carbon::now();
                $item['updated_at'] = Carbon::now();
                return $item;
            }, $request->attendances);

            $grades = array_map(function ($item) {
                $item['created_at'] = Carbon::now();
                $item['updated_at'] = Carbon::now();
                return $item;
            }, $request->grades);

            $studentIds = collect($attendances)
                ->pluck('student_id')
                ->merge(collect($grades)->pluck('student_id'))
                ->unique()
                ->values();

            $studyResults = StudyResult::query()
                ->whereIn('student_id', $studentIds)
                ->where('academic_year_id', activeAcademicYear()?->id)
                ->get();

            // Hapus data lama untuk student ini agar tidak terjadi duplikasi
            Attendance::whereIn('student_id', $studentIds)
                ->where('course_id', $course->id)
                ->where('classroom_id', $classroom->id)
                ->delete();

            Grade::whereIn('student_id', $studentIds)
                ->where('course_id', $course->id)
                ->where('classroom_id', $classroom->id)
                ->delete();

            // Insert data baru
            if (!empty($attendances)) Attendance::insert($attendances);
            if (!empty($grades)) Grade::insert($grades);

            $studyResults->each(function ($result) use ($course, $classroom) {
                $finalScore = $this->calculateFinalScore(
                    attendancePercentage: $this->calculateAttendacePercentage(
                        $this->getAttendanceCount($result->student_id, $course->id, $classroom->id)
                    ),
                    taskPercentage: $this->calculateTaskPercentage(
                        $this->getGradeCount($result->student_id, $course->id, $classroom->id, 'tugas')
                    ),
                    utsPercentage: $this->calculateUTSPercentage(
                        $this->getGradeCount($result->student_id, $course->id, $classroom->id, 'uts')
                    ),
                    uasPercentage: $this->calculateUASPercentage(
                        $this->getGradeCount($result->student_id, $course->id, $classroom->id, 'uas')
                    ),
                );

                StudyResultGrade::updateOrCreate(
                    [
                        'study_result_id' => $result->id,
                        'course_id' => $course->id,
                    ],
                    [
                        'grade' => $finalScore,
                        'letter' => getLetterGrade($finalScore),
                        'weight_of_value' => $this->getWeight(getLetterGrade($finalScore)),
                    ]
                );

                $this->updateGPA($result->student_id);
            });

            \DB::commit();

            return redirect()->back()->with('success', 'Berhasil melakukan perubahan');

        } catch (Throwable $e) {
            \DB::rollBack();

            return redirect()->back()->with('error', 'Error: ' . $e->getMessage());
        }
    }
}