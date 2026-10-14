<?php

namespace App\Http\Resources;

use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin JobOffer
 */
class JobOfferResource extends JsonResource
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
            'type' => ['value' => $this->type->value, 'label' => $this->type->label()],
            'title' => $this->title,
            'company' => $this->company,
            'city' => $this->city,
            'description' => $this->description,
            'apply_url' => $this->apply_url,
            'apply_email' => $this->apply_email,
            'published_at' => $this->published_at?->toIso8601String(),
            'expires_at' => $this->expires_at?->toIso8601String(),
        ];
    }
}
