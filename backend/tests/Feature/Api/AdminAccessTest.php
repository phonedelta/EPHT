<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_admin_api_rejects_unauthenticated_requests(): void
    {
        $this->getJson($this->api('admin/me'))
            ->assertUnauthorized()
            ->assertExactJson(['success' => false, 'message' => 'Authentification requise.']);
    }

    public function test_an_invalid_bearer_token_is_rejected(): void
    {
        $this->getJson($this->api('admin/me'), ['Authorization' => 'Bearer jeton-invalide'])
            ->assertUnauthorized();
    }

    public function test_an_authenticated_user_can_read_their_own_profile(): void
    {
        $admin = User::factory()->admin()->create(['name' => 'Direction EPHT']);

        $this->actingAs($admin, 'sanctum')
            ->getJson($this->api('admin/me'))
            ->assertOk()
            ->assertExactJson([
                'success' => true,
                'data' => [
                    'id' => $admin->id,
                    'name' => 'Direction EPHT',
                    'email' => $admin->email,
                    'role' => ['value' => 'admin', 'label' => 'Administrateur'],
                ],
            ]);
    }

    public function test_admin_responses_are_never_publicly_cacheable(): void
    {
        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson($this->api('admin/me'))
            ->assertOk();

        $this->assertStringNotContainsString('public', (string) $response->headers->get('Cache-Control'));
    }
}
