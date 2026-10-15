<?php

namespace Tests\Feature\Api;

use App\Models\Formation;
use App\Models\FormationCategory;
use App\Models\Gallery;
use App\Models\Media;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FormationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_only_published_formations_in_display_order(): void
    {
        Formation::factory()->create(['title' => 'Pâtisserie', 'sort_order' => 2]);
        Formation::factory()->create(['title' => 'Cuisine', 'sort_order' => 1]);
        Formation::factory()->draft()->create(['title' => 'Brouillon']);
        Formation::factory()->archived()->create(['title' => 'Archivée']);
        Formation::factory()->scheduled()->create(['title' => 'Programmée']);
        Formation::factory()->create(['title' => 'Supprimée'])->delete();

        $this->getJson($this->api('formations'))
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('data.0.title', 'Cuisine')
            ->assertJsonPath('data.1.title', 'Pâtisserie');
    }

    public function test_a_formation_exposes_its_category_and_cover(): void
    {
        $category = FormationCategory::factory()->create(['name' => 'Restauration', 'slug' => 'restauration']);
        $cover = Media::factory()->illustrative()->create(['alt' => 'Table dressée']);

        Formation::factory()->create([
            'title' => 'Technicien en restauration',
            'slug' => 'technicien-en-restauration',
            'summary' => 'Présentation courte.',
            'formation_category_id' => $category->id,
            'cover_media_id' => $cover->id,
        ]);

        $this->getJson($this->api('formations'))
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'technicien-en-restauration')
            ->assertJsonPath('data.0.summary', 'Présentation courte.')
            ->assertJsonPath('data.0.category', ['id' => $category->id, 'slug' => 'restauration', 'name' => 'Restauration'])
            ->assertJsonPath('data.0.cover.alt', 'Table dressée')
            ->assertJsonPath('data.0.cover.is_illustrative', true)
            ->assertJsonPath('data.0.cover.url', $cover->url());
    }

    public function test_level_diploma_duration_and_capacity_stay_null_until_confirmed(): void
    {
        Formation::factory()->create(['title' => 'A', 'sort_order' => 1]);
        Formation::factory()->create([
            'title' => 'B',
            'sort_order' => 2,
            'level' => 'Technicien',
            'diploma' => 'Diplôme de Technicien',
            'duration_label' => '2 ans',
            'duration_months' => 24,
            'group_count' => 2,
            'group_capacity' => 20,
        ]);

        $this->getJson($this->api('formations'))
            ->assertOk()
            ->assertJsonPath('data.0.level', null)
            ->assertJsonPath('data.0.diploma', null)
            ->assertJsonPath('data.0.duration', null)
            ->assertJsonPath('data.0.capacity', null)
            ->assertJsonPath('data.1.capacity', ['groups' => 2, 'per_group' => 20, 'total' => 40])
            ->assertJsonPath('data.1.level', 'Technicien')
            ->assertJsonPath('data.1.diploma', 'Diplôme de Technicien')
            ->assertJsonPath('data.1.duration', ['label' => '2 ans', 'months' => 24]);
    }

    public function test_it_searches_title_and_summary_without_case_sensitivity(): void
    {
        Formation::factory()->create(['title' => 'Cuisine', 'summary' => 'Techniques culinaires.']);
        Formation::factory()->create(['title' => 'Pâtisserie', 'summary' => 'Pâtes et crèmes.']);
        Formation::factory()->create(['title' => 'Service', 'summary' => 'Accueil en salle, de la CUISINE au client.']);

        $this->getJson($this->api('formations?search=cuisine'))
            ->assertOk()
            ->assertJsonPath('meta.total', 2)
            ->assertJsonMissing(['title' => 'Pâtisserie']);
    }

    public function test_search_treats_like_wildcards_as_plain_text(): void
    {
        Formation::factory()->count(2)->create();

        $this->getJson($this->api('formations?search=%25'))
            ->assertOk()
            ->assertJsonPath('meta.total', 0);
    }

    public function test_it_filters_by_category_level_diploma_and_duration(): void
    {
        $restauration = FormationCategory::factory()->create(['slug' => 'restauration']);
        $cuisine = FormationCategory::factory()->create(['slug' => 'cuisine']);

        Formation::factory()->create([
            'title' => 'Technicien en restauration',
            'formation_category_id' => $restauration->id,
            'level' => 'Technicien',
            'diploma' => 'Diplôme de Technicien',
            'duration_months' => 24,
        ]);
        Formation::factory()->create([
            'title' => 'Cuisine',
            'formation_category_id' => $cuisine->id,
            'level' => 'Qualification',
            'diploma' => 'Diplôme de Qualification',
            'duration_months' => 12,
        ]);

        foreach (['category=cuisine', 'level=Qualification', 'diploma=Diplôme de Qualification', 'duration=12'] as $filter) {
            $this->getJson($this->api('formations?'.$filter))
                ->assertOk()
                ->assertJsonPath('meta.total', 1)
                ->assertJsonPath('data.0.title', 'Cuisine');
        }
    }

    public function test_available_filters_only_reflect_published_formations(): void
    {
        $visible = FormationCategory::factory()->create(['name' => 'Cuisine', 'slug' => 'cuisine']);
        $hidden = FormationCategory::factory()->create(['name' => 'Réception', 'slug' => 'reception']);

        Formation::factory()->create([
            'formation_category_id' => $visible->id,
            'level' => 'Qualification',
            'diploma' => 'Diplôme de Qualification',
            'duration_label' => '1 an',
            'duration_months' => 12,
        ]);
        Formation::factory()->draft()->create([
            'formation_category_id' => $hidden->id,
            'level' => 'Technicien spécialisé',
            'diploma' => 'Autre diplôme',
            'duration_months' => 36,
        ]);

        $this->getJson($this->api('formations'))
            ->assertOk()
            ->assertJsonPath('meta.filters.categories', [['id' => $visible->id, 'slug' => 'cuisine', 'name' => 'Cuisine']])
            ->assertJsonPath('meta.filters.levels', ['Qualification'])
            ->assertJsonPath('meta.filters.diplomas', ['Diplôme de Qualification'])
            ->assertJsonPath('meta.filters.durations', [['months' => 12, 'label' => '1 an']]);
    }

    public function test_it_shows_a_published_formation_with_its_details(): void
    {
        $photo = Media::factory()->create();
        $gallery = Gallery::factory()->create(['title' => 'Atelier cuisine']);
        $gallery->media()->attach($photo->id, ['sort_order' => 1]);

        Formation::factory()->create([
            'slug' => 'cuisine',
            'title' => 'Cuisine',
            'description' => '<p>Présentation détaillée.</p>',
            'objectives' => ['Maîtriser les cuissons'],
            'faq' => [['question' => 'Quand commencer ?', 'answer' => 'À la rentrée.']],
            'gallery_id' => $gallery->id,
            'seo_title' => 'Formation cuisine à Salé',
        ]);

        $this->getJson($this->api('formations/cuisine'))
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Cuisine')
            ->assertJsonPath('data.description', '<p>Présentation détaillée.</p>')
            ->assertJsonPath('data.objectives', ['Maîtriser les cuissons'])
            ->assertJsonPath('data.skills', [])
            ->assertJsonPath('data.faq.0.question', 'Quand commencer ?')
            ->assertJsonPath('data.gallery.title', 'Atelier cuisine')
            ->assertJsonPath('data.gallery.media.0.id', $photo->id)
            ->assertJsonPath('data.seo.title', 'Formation cuisine à Salé');
    }

    public function test_an_unpublished_or_unknown_formation_is_not_found(): void
    {
        Formation::factory()->draft()->create(['slug' => 'brouillon']);
        Formation::factory()->scheduled()->create(['slug' => 'programmee']);

        foreach (['brouillon', 'programmee', 'inconnue'] as $slug) {
            $this->getJson($this->api('formations/'.$slug))
                ->assertNotFound()
                ->assertExactJson(['success' => false, 'message' => 'Ressource introuvable.']);
        }
    }
}
