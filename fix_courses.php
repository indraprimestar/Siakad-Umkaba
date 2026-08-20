<?php
$ay = activeAcademicYear();
$count = App\Models\Course::whereNull('academic_year_id')->update(['academic_year_id' => $ay->id]);
echo "Fixed {$count} courses with NULL academic_year_id -> set to {$ay->id} ({$ay->name})\n";
