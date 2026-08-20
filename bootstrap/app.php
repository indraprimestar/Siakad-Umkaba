<?php

// use Illuminate\Foundation\Application;
// use Illuminate\Foundation\Configuration\Exceptions;
// use Illuminate\Foundation\Configuration\Middleware;

// return Application::configure(basePath: dirname(__DIR__))
//     ->withRouting(
//         web: __DIR__.'/../routes/web.php',
//         commands: __DIR__.'/../routes/console.php',
//         health: '/up',
//     )
//     ->withMiddleware(function (Middleware $middleware): void {
//         $middleware->web(append: [
//             \App\Http\Middleware\HandleInertiaRequests::class,
//             \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
//         ])->alias(aliases:[
//             'role' => RoleMiddleware::class
//         ]);

//         //
//     })
//     ->withExceptions(function (Exceptions $exceptions): void {
//         //
//     })->create();

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// IMPORT Spatie middleware ⬇️
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // tambahkan middleware web kamu
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,

        
        ]);

        $middleware->validateCsrfTokens(except: [
            'payments/callback',
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'checkActiveAcademicYear' => \App\Http\Middleware\CheckActiveAcademicYear::class,
            'checkFeeStudent' => \App\Http\Middleware\CheckFeeStudent::class,
            'validateClassroom' => \App\Http\Middleware\ValidateClassroom::class,
            'validateCourse' => \App\Http\Middleware\ValidateCourse::class,
            'validateDepartment' => \App\Http\Middleware\ValidateDepartment::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();
