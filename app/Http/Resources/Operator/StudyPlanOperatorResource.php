<?php

namespace App\Http\Resources\Operator;

use App\Http\Resources\Operator\ScheduleResource;
use App\Http\Resources\Operator\ScheduleOperatorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Operator\StudyPlanOperatorController;

class StudyPlanOperatorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'status' => $this->status,

            'notes' => $this->notes,

            'semester' => $this->semester,

            'created_at' => $this->created_at,

            'student' => $this->whenLoaded('student', value: [
                'id' => $this->student?->id,

                'student_number' => $this->student?->student_number,

                'name' => $this->student?->user?->name,

                'avatar' => $this->student?->user?->avatar
                    ? Storage::url(path: $this->student?->user?->avatar)
                    : null,

                'classroom' => $this->student?->classroom?->name,
            ]),

            'academicYear' => $this->whenLoaded('academicYear', value: [
                'id' => $this->academicYear?->id,

                'name' => $this->academicYear?->name,
            ]),

            'schedules' => $this->whenLoaded('schedules', value: ScheduleOperatorResource::collection(resource: $this->schedules)),
        ];
    }
}