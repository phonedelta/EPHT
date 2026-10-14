<?php

namespace App\Http\Resources;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Testimonial
 */
class TestimonialResource extends JsonResource
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
            'author_name' => $this->author_name,
            'author_role' => $this->author_role,
            'quote' => $this->quote,
            'formation' => $this->whenLoaded('formation', fn () => $this->formation === null ? null : [
                'slug' => $this->formation->slug,
                'title' => $this->formation->title,
            ]),
            'photo' => new MediaResource($this->whenLoaded('photo')),
        ];
    }
}
