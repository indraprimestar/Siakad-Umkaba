<?php

namespace App\Http\Controllers\Admin;

use App\Models\FeeGroup;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Enums\MessageType;
use Throwable;
use App\Http\Resources\Admin\FeeGroupResource;
use App\Http\Requests\Admin\FeeGroupRequest;
use App\Http\Requests\Admin\FeeGroupStoreRequest;
use App\Http\Requests\Admin\FeeGroupUpdateRequest;


class FeeGroupController extends Controller
{
    public function index(): Response
    {
        $fee_groups = FeeGroup::query()
        ->select(['id', 'group', 'amount', 'created_at'])
        ->filter(request()->only(['search']))
        ->sorting([
                    'field'     => request('field') ?? request('sort'), // dukung 'field' atau 'sort'
                    'direction' => request('direction'),
                ])

        ->paginate(request()->load ?? 10);

        return inertia('Admin/FeeGroups/index', [
            'page_settings' => [
                'title' => 'Golongan',
                'subtitle' => 'Menampilkan Semua golongan UKT yang ada di UMKABA',
            ],
            'feeGroups' => FeeGroupResource::collection($fee_groups)->additional([
                'meta' => [
                    'has_pages' => $fee_groups->hasPages(),
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
        return inertia('Admin/FeeGroups/Create', [
            'page_settings' => [
                'title' => 'Tambah Golongan UKT',
                'subtitle' => 'Buat golongan ukt baru disini. klik simpan untuk menyimpan data.',
                'method' => 'POST',
                'action' => route('admin.fee-groups.store'),
            ]
        ]);
    }

    public function store(FeeGroupRequest $request): RedirectResponse
    {
       try{

        FeeGroup::create([
            'group' => $request->group,
            'amount' => $request->amount,
        ]);
        flashMessage(MessageType::CREATED->message('Golongan UKT'));
         return to_route('admin.fee-groups.index');
       }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.fee-groups.index');
       }
    }
    public function edit(FeeGroup $feeGroup): Response
    {
        return inertia('Admin/FeeGroups/Edit', [
            'page_settings' => [
                'title' => 'Edit Golongan UKT',
                'subtitle' => 'Edit golongan ukt disini. klik simpan untuk menyimpan data.',
                'method' => 'PUT',
                'action' => route('admin.fee-groups.update', $feeGroup),
            ],
            'feeGroup' => $feeGroup
        ]);
    }

    public function update(FeeGroup $feeGroup, FeeGroupRequest $request): RedirectResponse
    {
       try{

        $feeGroup->update([
            'group' => $request->group,
            'amount' => $request->amount,
        ]);
        flashMessage(MessageType::UPDATE->message('Golongan UKT'));
         return to_route('admin.fee-groups.index');
       }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.fee-groups.index');
       }
    }

    public function destroy(FeeGroup $feeGroup): RedirectResponse
    {
        try{
            $feeGroup->delete();
            flashMessage(MessageType::DELETED->message('Golongan UKT'));
            return to_route('admin.fee-groups.index');
        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.fee-groups.index');
        }
    }
}
