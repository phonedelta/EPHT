<?php

namespace App\Models;

use App\Enums\PublicationStatus;
use App\Models\Concerns\HasPublicationStatus;
use App\Models\Concerns\HasSlug;
use App\Models\Concerns\InvalidatesFrontendCache;
use Database\Factories\FormationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'formation_category_id', 'title', 'slug', 'summary', 'description', 'level', 'diploma',
    'duration_label', 'duration_months', 'group_count', 'group_capacity', 'objectives', 'skills', 'program',
    'admission_requirements', 'career_opportunities', 'required_documents', 'faq',
    'cover_media_id', 'gallery_id', 'status', 'published_at', 'sort_order',
    'seo_title', 'seo_description',
])]
class Formation extends Model
{
    /** @use HasFactory<FormationFactory> */
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
            'duration_months' => 'integer',
            'group_count' => 'integer',
            'group_capacity' => 'integer',
            'sort_order' => 'integer',
            'objectives' => 'array',
            'skills' => 'array',
            'program' => 'array',
            'admission_requirements' => 'array',
            'career_opportunities' => 'array',
            'required_documents' => 'array',
            'faq' => 'array',
        ];
    }

    /**
     * @return BelongsTo<FormationCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(FormationCategory::class, 'formation_category_id');
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
     * @return HasMany<Application, $this>
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    /**
     * @return HasMany<Testimonial, $this>
     */
    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

    /**
     * @return list<string>
     */
    public function frontendCacheTags(): array
    {
        return ['formations'];
    }
}
