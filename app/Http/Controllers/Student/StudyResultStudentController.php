<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\StudyResultStudentResource;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Models\StudyResult;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudyResultStudentController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('checkActiveAcademicYear'),
            new Middleware('checkFeeStudent'),
        ];
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $studyResults = StudyResult::query()
            ->select(columns: ['id', 'student_id', 'academic_year_id', 'gpa', 'semester', 'created_at'])
            ->where(column: 'student_id', operator: auth()->user()->student->id)
            ->with(relations: ['grades', 'academicYear'])
            ->paginate(perPage: $request->load ?? 10);

        return inertia(
            component: 'Students/StudyResults/Index',
            props: [
                'page_settings' => [
                    'title' => 'Kartu Hasil Studi',
                    'subtitle' => 'Menampilkan semua data kartu hasil studi',
                ],
                'studyResults' => StudyResultStudentResource::collection(resource: $studyResults)->additional(data: [
                    'meta' => [
                        'has_pages' => $studyResults->hasPages(),
                    ],
                ]),
                'state' => [
                    'page' => $request->page ?? 1,
                    'load' => 10,
                ],
            ]
        );
    }
}