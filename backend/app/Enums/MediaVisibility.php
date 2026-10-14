<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum MediaVisibility: string
{
    use HasValues;

    case Public = 'public';
    case Private = 'private';
}
