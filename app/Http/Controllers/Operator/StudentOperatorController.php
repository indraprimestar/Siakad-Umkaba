<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
//use App\Http\Resources\Admin\StudentOperatorResource;
use App\Http\Resources\Operator\StudentOperatorResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Operator\StudentRequest;
use App\Http\Requests\Operator\StudentOperatorRequest;
use App\Traits\HasFile;
use App\Models\User;
use App\Models\Classroom;
use App\Models\FeeGroup;
use App\Enums\MessageType;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class StudentOperatorController extends Controller
{
    use HasFile;
    public function index(): Response
    {
        $student = Student::query()
            ->select(['students.id','students.user_id', 'students.faculty_id', 'students.department_id', 
            'students.fee_group_id', 'students.student_number', 'students.classroom_id', 'students.semester', 'students.batch', 'students.created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->whereHas('user', function ($query) {
                $query->whereHas('roles', fn($query) => $query->where('name', 'Mahasiswa'));
            })
            ->where('students.faculty_id', auth()->user()->operator->faculty_id)
            ->where('students.department_id', auth()->user()->operator->department_id)
            ->with(['user','classroom','feeGroup'])
            ->paginate(request()->load ?? 10);

        $faculty_name = auth()->user()->operator->faculty?->name;

        $department_name = auth()->user()->operator->department?->name;

        return inertia('Operators/Students/Index', [
            'page_settings' => [
                'title' => 'Mahasiswa',
                'subtitle' => "Menampilkan Semua data mahasiswa yang ada di {$faculty_name} dan Jurusan {$department_name}",
            ],
            'students' => StudentOperatorResource::collection($student)->additional([
                'meta' => [
                    'has_pages' => $student->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' =>10,
            ],
        ]);
    }
    public function create(): Response
    {
        return inertia('Operators/Students/Create', [
            'page_settings' => [
                'title' => 'Tambah Mahasiswa',
                'subtitle' => 'Buat mahasiswa baru disini. klik simpan untuk menyimpan data.',
                'method' => 'POST',
                'action' => route('operators.students.store'),
            ],
            'classrooms' => Classroom::query()
                ->select(['id','name'])
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->orderBy('name')
                ->get()
                ->map(fn($item)=>[
                    'value' => $item->id,
                    'label' => $item->name,
            ]),
            'feeGroups' => FeeGroup::query()
                ->select(['id', 'group', 'amount'])
                ->orderBy('group')
                ->get()
                ->map(fn($item) =>[
                    'value' => $item->id,
                    'label' => 'Golongan ' . $item->group . ' - ' . number_format($item->amount, 0, ',', '.'),
                ]),
        ]);
    }

    public function store(StudentOperatorRequest $request): RedirectResponse
    {
        try{
            DB::beginTransaction();
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => $this->upload_file($request, 'avatar', 'users'),
            ]);
            $user->student()->create([
                'faculty_id' => auth()->user()->operator->faculty_id, //$request->faculty_id,
                'department_id' => auth()->user()->operator->department_id, //$request->department_id,
                'classroom_id' => $request->classroom_id,
                'fee_group_id' => $request->fee_group_id,
                'student_number' => $request->student_number,
                'semester' => $request->semester,
                'batch' => $request->batch,
            ]);
            DB::commit();

            $user->assignRole('Mahasiswa');
            flashMessage(MessageType::CREATED->message('Mahasiswa'));
            return to_route('operators.students.index');

        }catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('operators.students.index');
        }
    }

    public function Edit(Student $student): Response
    {
        return inertia('Operators/Students/Edit', [
            'page_settings' => [
                'title' => 'Edit Data Mahasiswa',
                'subtitle' => 'Edit data mahasiswa disini. klik simpan untuk menyimpan data.',
                'method' => 'PUT',
                'action' => route('operators.students.update', $student),
            ],
            'student' => $student->load('user'),
            'classrooms' => Classroom::query()
                ->select(['id','name'])
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->orderBy('name')
                ->get()
                ->map(fn($item)=>[
                    'value' => $item->id,
                    'label' => $item->name,
            ]),
            'feeGroups' => FeeGroup::query()
                ->select(['id', 'group', 'amount'])
                ->orderBy('group')
                ->get()
                ->map(fn($item) =>[
                    'value' => $item->id,
                    'label' => 'Golongan ' . $item->group . ' - ' . number_format($item->amount, 0, ',', '.'),
                ]),
        ]);
    }

    public function update(Student $student, StudentOperatorRequest $request): RedirectResponse
    {
        try{
            DB::beginTransaction();

            $student->update([
                // 'faculty_id' => auth()->user()->operator->faculty_id, //$request->faculty_id,
                // 'department_id' => auth()->user()->operator->department_id, //$request->department_id,
                'classroom_id' => $request->classroom_id,
                'fee_group_id' => $request->fee_group_id,
                'student_number' => $request->student_number,
                'semester' => $request->semester,
                'batch' => $request->batch,
            ]);
            $student->user()->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password ? Hash::make($request->password) : $student->user->password, //Hash::make($request->password),
                'avatar' => $this->upload_file($request, $student->user, 'avatar', 'users'),
            ]);
            $user = $student->user;

            DB::commit();

            $user->assignRole('Mahasiswa');
            flashMessage(MessageType::UPDATED->message('Mahasiswa'));
            return to_route('operators.students.index');

        }catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('operators.students.index');
        }
    }

    public function destroy(Student $student): RedirectResponse
    {
        try{
            $this->delete_file($student->user, 'avatar');
            $student->delete();
            flashMessage(MessageType::DELETED->message('Mahasiswa'));
            return to_route('operators.students.index');
        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('operators.students.index');
        }
    }
}
