<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Langues
    |--------------------------------------------------------------------------
    |
    | Le site est publié en français. La liste sert au middleware qui choisit
    | la langue d'une requête : ajouter un code ici (et les traductions
    | correspondantes) suffit pour qu'il soit accepté.
    |
    */

    'locales' => ['fr'],

    /*
    |--------------------------------------------------------------------------
    | Frontend Next.js
    |--------------------------------------------------------------------------
    */

    'frontend' => [
        'url' => rtrim((string) env('FRONTEND_URL', 'http://localhost:3000'), '/'),

        // Secret partagé pour demander au frontend d'invalider son cache.
        // Vide : aucun appel n'est émis.
        'revalidate_secret' => env('FRONTEND_REVALIDATE_SECRET'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Médiathèque
    |--------------------------------------------------------------------------
    */

    'media' => [
        // Disque des médias publics : "public" en local, "s3" en production.
        'disk' => env('MEDIA_DISK', 'public'),

        // Plus grand côté conservé à l'import, en pixels.
        'max_dimension' => 2400,

        'jpeg_quality' => 82,
    ],

    /*
    |--------------------------------------------------------------------------
    | Contenu d'illustration
    |--------------------------------------------------------------------------
    |
    | Photographies libres de droits et textes provisoires utilisés pendant le
    | développement. À laisser désactivé en production : seules les données de
    | référence sont alors créées par les seeders.
    |
    */

    'seed_illustrative_content' => (bool) env('SEED_ILLUSTRATIVE_CONTENT', false),

    /*
    |--------------------------------------------------------------------------
    | Notifications internes
    |--------------------------------------------------------------------------
    */

    'admin_notification_email' => env('ADMIN_NOTIFICATION_EMAIL'),

];
