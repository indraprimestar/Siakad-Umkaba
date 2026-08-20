<?php

namespace App\Http\Controllers\Operator;

use App\Enums\StudyPlanStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Operator\StudyPlanOperatorResource;
use App\Models\Student;
use App\Models\StudyPlan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use Inertia\Response;

class StudyPlanOperatorController extends Controller
{
    public function index(Student $student): Response
    {
        $studyPlans = StudyPlan::query()
            ->select(['id', 'student_id', 'academic_year_id', 'status', 'notes', 'semester', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->where('student_id', $student->id)
            ->with([
                'student.user',
                'student.classroom',
                'academicYear',
                'schedules.course',
                'schedules.classroom',
                'schedules.academicYear',
            ])
            ->paginate(request()->load ?? 10);

        return inertia('Operators/Students/StudyPlans/Index', props: [
            'page_settings' => [
                'title' => 'Kartu Rencana Studi',
                'subtitle' => 'Menampilkan semua data kartu rencana studi',
            ],
            'studyPlans' => StudyPlanOperatorResource::collection(resource: $studyPlans)->additional(data: [
                'meta' => [
                    'has_pages' => $studyPlans->hasPages(),
                ],
            ]),

            'student' => $student,

            'state' => [
                'page' => request()->page ?? 1,

                'search' => request()->search ?? '',

                'load' => 10,
            ],
            'statuses' => StudyPlanStatus::options(),
        ]);
    }

    public function approve(Request $request, Student $student, StudyPlan $studyPlan)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:Pending,Approved,Rejected'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $studyPlan->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? $studyPlan->notes,
        ]);

        if ($validated['status'] === StudyPlanStatus::APPROVED->value) {
            $studyResult = \App\Models\StudyResult::firstOrCreate([
                'student_id' => $studyPlan->student_id,
                'academic_year_id' => $studyPlan->academic_year_id,
                'semester' => $studyPlan->semester,
            ]);

            $studyPlan->loadMissing('schedules');
            foreach ($studyPlan->schedules as $schedule) {
                if ($schedule->course_id) {
                    \App\Models\StudyResultGrade::firstOrCreate([
                        'study_result_id' => $studyResult->id,
                        'course_id' => $schedule->course_id,
                    ], [
                        'letter' => '-',
                        'weight_of_value' => 0,
                        'grade' => 0,
                    ]);
                }
            }
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Status KRS mahasiswa ' . $student->user->name . ' berhasil diperbarui.',
        ]);
    }
}