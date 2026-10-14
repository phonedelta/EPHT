<?php

namespace Database\Seeders;

use App\Enums\GallerySection;
use App\Enums\PublicationStatus;
use App\Enums\StudentLifeCategory;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\Formation;
use App\Models\Gallery;
use App\Models\Media;
use App\Models\SiteSetting;
use App\Services\Media\ImageImporter;
use App\Support\Typography;
use Illuminate\Database\Seeder;

/**
 * Contenu d'illustration pour le développement : photographies du domaine
 * public et articles provisoires. Rien de ce qui est créé ici ne décrit des
 * faits propres à l'établissement, et tout doit être remplacé avant la mise
 * en ligne. Les éléments déjà renseignés par l'administration sont préservés.
 */
class IllustrativeContentSeeder extends Seeder
{
    /** @var array<string, Media> */
    private array $media = [];

    public function run(ImageImporter $importer): void
    {
        $this->importIllustrations($importer);
        $this->assignSettingImages();
        $this->assignFormationCovers();
        $this->fillInfrastructureGalleries();
        $this->createStudentLifeGalleries();
        $this->createArticles();
    }

    private function importIllustrations(ImageImporter $importer): void
    {
        $directory = __DIR__.'/assets/illustrations';

        /** @var array<string, array{alt: string, credit: string, credit_url: string, focal?: array{0: int, 1: int}}> $manifest */
        $manifest = require $directory.'/manifest.php';

        foreach ($manifest as $name => $details) {
            $this->media[$name] = $importer->import("{$directory}/{$name}.jpg", "illustrations/{$name}.jpg", [
                'alt' => Typography::french($details['alt']),
                'credit' => $details['credit'],
                'credit_url' => $details['credit_url'],
                'license' => 'CC0 1.0',
                'is_illustrative' => true,
                'folder' => 'illustrations',
                'focal_x' => $details['focal'][0] ?? 50,
                'focal_y' => $details['focal'][1] ?? 50,
            ]);
        }
    }

    private function assignSettingImages(): void
    {
        $images = [
            'home.hero.image' => 'dressage-au-passe',
            'home.hero.secondary_image' => 'croissants-sur-plaque',
            'home.about.image' => 'service-plateau-ardoise',
            'home.practice.image' => 'cuisine-professionnelle',
            'home.practice.image_secondary' => 'farine-tamisee',
            'home.practice.image_tertiary' => 'cuisson-au-wok',
        ];

        foreach ($images as $key => $name) {
            SiteSetting::query()
                ->where('key', $key)
                ->whereNull('value')
                ->get()
                ->each(fn (SiteSetting $setting) => $setting->update(['value' => $this->media[$name]->getKey()]));
        }
    }

    private function assignFormationCovers(): void
    {
        $covers = [
            'technicien-en-restauration' => 'table-dressee-fleurs',
            'agent-de-restauration' => 'service-plateau-flutes',
            'cuisine' => 'decoupe-legumes',
            'patisserie' => 'dessert-a-l-assiette',
        ];

        foreach ($covers as $slug => $name) {
            Formation::query()
                ->where('slug', $slug)
                ->whereNull('cover_media_id')
                ->get()
                ->each(fn (Formation $formation) => $formation->update(['cover_media_id' => $this->media[$name]->getKey()]));
        }
    }

    private function fillInfrastructureGalleries(): void
    {
        $photos = [
            'cuisine-pedagogique' => ['cuisine-ouverte'],
            'restaurant-d-application' => ['table-de-restaurant'],
            'salle-de-reception' => ['salle-de-reception'],
            'salles-de-cours' => ['salle-de-cours'],
            'salle-informatique' => ['salle-informatique'],
        ];

        foreach ($photos as $slug => $names) {
            $gallery = Gallery::query()->where('slug', $slug)->first();

            if ($gallery !== null) {
                $this->attachPhotos($gallery, $names);
            }
        }
    }

    private function createStudentLifeGalleries(): void
    {
        $galleries = [
            'travaux-pratiques-en-cuisine' => [
                'title' => 'Travaux pratiques en cuisine',
                'description' => 'Découpes, cuissons, dressage : les gestes du métier se travaillent en atelier.',
                'category' => StudentLifeCategory::PracticalWork,
                'photos' => ['cuisson-au-wok', 'taille-des-oignons', 'saute-de-legumes'],
            ],
            'realisations-en-atelier' => [
                'title' => 'Réalisations en atelier',
                'description' => 'Entremets, viennoiseries, pièces salées : un aperçu des préparations travaillées en formation.',
                'category' => StudentLifeCategory::StudentWork,
                'photos' => ['entremets-fruits-rouges', 'feuillete-asperges', 'brioche-sucre-glace'],
            ],
        ];

        $order = 0;

        foreach ($galleries as $slug => $details) {
            $gallery = Gallery::withTrashed()->firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => $details['title'],
                    'description' => Typography::french($details['description']),
                    'section' => GallerySection::StudentLife,
                    'category' => $details['category']->value,
                    'status' => PublicationStatus::Published,
                    'sort_order' => ++$order,
                ],
            );

            $this->attachPhotos($gallery, $details['photos']);
        }
    }

    /**
     * @param  list<string>  $names
     */
    private function attachPhotos(Gallery $gallery, array $names): void
    {
        // Une galerie déjà alimentée depuis l'administration n'est pas modifiée.
        if ($gallery->media()->exists()) {
            return;
        }

        foreach ($names as $index => $name) {
            $gallery->media()->attach($this->media[$name]->getKey(), ['sort_order' => $index + 1]);
        }

        if ($gallery->cover_media_id === null) {
            $gallery->update(['cover_media_id' => $this->media[$names[0]]->getKey()]);
        }
    }

    private function createArticles(): void
    {
        if (Article::withTrashed()->exists()) {
            return;
        }

        $categories = [];

        foreach (['vie-de-l-ecole' => "Vie de l'école", 'admissions' => 'Admissions', 'metiers' => 'Métiers'] as $slug => $name) {
            $categories[$slug] = ArticleCategory::query()
                ->firstOrCreate(['slug' => $slug], ['name' => Typography::french($name), 'sort_order' => count($categories) + 1])
                ->getKey();
        }

        $articles = [
            [
                'slug' => 'le-nouveau-site-de-l-epht-est-en-ligne',
                'title' => "Le nouveau site de l'EPHT est en ligne",
                'category' => 'vie-de-l-ecole',
                'cover' => 'table-dressee-bois',
                'days_ago' => 0,
                'excerpt' => "Formations, admissions, vie de l'école : le site de l'EPHT a été entièrement repensé pour vous informer plus simplement.",
                'paragraphs' => [
                    "Le site de l'EPHT change de visage. Sa nouvelle version rassemble, au même endroit, la présentation de l'école, le catalogue des formations et les informations utiles aux futurs étudiants.",
                    "Chaque formation dispose désormais de sa propre page. Les actualités et les galeries permettent de suivre la vie de l'établissement au fil de l'année.",
                    'Le site a été conçu pour être consulté aussi facilement sur téléphone que sur ordinateur.',
                ],
            ],
            [
                'slug' => 'comment-se-deroule-une-demande-d-inscription',
                'title' => "Comment se déroule une demande d'inscription",
                'category' => 'admissions',
                'cover' => 'mise-en-place-de-table',
                'days_ago' => 6,
                'excerpt' => "Choisir une formation, envoyer sa candidature, suivre les étapes d'admission : le point sur la démarche.",
                'paragraphs' => [
                    "La demande d'inscription commence par le choix d'une formation. Les pages du site présentent chacune d'elles pour vous aider à identifier celle qui correspond à votre projet.",
                    "La candidature s'envoie ensuite en ligne. Elle est étudiée par l'école, qui vous contacte pour la suite des étapes d'admission.",
                    "L'inscription n'est définitive qu'après validation de la candidature par l'établissement.",
                ],
            ],
            [
                'slug' => 'service-cuisine-patisserie-trois-familles-de-metiers',
                'title' => 'Service, cuisine, pâtisserie : trois familles de métiers',
                'category' => 'metiers',
                'cover' => 'viennoiseries-ardoise',
                'days_ago' => 13,
                'excerpt' => "Accueillir et servir, cuisiner, créer des desserts : tour d'horizon des métiers de la restauration.",
                'paragraphs' => [
                    "La restauration réunit des métiers très différents. En salle, le service repose sur l'accueil, l'attention portée au client et le travail en équipe.",
                    "En cuisine, le quotidien est fait de préparations, de cuissons et d'organisation, avec des règles d'hygiène à respecter à chaque étape.",
                    "La pâtisserie demande de la précision : pesées, températures et temps de cuisson laissent peu de place à l'approximation.",
                ],
            ],
        ];

        foreach ($articles as $article) {
            $content = collect($article['paragraphs'])
                ->map(fn (string $paragraph) => '<p>'.e(Typography::french($paragraph), false).'</p>')
                ->implode("\n");

            Article::query()->create([
                'slug' => $article['slug'],
                'title' => Typography::french($article['title']),
                'article_category_id' => $categories[$article['category']],
                'excerpt' => Typography::french($article['excerpt']),
                'content' => $content,
                'cover_media_id' => $this->media[$article['cover']]->getKey(),
                'status' => PublicationStatus::Published,
                'published_at' => now()->subDays($article['days_ago'])->startOfHour(),
            ]);
        }
    }
}
