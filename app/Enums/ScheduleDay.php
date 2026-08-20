<?php

namespace App\Enums;

enum ScheduleDay: string {
    case MONDAY = "Senin";

    case TUESDAY = "Selasa";  

    case WEDNESDAY = "Rabu";

    case THURSDAY = "Kamis";    

    case FRIDAY = "Jumat";        
    
    case SATURDAY = "Sabtu";

    case SUNDAY = "Minggu";

    public static function options(): array 
    {
        return collect(self::cases())->map(fn ($item) => [ 
            'value' => $item->value,
            'label' => $item->value
            
            ])->values()->toArray();
    }
}