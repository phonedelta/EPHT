<?php

namespace Database\Factories;

use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\ArticleCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'article_category_id' => ArticleCategory::factory(),
            'title' => ucfirst(fake()->unique()->words(5, true)),
            'excerpt' => fake()->sentence(16),
            'content' => '<p>'.fake()->paragraph().'</p>',
            'status' => PublicationStatus::Published,
            'published_at' => now()->subDay(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PublicationStatus::Draft,
            'published_at' => null,
        ]);
    }

    /**
     * Publié, mais avec une date de mise en ligne future.
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PublicationStatus::Published,
            'published_at' => now()->addWeek(),
        ]);
    }
}
