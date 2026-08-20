<?php

namespace App\Http\Requests\Operator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\ScheduleDay;

class ScheduleOperatorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth()->user();
        
        if (!$user || !$user->operator) {
            return false;
        }
        
        $operator = $user->operator;
        return $operator->faculty_id && $operator->department_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'day_of_week' => ['required', Rule::enum(ScheduleDay::class)],
            'quote' => 'required|integer|min:1|max:100',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'course_id' => 'Mata Kuliah',
            'classroom_id' => 'Kelas',
            'start_time' => 'Waktu Mulai',
            'end_time' => 'Waktu Selesai',
            'day_of_week' => 'Hari',
            'quote' => 'Kuota',
        ];
    }
}