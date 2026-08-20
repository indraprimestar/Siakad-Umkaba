<?php

namespace App\Http\Resources\Operator;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class ScheduleOperatorResource extends JsonResource
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
            'course' => $this->whenLoaded('course', function() {
                return [
                    'id' => $this->course?->id,
                    'name' => $this->course?->name,
                    'credit' => $this->course?->credit,
                ];
            }),
            'classroom' => $this->whenLoaded('classroom', function() {
                return [
                    'id' => $this->classroom?->id,
                    'name' => $this->classroom?->name,
                ];
            }),
            'academicYear' => $this->whenLoaded('academicYear', function() {
                return [
                    'id' => $this->academicYear?->id,
                    'name' => $this->academicYear?->name,
                ];
            }),
        ];
    }
}