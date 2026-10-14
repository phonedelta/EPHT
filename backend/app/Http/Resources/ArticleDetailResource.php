<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * Article complet, avec son contenu et ses métadonnées SEO.
 */
class ArticleDetailResource extends ArticleResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'content' => $this->content,
            'seo' => [
                'title' => $this->seo_title,
                'description' => $this->seo_description,
            ],
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
