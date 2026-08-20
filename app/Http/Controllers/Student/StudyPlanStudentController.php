<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\StudyPlanStudentResource;
use App\Http\Resources\Student\StudyPlanScheduleStudentResource;
use App\Models\StudyPlan;
use App\Models\Schedule;
use App\Enums\StudyPlanStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class StudyPlanStudentController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('checkActiveAcademicYear'),
            new Middleware('checkFeeStudent', except:['index']),
        ];
    }

    public function index(): Response
    {
        $studyPlans = StudyPlan::query()
            ->select(['id', 'student_id', 'academic_year_id', 'status', 'created_at'])
            ->where('student_id', auth()->user()->student?->id)
            ->with(['academicYear'])
            ->latest('created_at')
            ->paginate(request()->load ?? 10);

        return Inertia::render('Students/StudyPlans/Index', [
            'page_settings' => [
                'title' => 'Kartu Rencana Studi',
                'subtitle' => 'Menampilkan semua kartu rencana studi anda',
            ],
            'studyPlans' => StudyPlanStudentResource::collection($studyPlans)->additional([
                'meta' => [
                    'has_pages' => $studyPlans->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ],
        ]);
    }

    public function create(): Response | RedirectResponse
    {
        if (!activeAcademicYear()) {
            flashMessage(
                message: 'Tidak ada tahun akademik aktif',
                type: 'warning'
            );
            return back();
        }

        $student = auth()->user()->student;
        $academicYear = activeAcademicYear();

        if (!$student) {
            flashMessage(
                message: 'Data mahasiswa tidak ditemukan',
                type: 'warning'
            );
            return back();
        }

        // Check if student already submitted KRS
        $existingStudyPlan = StudyPlan::query()
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->whereNot('status', StudyPlanStatus::REJECTED)
            ->first();

        if ($existingStudyPlan) {
            return redirect()
                ->route('students.study-plans.index')
                ->with('flash', [
                    'message' => 'Anda sudah mengajukan KRS untuk semester ini',
                    'type' => 'warning'
                ]);
        }

        // Fetch schedules
        $schedules = Schedule::query()
            ->where('faculty_id', $student->faculty_id)
            ->where('department_id', $student->department_id)
            ->where('academic_year_id', $academicYear->id)
            ->with(['course', 'classroom', 'academicYear'])
            ->withCount(['studyPlan as taken_quota' => function ($query) {
                $query->whereNot('status', \App\Enums\StudyPlanStatus::REJECTED);
            }])
            ->orderBy('day_of_week')
            ->get();

        if ($schedules->isEmpty()) {
            return redirect()
                ->route('students.study-plans.index')
                ->with('flash', [
                    'message' => 'Tidak ada jadwal tersedia untuk semester ini',
                    'type' => 'warning'
                ]);
        }

        return inertia('Students/StudyPlans/Create', [
            'page_settings' => [
                'title' => 'Tambah kartu rencana studi',
                'subtitle' => 'Harap pilih mata kuliah yang sesuai dengan kelas anda',
                'method' => 'POST',
                'action' => route('students.study-plans.store'),
            ],
            'schedules' => StudyPlanScheduleStudentResource::collection($schedules),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'schedule_id'   => ['required', 'array', 'min:1'],
            'schedule_id.*' => ['integer', 'exists:schedules,id'],
        ]);

        $student      = auth()->user()->student;
        $academicYear = activeAcademicYear();

        $studyPlan = StudyPlan::create([
            'student_id'       => $student->id,
            'academic_year_id' => $academicYear->id,
            'semester'         => $student->semester,
            'status'           => StudyPlanStatus::PENDING,
        ]);

        $studyPlan->schedules()->attach($validated['schedule_id']);

        flashMessage(message: 'KRS berhasil diajukan', type: 'success');

        return to_route('students.study-plans.show', $studyPlan);
    }

    public function show(StudyPlan $studyPlan): Response
    {
        // PENTING: load relasi dulu, sebelum dibungkus Resource.
        // Tanpa ini, whenLoaded() di Resource akan selalu null/kosong
        // meskipun datanya ada di database.
        $studyPlan->load(['schedules.course', 'schedules.classroom', 'academicYear']);

        return Inertia::render('Students/StudyPlans/Show', [
            'page_settings' => [
                'title' => 'Detail KRS',
                'subtitle' => 'Lihat detail kartu rencana studi Anda',
            ],
            // PENTING: pakai StudyPlanStudentResource (sudah punya field
            // schedules + academicYear lengkap). StudyPlanScheduleStudentResource
            // adalah resource untuk SATU Schedule individual, bukan StudyPlan.
            'studyPlan' => StudyPlanStudentResource::make($studyPlan),
        ]);
    }
}