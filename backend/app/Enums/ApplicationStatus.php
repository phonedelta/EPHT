<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum ApplicationStatus: string
{
    use HasValues;

    case New = 'nouvelle';
    case Contacted = 'contactee';
    case InterviewScheduled = 'entretien_prevu';
    case Accepted = 'acceptee';
    case Rejected = 'refusee';
    case Enrolled = 'inscription_finalisee';

    public function label(): string
    {
        return match ($this) {
            self::New => 'Nouvelle',
            self::Contacted => 'Contactée',
            self::InterviewScheduled => 'Entretien prévu',
            self::Accepted => 'Acceptée',
            self::Rejected => 'Refusée',
            self::Enrolled => 'Inscription finalisée',
        };
    }
}
