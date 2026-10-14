<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PartnerResource;
use App\Models\Partner;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PartnerController extends Controller
{
    /**
     * Partenaires confirmés et publiés par l'administration.
     */
    public function index(): AnonymousResourceCollection
    {
        $partners = Partner::query()
            ->published()
            ->with('logo')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return PartnerResource::collection($partners);
    }
}
