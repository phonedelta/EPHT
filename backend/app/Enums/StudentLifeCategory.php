<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Catégories des publications de la page « Vie à l'EPHT ».
 */
enum StudentLifeCategory: string
{
    use HasValues;

    case PracticalWork = 'travaux-pratiques';
    case StudentWork = 'realisations-etudiantes';
    case Events = 'evenements';
    case Conferences = 'conferences';
    case Defenses = 'soutenances';
    case OpenDays = 'portes-ouvertes';

    public function label(): string
    {
        return match ($this) {
            self::PracticalWork => 'Travaux pratiques',
            self::StudentWork => 'Réalisations étudiantes',
            self::Events => 'Événements',
            self::Conferences => 'Conférences',
            self::Defenses => 'Soutenances',
            self::OpenDays => 'Journées portes ouvertes',
        };
    }
}
