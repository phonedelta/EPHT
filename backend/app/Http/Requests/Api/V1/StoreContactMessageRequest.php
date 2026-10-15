<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactMessageRequest extends FormRequest
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
        $this->merge(collect($this->only(['name', 'email', 'phone', 'subject', 'message']))
            ->map(fn (mixed $value) => is_string($value) ? (trim($value) === '' ? null : trim($value)) : $value)
            ->all());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:32', 'regex:/^\+?[0-9][0-9 .\-]{7,30}$/'],
            'subject' => ['required', 'string', 'max:200'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'consent' => ['accepted'],
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
            'name.required' => 'Indiquez votre nom.',
            'email.required' => 'Indiquez votre adresse e-mail.',
            'email.email' => 'Cette adresse e-mail n’est pas valide.',
            'phone.regex' => 'Ce numéro de téléphone n’est pas valide.',
            'subject.required' => 'Choisissez un sujet.',
            'message.required' => 'Écrivez votre message.',
            'message.min' => 'Votre message est un peu court.',
            'message.max' => 'Le message ne doit pas dépasser 5000 caractères.',
            'consent.accepted' => 'Votre accord est nécessaire pour traiter le message.',
        ];
    }
}
