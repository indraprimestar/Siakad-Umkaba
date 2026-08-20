<?php

namespace App\Http\Resources\Student;

use App\Http\Resources\Operator\GradeOperatorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudyResultStudentResource extends JsonResource
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

            'semester' => $this->semester,

            'gpa' => $this->gpa,

            'created_at' => $this->created_at,

            'academicYear' => $this->whenLoaded(
                relationship: 'academicYear',
                value: [
                    'id' => $this->academicYear?->id,
                    'name' => $this->academicYear?->name,
                ]
            ),

            'grades' => $this->whenLoaded(
                relationship: 'grades',
                value: GradeOperatorResource::collection($this->grades)
            ),
        ];
    }
}