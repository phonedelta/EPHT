<?php

namespace Database\Seeders;

use App\Enums\GallerySection;
use App\Enums\PublicationStatus;
use App\Models\Gallery;
use App\Support\Typography;
use Illuminate\Database\Seeder;

class InfrastructureSeeder extends Seeder
{
    /**
     * Espaces de l'école présentés sur le site. Les photographies sont
     * ajoutées depuis l'administration ; les descriptions sont provisoires.
     */
    public function run(): void
    {
        $spaces = [
            'cuisine-pedagogique' => ['Cuisine pédagogique', "L'espace où s'apprennent les techniques culinaires, poste par poste."],
            'restaurant-d-application' => ["Restaurant d'application", "Un cadre pour s'exercer au service en salle."],
            'salle-de-reception' => ['Salle de réception', "Un espace consacré à l'accueil et à l'organisation de réceptions."],
            'salles-de-cours' => ['Salles de cours', 'Des salles réservées aux enseignements théoriques.'],
            'salle-informatique' => ['Salle informatique', 'Un espace équipé pour les travaux sur ordinateur.'],
        ];

        $order = 0;

        foreach ($spaces as $slug => [$title, $description]) {
            Gallery::withTrashed()->firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => Typography::french($title),
                    'description' => Typography::french($description),
                    'section' => GallerySection::Infrastructure,
                    'status' => PublicationStatus::Published,
                    'sort_order' => ++$order,
                ],
            );
        }
    }
}
