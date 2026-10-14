<?php

namespace App\Models;

use App\Models\Concerns\InvalidatesFrontendCache;
use Database\Factories\TestimonialFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'author_name', 'author_role', 'formation_id', 'quote', 'photo_media_id',
    'is_published', 'published_at', 'sort_order',
])]
class Testimonial extends Model
{
    /** @use HasFactory<TestimonialFactory> */
    use HasFactory, InvalidatesFrontendCache, SoftDeletes;

    protected static function booted(): void
    {
        static::saving(function (self $testimonial): void {
            if ($testimonial->is_published && $testimonial->published_at === null) {
                $testimonial->published_at = now();
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Témoignages validés par l'administration.
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * @return BelongsTo<Formation, $this>
     */
    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    /**
     * @return BelongsTo<Media, $this>
     */
    public function photo(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'photo_media_id');
    }

    /**
     * @return list<string>
     */
    public function frontendCacheTags(): array
    {
        return ['testimonials'];
    }
}
