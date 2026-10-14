<?php

namespace App\Models\Concerns;

use App\Enums\PublicationStatus;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * Cycle de publication commun aux contenus éditoriaux
 * (colonnes « status » et « published_at »).
 */
trait HasPublicationStatus
{
    public static function bootHasPublicationStatus(): void
    {
        // Publier sans date explicite revient à publier maintenant.
        static::saving(function (self $model): void {
            if ($model->status === PublicationStatus::Published && $model->published_at === null) {
                $model->published_at = now();
            }
        });
    }

    /**
     * Contenus visibles sur le site public : publiés, et dont la date de
     * publication est atteinte (une date future programme la mise en ligne).
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query
            ->where($this->qualifyColumn('status'), PublicationStatus::Published->value)
            ->where($this->qualifyColumn('published_at'), '<=', now());
    }

    public function isPublished(): bool
    {
        return $this->status === PublicationStatus::Published
            && $this->published_at !== null
            && $this->published_at->lte(now());
    }
}
