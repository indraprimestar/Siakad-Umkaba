<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;       // <-- tambahkan ini
use Inertia\Inertia;        // <-- opsional kalau pakai Inertia::render()
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Classroom;
use App\Models\Course;

class DashboardAdminController extends Controller
{
    //
    public function __invoke(): Response

    {
        // dd([
        //     'faculies' => Faculty::count(),
        //     'departments' => Department::count(),
        //     'classrooms' => Classroom::count(),
        //     'courses' => Course::count(),
        // ]);
        return inertia('Admin/Dashboard',[
            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan Semua Statistik Pada Platform Ini',
            ],
            'count' => [
                'faculties' => Faculty::count(),
                'departments' => Department::count(),
                'classrooms' => Classroom::count(),
                'courses' => Course::count(),
            ],
        ]);
    }
}
