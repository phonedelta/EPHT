<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ListJobOffersRequest;
use App\Http\Resources\JobOfferResource;
use App\Models\JobOffer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobOfferController extends Controller
{
    /**
     * Offres de stage et d'emploi publiées et non expirées.
     */
    public function index(ListJobOffersRequest $request): AnonymousResourceCollection
    {
        $offers = JobOffer::query()
            ->active()
            ->when($request->validated('type'), fn (Builder $query, string $type) => $query->where('type', $type))
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get();

        return JobOfferResource::collection($offers);
    }
}
