<?php

namespace Tests\Feature\Api;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use RuntimeException;
use Tests\TestCase;

/**
 * Règles communes à toutes les réponses de l'API.
 */
class ApiConventionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_responses_are_cacheable_and_set_no_cookie(): void
    {
        $response = $this->getJson($this->api('testimonials'))->assertOk();

        $cacheControl = (string) $response->headers->get('Cache-Control');

        $this->assertStringContainsString('public', $cacheControl);
        $this->assertStringContainsString('max-age=60', $cacheControl);
        $this->assertNotEmpty($response->headers->get('ETag'));
        $this->assertSame([], $response->headers->getCookies());
    }

    public function test_an_unchanged_response_is_answered_with_not_modified(): void
    {
        $etag = $this->getJson($this->api('testimonials'))->headers->get('ETag');

        $this->getJson($this->api('testimonials'), ['If-None-Match' => $etag])->assertStatus(304);
    }

    public function test_responses_declare_the_french_locale(): void
    {
        $this->getJson($this->api('testimonials'), ['Accept-Language' => 'en-US,en;q=0.9'])
            ->assertOk()
            ->assertHeader('Content-Language', 'fr');
    }

    public function test_an_unknown_route_returns_a_normalized_404(): void
    {
        $this->getJson($this->api('inexistant'))
            ->assertNotFound()
            ->assertExactJson(['success' => false, 'message' => 'Ressource introuvable.']);
    }

    public function test_a_wrong_http_method_returns_a_normalized_405(): void
    {
        $this->postJson($this->api('formations'))
            ->assertStatus(405)
            ->assertExactJson(['success' => false, 'message' => 'Méthode HTTP non autorisée.']);

        $this->deleteJson($this->api('site-settings'))->assertStatus(405);
    }

    public function test_validation_errors_are_normalized_and_written_in_french(): void
    {
        $this->getJson($this->api('articles?per_page=0'))
            ->assertUnprocessable()
            ->assertExactJson([
                'success' => false,
                'message' => 'Les données envoyées ne sont pas valides.',
                'errors' => [
                    'per_page' => ['Le champ nombre de résultats par page doit être au moins égal à 1.'],
                ],
            ]);
    }

    public function test_requests_are_rate_limited_with_a_normalized_429(): void
    {
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(2)->by($request->ip()));

        $this->getJson($this->api('testimonials'))->assertOk()->assertHeader('X-RateLimit-Remaining', 1);
        $this->getJson($this->api('testimonials'))->assertOk();

        $this->getJson($this->api('testimonials'))
            ->assertStatus(429)
            ->assertHeader('Retry-After')
            ->assertExactJson([
                'success' => false,
                'message' => 'Trop de requêtes. Veuillez réessayer dans quelques instants.',
            ]);
    }

    public function test_an_unexpected_error_never_leaks_technical_details(): void
    {
        config(['app.debug' => false]);

        Route::middleware('api')->get('/api/v1/_test/erreur', function (): never {
            throw new RuntimeException('SQLSTATE[08006] mot de passe refusé pour epht');
        });

        $response = $this->getJson('/api/v1/_test/erreur')
            ->assertStatus(500)
            ->assertExactJson(['success' => false, 'message' => 'Une erreur interne est survenue.']);

        $this->assertStringNotContainsString('SQLSTATE', $response->getContent());
    }
}
