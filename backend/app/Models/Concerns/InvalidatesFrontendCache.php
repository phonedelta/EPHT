<?php

namespace App\Models\Concerns;

use App\Services\Frontend\FrontendCache;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Signale au frontend toute création, modification ou suppression du modèle.
 */
trait InvalidatesFrontendCache
{
    public static function bootInvalidatesFrontendCache(): void
    {
        $revalidate = function (self $model): void {
            app(FrontendCache::class)->revalidate($model->frontendCacheTags());
        };

        static::saved($revalidate);
        static::deleted($revalidate);

        if (in_array(SoftDeletes::class, class_uses_recursive(static::class), true)) {
            static::restored($revalidate);
        }
    }

    /**
     * Étiquettes de cache du frontend concernées par ce modèle.
     *
     * @return list<string>
     */
    abstract public function frontendCacheTags(): array;
}
