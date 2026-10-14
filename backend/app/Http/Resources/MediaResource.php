<?php

namespace App\Http\Resources;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Media
 */
class MediaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'url' => $this->url(),
            'external_url' => $this->external_url,
            'mime_type' => $this->mime_type,
            'width' => $this->width,
            'height' => $this->height,
            'alt' => $this->alt ?? '',
            'title' => $this->title,
            // La légende saisie pour une galerie prime sur celle du média.
            'caption' => $this->whenPivotLoaded(
                'gallery_media',
                fn () => $this->pivot->caption ?? $this->caption,
                $this->caption,
            ),
            'credit' => $this->credit,
            'credit_url' => $this->credit_url,
            'is_illustrative' => $this->is_illustrative,
            'dominant_color' => $this->dominant_color,
            'focal_point' => ['x' => $this->focal_x, 'y' => $this->focal_y],
        ];
    }
}
