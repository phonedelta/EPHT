<?php

namespace Tests\Feature\Api;

use App\Enums\ContactMessageStatus;
use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessagesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return $overrides + [
            'name' => ' Youssef Bennani ',
            'email' => 'Youssef@Example.com',
            'phone' => '',
            'subject' => 'Formations',
            'message' => 'Bonjour, quelles sont les dates de la prochaine rentrée ?',
            'consent' => true,
        ];
    }

    public function test_it_records_a_contact_message(): void
    {
        $this->postJson($this->api('contact'), $this->payload())
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.received', true);

        $message = ContactMessage::query()->sole();

        $this->assertSame('Youssef Bennani', $message->name);
        $this->assertSame('youssef@example.com', $message->email);
        $this->assertNull($message->phone);
        $this->assertSame(ContactMessageStatus::New, $message->fresh()->status);
    }

    public function test_it_rejects_incomplete_or_invalid_data(): void
    {
        $this->postJson($this->api('contact'), [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'message', 'consent']);

        $this->postJson($this->api('contact'), $this->payload(['email' => 'non', 'phone' => 'abc', 'message' => 'Court']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'phone', 'message']);
    }

    public function test_the_honeypot_field_blocks_robots(): void
    {
        $this->postJson($this->api('contact'), $this->payload(['website' => 'spam']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['website']);

        $this->assertSame(0, ContactMessage::query()->count());
    }
}
