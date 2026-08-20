<?php

namespace App\Http\Controllers\Operator;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Operator\CourseOperatorRequest;
use App\Http\Resources\Operator\CourseOperatorResource;
use App\Models\Course;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Throwable;

class CourseOperatorController extends Controller
{
    /**
     * Display a listing of courses
     */
    public function index(): Response
    {
        $courses = Course::query()
            ->with(['teacher.user', 'department', 'faculty'])
            ->select([
                'courses.id',
                'courses.faculty_id',
                'courses.department_id',
                'courses.teacher_id',
                'courses.code',
                'courses.name',
                'courses.credit',
                'courses.semester',
                'courses.created_at'
            ])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->where('courses.faculty_id', auth()->user()->operator->faculty_id)
            ->where('courses.department_id', auth()->user()->operator->department_id)
            ->paginate(request()->get('load') ?? 10);

        return inertia('Operators/Courses/Index', [
            'page_settings' => [
                'title' => 'Mata Kuliah',
                'subtitle' => 'Menampilkan semua data mata kuliah yang tersedia',
            ],
            'courses' => [
                'data' => CourseOperatorResource::collection($courses)->resolve(),
                'meta' => [
                    'current_page' => $courses->currentPage(),
                    'per_page' => $courses->perPage(),
                    'total' => $courses->total(),
                    'from' => $courses->firstItem(),
                    'to' => $courses->lastItem(),
                    'has_pages' => $courses->hasPages(),
                ],
                'links' => [
                    'first' => $courses->url(1),
                    'last' => $courses->url($courses->lastPage()),
                    'next' => $courses->nextPageUrl(),
                    'prev' => $courses->previousPageUrl(),
                ],
            ],
            'state' => [
                'page' => request()->get('page') ?? 1,
                'search' => request()->get('search') ?? '',
                'load' => 10,
            ],
        ]);
    }

    /**
     * Show the form for creating a new course
     */
    public function create(): Response
    {
        $operator = auth()->user()->operator;

        $teachers = Teacher::query()
            ->where('faculty_id', $operator->faculty_id)
            ->where('department_id', $operator->department_id)
            ->with(['user'])
            ->get()
            ->map(fn($teacher) => [
                'value' => $teacher->id,
                'label' => $teacher->user->name ?? 'Unknown',
            ])
            ->toArray();

        return inertia('Operators/Courses/Create', [
            'page_settings' => [
                'title' => 'Tambah Mata Kuliah',
                'subtitle' => 'Buat mata kuliah baru disini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('operators.courses.store'),
            ],
            'teachers' => $teachers,
        ]);
    }

    /**
     * Store a newly created course in database
     */
    public function store(CourseOperatorRequest $request): RedirectResponse
    {
        try {
            Course::create([
                'code' => $request->code,
                'name' => $request->name,
                'credit' => $request->credit,
                'semester' => $request->semester,
                'teacher_id' => $request->teacher_id,
                'faculty_id' => auth()->user()->operator->faculty_id,
                'department_id' => auth()->user()->operator->department_id,
                'academic_year_id' => activeAcademicYear()?->id,
            ]);

            flashMessage(MessageType::CREATED->message('Mata Kuliah'));
            return to_route('operators.courses.index');

        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('operators.courses.index');
        }
    }

    /**
     * Show the form for editing the specified course
     */
    public function edit(Course $course): Response
    {
        $operator = auth()->user()->operator;

        $teachers = Teacher::query()
            ->where('faculty_id', $operator->faculty_id)
            ->where('department_id', $operator->department_id)
            ->with(['user'])
            ->get()
            ->map(fn($teacher) => [
                'value' => $teacher->id,
                'label' => $teacher->user->name ?? 'Unknown',
            ])
            ->toArray();

        return inertia('Operators/Courses/Edit', [
            'page_settings' => [
                'title' => 'Edit Mata Kuliah',
                'subtitle' => 'Edit mata kuliah disini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('operators.courses.update', $course),
            ],
            'course' => $course,
            'teachers' => $teachers,
        ]);
    }

    /**
     * Update the specified course in database
     */
    public function update(CourseOperatorRequest $request, Course $course): RedirectResponse
    {
        try {
            $course->update([
                'code' => $request->code,
                'name' => $request->name,
                'credit' => $request->credit,
                'semester' => $request->semester,
                'teacher_id' => $request->teacher_id,
            ]);

            flashMessage(MessageType::UPDATED->message('Mata Kuliah'));
            return to_route('operators.courses.index');

        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('operators.courses.index');
        }
    }

    /**
     * Delete the specified course from database
     */
    public function destroy(Course $course): RedirectResponse
    {
        try {
            $course->delete();

            flashMessage(MessageType::DELETED->message('Mata Kuliah'));
            return to_route('operators.courses.index');

        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('operators.courses.index');
        }
    }
}