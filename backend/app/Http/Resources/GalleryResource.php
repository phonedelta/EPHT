<?php

namespace App\Http\Resources;

use App\Enums\GallerySection;
use App\Enums\StudentLifeCategory;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Gallery
 */
class GalleryResource extends JsonResource
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
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'section' => $this->section->value,
            'category' => $this->categoryPayload(),
            'cover' => new MediaResource($this->whenLoaded('cover')),
            'media' => MediaResource::collection($this->whenLoaded('media')),
            'published_at' => $this->published_at?->toIso8601String(),
        ];
    }

    /**
     * @return array{value: string, label: string}|null
     */
    private function categoryPayload(): ?array
    {
        if ($this->category === null) {
            return null;
        }

        $label = $this->section === GallerySection::StudentLife
            ? StudentLifeCategory::tryFrom($this->category)?->label()
            : null;

        return ['value' => $this->category, 'label' => $label ?? $this->category];
    }
}
