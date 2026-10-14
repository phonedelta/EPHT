<?php

use App\Http\Controllers\Api\V1\Admin\MeController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\FormationController;
use App\Http\Controllers\Api\V1\GalleryController;
use App\Http\Controllers\Api\V1\JobOfferController;
use App\Http\Controllers\Api\V1\PartnerController;
use App\Http\Controllers\Api\V1\SiteSettingController;
use App\Http\Controllers\Api\V1\TestimonialController;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

/*
|--------------------------------------------------------------------------
| API EPHT — v1
|--------------------------------------------------------------------------
|
| Toutes les routes sont préfixées par /api/v1. Deux espaces distincts :
|
|   - l'API publique, en lecture seule et sans session, consommée par le site ;
|   - l'API d'administration, réservée à une session Sanctum authentifiée.
|
*/

Route::prefix('v1')->name('api.v1.')->group(function (): void {

    // --- API publique ------------------------------------------------------
    // Sans cookie ni session : les réponses peuvent être mises en cache.
    Route::middleware('cache.headers:public;max_age=60;etag')->group(function (): void {
        Route::get('site-settings', [SiteSettingController::class, 'index'])->name('site-settings.index');

        Route::get('formations', [FormationController::class, 'index'])->name('formations.index');
        Route::get('formations/{slug}', [FormationController::class, 'show'])->name('formations.show');

        Route::get('articles', [ArticleController::class, 'index'])->name('articles.index');
        Route::get('articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');

        Route::get('events', [EventController::class, 'index'])->name('events.index');

        Route::get('galleries', [GalleryController::class, 'index'])->name('galleries.index');
        Route::get('galleries/{slug}', [GalleryController::class, 'show'])->name('galleries.show');

        Route::get('testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');
        Route::get('job-offers', [JobOfferController::class, 'index'])->name('job-offers.index');
        Route::get('partners', [PartnerController::class, 'index'])->name('partners.index');
    });

    // --- API d'administration ----------------------------------------------
    // Authentification par session (cookie HTTP-only) et protection CSRF,
    // acceptées uniquement depuis les domaines du frontend déclarés.
    Route::prefix('admin')
        ->name('admin.')
        ->middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum'])
        ->group(function (): void {
            Route::get('me', MeController::class)->name('me');
        });
});
