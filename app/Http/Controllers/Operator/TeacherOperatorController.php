<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Http\Requests\Operator\TeacherOperatorRequest;
use App\Http\Resources\Operator\TeacherOperatorResource;
use App\Models\Teacher;
use App\Models\User;
use App\Traits\HasFile;
use App\Enums\MessageType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Response;
use Throwable;

class TeacherOperatorController extends Controller
{
    use HasFile;

    /**
     * Display a listing of teachers
     */
    public function index(): Response
    {
        $teachers = Teacher::query()
            ->select([
                'teachers.id',
                'teachers.user_id',
                'teachers.faculty_id',
                'teachers.department_id',
                'teachers.teacher_number',
                'teachers.academic_title',
                'teachers.created_at'
            ])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->whereHas('user', function ($query) {
                $query->whereHas('roles', fn($query) => $query->where('name', 'Dosen'));
            })
            ->where('teachers.faculty_id', auth()->user()->operator->faculty_id)
            ->where('teachers.department_id', auth()->user()->operator->department_id)
            ->with(['user'])
            ->paginate(request()->load ?? 10);

        return inertia('Operators/Teachers/Index', [
            'page_settings' => [
                'title' => 'Dosen',
                'subtitle' => 'Menampilkan semua data dosen yang tersedia',
            ],
            'teachers' => TeacherOperatorResource::collection($teachers)->additional([
                'meta' => [
                    'has_pages' => $teachers->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ],
        ]);
    }

    /**
     * Show the form for creating a new teacher
     */
    public function create(): Response
    {
        return inertia('Operators/Teachers/Create', [
            'page_settings' => [
                'title' => 'Tambah Dosen',
                'subtitle' => 'Buat dosen baru disini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('operators.teachers.store'),
            ],
        ]);
    }

    /**
     * Store a newly created teacher in database
     */
    public function store(TeacherOperatorRequest $request): RedirectResponse
    {
        try {

            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => $this->upload_file($request, 'avatar', 'users'),
            ]);

            $user->teacher()->create([
                'faculty_id' => auth()->user()->operator->faculty_id,
                'department_id' => auth()->user()->operator->department_id,
                'teacher_number' => $request->teacher_number,
                'academic_title' => $request->academic_title,
            ]);

            $user->assignRole('Dosen');

            DB::commit();

            flashMessage(MessageType::CREATED->message('Dosen'));
            return to_route('operators.teachers.index');

        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');

            return to_route('operators.teachers.index');
        }
    }

    /**
     * Show the form for editing the specified teacher
     */
    public function edit(Teacher $teacher): Response
    {
        return inertia('Operators/Teachers/Edit', [
            'page_settings' => [
                'title' => 'Edit Dosen',
                'subtitle' => 'Edit dosen disini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('operators.teachers.update', $teacher),
            ],
            'teacher' => $teacher->load('user'),
        ]);
    }

    /**
     * Update the specified teacher in database
     */
    public function update(Teacher $teacher, TeacherOperatorRequest $request): RedirectResponse
    {
        try {

            DB::beginTransaction();

            $teacher->update([
                'teacher_number' => $request->teacher_number,
                'academic_title' => $request->academic_title,
            ]);

            $teacher->user()->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password ? Hash::make($request->password) : $teacher->user->password,
                'avatar' => $this->update_file($request, $teacher->user, 'avatar', 'users'),
            ]);

            DB::commit();

            flashMessage(MessageType::UPDATED->message('Dosen'));
            return to_route('operators.teachers.index');

        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');

            return to_route('operators.teachers.index');
        }
    }

    /**
     * Remove the specified teacher from database
     */
    public function destroy(Teacher $teacher): RedirectResponse
    {
        try {

            DB::beginTransaction();

            // Load user relationship to ensure it exists
            $teacher->load('user');

            // Delete user avatar file if exists
            if ($teacher->user) {
                $this->delete_file($teacher->user, 'avatar');

                // Delete user account
                $teacher->user->delete();
            }

            // Delete teacher record
            $teacher->delete();

            DB::commit();

            flashMessage(MessageType::DELETED->message('Dosen'));
            return to_route('operators.teachers.index');

        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');

            return to_route('operators.teachers.index');
        }
    }
}