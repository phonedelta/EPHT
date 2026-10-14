<?php

namespace App\Services;

use App\Enums\MediaVisibility;
use App\Enums\SettingType;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use App\Models\SiteSetting;
use Illuminate\Support\Arr;

/**
 * Lecture des paramètres du site enregistrés en base.
 */
class SiteSettings
{
    /**
     * Paramètres publics, regroupés en arborescence d'après leur clé pointée
     * (« contact.email » devient ['contact' => ['email' => …]]). Les paramètres
     * de type média sont remplacés par la description du média.
     *
     * @return array<string, mixed>
     */
    public function publicTree(): array
    {
        $settings = SiteSetting::query()
            ->where('is_public', true)
            ->orderBy('key')
            ->get(['key', 'type', 'value']);

        $mediaIds = $settings
            ->where('type', SettingType::Media)
            ->pluck('value')
            ->filter()
            ->unique();

        $media = $mediaIds->isEmpty()
            ? collect()
            : Media::query()
                ->whereKey($mediaIds->all())
                ->where('visibility', MediaVisibility::Public->value)
                ->get()
                ->keyBy('id');

        $tree = [];

        foreach ($settings as $setting) {
            $value = $setting->value;

            if ($setting->type === SettingType::Media) {
                $item = $value === null ? null : $media->get((int) $value);
                $value = $item === null ? null : MediaResource::make($item)->resolve();
            }

            Arr::set($tree, $setting->key, $value);
        }

        return $tree;
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return SiteSetting::query()->where('key', $key)->value('value') ?? $default;
    }
}
