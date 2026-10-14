<?php

namespace App\Models;

use App\Enums\JobOfferType;
use App\Enums\PublicationStatus;
use App\Models\Concerns\HasPublicationStatus;
use App\Models\Concerns\HasSlug;
use App\Models\Concerns\InvalidatesFrontendCache;
use Database\Factories\JobOfferFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'type', 'title', 'slug', 'company', 'city', 'description', 'apply_url', 'apply_email',
    'status', 'published_at', 'expires_at',
])]
class JobOffer extends Model
{
    /** @use HasFactory<JobOfferFactory> */
    use HasFactory, HasPublicationStatus, HasSlug, InvalidatesFrontendCache, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => JobOfferType::class,
            'status' => PublicationStatus::class,
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Offres visibles sur le site : publiées et non expirées. L'expiration est
     * évaluée à chaque lecture, sans tâche planifiée.
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->published()->where(function (Builder $query): void {
            $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
        });
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->lte(now());
    }

    /**
     * @return list<string>
     */
    public function frontendCacheTags(): array
    {
        return ['job-offers'];
    }
}
