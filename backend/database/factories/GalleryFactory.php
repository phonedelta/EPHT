<?php

namespace Database\Factories;

use App\Enums\GallerySection;
use App\Enums\PublicationStatus;
use App\Models\Gallery;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Gallery>
 */
class GalleryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => ucfirst(fake()->unique()->words(3, true)),
            'description' => fake()->sentence(10),
            'section' => GallerySection::Infrastructure,
            'status' => PublicationStatus::Published,
            'published_at' => now()->subDay(),
            'sort_order' => 0,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PublicationStatus::Draft,
            'published_at' => null,
        ]);
    }

    public function studentLife(string $category): static
    {
        return $this->state(fn (array $attributes) => [
            'section' => GallerySection::StudentLife,
            'category' => $category,
        ]);
    }
}
