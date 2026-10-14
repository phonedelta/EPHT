<?php

namespace Tests\Feature\Database;

use App\Enums\GallerySection;
use App\Models\Article;
use App\Models\Formation;
use App\Models\Gallery;
use App\Models\Media;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SeedersTest extends TestCase
{
    use RefreshDatabase;

    public function test_reference_seeding_creates_real_content_only(): void
    {
        config(['epht.seed_illustrative_content' => false]);

        $this->seed(DatabaseSeeder::class);

        $this->assertSame('contact@epht.ma', SiteSetting::query()->where('key', 'contact.email')->value('value'));
        $this->assertSame(
            ['Apprenez un métier.', 'Construisez votre avenir.'],
            SiteSetting::query()->where('key', 'home.hero.title')->value('value'),
        );

        $this->assertSame(
            ['technicien-en-restauration', 'agent-de-restauration', 'cuisine', 'patisserie'],
            Formation::published()->orderBy('sort_order')->pluck('slug')->all(),
        );
        $this->assertSame(5, Gallery::published()->where('section', GallerySection::Infrastructure)->count());

        // Rien d'inventé : ni photographie, ni article, ni témoignage, ni compte.
        $this->assertSame(0, Media::count());
        $this->assertSame(0, Article::count());
        $this->assertSame(0, Testimonial::count());
        $this->assertSame(0, User::count());
    }

    public function test_unconfirmed_formation_facts_are_left_empty(): void
    {
        config(['epht.seed_illustrative_content' => false]);

        $this->seed(DatabaseSeeder::class);

        foreach (Formation::all() as $formation) {
            $this->assertNull($formation->level, $formation->slug);
            $this->assertNull($formation->diploma, $formation->slug);
            $this->assertNull($formation->duration_label, $formation->slug);
            $this->assertNull($formation->duration_months, $formation->slug);
            $this->assertNull($formation->program, $formation->slug);
        }
    }

    public function test_seeding_again_preserves_changes_made_by_the_administration(): void
    {
        config(['epht.seed_illustrative_content' => false]);

        $this->seed(DatabaseSeeder::class);

        SiteSetting::query()->where('key', 'contact.phone')->firstOrFail()->update(['value' => '+212 5 00 00 00 00']);
        Formation::query()->where('slug', 'cuisine')->firstOrFail()->update(['summary' => 'Texte validé par l’école.']);
        $settings = SiteSetting::count();

        $this->seed(DatabaseSeeder::class);

        $this->assertSame($settings, SiteSetting::count());
        $this->assertSame('+212 5 00 00 00 00', SiteSetting::query()->where('key', 'contact.phone')->value('value'));
        $this->assertSame('Texte validé par l’école.', Formation::query()->where('slug', 'cuisine')->value('summary'));
        $this->assertSame(4, Formation::count());
        $this->assertSame(5, Gallery::count());
    }

    public function test_illustrative_seeding_flags_every_photograph_as_an_illustration(): void
    {
        Storage::fake('public');
        config(['epht.seed_illustrative_content' => true, 'epht.media.disk' => 'public']);

        $this->seed(DatabaseSeeder::class);

        $this->assertGreaterThan(0, Media::count());
        $this->assertSame(0, Media::query()->where('is_illustrative', false)->count());
        $this->assertSame(0, Media::query()->whereNull('alt')->orWhereNull('credit')->orWhereNull('credit_url')->count());

        foreach (Media::all() as $media) {
            Storage::disk('public')->assertExists($media->path);
        }

        $this->assertSame(0, Formation::query()->whereNull('cover_media_id')->count());
        $this->assertSame(0, Gallery::query()->whereNull('cover_media_id')->count());
        $this->assertNotNull(SiteSetting::query()->where('key', 'home.hero.image')->value('value'));
        $this->assertSame(3, Article::published()->count());

        // Même en développement, aucun témoignage n'est fabriqué.
        $this->assertSame(0, Testimonial::count());
    }

    public function test_illustrative_seeding_does_not_replace_images_chosen_by_the_administration(): void
    {
        Storage::fake('public');
        config(['epht.seed_illustrative_content' => true, 'epht.media.disk' => 'public']);

        $this->seed(DatabaseSeeder::class);

        $official = Media::factory()->create();
        SiteSetting::query()->where('key', 'home.hero.image')->firstOrFail()->update(['value' => $official->id]);
        Formation::query()->where('slug', 'cuisine')->firstOrFail()->update(['cover_media_id' => $official->id]);

        $this->seed(DatabaseSeeder::class);

        $this->assertSame($official->id, SiteSetting::query()->where('key', 'home.hero.image')->value('value'));
        $this->assertSame($official->id, Formation::query()->where('slug', 'cuisine')->value('cover_media_id'));
        $this->assertSame(3, Article::count());
    }
}
