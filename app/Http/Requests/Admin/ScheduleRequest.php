<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ScheduleDay;
use Illuminate\Validation\Rules\Enum;
//use App\Enums\Enum;

class ScheduleRequest extends FormRequest
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
            // 'semester_id' => [
            //     'required',
            //     'exists:semesters,id',
            // ],
            'course_id' => [
                'required',
                'exists:courses,id',
            ],
            'classroom_id' => [
                'required',
                'exists:classrooms,id',
            ],
            'day_of_week' => [
                'required',
                new Enum(ScheduleDay::class),
            ],
            'start_time' => [
                'required',
            ],
            'end_time' => [
                'required',
            ],
            'quote' => [
                'required',
                'integer',
            ],
        ];
    }
    public function attributes()
    {
        return [
            'faculty_id' => 'Fakultas',
            'department_id' => 'Program Studi',
            'academic_year_id' => 'Angkatan',
            'semester_id' => 'Semester',
            'course_id' => 'Matkul',
            'classroom_id' => 'kelas',
            'day_of_week' => 'Hari',
            'start_time' => 'Waktu Mulai',
            'end_time' => 'Waktu Akhir',
            'quote' => 'kouta',
        ];
    }
}
