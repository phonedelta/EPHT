<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * Génère un slug unique à la création lorsqu'aucun n'est fourni.
 * Le modèle peut définir $slugSource (colonne d'origine, « title » par défaut).
 */
trait HasSlug
{
    public static function bootHasSlug(): void
    {
        static::creating(function (self $model): void {
            if (blank($model->slug)) {
                $model->slug = $model->generateUniqueSlug((string) $model->{$model->slugSource()});
            }
        });
    }

    protected function slugSource(): string
    {
        return property_exists($this, 'slugSource') ? $this->slugSource : 'title';
    }

    public function generateUniqueSlug(string $value): string
    {
        $base = Str::slug($value) ?: Str::lower(Str::random(8));
        $slug = $base;
        $suffix = 2;

        while ($this->slugExists($slug)) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }

    private function slugExists(string $slug): bool
    {
        $query = static::query();

        // Les slugs des éléments archivés restent réservés.
        if (in_array(SoftDeletes::class, class_uses_recursive(static::class), true)) {
            $query->withTrashed();
        }

        return $query->where('slug', $slug)->exists();
    }
}
