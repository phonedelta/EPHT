<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum MediaType: string
{
    use HasValues;

    case Image = 'image';
    case Video = 'video';
    case Document = 'document';
}
