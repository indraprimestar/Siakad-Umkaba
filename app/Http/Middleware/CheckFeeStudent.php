<?php

namespace App\Http\Middleware;

use App\Models\Fee;
use App\Enums\FeeStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckFeeStudent
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $student = auth()->user()?->student;
        $academicYear = activeAcademicYear();

        if (!$student || !$academicYear) {
            flashMessage('Harap melakukan pembayaran uang kuliah tunggal terlebih dahulu', 'warning');
            return to_route('students.fees.index');
        }

        $fee = Fee::query()
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->where('semester', $student->semester)
            ->where('status', FeeStatus::SUCCESS->value)
            ->exists();

        if (!$fee) {
            flashMessage('Harap melakukan pembayaran uang kuliah tunggal terlebih dahulu', 'warning');
            return to_route('students.fees.index');
        }

        return $next($request);
    }
}