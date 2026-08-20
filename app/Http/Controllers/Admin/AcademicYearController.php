<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AcademicYear;
use App\Enums\AcademicYearSemester;
use Illuminate\Http\RedirectResponse;
use Throwable;
use App\Http\Requests\Admin\AcademicYearRequest;
use App\Http\Resources\Admin\AcademicYearResource;
use App\Enums\MessageType;
use Inertia\Response;

class AcademicYearController extends Controller
{
    public function index():Response
    {
        // $academicYears = AcademicYear::query()
        // ->select(['academic_years.id', 'academic_years.name', 'academic_years.slug', 'academic_years.start_date', 'academic_years.end_date', 'academic_years.semester', 'academic_years.is_active', 'academic_years.created_at'])
        // ->filter(request()->only(['search']))
        // ->sorting(request()->only(['field', 'direction']))
        // ->paginate(request()->load ?? 10);

        $academicYears = AcademicYear::query()
        ->select(['academic_years.id', 'academic_years.name', 'academic_years.slug', 'academic_years.start_date', 'academic_years.end_date', 'academic_years.semester', 'academic_years.is_active', 'academic_years.created_at'])
        ->filter(request()->only(['search']))
        ->sorting([
            'field'     => request('field') ?? request('sort'), // <-- dukung 'field' atau 'sort'
            'direction' => request('direction'),
        ])
         ->paginate((int) (request()->load ?? 10))
         ->withQueryString();

        return inertia('Admin/AcademicYears/index', [
            'page_settings' => [
                'title' => 'Tahun Ajaran',
                'subtitle' => 'Menampilkan Semua data tahun ajaran yang ada di UMKABA',
            ],

            'academicYears' => AcademicYearResource::collection($academicYears)->additional([
                'meta' => [
                    'has_pages' => $academicYears->hasPages(),
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
        return inertia('Admin/AcademicYears/Create', [
            'page_settings' => [
                'title' => 'Tambah Tahun Ajaran',
                'subtitle' => 'Buat tahun ajaran baru disini. klik simpan untuk menyimpan data.',
                'method' => 'POST',
                'action' => route('admin.academic-years.store'),
            ],
            'academicYearSemester' => AcademicYearSemester::options(),
        ]);
    }
    public function store(AcademicYearRequest $request):RedirectResponse
    {
       try{
            AcademicYear::create([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'semester' => $request->semester,
                'is_active' => $request->is_active,
            ]);
            flashMessage(MessageType::CREATED->message('Tahun Ajaran'));
             return to_route('admin.academic-years.index');

       }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.academic-years.index');
       }
    }

    public function edit(AcademicYear $academicYear):Response
    {
        return inertia('Admin/AcademicYears/Edit', [
            'page_settings' => [
                'title' => 'Edit Tahun Ajaran',
                'subtitle' => 'Edit data tahun ajaran disini. klik simpan untuk menyimpan data.',
                'method' => 'PUT',
                'action' => route('admin.academic-years.update', $academicYear),
            ],
            'academicYear' => $academicYear,
            'academicYearSemester' => AcademicYearSemester::options(),
        ]);
    }

    public function update(AcademicYearRequest $request, AcademicYear $academicYear):RedirectResponse
    {
        try{
            $academicYear->update([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'semester' => $request->semester,
                'is_active' => $request->is_active,
            ]);
            flashMessage(MessageType::UPDATED->message('Tahun Ajaran'));
             return to_route('admin.academic-years.index');

        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.academic-years.index');
        }
    } 

    public function destroy(AcademicYear $academicYear):RedirectResponse
    {
        try{
            $academicYear->delete();
            flashMessage(MessageType::DELETED->message('Tahun Ajaran'));
            return to_route('admin.academic-years.index');
        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.academic-years.index');
        }
    }
}
