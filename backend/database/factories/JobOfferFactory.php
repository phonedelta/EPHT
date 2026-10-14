<?php

namespace Database\Factories;

use App\Enums\JobOfferType;
use App\Enums\PublicationStatus;
use App\Models\JobOffer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobOffer>
 */
class JobOfferFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => JobOfferType::Internship,
            'title' => ucfirst(fake()->unique()->words(3, true)),
            'company' => fake()->company(),
            'city' => 'Rabat',
            'description' => fake()->paragraph(),
            'apply_url' => 'https://example.com/candidature',
            'status' => PublicationStatus::Published,
            'published_at' => now()->subDay(),
            'expires_at' => now()->addMonth(),
        ];
    }

    public function job(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => JobOfferType::Job,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subDay(),
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
