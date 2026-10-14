<?php

namespace App\Models;

use App\Enums\MediaType;
use App\Enums\MediaVisibility;
use App\Models\Concerns\InvalidatesFrontendCache;
use App\Services\Frontend\FrontendCache;
use Database\Factories\MediaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

#[Fillable([
    'type', 'visibility', 'disk', 'path', 'external_url', 'original_name', 'mime_type', 'size',
    'width', 'height', 'dominant_color', 'focal_x', 'focal_y', 'alt', 'title', 'caption',
    'credit', 'credit_url', 'license', 'is_illustrative', 'folder', 'uploaded_by',
])]
class Media extends Model
{
    /** @use HasFactory<MediaFactory> */
    use HasFactory, InvalidatesFrontendCache, SoftDeletes;

    protected $table = 'media';

    protected static function booted(): void
    {
        static::creating(function (self $media): void {
            $media->uuid ??= (string) Str::uuid();
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
            'type' => MediaType::class,
            'visibility' => MediaVisibility::class,
            'size' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'focal_x' => 'integer',
            'focal_y' => 'integer',
            'is_illustrative' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function isPublic(): bool
    {
        return $this->visibility === MediaVisibility::Public;
    }

    /**
     * URL publique du fichier. Un média privé n'en a jamais : il est servi
     * uniquement par un contrôleur soumis à autorisation.
     */
    public function url(): ?string
    {
        if (! $this->isPublic() || blank($this->path)) {
            return null;
        }

        return Storage::disk($this->disk)->url($this->path);
    }

    /**
     * Un média peut apparaître partout : tout le site est rafraîchi.
     *
     * @return list<string>
     */
    public function frontendCacheTags(): array
    {
        return [FrontendCache::ALL];
    }
}
