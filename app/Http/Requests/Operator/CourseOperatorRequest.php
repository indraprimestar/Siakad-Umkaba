<?php

namespace App\Http\Requests\Operator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseOperatorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Admin Fakultas');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $course = $this->route('course');

        return [
            'code' => [
                'required',
                'min:2',
                'max:10',
                'string',
                $course ? Rule::unique('courses', 'code')->ignore($course->id) : Rule::unique('courses', 'code'),
            ],
            'name' => [
                'required',
                'min:3',
                'max:255',
                'string',
            ],
            'credit' => [
                'required',
                'integer',
                'min:1',
                'max:6',
            ],
            'semester' => [
                'required',
                'integer',
                'min:1',
                'max:8',
            ],
            'teacher_id' => [
                'required',
                'exists:teachers,id',
            ],
            'department_id' => [
                'nullable',
                'exists:departments,id',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'code' => 'Kode Mata Kuliah',
            'name' => 'Nama Mata Kuliah',
            'credit' => 'SKS',
            'semester' => 'Semester',
            'teacher_id' => 'Pengajar',
            'department_id' => 'Program Studi',
        ];
    }
}