<?php

namespace App\Http\Middleware;

use Tightenco\Ziggy\Ziggy;
use App\Models\AcademicYear;
use App\Models\Fee;
//use App\Http\Resources\UserSingleResource;
// use App\Models\AcademicYear;
// use App\Models\Fee;
// use Illuminate\Http\Request;
//use Inertia\Middleware;
use App\Enums\FeeStatus;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Http\Resources\UserSingleResource;


class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? new UserSingleResource($request->user()) : null,
            ],
            'flash_message' => fn() => [
                'type' => $request->session()->get('type'),
                'message' => $request->session()->get('message'),

            ],

            #'ziggy' => fn() => [
            #    ...(new Ziggy)->toArray(),
            #    'location' => url()->current(),
            #],
            #'ziggy' => fn () => ['location' => url()->current()],


            'academic_year' => fn() => AcademicYear::query()->where('is_active', true)->first(),
            'checkFee' => fn() => $request ->user() && $request->user()->student && activeAcademicYear()
            ? Fee::query()
            ->where('student_id', auth()->user()->student->id)
            ->where('academic_year_id', activeAcademicYear()->id)
            ->where('semester', auth()->user()->student->semester)
            ->where('status', FeeStatus::SUCCESS->value)
            ->first()
            : null
        ];
    }
}



// namespace App\Http\Middleware;

// use App\Http\Resources\UserSingleResource;
// use App\Models\AcademicYear;
// use App\Models\Fee;
// use Illuminate\Http\Request;
// use Inertia\Middleware;
// // use App\Enums\FeeStatus; // <- aktifkan kalau kamu punya enum ini

// class HandleInertiaRequests extends Middleware
// {
//     protected $rootView = 'app';

//     public function version(Request $request): ?string
//     {
//         return parent::version($request);
//     }

//     public function share(Request $request): array
//     {
//         // Guest (belum login) -> jangan jalankan logic yang butuh user/TA aktif
//         if (! $request->user()) {
//             return [
//                 ...parent::share($request),
//                 'auth' => ['user' => null],
//                 'flash_message' => fn () => [
//                     'type' => $request->session()->get('type'),
//                     'message' => $request->session()->get('message'),
//                 ],
//                 'academic_year' => fn () => AcademicYear::where('is_active', true)->first(),
//                 'checkFee' => null,
//             ];
//         }

//         $user = $request->user();

//         return [
//             ...parent::share($request),

//             'auth' => ['user' => new UserSingleResource($user)],

//             'flash_message' => fn () => [
//                 'type' => $request->session()->get('type'),
//                 'message' => $request->session()->get('message'),
//             ],

//             // boleh null; aman
//             'academic_year' => fn () => AcademicYear::where('is_active', true)->first(),

//             // jalankan hanya untuk mahasiswa & hanya jika ada TA aktif
//             'checkFee' => fn () => (function () use ($user) {
//                 // bukan mahasiswa atau belum punya relasi student -> jangan cek
//                 if (! method_exists($user, 'hasRole') || ! $user->hasRole('student') || ! $user->student) {
//                     return null;
//                 }

//                 $ay = AcademicYear::where('is_active', true)->first();
//                 if (! $ay) {
//                     return null;
//                 }

//                 return Fee::query()
//                     ->where('student_id', $user->student->id)
//                     ->where('academic_year_id', $ay->id)
//                     ->where('semester', $user->student->semester)
//                     // ->where('status', FeeStatus::SUCCESS->value) // aktifkan jika enum ada
//                     ->exists();
//             })(),
//         ];
//     }
// }
