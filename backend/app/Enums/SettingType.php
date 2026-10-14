<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum SettingType: string
{
    use HasValues;

    case String = 'string';
    case Text = 'text';
    case Url = 'url';
    case Email = 'email';
    case Phone = 'phone';
    case Number = 'number';
    case Boolean = 'boolean';

    // Liste ou structure (étapes, points forts, lignes d'adresse…).
    case Json = 'json';

    // Identifiant d'un média de la médiathèque.
    case Media = 'media';
}
