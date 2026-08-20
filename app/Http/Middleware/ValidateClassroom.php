<?php

namespace App\Http\Middleware;

use App\Models\Classroom;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateClassroom
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $classroom = Classroom::query()

            ->where(column: 'id', operator: $request->classroom_id)

            ->where(column: 'faculty_id', operator: $request->faculty_id)

            ->where(column: 'department_id', operator: $request->department_id)

            ->exists();

        if (!$classroom) {

            flashMessage(message: 'Kelas tersebut tidak ada di program studi atau fakultas yang anda pilih', type: 'error');

            return to_route(route: 'admin.schedules.index');

        }

        return $next($request);
    }
}