<?php

namespace Tests\Feature\Database;

use App\Enums\GallerySection;
use App\Enums\SettingType;
use App\Models\Article;
use App\Models\Formation;
use App\Models\Gallery;
use App\Models\Media;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\User;
use App\Support\Typography;
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
            [
                'agent-de-restauration',
                'technicien-en-restauration',
                'technicien-en-cuisine',
                'technicien-en-patisserie',
                'technicien-en-reception',
                'technicien-specialise-en-gestion-hoteliere',
                'technicien-specialise-en-direction-de-restauration',
            ],
            Formation::published()->orderBy('sort_order')->pluck('slug')->all(),
        );
        $this->assertSame(5, Gallery::published()->where('section', GallerySection::Infrastructure)->count());

        // Rien d'inventé : ni photographie, ni article, ni témoignage, ni compte.
        $this->assertSame(0, Media::count());
        $this->assertSame(0, Article::count());
        $this->assertSame(0, Testimonial::count());
        $this->assertSame(0, User::count());
    }

    public function test_formations_carry_the_facts_of_the_annex_and_nothing_more(): void
    {
        config(['epht.seed_illustrative_content' => false]);

        $this->seed(DatabaseSeeder::class);

        $diplomas = collect(Formation::query()->orderBy('sort_order')->pluck('diploma'));
        $this->assertStringContainsString('(DQ)', $diplomas->first());
        $this->assertSame(4, $diplomas->filter(fn (string $diploma) => str_contains($diploma, '(DT)'))->count());
        $this->assertSame(2, $diplomas->filter(fn (string $diploma) => str_contains($diploma, '(DTS)'))->count());

        foreach (Formation::all() as $formation) {
            $this->assertSame(1, $formation->group_count, $formation->slug);
            $this->assertSame(20, $formation->group_capacity, $formation->slug);

            // L'annexe ne renseigne ni durée ni programme.
            $this->assertNull($formation->duration_label, $formation->slug);
            $this->assertNull($formation->duration_months, $formation->slug);
            $this->assertNull($formation->program, $formation->slug);
        }
    }

    public function test_content_seeded_before_the_annex_is_upgraded_unless_edited(): void
    {
        config(['epht.seed_illustrative_content' => false]);

        $untouched = Formation::factory()->create(['slug' => 'cuisine', 'title' => 'Cuisine', 'sort_order' => 3]);
        $edited = Formation::factory()->create(['slug' => 'patisserie', 'title' => 'Pâtisserie fine', 'sort_order' => 9]);
        $lead = SiteSetting::query()->create([
            'key' => 'home.about.lead',
            'group' => 'home',
            'type' => SettingType::Text,
            'is_public' => true,
            'value' => Typography::french("À Salé, l'EPHT forme aux métiers de la restauration, de la cuisine et de la pâtisserie, avec une idée simple : apprendre un métier, c'est d'abord le pratiquer."),
        ]);
        SiteSetting::query()->create([
            'key' => 'social.facebook',
            'group' => 'social',
            'type' => SettingType::Url,
            'is_public' => true,
            'value' => 'https://www.facebook.com/epht.ecolehoteliere',
        ]);
        $tagline = SiteSetting::query()->create([
            'key' => 'home.formations.intro',
            'group' => 'home',
            'type' => SettingType::Text,
            'is_public' => true,
            'value' => 'Texte validé par l’école.',
        ]);

        $this->seed(DatabaseSeeder::class);

        $this->assertSame('technicien-en-cuisine', $untouched->fresh()->slug);
        $this->assertSame('Technicien en cuisine', $untouched->fresh()->title);
        $this->assertSame('patisserie', $edited->fresh()->slug);
        $this->assertSame('Pâtisserie fine', $edited->fresh()->title);
        $this->assertSame(9, $edited->fresh()->sort_order);
        $this->assertSame('Diplôme de technicien (DT)', $edited->fresh()->diploma);
        $this->assertSame(7, Formation::count());
        $this->assertStringContainsString('hôtellerie', $lead->fresh()->value);
        $this->assertSame('Texte validé par l’école.', $tagline->fresh()->value);
        $this->assertSame('https://www.facebook.com/ephtma', SiteSetting::query()->where('key', 'social.facebook')->value('value'));
    }

    public function test_seeding_again_preserves_changes_made_by_the_administration(): void
    {
        config(['epht.seed_illustrative_content' => false]);

        $this->seed(DatabaseSeeder::class);

        SiteSetting::query()->where('key', 'contact.phone')->firstOrFail()->update(['value' => '+212 5 00 00 00 00']);
        Formation::query()->where('slug', 'technicien-en-cuisine')->firstOrFail()->update(['summary' => 'Texte validé par l’école.']);
        $settings = SiteSetting::count();

        $this->seed(DatabaseSeeder::class);

        $this->assertSame($settings, SiteSetting::count());
        $this->assertSame('+212 5 00 00 00 00', SiteSetting::query()->where('key', 'contact.phone')->value('value'));
        $this->assertSame('Texte validé par l’école.', Formation::query()->where('slug', 'technicien-en-cuisine')->value('summary'));
        $this->assertSame(7, Formation::count());
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
        Formation::query()->where('slug', 'technicien-en-cuisine')->firstOrFail()->update(['cover_media_id' => $official->id]);

        $this->seed(DatabaseSeeder::class);

        $this->assertSame($official->id, SiteSetting::query()->where('key', 'home.hero.image')->value('value'));
        $this->assertSame($official->id, Formation::query()->where('slug', 'technicien-en-cuisine')->value('cover_media_id'));
        $this->assertSame(3, Article::count());
    }
}
