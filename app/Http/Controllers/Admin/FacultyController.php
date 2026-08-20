<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Faculty;
use App\Http\Resources\Admin\FacultyResource;
use App\Http\Requests\Admin\FacultyStoreRequest;
use Throwable;
use App\Enums\MessageType;
use App\Http\Requests\Admin\FacultyRequest;
use Illuminate\Http\RedirectResponse;
use App\Traits\HasFile;                             // ← kalau memang punya trait ini
 


class FacultyController extends Controller
{
    use HasFile;
    public function index(): Response
    {
        $faculties = Faculty::query()
            ->select(['id', 'name', 'code', 'logo', 'slug', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['sort', 'direction']))
            ->paginate(request()->load ?? 10);

        return inertia('Admin/Faculties/index', [
            'page_settings' => [
                'title' => 'Fakultas',
                'subtitle' => 'Menampilkan Semua data fakultas yang ada di UMKABA',
            ],
            'faculties' => FacultyResource::collection($faculties)->additional([
                'meta' => [
                    'has_pages' => $faculties->hasPages(),
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
        return inertia('Admin/Faculties/Create', [
            'page_settings' => [
                'title' => 'Tambah Fakultas',
                'subtitle' => 'Buat fakultas baru disini. klik simpan untuk menyimpan data.',
                'method' => 'POST',
                'action' => route('admin.faculties.store'),
            ]
        ]);
    }

    public function store(FacultyRequest $request): RedirectResponse
    {
       try{
            Faculty::create([
                'name' => $request->name,
                'slug' => str()->slug($request->name),
                'code' => str()->random(6),
                'logo' => $this->upload_file($request, 'logo', 'faculties'),
            ]);
            //flashMessage(MessageType::CREATE->message('Fakultas'));
             return to_route('admin.faculties.index');

       }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.faculties.index');
       }
    }
    public function edit(Faculty $faculty): Response
    {
        return inertia('Admin/Faculties/Edit', [
            'page_settings' => [
                'title' => 'Edit Fakultas',
                'subtitle' => 'Edit fakultas disini. klik simpan untuk menyimpan data.',
                'method' => 'PUT',
                'action' => route('admin.faculties.update', $faculty),
            ],
            'faculty' => $faculty,
        ]);
    }

    public function update(Faculty $faculty, FacultyRequest $request): RedirectResponse
    {
       try{
            $faculty->update([
                'name' => $request->name,
                'slug' => str()->slug($request->name), 
                'logo' => $this->update_file($request, $faculty, 'logo', 'faculties'),
            ]);
            flashMessage(MessageType::UPDATED->message('Fakultas'));
             return to_route('admin.faculties.index');

       }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.faculties.index');
       }
    }

    public function destroy(Faculty $faculty): RedirectResponse
    {
        try{
            $this->delete_file($faculty, 'logo');
            $faculty->delete();
            flashMessage(MessageType::DELETED->message('Fakultas'));
            return to_route('admin.faculties.index');

        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.faculties.index');
        }
    }
}
