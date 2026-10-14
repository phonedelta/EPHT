<?php

namespace App\Support;

final class SearchTerm
{
    /**
     * Prépare une saisie utilisateur pour une recherche « contient » :
     * les caractères joker de LIKE sont neutralisés.
     */
    public static function contains(string $term): string
    {
        return '%'.addcslashes(trim($term), '%_\\').'%';
    }
}
