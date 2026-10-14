<?php

namespace Database\Factories;

use App\Enums\PublicationStatus;
use App\Models\Formation;
use App\Models\FormationCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Formation>
 */
class FormationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'formation_category_id' => FormationCategory::factory(),
            'title' => ucfirst(fake()->unique()->words(3, true)),
            'summary' => fake()->sentence(14),
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

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PublicationStatus::Archived,
        ]);
    }

    /**
     * Publiée, mais avec une date de mise en ligne future.
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PublicationStatus::Published,
            'published_at' => now()->addWeek(),
        ]);
    }
}
