<?php

namespace Tests\Feature\Api;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\Formation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ApplicationsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        if (! array_key_exists('formation', $overrides)) {
            $overrides['formation'] = Formation::factory()->create()->slug;
        }

        return $overrides + [
            'last_name' => ' Alaoui ',
            'first_name' => 'Salma',
            'email' => 'Salma.Alaoui@example.com',
            'phone' => '+212 6 12 34 56 78',
            'city' => 'Salé',
            'education_level' => 'Baccalauréat',
            'diploma_obtained' => '',
            'message' => 'Je souhaite intégrer la formation en septembre.',
            'consent' => true,
        ];
    }

    public function test_it_records_an_application_with_a_yearly_reference(): void
    {
        $this->travelTo(now()->setDate(2026, 10, 15));

        $formation = Formation::factory()->create(['slug' => 'cuisine']);

        $this->postJson($this->api('applications'), $this->payload(['formation' => 'cuisine']))
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.reference', 'EPHT-2026-000001');

        $application = Application::query()->sole();

        $this->assertSame($formation->id, $application->formation_id);
        $this->assertSame('Alaoui', $application->last_name);
        $this->assertSame('salma.alaoui@example.com', $application->email);
        $this->assertNull($application->diploma_obtained);
        $this->assertSame(ApplicationStatus::New, $application->fresh()->status);
        $this->assertNotNull($application->consent_given_at);

        $this->postJson($this->api('applications'), $this->payload(['formation' => 'cuisine']))
            ->assertCreated()
            ->assertJsonPath('data.reference', 'EPHT-2026-000002');
    }

    public function test_the_same_submission_token_does_not_create_a_duplicate(): void
    {
        $payload = $this->payload(['submission_token' => (string) Str::uuid()]);

        $first = $this->postJson($this->api('applications'), $payload)->assertCreated()->json('data.reference');

        $this->postJson($this->api('applications'), $payload)
            ->assertOk()
            ->assertJsonPath('data.reference', $first);

        $this->assertSame(1, Application::query()->count());
    }

    public function test_it_rejects_incomplete_or_invalid_data(): void
    {
        $this->postJson($this->api('applications'), [])
            ->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonValidationErrors([
                'formation', 'last_name', 'first_name', 'email', 'phone', 'city', 'education_level', 'consent',
            ]);

        $this->postJson($this->api('applications'), $this->payload(['email' => 'pas-une-adresse', 'phone' => 'abc']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'phone']);
    }

    public function test_only_published_formations_accept_applications(): void
    {
        Formation::factory()->draft()->create(['slug' => 'brouillon']);

        $this->postJson($this->api('applications'), $this->payload(['formation' => 'brouillon']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['formation']);
    }

    public function test_the_honeypot_field_blocks_robots(): void
    {
        $this->postJson($this->api('applications'), $this->payload(['website' => 'https://spam.example']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['website']);

        $this->assertSame(0, Application::query()->count());
    }
}
