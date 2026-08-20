<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Faculty>
 */
class FacultyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [

            'name' => $name = $this->faker->unique() -> randomElement ([
                'Fakultas Ilmu Kesehatan',
                'Fakultas Humaniora dan Sainstek',
                'Fakultas Keguruan dan Ilmu Pendidikan',
                'Fakultas Ilmu Agama',
            ]),
            //
            'slug'=> str()->slug($name),
            'code'=> str()->random(6),
        ];
    }

    public function configure(){
        return $this->afterCreating(function($faculty)
        {
            
            $departments = match ($faculty->name){
                'Fakultas Ilmu Kesehatan' => [
                    ['name' => $name = 'D3 Keperawatan', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                    ['name' => $name = 'S1 Keperawatan', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                    ['name' => $name = 'S1 Ilmu Gizi', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                    ['name' => $name = 'Profesi Ners', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                ],

                'Fakultas Humaniora dan Sainstek' => [
                     ['name' => $name = 'S1 Akutansi', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                     ['name' => $name = 'S1 Manajemen', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                     ['name' => $name = 'S1 Informatika', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                     ['name' => $name = 'S1 Hukum', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                ],

                'Fakultas Keguruan dan Ilmu Pendidikan' => [
                     ['name' => $name = 'S1 PGSD (Pendidikan Guru Sekolah Dasar)', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                     ['name' => $name = 'S1 Pendidikan Bahasa Inggris', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                ],

                'Fakultas Ilmu Agama' => [
                     ['name' => $name = 'S1 Agama Islam', 'slug' => str()->slug($name), 'code' => str()->random(6)],
                ],

                default => [],
            };
            foreach($departments as $department){
                $faculty->departments()->create([
                    'name' => $department['name'],
                    'slug' => $department['slug'],
                    'code' => $department['code'],
                ]);
            }
        });
    }
}
