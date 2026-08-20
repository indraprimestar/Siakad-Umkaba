<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;


class Department extends Model
{
    //

    protected $fillable = [
        'faculty_id',
        'name',
        'code',
        'slug',
    ];
    public function sluggable(): array{
        return [
            'slug' => [
                'source' => 'name'
            ],
        ];
    }

    protected function code(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => strtoupper($value),
            set: fn (string $value) => strtolower($value),
        );
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function scopeFilter(Builder $query, array $filters): void 
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereAny([
                'name',
                'code',
            ],'REGEXP', $search)
            ->orWhereHas('faculty', fn($query) => $query->where('name', 'REGEXP', $search));
                
        });
        
    }
    public function scopeSorting(Builder $query, array $sorts):void{
        $query->when($sorts['field'] ?? null && $sorts['direction'] ?? null, function ($query) use ($sorts) {
            match ($sorts['field']) {
                'faculty_id' => $query->join('faculties', 'departments.faculty_id', '=', 'faculties.id')
                    ->orderBy('faculties.name', $sorts['direction']),
                default => $query->orderBy($sorts['field'], $sorts['direction']),
            };
        });
    }
    public function getRouteKeyName(): string { return 'slug'; } //tambahan

}
