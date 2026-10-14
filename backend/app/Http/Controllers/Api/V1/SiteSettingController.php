<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SiteSettings;
use Illuminate\Http\JsonResponse;

class SiteSettingController extends Controller
{
    /**
     * Paramètres publics du site : identité, coordonnées, réseaux sociaux,
     * SEO et textes éditoriaux.
     */
    public function index(SiteSettings $settings): JsonResponse
    {
        return response()->json(['data' => $settings->publicTree()]);
    }
}
