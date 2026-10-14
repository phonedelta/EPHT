<?php

namespace Tests\Feature\Services;

use App\Jobs\RevalidateFrontendCache;
use App\Models\Formation;
use App\Models\Media;
use App\Models\SiteSetting;
use App\Services\Frontend\FrontendCache;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class FrontendCacheTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'epht.frontend.url' => 'https://www.epht.test',
            'epht.frontend.revalidate_secret' => 'secret-de-test',
        ]);
    }

    public function test_saving_content_asks_the_frontend_to_refresh_the_matching_tag(): void
    {
        Queue::fake();

        Formation::factory()->create();

        Queue::assertPushed(RevalidateFrontendCache::class, fn (RevalidateFrontendCache $job) => $job->tags === ['formations']);
    }

    public function test_rapid_changes_to_the_same_content_are_coalesced_into_one_pending_call(): void
    {
        Queue::fake();

        $formation = Formation::factory()->create();
        $formation->update(['title' => 'Nouveau titre']);
        $formation->delete();
        $formation->restore();

        Queue::assertPushed(RevalidateFrontendCache::class, 1);
    }

    public function test_every_change_is_signalled_once_the_previous_call_has_been_processed(): void
    {
        // File « sync » : chaque appel est traité aussitôt, ce qui libère son verrou.
        Http::fake(['*' => Http::response(['revalidated' => true])]);

        $formation = FrontendCache::withoutRevalidation(fn () => Formation::factory()->create());
        Http::assertNothingSent();

        $formation->update(['title' => 'Nouveau titre']);
        $formation->update(['summary' => 'Nouvelle présentation.']);
        $formation->delete();

        Http::assertSentCount(3);
    }

    public function test_settings_and_media_map_to_their_own_tags(): void
    {
        Queue::fake();

        SiteSetting::query()->create(['key' => 'general.name', 'group' => 'general', 'value' => 'EPHT']);
        Media::factory()->create();

        Queue::assertPushed(RevalidateFrontendCache::class, fn (RevalidateFrontendCache $job) => $job->tags === ['settings']);
        Queue::assertPushed(RevalidateFrontendCache::class, fn (RevalidateFrontendCache $job) => $job->tags === [FrontendCache::ALL]);
    }

    public function test_nothing_is_dispatched_without_a_configured_secret(): void
    {
        config(['epht.frontend.revalidate_secret' => null]);
        Queue::fake();

        Formation::factory()->create();

        Queue::assertNothingPushed();
    }

    public function test_bulk_operations_can_mute_revalidation(): void
    {
        Queue::fake();

        $count = FrontendCache::withoutRevalidation(fn () => Formation::factory()->count(3)->create()->count());

        $this->assertSame(3, $count);
        Queue::assertNothingPushed();

        Formation::factory()->create();
        Queue::assertPushed(RevalidateFrontendCache::class);
    }

    public function test_the_job_calls_the_frontend_with_the_shared_secret(): void
    {
        Http::fake(['https://www.epht.test/api/revalidate' => Http::response(['revalidated' => true])]);

        (new RevalidateFrontendCache(['formations', 'settings']))->handle();

        Http::assertSent(fn (Request $request) => $request->url() === 'https://www.epht.test/api/revalidate'
            && $request->method() === 'POST'
            && $request->hasHeader('X-Revalidate-Secret', 'secret-de-test')
            && $request['tags'] === ['formations', 'settings']);
    }

    public function test_the_job_fails_when_the_frontend_refuses_the_call_so_it_can_be_retried(): void
    {
        Http::fake(['*' => Http::response(['message' => 'Unauthorized'], 401)]);

        $this->expectException(RequestException::class);

        (new RevalidateFrontendCache(['formations']))->handle();
    }
}
