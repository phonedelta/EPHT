<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\GallerySection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListGalleriesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'section' => ['nullable', Rule::enum(GallerySection::class)],
            'category' => ['nullable', 'string', 'max:48'],
        ];
    }
}
