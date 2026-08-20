<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudyPlanStudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'academic_year_id' => $this->academic_year_id,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'notes' => $this->notes,
            'academicYear' => $this->whenLoaded('academicYear', function () {
                return [
                    'id' => $this->academicYear?->id,
                    'name' => $this->academicYear?->name,
                ];
            }),
            // ← TAMBAH INI:
            'schedules' => $this->whenLoaded('schedules', function () {
                return $this->schedules->map(function ($schedule) {
                    return [
                        'id' => $schedule->id,
                        'day_of_week' => $schedule->day_of_week,
                        'start_time' => $schedule->start_time,
                        'end_time' => $schedule->end_time,
                        'course' => [
                            'id' => $schedule->course?->id,
                            'name' => $schedule->course?->name,
                            'credit' => $schedule->course?->credit,
                        ],
                        'classroom' => [
                            'id' => $schedule->classroom?->id,
                            'name' => $schedule->classroom?->name,
                        ],
                    ];
                });
            }),
        ];
    }
}