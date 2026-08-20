<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Department;
use App\Models\Faculty;
use App\Http\Resources\Admin\DepartmentResource;
use App\Http\Requests\Admin\DepartmentRequest;
use App\Http\Requests\Admin\DepartmentStoreRequest;
use Illuminate\Http\RedirectResponse;
use App\Traits\HasFile;
use App\Enums\MessageType;
use Throwable;


class DepartmentController extends Controller
{
    public function index(): Response
    {
        // $departments = Department::query()
        //     ->select(['departments.id', 'departments.faculty_id', 'departments.name', 'departments.code', 'departments.slug', 'departments.created_at'])
        //     ->filter(request()->only(['search']))
        //     ->sorting(request()->only(['sort', 'direction']))
        //     ->with('faculty')
        //     ->paginate(request()->load ?? 10);
        $departments = Department::query()
            ->select(['departments.id','departments.faculty_id','departments.name','departments.code','departments.slug','departments.created_at'])
            ->filter(request()->only(['search']))
            ->sorting([
                'field'     => request('field') ?? request('sort'), // <-- dukung 'field' atau 'sort'
                'direction' => request('direction'),
            ])
            ->with('faculty')
            ->paginate(request()->load ?? 10);

        return inertia('Admin/Departments/index', [
            'page_settings' => [
                'title' => 'Program Studi',
                'subtitle' => 'Menampilkan Semua data program studi yang ada di UMKABA',
            ],
            'departments' => DepartmentResource::collection($departments)->additional([
                'meta' => [
                    'has_pages' => $departments->hasPages(),
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
        return inertia('Admin/Departments/Create', [
            'page_settings' =>[
                'title' => 'Tambah program studi',
                'subtitle' => 'Buat program studi baru disini. klik simpan jika selesai',
                'method' => 'POST',
                'action' => route('admin.departments.store'),
            ],
            'faculties' => Faculty::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),

        ]);
    }
    public function store(DepartmentRequest $request): RedirectResponse
    {
        try{
            Department::create([
                'faculty_id' => $request->faculty_id,
                'name' => $request->name,
                'slug' => str()->slug($request->name),
                'code' => str()->random(6),
                
            ]);
            flashMessage(MessageType::CREATED->message('Program Studi'));
             return to_route('admin.departments.index');

        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.departments.index');
        }
    }
    public function edit(Department $department): Response
    {
        return inertia('Admin/Departments/Edit', [
            'page_settings' =>[
                'title' => 'Edit program studi',
                'subtitle' => 'Edit program studi disini. klik simpan jika selesai',
                'method' => 'PUT',
                'action' => route('admin.departments.update', $department),
            ],
            'department' => $department,
            'faculties' => Faculty::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    } 
    public function update(Department $department, DepartmentRequest $request): RedirectResponse
    {
        try{
            $department->update([
                'faculty_id' => $request->faculty_id,
                'name' => $request->name,
                'slug' => str()->slug($request->name), 
                // 'code' => str()->random(6), pakai ini jika mau random code diganti
            ]);
            flashMessage(MessageType::UPDATED->message('Program Studi'));
             return to_route('admin.departments.index');

        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.departments.index');
        }
    }

    public function destroy(Department $department): RedirectResponse
    {
        try{
            $department->delete();
            flashMessage(MessageType::DELETED->message('Program Studi'));
            return to_route('admin.departments.index');
        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.departments.index');
        }
    }
}
