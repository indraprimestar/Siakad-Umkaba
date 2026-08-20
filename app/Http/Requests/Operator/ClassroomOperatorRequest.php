<?php

namespace App\Http\Requests\Operator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClassroomOperatorRequest extends FormRequest
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
        $classroom = $this->route('classroom');

        return [
            'name' => [
                'required',
                'min:3',
                'max:255',
                'string',
                $classroom ? Rule::unique('classrooms', 'name')->ignore($classroom->id) : Rule::unique('classrooms', 'name'),
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Nama Kelas',
        ];
    }
}