<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreApplicationRequest;
use App\Models\Application;
use App\Models\Formation;
use App\Services\Applications\ApplicationReference;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ApplicationController extends Controller
{
    /**
     * Enregistre une demande d'inscription envoyée depuis le site.
     *
     * Un même jeton de soumission (double clic, nouvel essai réseau) renvoie
     * la candidature déjà créée au lieu d'en créer une seconde.
     */
    public function store(StoreApplicationRequest $request, ApplicationReference $references): JsonResponse
    {
        $data = $request->validated();
        $token = $data['submission_token'] ?? null;

        if ($token !== null && ($existing = $this->findByToken($token))) {
            return $this->respond($existing, 200);
        }

        $formation = Formation::query()->published()->where('slug', $data['formation'])->firstOrFail();

        try {
            $application = DB::transaction(function () use ($data, $formation, $references, $token): Application {
                $application = new Application([
                    'formation_id' => $formation->id,
                    'last_name' => $data['last_name'],
                    'first_name' => $data['first_name'],
                    'email' => mb_strtolower($data['email']),
                    'phone' => $data['phone'],
                    'city' => $data['city'],
                    'education_level' => $data['education_level'],
                    'diploma_obtained' => $data['diploma_obtained'] ?? null,
                    'message' => $data['message'] ?? null,
                    'consent_given_at' => now(),
                    'submission_token' => $token,
                ]);
                $application->reference = $references->next();
                $application->save();

                return $application;
            });
        } catch (UniqueConstraintViolationException $e) {
            // Deux envois simultanés du même jeton : le premier l'emporte.
            if ($token !== null && ($existing = $this->findByToken($token))) {
                return $this->respond($existing, 200);
            }

            throw $e;
        }

        return $this->respond($application, 201);
    }

    private function findByToken(string $token): ?Application
    {
        return Application::query()->where('submission_token', $token)->first(['id', 'reference']);
    }

    private function respond(Application $application, int $status): JsonResponse
    {
        return response()->json(['data' => ['reference' => $application->reference]], $status);
    }
}
