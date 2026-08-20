<?php

namespace App\Http\Controllers\Operator;

use App\Enums\MessageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Operator\ClassroomOperatorRequest;
use App\Http\Resources\Operator\ClassroomOperatorResource;
use App\Models\Classroom;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Throwable;

class ClassroomOperatorController extends Controller
{
    /**
     * Display a listing of classrooms
     */
    public function index(): Response
    {
        $classrooms = Classroom::query()
            ->select(['id', 'faculty_id', 'department_id', 'academic_year_id', 'name', 'slug', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->where('faculty_id', auth()->user()->operator->faculty_id)
            ->where('department_id', auth()->user()->operator->department_id)
            ->with(['academicYear'])
            ->paginate(request()->get('load') ?? 10);

        return inertia('Operators/Classrooms/Index', [
            'page_settings' => [
                'title' => 'Kelas',
                'subtitle' => 'Menampilkan semua kelas yang tersedia',
            ],
            'classrooms' => [
                'data' => ClassroomOperatorResource::collection($classrooms)->resolve(),
                'meta' => [
                    'current_page' => $classrooms->currentPage(),
                    'per_page' => $classrooms->perPage(),
                    'total' => $classrooms->total(),
                    'from' => $classrooms->firstItem(),
                    'to' => $classrooms->lastItem(),
                    'has_pages' => $classrooms->hasPages(),
                ],
                'links' => [
                    'first' => $classrooms->url(1),
                    'last' => $classrooms->url($classrooms->lastPage()),
                    'next' => $classrooms->nextPageUrl(),
                    'prev' => $classrooms->previousPageUrl(),
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
     * Show the form for creating a new classroom
     */
    public function create(): Response
    {
        return inertia('Operators/Classrooms/Create', [
            'page_settings' => [
                'title' => 'Tambah Kelas',
                'subtitle' => 'Buat kelas baru disini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('operators.classrooms.store'),
            ],
            'academic_year' => activeAcademicYear(),
        ]);
    }

    /**
     * Store a newly created classroom in database
     */
    public function store(ClassroomOperatorRequest $request): RedirectResponse
    {
        try {
            Classroom::create([
                'faculty_id' => auth()->user()->operator->faculty_id,
                'department_id' => auth()->user()->operator->department_id,
                'academic_year_id' => activeAcademicYear()->id,
                'name' => $request->name,
            ]);

            flashMessage(MessageType::CREATED->message('Kelas'));
            return to_route('operators.classrooms.index');

        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('operators.classrooms.index');
        }
    }

    /**
     * Show the form for editing the specified classroom
     */
    public function edit(Classroom $classroom): Response
    {
        return inertia('Operators/Classrooms/Edit', [
            'page_settings' => [
                'title' => 'Edit Kelas',
                'subtitle' => 'Edit data kelas. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('operators.classrooms.update', $classroom->slug),
            ],
            'classroom' => ClassroomOperatorResource::make($classroom)->resolve(),
            'academic_year' => $classroom->academicYear,
        ]);
    }

    /**
     * Update the specified classroom in database
     */
    public function update(ClassroomOperatorRequest $request, Classroom $classroom): RedirectResponse
    {
        try {
            $classroom->update([
                'name' => $request->name,
            ]);

            flashMessage(MessageType::UPDATED->message('Kelas'));
            return to_route('operators.classrooms.index');

        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('operators.classrooms.index');
        }
    }

    /**
     * Delete the specified classroom from database
     */
    public function destroy(Classroom $classroom): RedirectResponse
    {
        try {
            $classroom->delete();

            flashMessage(MessageType::DELETED->message('Kelas'));
            return to_route('operators.classrooms.index');

        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('operators.classrooms.index');
        }
    }
}