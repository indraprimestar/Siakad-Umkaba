<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ScheduleResource extends JsonResource
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
            'start_time' => Carbon::parse($this->start_time)->format('H:i'),
            'end_time' => Carbon::parse($this->end_time)->format('H:i'),
            'day_of_week' => $this->day_of_week,
            'quote' => $this->quote,
            'created_at' => $this->created_at,
            'taken_quota' => $this->taken_quota,
            'faculty' => $this->whenLoaded('faculty', [
                'id' => $this->faculty?->id,
                'name' => $this->faculty?->name,
            ]),
            'department' => $this->whenLoaded('department', [
                'id' => $this->department?->id,
                'name' => $this->department?->name,
            ]),
            'classroom' => $this->whenLoaded('classroom', [
                'id' => $this->classroom?->id,
                'name' => $this->classroom?->name,
                'slug' => $this->classroom?->slug,
            ]),
            'course' => $this->whenLoaded('course', [
                'id' => $this->course?->id,
                'name' => $this->course?->name,
                'code' => $this->course?->code,
                'credit' => $this->course?->credit,
            ]),
            'academicYear' => $this->whenLoaded('academicYear', [
                'id' => $this->academicYear?->id,
                'name' => $this->academicYear?->name,
            ]),
        ];
    }
}
