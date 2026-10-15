<?php

namespace App\Http\Requests\Api\V1;

use App\Models\Formation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Retire les espaces superflus avant validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge(collect($this->only([
            'last_name', 'first_name', 'email', 'phone', 'city', 'education_level', 'diploma_obtained', 'message',
        ]))->map(fn (mixed $value) => is_string($value) ? (trim($value) === '' ? null : trim($value)) : $value)->all());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            // Seules les formations publiées acceptent des candidatures.
            'formation' => ['required', 'string', 'max:255', Rule::exists(Formation::class, 'slug')->where(
                fn ($query) => $query->whereIn('id', Formation::query()->published()->select('id')),
            )],
            'last_name' => ['required', 'string', 'max:100'],
            'first_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255'],
            // Chiffres, espaces, points, tirets et indicatif international.
            'phone' => ['required', 'string', 'max:32', 'regex:/^\+?[0-9][0-9 .\-]{7,30}$/'],
            'city' => ['required', 'string', 'max:100'],
            'education_level' => ['required', 'string', 'max:100'],
            'diploma_obtained' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:2000'],
            'consent' => ['accepted'],
            'submission_token' => ['nullable', 'uuid'],
            // Champ piège, invisible pour un visiteur : un robot le remplit.
            'website' => ['prohibited'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'formation.required' => 'Choisissez une formation.',
            'formation.exists' => 'Cette formation n’accepte pas de candidature.',
            'last_name.required' => 'Indiquez votre nom.',
            'first_name.required' => 'Indiquez votre prénom.',
            'email.required' => 'Indiquez votre adresse e-mail.',
            'email.email' => 'Cette adresse e-mail n’est pas valide.',
            'phone.required' => 'Indiquez votre numéro de téléphone.',
            'phone.regex' => 'Ce numéro de téléphone n’est pas valide.',
            'city.required' => 'Indiquez votre ville.',
            'education_level.required' => 'Indiquez votre niveau d’études.',
            'message.max' => 'Le message ne doit pas dépasser 2000 caractères.',
            'consent.accepted' => 'Votre accord est nécessaire pour traiter la demande.',
        ];
    }
}
