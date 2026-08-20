<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Fee;
use App\Http\Resources\Admin\FeeResource;

class FeeController extends Controller
{
    public function _invoke():Response
    {
        $fees = Fee::query()
            ->select(['fees.id', 'fees.student_id', 'fees.fee_group_id','fees.semester', 'fees.status', 'fees.created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['sort', 'direction']))
            // ->with('student', 'feeGroup')
            ->paginate(request()->load ?? 10);

        return inertia('Admin/Fees/index', [
            'page_settings' => [
                'title' => 'Uang Kuliah Tunggal',
                'subtitle' => 'Menampilkan Semua data uang kuliah tunggal yang ada di UMKABA',
            ],
            'fees' => FeeResource::collection($fees)->additional([
                'meta' => [
                    'has_pages' => $fees->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10, //kalau ganti disini aja karena ini tampilan
            ],
        ]);
    }
}
