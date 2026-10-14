<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Choisit la langue de la réponse d'après l'en-tête Accept-Language,
 * parmi les langues publiées (config/epht.php).
 */
class SetLocale
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var list<string> $supported */
        $supported = config('epht.locales');

        $locale = $request->getPreferredLanguage($supported) ?? config('app.locale');

        app()->setLocale($locale);

        $response = $next($request);

        $response->headers->set('Content-Language', $locale);
        $response->setVary('Accept-Language', false);

        return $response;
    }
}
