<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use App\Models\Concerns\InvalidatesFrontendCache;
use Database\Factories\FormationCategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'description', 'sort_order'])]
class FormationCategory extends Model
{
    /** @use HasFactory<FormationCategoryFactory> */
    use HasFactory, HasSlug, InvalidatesFrontendCache;

    protected string $slugSource = 'name';

    /**
     * @return HasMany<Formation, $this>
     */
    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class);
    }

    /**
     * @return list<string>
     */
    public function frontendCacheTags(): array
    {
        return ['formations'];
    }
}
