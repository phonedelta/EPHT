<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum ContactMessageStatus: string
{
    use HasValues;

    case New = 'new';
    case Read = 'read';
    case Answered = 'answered';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::New => 'Nouveau',
            self::Read => 'Lu',
            self::Answered => 'Traité',
            self::Archived => 'Archivé',
        };
    }
}
