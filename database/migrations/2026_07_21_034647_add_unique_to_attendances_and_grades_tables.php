<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus duplikat data lama sebelum tambah unique constraint
        DB::statement('DELETE a1 FROM attendances a1
            INNER JOIN attendances a2
            WHERE a1.id > a2.id
              AND a1.student_id = a2.student_id
              AND a1.course_id = a2.course_id
              AND a1.classroom_id = a2.classroom_id
              AND a1.section = a2.section');

        DB::statement('DELETE g1 FROM grades g1
            INNER JOIN grades g2
            WHERE g1.id > g2.id
              AND g1.student_id = g2.student_id
              AND g1.course_id = g2.course_id
              AND g1.classroom_id = g2.classroom_id
              AND g1.category = g2.category
              AND (g1.section = g2.section OR (g1.section IS NULL AND g2.section IS NULL))');

        Schema::table('attendances', function (Blueprint $table) {
            $table->unique(['student_id', 'course_id', 'classroom_id', 'section'], 'attendances_unique');
        });

        Schema::table('grades', function (Blueprint $table) {
            $table->unique(['student_id', 'course_id', 'classroom_id', 'category', 'section'], 'grades_unique');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropUnique('attendances_unique');
        });

        Schema::table('grades', function (Blueprint $table) {
            $table->dropUnique('grades_unique');
        });
    }
};
