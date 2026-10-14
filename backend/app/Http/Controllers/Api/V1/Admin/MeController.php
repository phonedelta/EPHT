<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminUserResource;
use Illuminate\Http\Request;

class MeController extends Controller
{
    /**
     * Utilisateur de la session d'administration en cours.
     */
    public function __invoke(Request $request): AdminUserResource
    {
        return new AdminUserResource($request->user());
    }
}
