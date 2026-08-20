<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('study_results', function (Blueprint $table) {
            $table->dropForeign(['academic_year']);
            $table->renameColumn('academic_year', 'academic_year_id');
            $table->foreign('academic_year_id')->references('id')->on('academic_years')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('study_results', function (Blueprint $table) {
            $table->dropForeign(['academic_year_id']);
            $table->renameColumn('academic_year_id', 'academic_year');
            $table->foreign('academic_year')->references('id')->on('academic_years')->cascadeOnDelete();
        });
    }
};
