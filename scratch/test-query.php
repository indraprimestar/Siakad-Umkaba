<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$course_id = 3; // "Jaringan Komputer" or whatever the course is, let's find it by name if needed.
$course = \App\Models\Course::where('name', 'like', '%Jaringan Komputer%')->first();
if (!$course) {
    echo "Course not found\n";
    exit;
}
echo "Course ID: " . $course->id . "\n";

$classroom = \App\Models\Classroom::where('name', 'like', '%Lab Komputer%')->first();
if (!$classroom) {
    echo "Classroom not found\n";
    exit;
}
echo "Classroom ID: " . $classroom->id . "\n";

$schedule = \App\Models\Schedule::query()
    ->where('course_id', $course->id)
    ->where('classroom_id', $classroom->id)
    ->first();

if (!$schedule) {
    echo "Schedule not found\n";
    exit;
}

echo "Schedule ID: " . $schedule->id . "\n";

// check active academic year
$activeAcademicYear = activeAcademicYear();
if (!$activeAcademicYear) {
    echo "Active academic year not found\n";
    exit;
}
echo "Active Academic Year ID: " . $activeAcademicYear->id . "\n";

$students = \App\Models\Student::query()
    ->whereHas('user', function ($query) {
        $query->whereHas('roles', fn ($query) => $query->where('name', 'Student'));
    })
    ->whereHas('studyPlans', function ($query) use ($schedule, $activeAcademicYear) {
        $query->where('academic_year_id', $activeAcademicYear->id)
            ->approved()
            ->whereHas('schedules', fn ($query) => $query->where('schedule_id', $schedule->id));
    })
    ->get();

echo "Students found: " . $students->count() . "\n";

if ($students->count() == 0) {
    echo "Debugging why 0 students...\n";
    // Get ALL students taking this schedule without the 'roles' check or 'approved' check
    
    $studentsAll = \App\Models\Student::whereHas('studyPlans', function ($query) use ($schedule) {
        $query->whereHas('schedules', fn ($query) => $query->where('schedule_id', $schedule->id));
    })->get();
    
    echo "Students enrolled in schedule (any academic year/status): " . $studentsAll->count() . "\n";
    
    if ($studentsAll->count() > 0) {
        foreach($studentsAll as $st) {
            echo "Student: " . $st->id . " NPM: " . $st->student_number . "\n";
            $plan = $st->studyPlans()->whereHas('schedules', fn ($query) => $query->where('schedule_id', $schedule->id))->first();
            echo "  StudyPlan ID: " . $plan->id . ", Status: " . $plan->status->value . ", Academic Year: " . $plan->academic_year_id . "\n";
            echo "  Has Role Student? " . ($st->user->hasRole('Student') ? 'Yes' : 'No') . "\n";
        }
    }
}

