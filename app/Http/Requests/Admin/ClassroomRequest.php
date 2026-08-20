<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ClassroomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Super Admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],
            'faculty_id' => [
                'required',
                'exists:faculties,id',
            ],
            'department_id' => [
                'required',
                'exists:departments,id',
            ],
            // 'academic_year_id' => [
            //     'required',
            //     'exists:academic_years,id',
            // ],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Nama',
            'faculty_id' => 'Fakultas',
            'department_id' => 'Departemen',
            // 'academic_year_id' => 'Tahun Ajaran',
        ];
    }
}
