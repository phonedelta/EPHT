<?php

namespace App\Enums\Concerns;

trait HasValues
{
    /**
     * Valeurs scalaires de l'énumération, pour les migrations et la validation.
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
