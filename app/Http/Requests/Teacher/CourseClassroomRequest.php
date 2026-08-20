<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class CourseClassroomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Dosen');
    }

    public function rules(): array
    {
        return [
            'attendances.*.status' => [
                'nullable',
                'boolean',
            ],
            'grades.*.grade' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'attendances.*.status' => 'Kehadiran',
            'grades.*.grade' => 'Nilai',
        ];
    }
}