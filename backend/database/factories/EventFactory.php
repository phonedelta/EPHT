<?php

namespace Database\Factories;

use App\Enums\PublicationStatus;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => ucfirst(fake()->unique()->words(4, true)),
            'summary' => fake()->sentence(12),
            'location' => 'Salé',
            'starts_at' => now()->addWeek(),
            'status' => PublicationStatus::Published,
            'published_at' => now()->subDay(),
        ];
    }

    public function past(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => now()->subMonth(),
            'ends_at' => now()->subMonth()->addHours(3),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PublicationStatus::Draft,
            'published_at' => null,
        ]);
    }
}
