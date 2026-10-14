<?php

namespace App\Models;

use App\Enums\PublicationStatus;
use App\Models\Concerns\HasPublicationStatus;
use App\Models\Concerns\HasSlug;
use App\Models\Concerns\InvalidatesFrontendCache;
use Database\Factories\EventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'title', 'slug', 'summary', 'description', 'location', 'starts_at', 'ends_at',
    'cover_media_id', 'gallery_id', 'status', 'published_at',
])]
class Event extends Model
{
    /** @use HasFactory<EventFactory> */
    use HasFactory, HasPublicationStatus, HasSlug, InvalidatesFrontendCache, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => PublicationStatus::class,
            'published_at' => 'datetime',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
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
     * @return BelongsTo<Gallery, $this>
     */
    public function gallery(): BelongsTo
    {
        return $this->belongsTo(Gallery::class);
    }

    /**
     * @return list<string>
     */
    public function frontendCacheTags(): array
    {
        return ['events'];
    }
}
