<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Hors production : chargement paresseux, attributs inconnus ou ignorés
        // lèvent une exception au lieu de passer inaperçus.
        Model::shouldBeStrict(! $this->app->isProduction());

        $this->configureRateLimiting();
    }

    private function configureRateLimiting(): void
    {
        // Lecture de l'API. Le serveur Next.js appelle l'API depuis une seule
        // adresse : la limite reste large pour ne pas bloquer un build.
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(300)
            ->by($request->user()?->getAuthIdentifier() ?: $request->ip()));

        // Formulaires publics (candidature, contact).
        RateLimiter::for('forms', fn (Request $request) => [
            Limit::perMinute(5)->by($request->ip()),
            Limit::perHour(30)->by($request->ip()),
        ]);
    }
}
