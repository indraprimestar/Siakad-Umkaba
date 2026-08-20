<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Teacher;
use App\Http\Resources\Admin\TeacherResource;
use App\Http\Requests\Admin\TeacherRequest;
use Inertia\Response;
use App\Models\Faculty;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use App\Enums\MessageType;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Traits\HasFile; 
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Http\Requests\Admin\TeacherStoreRequest;
use Illuminate\Support\Facades\Hash;



class TeacherController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('validateDepartment', only:['store', 'update']),
        ];
    }
    use HasFile;
    public function index()
    {
        $teachers = Teacher::query()
            ->select(['teachers.id', 'teachers.user_id', 'teachers.faculty_id', 'teachers.department_id', 'teachers.teacher_number', 'teachers.academic_title', 'teachers.created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['user', 'faculty', 'department'])
            ->whereHas('user', function ($query) {
                $query->whereHas('roles', fn($query) => $query->where('name', 'Dosen'));
            })
            ->paginate(request()->load ?? 10);
        return inertia()->render('Admin/Teachers/Index', [
            'page_settings' => [
                'title' => 'Dosen',
                'subtitle' => 'Menampilkan Semua data dosen yang ada di UMKABA',
            ],
            'teachers' => TeacherResource::collection($teachers)->additional([
                'meta' => [
                    'has_pages' => $teachers->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10, //kalau ganti disini aja karena ini tampilan
            ],

        ]);
    }
    public function create(): Response
    {
        return inertia('Admin/Teachers/Create', [
            'page_settings' => [
                'title' => 'Tambah Dosen',
                'subtitle' => 'Buat dosen baru disini. klik simpan untuk menyimpan data.',
                'method' => 'POST',
                'action' => route('admin.teachers.store'),
            ],
            'faculties' => Faculty::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }
    public function store (TeacherRequest $request): RedirectResponse
    {
        try{
            DB::beginTransaction();
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => $this->upload_file($request, 'avatar', 'users'),
            ]);
            $user->teacher()->create([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'teacher_number' => $request->teacher_number,
                'academic_title' => $request->academic_title,
            ]);

            $user->assignRole('Dosen');

            DB::commit();
            flashMessage(MessageType::CREATED->message('Dosen'));
            return to_route('admin.teachers.index'); 
        }catch (Throwable $e){
            DB::rollBack();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()));
            return to_route('admin.teachers.index');
        }
    }

    public function edit(Teacher $teacher): Response
    {
        return inertia('Admin/Teachers/Edit', [
            'page_settings' => [
                'title' => 'Edit Dosen',
                'subtitle' => 'Edit data dosen disini. klik simpan untuk menyimpan data.',
                'method' => 'PUT',
                'action' => route('admin.teachers.update', $teacher),
            ],
            'teacher' =>$teacher ->load('user'),
            'faculties' => Faculty::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }
    public function update(Teacher $teacher, TeacherRequest $request): RedirectResponse
    {
        try{
            DB::beginTransaction();
            $teacher->update([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'teacher_number' => $request->teacher_number,
                'academic_title' => $request->academic_title,
            ]);
            $teacher->user()->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password ? Hash::make($request->password) : $teacher->user->password,
                'avatar' => $this->upload_file($request, $teacher->user, 'avatar', 'users'),
            ]);

            DB::commit();
            flashMessage(MessageType::UPDATED->message('Dosen'));
            return to_route('admin.teachers.index'); 
        }catch (Throwable $e){
            DB::rollBack();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()));
            return to_route('admin.teachers.index');
        }
    }


    public function destroy(Teacher $teacher): RedirectResponse
    {
        try{
            $this->delete_file($teacher->user, 'avatar');
            $teacher->delete();
            flashMessage(MessageType::DELETED->message('Dosen'));
            return to_route('admin.teachers.index');
        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.teachers.index');
        }
    }
}
