<?php

namespace App\Http\Requests\Operator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentOperatorRequest extends FormRequest
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
        return [
            'name' =>[
                'required',
                'string',
                'min:3',
                'max:255',
            ],
            'email' =>[
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->student?->user),
            ],
            'password' => Rule::when($this ->routeIs('operator.students.store'), [
                'required',
                'min:8',
                'max:255',
            ]),
            Rule::when($this ->routeIs('operator.students.update'), [
                'nullable',
                'min:8',
                'max:255',
            ]),
            'student_number' => [
                'required',
                'string',
                'max:13',
                Rule::unique('students', 'student_number')->ignore($this->student),
            ],
            'batch' => [
                'required',
                'integer',
            ],
            'avatar' => [
                'nullable',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
            'fee_group_id' => [
                'required',
                'exists:fee_groups,id',
            ],
            'classroom_id' =>[
                'required',
                'exists:classrooms,id',
            ],
        ];
    }
    public function attributes(): array
    {
        return [
            'name' => 'Nama',
            'email' => 'Email',
            'password' => 'Password',
            'student_number' => 'N.I.M',
            'semester' => 'semester',
            'batch' => 'Angkatan',
            'fee_group_id' => 'Golongan UKT',
            'classroom_id' => 'Kelas',
        ];
    }
}
