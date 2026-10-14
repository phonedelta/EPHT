<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum GallerySection: string
{
    use HasValues;

    case Infrastructure = 'infrastructure';
    case StudentLife = 'student_life';
    case Formation = 'formation';
    case Event = 'event';

    public function label(): string
    {
        return match ($this) {
            self::Infrastructure => 'Infrastructures',
            self::StudentLife => "Vie à l'EPHT",
            self::Formation => 'Formations',
            self::Event => 'Événements',
        };
    }
}
