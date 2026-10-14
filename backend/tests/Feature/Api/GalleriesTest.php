<?php

namespace Tests\Feature\Api;

use App\Enums\StudentLifeCategory;
use App\Models\Gallery;
use App\Models\Media;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GalleriesTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_filters_published_galleries_by_section(): void
    {
        Gallery::factory()->create(['title' => 'Salle de réception', 'sort_order' => 2]);
        Gallery::factory()->create(['title' => 'Cuisine pédagogique', 'sort_order' => 1]);
        Gallery::factory()->draft()->create(['title' => 'Brouillon']);
        Gallery::factory()->studentLife(StudentLifeCategory::Defenses->value)->create(['title' => 'Soutenances']);

        $this->getJson($this->api('galleries?section=infrastructure'))
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.title', 'Cuisine pédagogique')
            ->assertJsonPath('data.1.title', 'Salle de réception')
            ->assertJsonPath('data.0.section', 'infrastructure')
            ->assertJsonPath('data.0.category', null);
    }

    public function test_student_life_galleries_carry_a_labelled_category(): void
    {
        Gallery::factory()->studentLife(StudentLifeCategory::PracticalWork->value)->create(['title' => 'Atelier']);
        Gallery::factory()->studentLife(StudentLifeCategory::Defenses->value)->create(['title' => 'Jury']);

        $this->getJson($this->api('galleries?section=student_life&category=soutenances'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Jury')
            ->assertJsonPath('data.0.category', ['value' => 'soutenances', 'label' => 'Soutenances']);
    }

    public function test_media_follow_the_gallery_order_and_caption(): void
    {
        $gallery = Gallery::factory()->create(['slug' => 'cuisine-pedagogique']);
        $second = Media::factory()->create(['caption' => 'Légende du média']);
        $first = Media::factory()->illustrative()->create();
        $cover = Media::factory()->create();

        $gallery->media()->attach($second->id, ['sort_order' => 2, 'caption' => 'Légende de la galerie']);
        $gallery->media()->attach($first->id, ['sort_order' => 1]);
        $gallery->update(['cover_media_id' => $cover->id]);

        $this->getJson($this->api('galleries/cuisine-pedagogique'))
            ->assertOk()
            ->assertJsonPath('data.cover.id', $cover->id)
            ->assertJsonCount(2, 'data.media')
            ->assertJsonPath('data.media.0.id', $first->id)
            ->assertJsonPath('data.media.0.is_illustrative', true)
            ->assertJsonPath('data.media.0.caption', null)
            ->assertJsonPath('data.media.1.id', $second->id)
            ->assertJsonPath('data.media.1.caption', 'Légende de la galerie');
    }

    public function test_private_media_are_never_listed(): void
    {
        $gallery = Gallery::factory()->create();
        $public = Media::factory()->create();
        $private = Media::factory()->private()->create();

        $gallery->media()->attach([$public->id => ['sort_order' => 1], $private->id => ['sort_order' => 2]]);

        $this->getJson($this->api('galleries'))
            ->assertOk()
            ->assertJsonCount(1, 'data.0.media')
            ->assertJsonPath('data.0.media.0.id', $public->id);
    }

    public function test_an_unknown_section_is_rejected(): void
    {
        $this->getJson($this->api('galleries?section=inconnue'))
            ->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonValidationErrors('section');
    }

    public function test_a_draft_gallery_is_not_found(): void
    {
        Gallery::factory()->draft()->create(['slug' => 'brouillon']);

        $this->getJson($this->api('galleries/brouillon'))->assertNotFound();
    }
}
