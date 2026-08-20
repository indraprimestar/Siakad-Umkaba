<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;       // <-- tambahkan ini
use Inertia\Inertia;        // <-- opsional kalau pakai Inertia::render()
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Classroom;
use App\Models\Course;

class DashboardOperatorController extends Controller
{
    /**
     * Handle the incoming request.
     */
     public function __invoke(): Response
    {
        return inertia('Operators/Dashboard',[
            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan Semua Statistik Pada Platform Ini',
            ],

            'count' => [
                'students' => Student::query()
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->count(),
                'teachers' => Teacher::query()
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->count(),
                'classrooms' => Classroom::query()
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->count(),
                'courses' => Course::query()
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->count(),
            ],
            
        ]);
        
    }
}
