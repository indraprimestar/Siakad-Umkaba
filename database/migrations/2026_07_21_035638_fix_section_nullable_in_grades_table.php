<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus unique constraint lama dulu (karena akan diubah)
        Schema::table('grades', function (Blueprint $table) {
            $table->dropUnique('grades_unique');
        });

        // Ubah section menjadi nullable
        Schema::table('grades', function (Blueprint $table) {
            $table->unsignedInteger('section')->nullable()->change();
        });

        // Bersihkan data duplikat UTS/UAS yang tersimpan sebagai section=0
        // (akibat bug NULL → 0 sebelumnya)
        DB::statement("
            DELETE g1 FROM grades g1
            INNER JOIN grades g2 ON
                g1.id > g2.id AND
                g1.student_id = g2.student_id AND
                g1.course_id = g2.course_id AND
                g1.classroom_id = g2.classroom_id AND
                g1.category = g2.category AND
                (
                    (g1.section = g2.section) OR
                    (g1.section IS NULL AND g2.section IS NULL) OR
                    (g1.section = 0 AND g2.section IS NULL) OR
                    (g1.section IS NULL AND g2.section = 0)
                )
        ");

        // Set section=0 ke NULL untuk UTS/UAS (karena dulu disimpan sebagai 0)
        DB::statement("UPDATE grades SET section = NULL WHERE category IN ('uts', 'uas') AND section = 0");

        // Bersihkan semua data grade yang tersisa berpotensi duplikat untuk tugas
        DB::statement("
            DELETE g1 FROM grades g1
            INNER JOIN grades g2 ON
                g1.id > g2.id AND
                g1.student_id = g2.student_id AND
                g1.course_id = g2.course_id AND
                g1.classroom_id = g2.classroom_id AND
                g1.category = g2.category AND
                g1.section = g2.section
        ");

        // Tambah kembali unique constraint yang benar (support NULL untuk UTS/UAS)
        Schema::table('grades', function (Blueprint $table) {
            $table->unique(['student_id', 'course_id', 'classroom_id', 'category', 'section'], 'grades_unique');
        });
    }

    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->dropUnique('grades_unique');
            $table->unsignedInteger('section')->nullable(false)->change();
            $table->unique(['student_id', 'course_id', 'classroom_id', 'category', 'section'], 'grades_unique');
        });
    }
};
