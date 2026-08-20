<?php

namespace App\Http\Resources\Teacher;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CourseStudentClassroomResource extends JsonResource
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
            'student_number' => $this->student_number,
            'user' => $this->whenLoaded('user', [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
                'avatar' => $this->user?->avatar ? Storage::url($this->user->avatar) : null,
            ]),
            'attendances' => $this->whenLoaded('attendances', CourseAttendanceResource::collection($this->attendances)),
            'grades' => $this->whenLoaded('grades', CourseGradeResource::collection($this->grades)),
            'total' => [
                'attendances_count' => $attendances_count = $this->attendance_count ?? 0,
                'tasks_count' => $tasks_count = $this->tasks_count ?? 0,
                'uts_count' => $uts_count = $this->uts_count ?? 0,
                'uas_count' => $uas_count = $this->uas_count ?? 0,

                'percentage' => [
                    'attendance_percentage' => $attendance_percentage = round(num: ($attendances_count / 12) * 10, precision: 2),
                    'task_percentage' => $task_percentage = round(num: ($tasks_count / 10) * 0.2, precision: 2),
                    'uts_percentage' => $uts_percentage = round(num: $uts_count * 0.3, precision: 2),
                    'uas_percentage' => $uas_percentage = round(num: $uas_count * 0.4, precision: 2),
                ],

                'final_score' => $final_score = round(num: $attendance_percentage + $task_percentage + $uts_percentage + $uas_percentage, precision: 2),
                'letter' => getLetterGrade(grade: $final_score),
            ],
        ];
    }
}