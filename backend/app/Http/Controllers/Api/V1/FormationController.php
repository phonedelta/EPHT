<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ListFormationsRequest;
use App\Http\Resources\FormationCategoryResource;
use App\Http\Resources\FormationDetailResource;
use App\Http\Resources\FormationResource;
use App\Models\Formation;
use App\Models\FormationCategory;
use App\Support\SearchTerm;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FormationController extends Controller
{
    /**
     * Catalogue des formations publiées, avec recherche et filtres.
     */
    public function index(ListFormationsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        $formations = Formation::query()
            ->published()
            ->with(['category', 'cover'])
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $term = SearchTerm::contains($search);

                $query->where(function (Builder $query) use ($term): void {
                    $query->whereLike('title', $term)->orWhereLike('summary', $term);
                });
            })
            ->when($filters['category'] ?? null, function (Builder $query, string $slug): void {
                $query->whereHas('category', fn (Builder $query) => $query->where('slug', $slug));
            })
            ->when($filters['level'] ?? null, fn (Builder $query, string $level) => $query->where('level', $level))
            ->when($filters['diploma'] ?? null, fn (Builder $query, string $diploma) => $query->where('diploma', $diploma))
            ->when($filters['duration'] ?? null, fn (Builder $query, int|string $months) => $query->where('duration_months', (int) $months))
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();

        return FormationResource::collection($formations)->additional([
            'meta' => [
                'total' => $formations->count(),
                'filters' => $this->availableFilters(),
            ],
        ]);
    }

    /**
     * Fiche d'une formation publiée.
     */
    public function show(string $slug): FormationDetailResource
    {
        $formation = Formation::query()
            ->published()
            ->with(['category', 'cover', 'gallery.cover', 'gallery.media'])
            ->where('slug', $slug)
            ->firstOrFail();

        return new FormationDetailResource($formation);
    }

    /**
     * Valeurs réellement présentes dans le catalogue publié : le frontend
     * n'affiche que des filtres qui renvoient au moins un résultat.
     *
     * @return array<string, mixed>
     */
    private function availableFilters(): array
    {
        $published = Formation::query()->published();

        $distinct = fn (string $column) => (clone $published)
            ->whereNotNull($column)
            ->distinct()
            ->orderBy($column)
            ->pluck($column)
            ->all();

        $categories = FormationCategory::query()
            ->whereHas('formations', fn (Builder $query) => $query->published())
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $durations = (clone $published)
            ->whereNotNull('duration_months')
            ->orderBy('duration_months')
            ->get(['duration_months', 'duration_label'])
            ->unique('duration_months')
            ->map(fn (Formation $formation) => [
                'months' => $formation->duration_months,
                'label' => $formation->duration_label ?? $formation->duration_months.' mois',
            ])
            ->values()
            ->all();

        return [
            'categories' => FormationCategoryResource::collection($categories)->resolve(),
            'levels' => $distinct('level'),
            'diplomas' => $distinct('diploma'),
            'durations' => $durations,
        ];
    }
}
