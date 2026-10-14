<?php

namespace Database\Seeders;

use App\Enums\SettingType;
use App\Models\SiteSetting;
use App\Support\Typography;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SiteSettingsSeeder extends Seeder
{
    // Types dont la valeur est un texte destiné à être lu.
    private const TEXT_TYPES = [SettingType::String, SettingType::Text, SettingType::Json];

    /**
     * Crée les paramètres manquants sans toucher à ceux déjà enregistrés.
     */
    public function run(): void
    {
        /** @var array<string, array{0: SettingType, 1: mixed, 2?: bool}> $definitions */
        $definitions = require __DIR__.'/data/site_settings.php';

        foreach ($definitions as $key => $definition) {
            [$type, $value] = $definition;

            if (in_array($type, self::TEXT_TYPES, true)) {
                $value = Typography::frenchDeep($value);
            }

            SiteSetting::query()->firstOrCreate(
                ['key' => $key],
                [
                    'group' => Str::before($key, '.'),
                    'type' => $type,
                    'value' => $value,
                    'is_public' => $definition[2] ?? true,
                ],
            );
        }
    }
}
