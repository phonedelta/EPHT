<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use App\Models\Concerns\InvalidatesFrontendCache;
use Database\Factories\ArticleCategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'sort_order'])]
class ArticleCategory extends Model
{
    /** @use HasFactory<ArticleCategoryFactory> */
    use HasFactory, HasSlug, InvalidatesFrontendCache;

    protected string $slugSource = 'name';

    /**
     * @return HasMany<Article, $this>
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    /**
     * @return list<string>
     */
    public function frontendCacheTags(): array
    {
        return ['articles'];
    }
}
