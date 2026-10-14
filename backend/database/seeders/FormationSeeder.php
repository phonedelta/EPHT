<?php

namespace Database\Seeders;

use App\Enums\PublicationStatus;
use App\Models\Formation;
use App\Models\FormationCategory;
use App\Support\Typography;
use Illuminate\Database\Seeder;

class FormationSeeder extends Seeder
{
    /**
     * Formations historiquement proposées par l'école.
     *
     * Seuls l'intitulé et une présentation courte sont renseignés : niveau,
     * diplôme, durée, programme et conditions d'accès restent vides tant que
     * l'école ne les a pas confirmés.
     */
    public function run(): void
    {
        $categories = [
            'restauration' => 'Restauration',
            'cuisine' => 'Cuisine',
            'patisserie' => 'Pâtisserie',
        ];

        $categoryIds = [];
        $order = 0;

        foreach ($categories as $slug => $name) {
            $categoryIds[$slug] = FormationCategory::query()
                ->firstOrCreate(['slug' => $slug], ['name' => $name, 'sort_order' => ++$order])
                ->getKey();
        }

        $formations = [
            [
                'slug' => 'technicien-en-restauration',
                'title' => 'Technicien en restauration',
                'category' => 'restauration',
                'summary' => "Une formation aux métiers du service et de l'organisation en restauration : accueil, service en salle et travail en équipe.",
            ],
            [
                'slug' => 'agent-de-restauration',
                'title' => 'Agent de restauration',
                'category' => 'restauration',
                'summary' => "Une formation pour acquérir les bases du métier : mise en place, service et règles d'hygiène en restauration.",
            ],
            [
                'slug' => 'cuisine',
                'title' => 'Cuisine',
                'category' => 'cuisine',
                'summary' => 'Une formation aux techniques culinaires : préparations, cuissons, dressage et organisation du travail en cuisine.',
            ],
            [
                'slug' => 'patisserie',
                'title' => 'Pâtisserie',
                'category' => 'patisserie',
                'summary' => 'Une formation aux fondamentaux de la pâtisserie : pâtes, crèmes, cuissons et finitions.',
            ],
        ];

        foreach ($formations as $index => $formation) {
            Formation::withTrashed()->firstOrCreate(
                ['slug' => $formation['slug']],
                [
                    'title' => $formation['title'],
                    'formation_category_id' => $categoryIds[$formation['category']],
                    'summary' => Typography::french($formation['summary']),
                    'status' => PublicationStatus::Published,
                    'sort_order' => $index + 1,
                ],
            );
        }
    }
}
