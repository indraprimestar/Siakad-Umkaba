<?php

namespace App\Http\Resources\Operator;

use App\Http\Resources\Operator\GradeOperatorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StudyResultOperatorResource extends JsonResource
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
            'student' => $this->whenLoaded(relationship: 'student', value: [
                'id' => $this->student?->id,
                'student_number' => $this->student?->student_number,
                'name' => $this->student?->user?->name,
                'avatar' => $this->student?->user?->avatar ? Storage::url($this->student?->user?->avatar) : null,
            ]),
            'academicYear' => $this->whenLoaded(relationship: 'academicYear', value: [
                'id' => $this->academicYear?->id,
                'name' => $this->academicYear?->name,
            ]),
            'grades' => GradeOperatorResource::collection(resource: $this->grades),
        ];
    }
}
