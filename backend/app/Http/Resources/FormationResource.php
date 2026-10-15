<?php

namespace App\Http\Resources;

use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Représentation d'une formation dans les listes.
 *
 * @mixin Formation
 */
class FormationResource extends JsonResource
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
            'summary' => $this->summary,
            // Niveau, diplôme et durée restent nuls tant qu'ils ne sont pas confirmés.
            'level' => $this->level,
            'diploma' => $this->diploma,
            'duration' => $this->duration_label === null && $this->duration_months === null ? null : [
                'label' => $this->duration_label,
                'months' => $this->duration_months,
            ],
            // Places par groupe et nombre de groupes ; nul tant qu'ils ne sont pas communiqués.
            'capacity' => $this->group_capacity === null ? null : [
                'groups' => $this->group_count,
                'per_group' => $this->group_capacity,
                'total' => $this->group_count === null ? null : $this->group_count * $this->group_capacity,
            ],
            'category' => new FormationCategoryResource($this->whenLoaded('category')),
            'cover' => new MediaResource($this->whenLoaded('cover')),
            'published_at' => $this->published_at?->toIso8601String(),
        ];
    }
}
