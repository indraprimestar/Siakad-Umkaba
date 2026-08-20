<?php

// use App\Http\Controllers\ProfileController;
// use Illuminate\Foundation\Application;
// use Illuminate\Support\Facades\Route;
// use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// // 👉 Tambahkan ini
// //Route::get('/toast-test', function () {
// //    return Inertia::render('ExamplePage');
    
// //});
// //Route::get('/toast-test', fn () => Inertia::render('ExamplePage'));
// Route::get('/toast-test', fn () => Inertia::render('ExamplePage'));

// //use App\Http\Controllers\Admin\DashboardAdminController;

// //Route::get('/admin/dashboard', DashboardAdminController::class)->name('admin.dashboard.test');


// //Route::get('/toast-test', fn () => Inertia::render('ExamplePage'));


// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// require __DIR__.'/auth.php';
// require __DIR__.'/admin.php';
// require __DIR__.'/teacher.php';
// require __DIR__.'/operator.php';
// require __DIR__.'/student.php';

// require base_path('routes/admin.php');
// require base_path('routes/teacher.php');
// require base_path('routes/operator.php');
// require base_path('routes/student.php');



use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Operator\StudyPlanOperatorController;
use App\Http\Controllers\PaymentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route:: get('/', function(){
    if (auth()->check()) 
        return to_route('dashboard');
    else
        return to_route('login');
});

Route::get('dashboard', function () {
        if(auth()->user()->hasRole('Super Admin')) {
            return redirect()->intended(route('admin.dashboard', absolute: false));

        }else if (auth()->user()->hasRole('Mahasiswa')) {
            return redirect()->intended(route('students.dashboard', absolute: false));

        }else if (auth()->user()->hasRole('Dosen')) {
            return redirect()->intended(route('teachers.dashboard', absolute: false));

        }else if (auth()->user()->hasRole('Admin Fakultas')) {
            return redirect()->intended(route('operators.dashboard', absolute: false));
            
        }else{
            abort(404);
        }
})->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
//     ->middleware(['auth', 'verified'])
//     ->name('dashboard');

Route::controller(PaymentController::class)->group(function () {

    Route::post('payments', 'create')->name('payments.create');

    Route::post('payments/callback', 'callback')->name('payments.callback');

    Route::get('payments/success', 'success')->name('payments.success');

});

// muat file-file route lain (cukup sekali, pakai __DIR__)
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/teacher.php';
require __DIR__.'/operator.php';
require __DIR__.'/student.php';

