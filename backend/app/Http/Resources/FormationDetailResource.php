<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * Fiche complète d'une formation.
 */
class FormationDetailResource extends FormationResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'description' => $this->description,
            'objectives' => $this->objectives ?? [],
            'skills' => $this->skills ?? [],
            'program' => $this->program ?? [],
            'admission_requirements' => $this->admission_requirements ?? [],
            'career_opportunities' => $this->career_opportunities ?? [],
            'required_documents' => $this->required_documents ?? [],
            'faq' => $this->faq ?? [],
            'gallery' => new GalleryResource($this->whenLoaded('gallery')),
            'seo' => [
                'title' => $this->seo_title,
                'description' => $this->seo_description,
            ],
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
