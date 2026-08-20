<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckActiveAcademicYear
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!activeAcademicYear()) {

            if (auth()->check()) {

                if (auth()->user()->hasRole('Super Admin')) {

                    flashMessage(message: 'Tidak ada tahun ajaran yang aktif. Silahkan tambahkan terlebih dahulu', type: 'error');

                    return to_route(route: 'admin.academic-years.index');

                } else if (auth()->user()->hasRole('Admin Fakultas')) {

                    flashMessage(message: 'Tidak ada tahun ajaran yang aktif. Harap hubungi admin', type: 'error');

                    return to_route(route: 'operators.dashboard');

                } else if (auth()->user()->hasRole('Mahasiswa')) {

                    flashMessage(message: 'Tidak ada tahun ajaran yang aktif. Harap hubungi admin', type: 'error');

                    return to_route(route: 'students.dashboard');

                }

            }

        }

        return $next($request);
    }
}