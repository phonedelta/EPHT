<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Convertit les exceptions en réponses JSON normalisées pour l'API.
 *
 * Aucun détail technique n'est renvoyé hors mode débogage : le message est
 * choisi d'après le code HTTP, jamais d'après le contenu de l'exception.
 */
class ApiExceptionRenderer
{
    private const MESSAGES = [
        400 => 'La requête est invalide.',
        401 => 'Authentification requise.',
        403 => 'Accès interdit.',
        404 => 'Ressource introuvable.',
        405 => 'Méthode HTTP non autorisée.',
        413 => 'Le contenu envoyé est trop volumineux.',
        419 => 'La session a expiré. Veuillez actualiser la page.',
        422 => 'Les données envoyées ne sont pas valides.',
        429 => 'Trop de requêtes. Veuillez réessayer dans quelques instants.',
        500 => 'Une erreur interne est survenue.',
        503 => 'Le service est momentanément indisponible.',
    ];

    public function __invoke(Throwable $e, Request $request): ?JsonResponse
    {
        if (! $request->is('api/*') && ! $request->expectsJson()) {
            return null;
        }

        if ($e instanceof ValidationException) {
            return $this->respond($e->status, ['errors' => $e->errors()]);
        }

        if ($e instanceof AuthenticationException) {
            return $this->respond(401);
        }

        if ($e instanceof HttpExceptionInterface) {
            return $this->respond($e->getStatusCode(), headers: $e->getHeaders());
        }

        // Erreur inattendue : en débogage, Laravel affiche le détail ; sinon
        // une réponse générique, l'exception étant déjà journalisée.
        return config('app.debug') ? null : $this->respond(500);
    }

    /**
     * @param  array<string, mixed>  $extra
     * @param  array<string, mixed>  $headers
     */
    private function respond(int $status, array $extra = [], array $headers = []): JsonResponse
    {
        $message = self::MESSAGES[$status] ?? self::MESSAGES[$status >= 500 ? 500 : 400];

        return response()->json(
            ['success' => false, 'message' => $message] + $extra,
            $status,
            $headers,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
        );
    }
}
