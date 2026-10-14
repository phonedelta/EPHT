<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TestimonialController extends Controller
{
    /**
     * Témoignages validés par l'administration. La liste est vide tant
     * qu'aucun témoignage réel n'a été publié.
     */
    public function index(): AnonymousResourceCollection
    {
        $testimonials = Testimonial::query()
            ->published()
            ->with(['formation', 'photo'])
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->get();

        return TestimonialResource::collection($testimonials);
    }
}
