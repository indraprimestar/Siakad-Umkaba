<?php

namespace App\Http\Resources\Operator;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class TeacherOperatorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'teacher_number' => $this->teacher_number,
            'academic_title' => $this->academic_title,
            'created_at' => $this->created_at,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user?->id,
                    'name' => $this->user?->name,
                    'email' => $this->user?->email,
                    'avatar' => $this->user?->avatar ? Storage::url($this->user->avatar) : null,
                ];
            }),
        ];
    }
}