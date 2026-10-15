<?php

namespace Database\Seeders;

use App\Enums\PublicationStatus;
use App\Models\Formation;
use App\Models\FormationCategory;
use App\Support\Typography;
use Illuminate\Database\Seeder;

class FormationSeeder extends Seeder
{
    private const LEVEL_DQ = 'Qualification professionnelle';

    private const LEVEL_DT = 'Technicien';

    private const LEVEL_DTS = 'Technicien spécialisé';

    private const DIPLOMAS = [
        self::LEVEL_DQ => 'Diplôme de qualification professionnelle (DQ)',
        self::LEVEL_DT => 'Diplôme de technicien (DT)',
        self::LEVEL_DTS => 'Diplôme de technicien spécialisé (DTS)',
    ];

    /**
     * Programmes de la filière « Hôtellerie, cuisine et restauration »,
     * d'après l'annexe 1 de la convention THINK GROUPE – EPHT : intitulé,
     * niveau de diplôme, nombre de groupes et capacité d'accueil par groupe.
     *
     * Durée, programme et conditions d'accès restent vides : l'annexe ne les
     * renseigne pas encore.
     *
     * Les valeurs déjà modifiées dans l'administration ne sont jamais
     * remplacées : un champ n'est complété que s'il est vide, et une formation
     * créée avant l'annexe n'est renommée que si son intitulé d'origine est intact.
     */
    public function run(): void
    {
        $categories = [
            'restauration' => 'Restauration',
            'cuisine' => 'Cuisine',
            'patisserie' => 'Pâtisserie',
            'hotellerie' => 'Hôtellerie',
        ];

        $categoryIds = [];
        $order = 0;

        foreach ($categories as $slug => $name) {
            $categoryIds[$slug] = FormationCategory::query()
                ->firstOrCreate(['slug' => $slug], ['name' => $name, 'sort_order' => ++$order])
                ->getKey();
        }

        foreach ($this->formations() as $index => $formation) {
            // Une formation créée avant l'annexe est reprise, même renommée : jamais de doublon.
            $record = $this->upgradeLegacy($formation) ?? Formation::withTrashed()->firstOrCreate(
                ['slug' => $formation['slug']],
                [
                    'title' => $formation['title'],
                    'formation_category_id' => $categoryIds[$formation['category']],
                    'summary' => Typography::french($formation['summary']),
                    'status' => PublicationStatus::Published,
                    'sort_order' => $index + 1,
                ],
            );

            // Faits confirmés par l'annexe : complétés seulement s'ils sont encore vides.
            $facts = [
                'level' => $formation['level'],
                'diploma' => self::DIPLOMAS[$formation['level']],
                'group_count' => 1,
                'group_capacity' => 20,
            ];

            $record->fill(array_filter($facts, fn (string $field) => $record->{$field} === null, ARRAY_FILTER_USE_KEY));

            if ($record->isDirty()) {
                $record->save();
            }
        }
    }

    /**
     * Les formations créées avant l'annexe portaient un intitulé court
     * (« Cuisine ») et un autre ordre d'affichage : elles prennent l'intitulé
     * officiel, sauf si l'administration les a modifiés depuis.
     *
     * @param  array<string, mixed>  $formation
     */
    private function upgradeLegacy(array $formation): ?Formation
    {
        $legacy = $formation['legacy'] ?? null;

        if ($legacy === null) {
            return null;
        }

        $record = Formation::withTrashed()->where('slug', $legacy['slug'])->first();

        if ($record === null) {
            return null;
        }

        if ($record->title === $legacy['title'] && ! Formation::withTrashed()->where('slug', $formation['slug'])->exists()) {
            $record->title = $formation['title'];
            $record->slug = $formation['slug'];
        }

        if ($record->sort_order === $legacy['sort_order']) {
            $record->sort_order = $formation['sort_order'];
        }

        if ($record->isDirty()) {
            $record->save();
        }

        return $record;
    }

    /**
     * Dans l'ordre de l'annexe : du diplôme de qualification au diplôme de technicien spécialisé.
     *
     * @return list<array<string, mixed>>
     */
    private function formations(): array
    {
        $formations = [
            [
                'slug' => 'agent-de-restauration',
                'title' => 'Agent de restauration',
                'category' => 'restauration',
                'level' => self::LEVEL_DQ,
                'summary' => "Une formation pour acquérir les bases du métier : mise en place, service et règles d'hygiène en restauration.",
                'legacy' => ['slug' => 'agent-de-restauration', 'title' => 'Agent de restauration', 'sort_order' => 2],
            ],
            [
                'slug' => 'technicien-en-restauration',
                'title' => 'Technicien en restauration',
                'category' => 'restauration',
                'level' => self::LEVEL_DT,
                'summary' => "Une formation aux métiers du service et de l'organisation en restauration : accueil, service en salle et travail en équipe.",
                'legacy' => ['slug' => 'technicien-en-restauration', 'title' => 'Technicien en restauration', 'sort_order' => 1],
            ],
            [
                'slug' => 'technicien-en-cuisine',
                'title' => 'Technicien en cuisine',
                'category' => 'cuisine',
                'level' => self::LEVEL_DT,
                'summary' => 'Une formation aux techniques culinaires : préparations, cuissons, dressage et organisation du travail en cuisine.',
                'legacy' => ['slug' => 'cuisine', 'title' => 'Cuisine', 'sort_order' => 3],
            ],
            [
                'slug' => 'technicien-en-patisserie',
                'title' => 'Technicien en pâtisserie',
                'category' => 'patisserie',
                'level' => self::LEVEL_DT,
                'summary' => 'Une formation aux fondamentaux de la pâtisserie : pâtes, crèmes, cuissons et finitions.',
                'legacy' => ['slug' => 'patisserie', 'title' => 'Pâtisserie', 'sort_order' => 4],
            ],
            [
                'slug' => 'technicien-en-reception',
                'title' => 'Technicien en réception',
                'category' => 'hotellerie',
                'level' => self::LEVEL_DT,
                'summary' => "Une formation aux métiers de l'accueil hôtelier : réception des clients, réservations, arrivées et départs.",
            ],
            [
                'slug' => 'technicien-specialise-en-gestion-hoteliere',
                'title' => 'Technicien spécialisé en gestion hôtelière',
                'category' => 'hotellerie',
                'level' => self::LEVEL_DTS,
                'summary' => "Une formation à l'organisation et à la gestion d'un établissement hôtelier : services, équipes et qualité de l'accueil.",
            ],
            [
                'slug' => 'technicien-specialise-en-direction-de-restauration',
                'title' => 'Technicien spécialisé en direction de restauration',
                'category' => 'restauration',
                'level' => self::LEVEL_DTS,
                'summary' => 'Une formation pour encadrer un restaurant : organisation du service, conduite des équipes et relation client.',
            ],
        ];

        return array_map(
            fn (array $formation, int $index) => $formation + ['sort_order' => $index + 1],
            $formations,
            array_keys($formations),
        );
    }
}
