<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TeacherRequest extends FormRequest
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
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->teacher?->user),
            ],
            'password' => Rule::when($this ->routeIs('admin.teachers.store'), [
                'required',
                'min:8',
                'max:255',
            ]),
            Rule::when($this ->routeIs('admin.teachers.update'), [
                'nullable',
                'min:8',
                'max:255',
            ]),
            'faculty_id' => [
                'required',
                'exists:faculties,id',
            ],
            'department_id' => [
                'required',
                'exists:departments,id',
            ],
            'teacher_number' => [
                'required',
                'string',
                'max:255',
            ],
            'academic_title' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],
            'avatar' => [
                'nullable',
                'mimes:jpeg,jpg,png',
                'max:2048',
            ],
        ];
    }
    public function attributes():array
    {
        return [
            'name' => 'Nama',
            'email' => 'Email',
            'password' => 'Password',
            'faculty_id' => 'Fakultas',
            'department_id' => 'Program Studi',
            'teacher_number' => 'NIDN',
            'academic_title' => 'Jabatan Akademik',
            'avatar' => 'Avatar',
        ];
    }
}
