<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use App\Models\StudyPlan;
use App\Enums\StudyPlanStatus;
use App\Models\Fee;
use App\Enums\FeeStatus;

class DashboardStudentController extends Controller
{
    public function __invoke(): Response
    {
        return inertia('Students/Dashboard',[
            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan Semua Statistik Pada Platform Ini',
            ],
            'count' => [
                'study_plans_approved' => StudyPlan::query()
                    ->where('student_id', auth()->user()->student->id)
                    ->where('status', StudyPlanStatus::APPROVED->value)
                    ->count(),
                'study_plans_reject' => StudyPlan::query()
                    ->where('student_id', auth()->user()->student->id)
                    ->where('status', StudyPlanStatus::REJECTED->value)
                    ->count(),
                'total_payments'=> Fee::query()
                    ->where('student_id', auth()->user()->student->id)
                    ->where('status', FeeStatus::SUCCESS->value)
                    ->with('feeGroup')
                    ->get()
                    ->sum(fn($fee)=> $fee->feeGroup?->amount ?? 0)
            ],
            
        ]);
    }
}
