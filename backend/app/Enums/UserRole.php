<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum UserRole: string
{
    use HasValues;

    // Accès complet, y compris les candidatures, les utilisateurs et les paramètres.
    case Admin = 'admin';

    // Gestion du contenu éditorial uniquement.
    case Editor = 'editor';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrateur',
            self::Editor => 'Éditeur',
        };
    }
}
