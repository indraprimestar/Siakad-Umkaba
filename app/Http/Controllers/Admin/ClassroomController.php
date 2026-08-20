<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Admin\ClassroomResource;
use App\Http\Requests\Admin\ClassroomRequest;
use Illuminate\Http\RedirectResponse;
use App\Models\Classroom;
use Inertia\Response;
use App\Models\Faculty;
use App\Models\Department;
use App\Http\Requests\Admin\ClassroomStoreRequest;
use App\Http\Requests\Admin\ClassroomUpdateRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Enums\MessageType;
use Throwable;

class ClassroomController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('validateDepartment', only:['store', 'update']),
        ];
    }
    public function index(): Response
    {
        $classrooms = Classroom::query()
            ->select(['classrooms.id', 'classrooms.faculty_id', 'classrooms.department_id', 'classrooms.academic_year_id', 'classrooms.name', 'classrooms.slug', 'classrooms.created_at'])
            ->filter(request()->only(['search']))
            ->sorting([
                'field'     => request('field') ?? request('sort'), // <-- dukung 'field' atau 'sort'
                'direction' => request('direction'),
            ])
            ->with('faculty', 'department', 'academicYear')
            ->paginate(request()->load ?? 10);


        return inertia('Admin/Classrooms/index', [
            'page_settings' => [
                'title' => 'Kelas',
                'subtitle' => 'Menampilkan Semua data kelas yang ada di UMKABA',
            ],

            'classrooms' => ClassroomResource::collection($classrooms)->additional([
                'meta' => [
                    'has_pages' => $classrooms->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10, //kalau ganti disini aja karena ini tampilan
            ],
        ]);
    }
    public function create():Response{
        return inertia('Admin/Classrooms/Create', [
            'page_settings' =>[
                'title' => 'Tambah Kelas',
                'subtitle' => 'Buat data kelas baru disini. klik simpan jika selesai',
                'method' => 'POST',
                'action' => route('admin.classrooms.store'),
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
    public function store(ClassroomRequest $request): RedirectResponse
    {
        try{
            Classroom::create([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'academic_year_id' => activeAcademicYear()->id,
                'name' => $request->name,

                
            ]);
            flashMessage(MessageType::CREATED->message('Kelas'));
             return to_route('admin.classrooms.index');

        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.classrooms.index');
        }
    }

     public function edit(Classroom $classroom):Response{
        return inertia('Admin/Classrooms/Edit', [
            'page_settings' =>[
                'title' => 'Edit Kelas',
                'subtitle' => 'Edit data kelas disini. klik simpan jika selesai',
                'method' => 'PUT',
                'action' => route('admin.classrooms.update', $classroom),
            ],
            'classroom' => $classroom,
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
    public function update(Classroom $classroom, ClassroomRequest $request): RedirectResponse
    {
        try{
            $classroom->update([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                // 'academic_year_id' => activeAcademicYear()->id,
                'name' => $request->name,

                
            ]);
            flashMessage(MessageType::UPDATED->message('Kelas'));
             return to_route('admin.classrooms.index');

        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.classrooms.index');
        }
    }

    public function destroy(Classroom $classroom): RedirectResponse
    {
        try{
            $classroom->delete();
            flashMessage(MessageType::DELETED->message('Kelas'));
            return to_route('admin.classrooms.index');
        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.classrooms.index');
        }
    }
}
