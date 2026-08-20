<?php
// Check all Iqbal's courses with academic_year_id
$courses = App\Models\Course::where('teacher_id', 4)->get(['id', 'name', 'code', 'academic_year_id']);
echo "All courses for Iqbal (teacher_id=4):\n";
foreach ($courses as $c) {
    echo "  id={$c->id}, name={$c->name}, code={$c->code}, academic_year_id=" . ($c->academic_year_id ?? 'NULL') . "\n";
}
echo "\nActive Academic Year: " . activeAcademicYear()->id . "\n";
