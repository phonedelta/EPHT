<?php

namespace Tests\Unit\Models;

use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\Formation;
use App\Models\FormationCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_slug_is_generated_from_the_title_when_missing(): void
    {
        $formation = Formation::factory()->create(['title' => 'Pâtisserie & Boulangerie', 'slug' => null]);

        $this->assertSame('patisserie-boulangerie', $formation->slug);
    }

    public function test_generated_slugs_are_unique_even_against_deleted_content(): void
    {
        Formation::factory()->create(['title' => 'Cuisine', 'slug' => null])->delete();

        $second = Formation::factory()->create(['title' => 'Cuisine', 'slug' => null]);
        $third = Formation::factory()->create(['title' => 'Cuisine', 'slug' => null]);

        $this->assertSame('cuisine-2', $second->slug);
        $this->assertSame('cuisine-3', $third->slug);
    }

    public function test_categories_derive_their_slug_from_their_name(): void
    {
        $this->assertSame('arts-culinaires', FormationCategory::factory()->create(['name' => 'Arts culinaires'])->slug);
    }

    public function test_publishing_without_a_date_publishes_now(): void
    {
        $this->freezeSecond();

        $article = Article::factory()->draft()->create();
        $this->assertFalse($article->isPublished());

        $article->update(['status' => PublicationStatus::Published]);

        $this->assertTrue($article->published_at->equalTo(now()));
        $this->assertTrue($article->isPublished());
    }

    public function test_a_future_publication_date_keeps_content_hidden_until_then(): void
    {
        $article = Article::factory()->scheduled()->create();

        $this->assertFalse($article->isPublished());
        $this->assertSame(0, Article::published()->count());

        $this->travel(8)->days();

        $this->assertTrue($article->isPublished());
        $this->assertSame(1, Article::published()->count());
    }
}
