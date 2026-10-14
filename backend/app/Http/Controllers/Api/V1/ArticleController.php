<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ListArticlesRequest;
use App\Http\Resources\ArticleCategoryResource;
use App\Http\Resources\ArticleDetailResource;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Support\SearchTerm;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ArticleController extends Controller
{
    /**
     * Articles publiés, du plus récent au plus ancien.
     */
    public function index(ListArticlesRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        $articles = Article::query()
            ->published()
            ->with(['category', 'cover'])
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $term = SearchTerm::contains($search);

                $query->where(function (Builder $query) use ($term): void {
                    $query->whereLike('title', $term)->orWhereLike('excerpt', $term);
                });
            })
            ->when($filters['category'] ?? null, function (Builder $query, string $slug): void {
                $query->whereHas('category', fn (Builder $query) => $query->where('slug', $slug));
            })
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate((int) ($filters['per_page'] ?? 9))
            ->withQueryString();

        $categories = ArticleCategory::query()
            ->whereHas('articles', fn (Builder $query) => $query->published())
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return ArticleResource::collection($articles)->additional([
            'meta' => [
                'categories' => ArticleCategoryResource::collection($categories)->resolve(),
            ],
        ]);
    }

    /**
     * Article publié, accompagné d'articles de la même catégorie.
     */
    public function show(string $slug): ArticleDetailResource
    {
        $article = Article::query()
            ->published()
            ->with(['category', 'cover'])
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Article::query()
            ->published()
            ->with(['category', 'cover'])
            ->whereKeyNot($article->getKey())
            ->when(
                $article->article_category_id,
                fn (Builder $query, int $categoryId) => $query->where('article_category_id', $categoryId),
            )
            ->orderByDesc('published_at')
            ->limit(3)
            ->get();

        return (new ArticleDetailResource($article))->additional([
            'meta' => [
                'related' => ArticleResource::collection($related)->resolve(),
            ],
        ]);
    }
}
