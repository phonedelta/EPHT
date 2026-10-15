<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactMessageController extends Controller
{
    /**
     * Enregistre un message envoyé depuis le formulaire de contact.
     */
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $data = $request->validated();

        ContactMessage::query()->create([
            'name' => $data['name'],
            'email' => mb_strtolower($data['email']),
            'phone' => $data['phone'] ?? null,
            'subject' => $data['subject'],
            'message' => $data['message'],
            'consent_given_at' => now(),
        ]);

        return response()->json(['data' => ['received' => true]], 201);
    }
}
