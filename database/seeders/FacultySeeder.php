<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Faculty;
use Illuminate\Support\Str;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        Faculty::factory()->count(4)->create();
    }
}
    /**
     * Run the database seeds.
     */
    //public function run(): void
   // {
        //
    //    Faculty::factory()->count(4)->create();
   // }


