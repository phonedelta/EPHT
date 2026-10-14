<?php

namespace Tests\Feature\Api;

use App\Models\Event;
use App\Models\Formation;
use App\Models\JobOffer;
use App\Models\Media;
use App\Models\Partner;
use App\Models\Testimonial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Témoignages, événements, offres et partenaires.
 */
class PublicListingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_testimonials_are_empty_until_one_is_published(): void
    {
        Testimonial::factory()->unpublished()->create();

        $this->getJson($this->api('testimonials'))
            ->assertOk()
            ->assertExactJson(['success' => true, 'data' => []]);
    }

    public function test_it_lists_published_testimonials_with_their_formation(): void
    {
        $formation = Formation::factory()->create(['title' => 'Cuisine', 'slug' => 'cuisine']);
        $photo = Media::factory()->create();

        Testimonial::factory()->create([
            'author_name' => 'Salma B.',
            'author_role' => 'Lauréate',
            'quote' => 'Une formation exigeante.',
            'formation_id' => $formation->id,
            'photo_media_id' => $photo->id,
        ]);
        Testimonial::factory()->unpublished()->create();
        Testimonial::factory()->create()->delete();

        $this->getJson($this->api('testimonials'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.author_name', 'Salma B.')
            ->assertJsonPath('data.0.quote', 'Une formation exigeante.')
            ->assertJsonPath('data.0.formation', ['slug' => 'cuisine', 'title' => 'Cuisine'])
            ->assertJsonPath('data.0.photo.id', $photo->id);
    }

    public function test_events_default_to_upcoming_ones_sorted_by_date(): void
    {
        Event::factory()->create(['title' => 'Dans un mois', 'starts_at' => now()->addMonth()]);
        Event::factory()->create(['title' => 'La semaine prochaine', 'starts_at' => now()->addWeek()]);
        Event::factory()->past()->create(['title' => 'Passé']);
        Event::factory()->draft()->create(['title' => 'Brouillon']);

        $this->getJson($this->api('events'))
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.title', 'La semaine prochaine')
            ->assertJsonPath('data.1.title', 'Dans un mois');

        $this->getJson($this->api('events?period=past'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Passé');
    }

    public function test_an_event_in_progress_is_still_upcoming(): void
    {
        Event::factory()->create([
            'title' => 'En cours',
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addHour(),
        ]);

        $this->getJson($this->api('events'))
            ->assertOk()
            ->assertJsonPath('data.0.title', 'En cours');
    }

    public function test_job_offers_exclude_expired_and_unpublished_ones(): void
    {
        JobOffer::factory()->create(['title' => 'Stage en cuisine']);
        JobOffer::factory()->create(['title' => 'Sans échéance', 'expires_at' => null]);
        JobOffer::factory()->expired()->create(['title' => 'Expirée']);
        JobOffer::factory()->draft()->create(['title' => 'Brouillon']);

        $titles = $this->getJson($this->api('job-offers'))
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->json('data.*.title');

        $this->assertEqualsCanonicalizing(['Stage en cuisine', 'Sans échéance'], $titles);
    }

    public function test_an_offer_disappears_as_soon_as_it_expires(): void
    {
        JobOffer::factory()->create(['expires_at' => now()->addMinutes(5)]);

        $this->getJson($this->api('job-offers'))->assertJsonCount(1, 'data');

        $this->travel(6)->minutes();

        $this->getJson($this->api('job-offers'))->assertJsonCount(0, 'data');
    }

    public function test_job_offers_can_be_filtered_by_type(): void
    {
        JobOffer::factory()->create(['title' => 'Stage']);
        JobOffer::factory()->job()->create(['title' => 'Commis de cuisine']);

        $this->getJson($this->api('job-offers?type=emploi'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Commis de cuisine')
            ->assertJsonPath('data.0.type', ['value' => 'emploi', 'label' => 'Emploi']);

        $this->getJson($this->api('job-offers?type=benevolat'))->assertUnprocessable();
    }

    public function test_only_published_partners_are_listed(): void
    {
        Partner::factory()->create(['name' => 'Hôtel partenaire']);
        Partner::factory()->unpublished()->create(['name' => 'Non confirmé']);

        $this->getJson($this->api('partners'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Hôtel partenaire');
    }
}
