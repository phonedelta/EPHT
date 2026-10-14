<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Garantit la même enveloppe pour toutes les réponses JSON de l'API :
 * un indicateur « success » en tête, suivi des données ou de l'erreur.
 */
class NormalizeApiResponse
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $response instanceof JsonResponse || $response->getContent() === '' || $response->isEmpty()) {
            return $response;
        }

        $data = $response->getData(true);

        if (is_array($data) && ! array_is_list($data) && ! array_key_exists('success', $data)) {
            $response->setEncodingOptions(
                $response->getEncodingOptions() | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
            );
            $response->setData(['success' => $response->isSuccessful()] + $data);
        }

        return $response;
    }
}
