<?php

namespace App\Http\Requests\Operator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class TeacherOperatorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasAnyRole(['Operator', 'Admin Fakultas']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
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

            'teacher_number' => [
                'required',
                'string',
                'max:10',
            ],

            'academic_title' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],

            'avatar' => [
                'nullable',
                'mimes:png,jpg,webp',
                'max:2048',
            ]
        ];

        // Tambahkan password rule berdasarkan route
        if ($this->routeIs('operators.teachers.store')) {
            $rules['password'] = [
                'required',
                'min:8',
                'max:255',
            ];
        } elseif ($this->routeIs('operators.students.store')) {
            $rules['password'] = [
                'nullable',
                'min:8',
                'max:255',
            ];
        }

        return $rules;
    }

    public function attributes(): array
    {
        return [
            'name' => 'Nama',
            'email' => 'Email',
            'password' => 'Password',
            'teacher_number' => 'Nomor Induk Dosen',
            'academic_title' => 'Jabatan Akademik',
            'avatar' => 'Avatar',
        ];
    }
}