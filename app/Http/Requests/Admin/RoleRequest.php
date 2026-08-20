<?php

namespace App\Http\Requests\Admin;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user() && auth()->user()->hasRole('Super Admin');
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
                'min:3', 
                'max:255', 
                Rule::unique('roles')->ignore($this->route('role')),
            ],
        ];
    }
    public function attributes(): array
    {
        return [
            'name' => 'Nama',
        ];
    }
}
