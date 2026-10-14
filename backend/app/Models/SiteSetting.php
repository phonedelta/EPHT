<?php

namespace App\Models;

use App\Enums\SettingType;
use App\Models\Concerns\InvalidatesFrontendCache;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'group', 'type', 'value', 'is_public'])]
class SiteSetting extends Model
{
    use InvalidatesFrontendCache;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => SettingType::class,
            'value' => 'json',
            'is_public' => 'boolean',
        ];
    }

    /**
     * @return list<string>
     */
    public function frontendCacheTags(): array
    {
        return ['settings'];
    }
}
