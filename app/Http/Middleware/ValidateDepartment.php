<?php

namespace App\Http\Middleware;

use App\Models\Department;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateDepartment
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $department = Department::query()

            ->where(column: 'id', operator: $request->department_id)

            ->where(column: 'faculty_id', operator: $request->faculty_id)

            ->exists();

        if (!$department) {

            flashMessage(message: 'Program studi yang anda pilih tidak terdaftar pada fakultas yang anda pilih', type: 'error');

            return back();

        }

        return $next($request);
    }
}