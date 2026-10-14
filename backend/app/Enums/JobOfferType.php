<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum JobOfferType: string
{
    use HasValues;

    case Internship = 'stage';
    case Job = 'emploi';

    public function label(): string
    {
        return match ($this) {
            self::Internship => 'Stage',
            self::Job => 'Emploi',
        };
    }
}
