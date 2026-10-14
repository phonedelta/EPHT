<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\MediaVisibility;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ListGalleriesRequest;
use App\Http\Resources\GalleryResource;
use App\Models\Gallery;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GalleryController extends Controller
{
    /**
     * Galeries publiées (infrastructures, vie étudiante…) avec leurs médias.
     */
    public function index(ListGalleriesRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        $galleries = $this->baseQuery()
            ->when($filters['section'] ?? null, fn (Builder $query, string $section) => $query->where('section', $section))
            ->when($filters['category'] ?? null, fn (Builder $query, string $category) => $query->where('category', $category))
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();

        return GalleryResource::collection($galleries);
    }

    public function show(string $slug): GalleryResource
    {
        return new GalleryResource(
            $this->baseQuery()->where('slug', $slug)->firstOrFail(),
        );
    }

    /**
     * @return Builder<Gallery>
     */
    private function baseQuery(): Builder
    {
        return Gallery::query()
            ->published()
            ->with([
                'cover',
                'media' => fn (BelongsToMany $query) => $query->where('visibility', MediaVisibility::Public->value),
            ]);
    }
}
