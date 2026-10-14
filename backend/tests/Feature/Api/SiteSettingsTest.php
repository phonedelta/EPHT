<?php

namespace Tests\Feature\Api;

use App\Enums\SettingType;
use App\Models\Media;
use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_public_settings_as_a_nested_tree(): void
    {
        $this->setting('general.name', 'EPHT');
        $this->setting('contact.email', 'contact@epht.ma', SettingType::Email);
        $this->setting('contact.address_lines', ['Ligne 1', 'Ligne 2'], SettingType::Json);
        $this->setting('home.hero.title', ['Apprenez un métier.', 'Construisez votre avenir.'], SettingType::Json);

        $this->getJson($this->api('site-settings'))
            ->assertOk()
            ->assertExactJson([
                'success' => true,
                'data' => [
                    'general' => ['name' => 'EPHT'],
                    'contact' => [
                        'email' => 'contact@epht.ma',
                        'address_lines' => ['Ligne 1', 'Ligne 2'],
                    ],
                    'home' => [
                        'hero' => ['title' => ['Apprenez un métier.', 'Construisez votre avenir.']],
                    ],
                ],
            ]);
    }

    public function test_it_never_exposes_private_settings(): void
    {
        $this->setting('general.name', 'EPHT');
        $this->setting('internal.note', 'réservé à l’administration', isPublic: false);

        $this->getJson($this->api('site-settings'))
            ->assertOk()
            ->assertJsonPath('data.general.name', 'EPHT')
            ->assertJsonMissingPath('data.internal');
    }

    public function test_media_settings_are_resolved_to_the_media_description(): void
    {
        $media = Media::factory()->illustrative()->create([
            'path' => 'illustrations/hero.jpg',
            'alt' => 'Dressage au passe',
            'width' => 1920,
            'height' => 1127,
            'focal_x' => 58,
            'focal_y' => 55,
        ]);

        $this->setting('home.hero.image', $media->id, SettingType::Media);
        $this->setting('home.about.image', null, SettingType::Media);

        $this->getJson($this->api('site-settings'))
            ->assertOk()
            ->assertJsonPath('data.home.hero.image.id', $media->id)
            ->assertJsonPath('data.home.hero.image.url', $media->url())
            ->assertJsonPath('data.home.hero.image.alt', 'Dressage au passe')
            ->assertJsonPath('data.home.hero.image.width', 1920)
            ->assertJsonPath('data.home.hero.image.is_illustrative', true)
            ->assertJsonPath('data.home.hero.image.focal_point', ['x' => 58, 'y' => 55])
            ->assertJsonPath('data.home.about.image', null);
    }

    public function test_a_private_media_is_not_exposed_through_a_setting(): void
    {
        $media = Media::factory()->private()->create();
        $this->setting('home.hero.image', $media->id, SettingType::Media);

        $this->getJson($this->api('site-settings'))
            ->assertOk()
            ->assertJsonPath('data.home.hero.image', null);
    }

    private function setting(string $key, mixed $value, SettingType $type = SettingType::String, bool $isPublic = true): SiteSetting
    {
        return SiteSetting::query()->create([
            'key' => $key,
            'group' => strtok($key, '.'),
            'type' => $type,
            'value' => $value,
            'is_public' => $isPublic,
        ]);
    }
}
