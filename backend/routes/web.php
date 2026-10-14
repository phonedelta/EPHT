<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes web
|--------------------------------------------------------------------------
|
| Ce backend ne sert aucune page : l'interface est l'application Next.js.
| Les routes de session de l'administration (connexion, déconnexion,
| réinitialisation du mot de passe) seront déclarées ici, sous le groupe
| « web », pour bénéficier des cookies et de la protection CSRF.
|
*/

Route::get('/', fn () => response()->json([
    'name' => config('app.name').' API',
    'version' => 'v1',
    'status' => 'ok',
]));
