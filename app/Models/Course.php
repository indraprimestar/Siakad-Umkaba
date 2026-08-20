<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Cviebrock\EloquentSluggable\Sluggable;


class Course extends Model
{
    //

    protected $fillable = [
        'faculty_id',
        'department_id',
        'teacher_id',
        'academic_year_id',
        'code',
        'name',
        'credit',
        'semester',
    ];
    protected static function booted(): void
    {
        static::creating(function ($course) {
            if (empty($course->academic_year_id)) {
                $course->academic_year_id = activeAcademicYear()?->id;
            }
        });
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function scopeFilter(Builder $query, array $filters): void 
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereAny([
                'name',
                'code',
            ], 'REGEXP', $search)
                ->orWhereHas('teacher.user', fn($query) => $query->whereAny(['name', 'email'],'REGEXP', $search))
                ->orWhereHas('faculty', fn($query) => $query->where('name', 'REGEXP', $search))
                ->orWhereHas('department', fn($query) => $query->where('name', 'REGEXP', $search));
        });
    }

    public function scopeSorting(Builder $query, array $sorts): void 
    {
        $query->when($sorts['field'] ?? null && $sorts['direction'] ?? null, function() {
            match ($sorts['field']) {
                'faculty_id' => $this->join('faculties', 'courses.faculty_id', '=', 'faculties.id')
                    ->orderBy('faculties.name', $sorts['direction']),
                'department_id' => $this->join('departments', 'courses.department_id', '=', 'departments.id')
                    ->orderBy('departments.name', $sorts['direction']),
                'name' => $query
                    ->leftJoin('teachers', 'teachers.id', '=','courses.teacher_id')
                    ->leftJoin('users', 'teachers.user_id', '=', 'users.id')
                    ->orderBy('users.name', $sorts['direction']),
                default => $this->orderBy($sorts['field'], $sorts['direction']),
            };
        });
    }

}
