<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Cviebrock\EloquentSluggable\Sluggable;

class Classroom extends Model
{
    use Sluggable;
    
    protected $fillable = [
        'name', 
        'faculty_id', 
        'department_id', 
        'academic_year_id'
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
            ],
        ];
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function courses(): HasManyThrough
    {
        return $this->hasManyThrough(
            Course::class,
            Schedule::class,
            'classroom_id',
            'id',
            'id',
            'course_id',
        );
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function (Builder $q, $search) {
            $q->where(function (Builder $w) use ($search) {
                $w->where('name', 'REGEXP', $search)
                  ->orWhereHas('faculty', fn ($s) => $s->where('name', 'REGEXP', $search))
                  ->orWhereHas('department', fn ($s) => $s->where('name', 'REGEXP', $search))
                  ->orWhereHas('academicYear', fn ($s) => $s->where('name', 'REGEXP', $search));
            });
        });
    }

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $query->when(isset($sorts['field']) && isset($sorts['direction']), function (Builder $q) use ($sorts) {
            $q->orderBy($sorts['field'], $sorts['direction']);
        });
    }
}