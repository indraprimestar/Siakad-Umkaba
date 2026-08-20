<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Resources\Teacher\CourseTeacherResource;
use App\Http\Resources\Teacher\CourseScheduleResource;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Response;

class CourseTeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        $courses = Course::query()
            ->where('teacher_id', auth()->user()->teacher->id)
            ->where(function($query) {
                $activeYear = activeAcademicYear();
                if ($activeYear) {
                    $query->where('academic_year_id', $activeYear->id);
                }
            })
            ->filter(request()->only(keys: ['search']))
            ->sorting(request()->only(keys: ['field', 'direction']))
            ->with(relations: ['faculty', 'department', 'schedules'])
            ->paginate(perPage: request()->load ?? 10);

        return inertia(component: 'Teachers/Courses/Index', props: [
            'page_settings' => [
                'title' => 'Mata Kuliah',
                'subtitle' => 'Menampilkan semua data mata kuliah yang anda ampu',
            ],
            'courses' => CourseTeacherResource::collection(resource: $courses)->additional(data: [
                'meta' => [
                    'has_pages' => $courses->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param Course $course
     * @return Response
     */
    public function show(Course $course): Response
    {
        $course = $course->load(relations: ['faculty', 'department', 'academicYear', 'schedules']);

        return inertia(component: 'Teachers/Courses/Show', props: [
            'page_settings' => [
                'title' => $course->name,
                'subtitle' => 'Menampilkan detail mata kuliah',
            ],
            'course' => new CourseScheduleResource(resource: $course),
        ]);
    }
}