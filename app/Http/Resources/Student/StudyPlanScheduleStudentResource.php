<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudyPlanScheduleStudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'day_of_week' => $this->day_of_week,
            'start_time'  => $this->start_time,
            'end_time'    => $this->end_time,
            'taken_quota' => $this->taken_quota,
            'quote'       => $this->quote,  // ← Ubah dari quota ke quote
            'course'      => [
                'id'   => $this->course?->id,
                'name' => $this->course?->name,
            ],
            'classroom'   => [
                'id'   => $this->classroom?->id,
                'name' => $this->classroom?->name,
            ],
        ];
    }
}