<?php

namespace App\Models;

use App\Enums\GallerySection;
use App\Enums\PublicationStatus;
use App\Models\Concerns\HasPublicationStatus;
use App\Models\Concerns\HasSlug;
use App\Models\Concerns\InvalidatesFrontendCache;
use Database\Factories\GalleryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'title', 'slug', 'description', 'section', 'category', 'cover_media_id',
    'status', 'published_at', 'sort_order',
])]
class Gallery extends Model
{
    /** @use HasFactory<GalleryFactory> */
    use HasFactory, HasPublicationStatus, HasSlug, InvalidatesFrontendCache, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'section' => GallerySection::class,
            'status' => PublicationStatus::class,
            'published_at' => 'datetime',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Media, $this>
     */
    public function cover(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'cover_media_id');
    }

    /**
     * Médias de la galerie, dans l'ordre défini par l'administration.
     *
     * @return BelongsToMany<Media, $this>
     */
    public function media(): BelongsToMany
    {
        return $this->belongsToMany(Media::class, 'gallery_media')
            ->withPivot(['caption', 'sort_order'])
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    /**
     * @return list<string>
     */
    public function frontendCacheTags(): array
    {
        return ['galleries'];
    }
}
