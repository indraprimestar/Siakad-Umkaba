<?php

namespace App\Traits;

use App\Models\Attendance;
use App\Models\Grade;

trait CalculateFinalScore
{
    public function getAttendanceCount(int $studentId, int $courseId, int $classroomId): int
    {
        return Attendance::query()
            ->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->where('classroom_id', $classroomId)
            ->whereBetween('section', [1, 12])
            ->active()
            ->count();
    }

    public function getTasksSum(int $studentId, int $courseId, int $classroomId): int
    {
        return (int) Grade::query()
            ->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->where('classroom_id', $classroomId)
            ->where('category', 'tugas')
            ->sum('grade');
    }

    public function getGradeCount(int $studentId, int $courseId, int $classroomId, string $category): int
    {
        $grade = Grade::query()
            ->where(column: 'student_id', operator: $studentId)
            ->where(column: 'course_id', operator: $courseId)
            ->where(column: 'classroom_id', operator: $classroomId)
            ->where(column: 'category', operator: $category);

        if ($category === 'tugas') {
            $grade->whereBetween(column: 'section', values: [0, 9]);
        } elseif (in_array(needle: $category, haystack: ['uts', 'uas'])) {
            $grade->whereNull(columns: 'section');
        }

        return $grade->sum(column: 'grade');
    }

    public function calculateAttendacePercentage(int $attendanceCount, int $totalSessions = 12): float
    {
        return round(num: ($attendanceCount / $totalSessions) * 10, precision: 2);
    }

    public function calculateTaskPercentage(int $tasksCount, int $totalTasks = 10): float
    {
        return round(num: ($tasksCount / $totalTasks) * 0.2, precision: 2);
    }

    public function calculateUTSPercentage(int $utsCount): float
    {
        return round(num: $utsCount * 0.3, precision: 2);
    }

    public function calculateUASPercentage(int $uasCount): float
    {
        return round(num: $uasCount * 0.4, precision: 2);
    }

    public function calculateFinalScore(
        float $attendancePercentage,
        float $taskPercentage,
        float $utsPercentage,
        float $uasPercentage
    ): float {
        return round(num: $attendancePercentage + $taskPercentage + $utsPercentage + $uasPercentage, precision: 2);
    }

    public function getWeight(string $letterGrade): float
    {
        $gradePoints = [
            'A' => 4.00,
            'A-' => 3.70,
            'B+' => 3.30,
            'B-' => 2.70,
            'C+' => 2.30,
            'C' => 2.00,
            'C-' => 1.70,
            'D' => 1.00,
            'E' => 0.00,
        ];

        return $gradePoints[$letterGrade] ?? 0.00;
    }

}

