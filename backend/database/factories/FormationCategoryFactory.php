<?php

namespace Database\Factories;

use App\Models\FormationCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FormationCategory>
 */
class FormationCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => ucfirst(fake()->unique()->words(2, true)),
            'sort_order' => 0,
        ];
    }
}
