<?php

namespace Database\Seeders;

use App\Services\Frontend\FrontendCache;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Les données de référence sont toujours créées. Le contenu d'illustration
     * (photographies libres de droits, articles provisoires) ne l'est que si
     * SEED_ILLUSTRATIVE_CONTENT est activé — jamais en production.
     *
     * Aucun compte administrateur n'est créé ici : voir la commande
     * « php artisan epht:create-admin ».
     */
    public function run(): void
    {
        FrontendCache::withoutRevalidation(function (): void {
            $this->call([
                SiteSettingsSeeder::class,
                FormationSeeder::class,
                InfrastructureSeeder::class,
            ]);

            if (config('epht.seed_illustrative_content')) {
                $this->call(IllustrativeContentSeeder::class);
            }
        });

        app(FrontendCache::class)->revalidate([FrontendCache::ALL]);
    }
}
