<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use App\Models\Concerns\InvalidatesFrontendCache;
use Database\Factories\PartnerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['name', 'slug', 'description', 'website_url', 'logo_media_id', 'is_published', 'sort_order'])]
class Partner extends Model
{
    /** @use HasFactory<PartnerFactory> */
    use HasFactory, HasSlug, InvalidatesFrontendCache;

    protected string $slugSource = 'name';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * @return BelongsTo<Media, $this>
     */
    public function logo(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'logo_media_id');
    }

    /**
     * @return list<string>
     */
    public function frontendCacheTags(): array
    {
        return ['partners'];
    }
}
