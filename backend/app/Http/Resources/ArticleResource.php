<?php

namespace App\Http\Resources;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Représentation d'un article dans les listes.
 *
 * @mixin Article
 */
class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'category' => new ArticleCategoryResource($this->whenLoaded('category')),
            'cover' => new MediaResource($this->whenLoaded('cover')),
            'published_at' => $this->published_at?->toIso8601String(),
        ];
    }
}
