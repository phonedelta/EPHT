<?php

namespace Database\Factories;

use App\Enums\MediaType;
use App\Enums\MediaVisibility;
use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => MediaType::Image,
            'visibility' => MediaVisibility::Public,
            'disk' => 'public',
            'path' => 'tests/'.Str::uuid().'.jpg',
            'original_name' => 'photo.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 120_000,
            'width' => 1600,
            'height' => 1067,
            'alt' => fake()->sentence(6),
            'is_illustrative' => false,
        ];
    }

    public function illustrative(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_illustrative' => true,
            'credit' => fake()->name(),
        ]);
    }

    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'visibility' => MediaVisibility::Private,
            'disk' => 'local',
        ]);
    }
}
