<?php

namespace App\Services\Frontend;

use App\Jobs\RevalidateFrontendCache;
use Closure;

/**
 * Demande au frontend Next.js d'invalider son cache lorsqu'un contenu change,
 * afin qu'une modification soit visible sans redéploiement.
 *
 * Les étiquettes correspondent à celles posées par le frontend sur ses
 * lectures de l'API (frontend/src/lib/api/tags.ts).
 */
class FrontendCache
{
    // Étiquette portée par toutes les lectures : invalide l'ensemble du site.
    public const ALL = 'content';

    private static bool $muted = false;

    /**
     * @param  list<string>  $tags
     */
    public function revalidate(array $tags): void
    {
        if (self::$muted || $tags === [] || ! $this->isConfigured()) {
            return;
        }

        RevalidateFrontendCache::dispatch(array_values(array_unique($tags)))->afterCommit();
    }

    public function isConfigured(): bool
    {
        return filled(config('epht.frontend.revalidate_secret'));
    }

    /**
     * Exécute un traitement de masse (import, seeder) sans émettre une
     * demande par enregistrement.
     *
     * @template TReturn
     *
     * @param  Closure(): TReturn  $callback
     * @return TReturn
     */
    public static function withoutRevalidation(Closure $callback): mixed
    {
        $previous = self::$muted;
        self::$muted = true;

        try {
            return $callback();
        } finally {
            self::$muted = $previous;
        }
    }
}
