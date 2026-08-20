<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Student;
use App\Models\User;
use App\Models\Classroom;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\FeeGroup;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Admin\StudentStoreRequest;
use App\Http\Resources\Admin\StudentResource;
use App\Http\Requests\Admin\StudentRequest;
use App\Enums\StudentStatus;
use Illuminate\Support\Facades\DB;
use App\Enums\MessageType;
use App\Traits\HasFile; 
use App\Http\Requests\Admin\StudentUpdateRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;


class StudentController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('validateDepartment', only:['store', 'update']),
        ];
    }
    use HasFile;
    public function index(): Response
    {
        $students = Student::query()
           ->select(['students.id', 'students.user_id', 'students.faculty_id', 'students.department_id', 
           'students.fee_group_id', 'students.student_number', 'students.classroom_id', 'students.semester', 'students.batch', 'students.created_at'])
           ->filter(request()->only(['search']))
           ->sorting(request()->only(['sort', 'direction']))
           ->with('user', 'faculty', 'department', 'feeGroup', 'classroom')
           ->whereHas('user', function ($query) {
               $query->whereHas('roles', fn($query) => $query->where('name', 'Mahasiswa'));
           })
           ->paginate(request()->load ?? 10);

           return inertia('Admin/Students/Index', [
               'page_settings' => [
                   'title' => 'Mahasiswa',
                   'subtitle' => 'Menampilkan Semua data mahasiswa yang ada di UMKABA',
               ],
               'students' => StudentResource::collection($students)->additional([
                   'meta' => [
                       'has_pages' => $students->hasPages(),
                   ],
                ]),
                'state' => [
                    'page' => request()->page ?? 1,
                    'search' => request()->search ?? '',
                    'load' => 10, //kalau ganti disini aja karena ini tampilan
                ],
            ]);
    }
    public function create():Response
    {
        return inertia('Admin/Students/Create', [
            'page_settings' => [
                'title' => 'Tambah Mahasiswa',
                'subtitle' => 'Buat mahasiswa baru disini. Klik simpan setelah selesai.',
                'method' => 'POST',
                'action' => route('admin.students.store'),
            ],
            'faculties' => Faculty::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'feeGroups' => FeeGroup::query()->select(['id', 'group', 'amount'])->orderBy('group')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => 'Golongan ' . $item->group . ' (Rp. ' . number_format($item->amount, 0, ',', '.') . ')',
            ]),
            'classrooms' => Classroom::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }
    public function store(StudentRequest $request):RedirectResponse{
        try{

            DB::beginTransaction();
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => $this->upload_file($request, 'avatar', 'users'),
            ]);

            $user->student()->create([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'classroom_id' => $request->classroom_id,
                'fee_group_id' => $request->fee_group_id,
                'student_number' => $request->student_number,
                'semester' => $request->semester,
                'batch' => $request->batch,
            ]);

            $user->assignRole('Mahasiswa');
            DB::commit();

            flashMessage(MessageType::CREATED->message('Mahasiswa'));
            return to_route('admin.students.index');

        }catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.students.index');
        }
    }

    #edit
        public function edit(Student $student):Response
    {
        return inertia('Admin/Students/Edit', [
            'page_settings' => [
                'title' => 'Edit Mahasiswa',
                'subtitle' => 'Edit data mahasiswa baru disini. Klik simpan setelah selesai.',
                'method' => 'PUT',
                'action' => route('admin.students.update', $student),
            ],
            'student' => $student ->load('user'),
            'faculties' => Faculty::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'feeGroups' => FeeGroup::query()->select(['id', 'group', 'amount'])->orderBy('group')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => 'Golongan ' . $item->group . ' (Rp. ' . number_format($item->amount, 0, ',', '.') . ')',
            ]),
            'classrooms' => Classroom::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }
    public function update(Student $student, StudentRequest $request):RedirectResponse{
        try{

            DB::beginTransaction();
            $student->update([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'fee_group_id' => $request->fee_group_id,
                'classroom_id' => $request->classroom_id,
                'student_number' => $request->student_number,
                'semester' => $request->semester,
                'batch' => $request->batch,
                
            ]);

            $student->user()->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password ? Hash::make($request->password) : $student->user->password,
                'avatar' => $this->upload_file($request, $student->user, 'avatar', 'users'),
            ]);

            DB::commit();

            flashMessage(MessageType::UPDATED->message('Mahasiswa'));
            return to_route('admin.students.index');

        }catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.students.index');
        }
    }

    public function destroy(Student $student):RedirectResponse{
        try{
            $this->delete_file($student->user, 'avatar');
            $student->delete();
            flashMessage(MessageType::DELETED->message('Mahasiswa'));
            return to_route('admin.students.index');
        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.students.index');
        }
    }
       
}
