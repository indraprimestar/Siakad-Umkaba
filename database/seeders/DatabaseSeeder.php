<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Faculty;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(FacultySeeder::class);
        $this->call(FeeGroupSeeder::class);
        

        User::factory()->create([
           'name' => 'Super Admin',
           'email' => 'superadmin@umkaba.ac.id',
           'password' => bcrypt('anakkuat2026'),
        ])->assignRole(Role::firstOrCreate([
            'name' => 'Super Admin',
        ]));

        $operator = User::factory()->create([
            'name' => 'Dhika Admin',
           'email' => 'dhika@mail.umkaba.ac.id',
        ])->assignRole(Role::firstOrCreate([
            'name' => 'Admin Fakultas',
        ]));

        $operator->operator()->create([
            'faculty_id' => 1,
            'department_id' => 1,
            'employee_number' => str()->padLeft(mt_rand(1, 999999), 6, '0'),
        ]);

        $teacher = User::factory()->create([
           'name' => 'Khairun Nisa',
           'email' => 'nisa@mail.umkaba.ac.id',
        ])->assignRole(Role::firstOrCreate([
            'name' => 'Dosen',
        ]));

        $teacher->teacher()->create([
            'faculty_id' => 1,
            'department_id' => 1,
            'teacher_number' => str()->padLeft(mt_rand(1, 999999), 6, '0'),
            'academic_title' => 'Asisten Ahli',
        ]);

        $student = User::factory()->create([
           'name' => 'Bagus',
           'email' => 'Bagus@mail.umkaba.ac.id',
        ])->assignRole(Role::firstOrCreate([
            'name' => 'Mahasiswa',
        ]));

        $student->student()->create([
            'faculty_id' => 1,
            'department_id' => 1,
            'fee_group_id' => rand(1, 6),
            'student_number' => str()->padLeft(mt_rand(1, 999999), 6, '0'),
            'semester' => 1,
            'batch' => 2025,
        ]);

    }
}
