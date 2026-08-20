<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudyPlan;
use App\Enums\ScheduleDay;
use Illuminate\Http\Request;

class ScheduleStudentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $studyPlan = StudyPlan::query()
            ->where('student_id', auth()->user()->student?->id)
            ->where('academic_year_id', activeAcademicYear()?->id)
            ->approved()
            ->with(['schedules.course']) // Optimasi: Eager load relation 'course' agar tidak n+1 query
            ->first();

        if (! $studyPlan) {
            flashMessage('Anda belum mengajukan krs', 'warning');

            return to_route('students.study-plans.index');
        }

        $days = ScheduleDay::cases();
        $scheduleTable = [];

        foreach ($studyPlan->schedules as $schedule) {
            $startTime = substr($schedule->start_time, 0, 5);
            // PERBAIKAN: Mengubah $schedule->endTime menjadi $schedule->end_time
            $endTime = substr($schedule->end_time, 0, 5);
            $day = $schedule->day_of_week->value;

            $scheduleTable[$startTime][$day] = [
                'course' => $schedule->course->name,
                'code' => $schedule->course->code,
                'end_time' => $endTime,
            ];
        }

        // PERBAIKAN: Mengubah helper 'collection()' menjadi 'collect()'
        $scheduleTable = collect($scheduleTable)->sortKeys();

        return inertia('Students/Schedules/Index', [
            'page_settings' => [
                'title' => 'Jadwal',
                'subtitle' => 'Menampilkan semua jadwal yang tersedia',
            ],
            'scheduleTable' => $scheduleTable,
            'days' => $days,
        ]);
    }
}