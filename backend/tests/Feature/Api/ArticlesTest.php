<?php

namespace Tests\Feature\Api;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\Media;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticlesTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_published_articles_from_newest_to_oldest(): void
    {
        Article::factory()->create(['title' => 'Ancien', 'published_at' => now()->subDays(10)]);
        Article::factory()->create(['title' => 'Récent', 'published_at' => now()->subDay()]);
        Article::factory()->draft()->create(['title' => 'Brouillon']);
        Article::factory()->scheduled()->create(['title' => 'Programmé']);
        Article::factory()->create(['title' => 'Supprimé'])->delete();

        $this->getJson($this->api('articles'))
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('data.0.title', 'Récent')
            ->assertJsonPath('data.1.title', 'Ancien');
    }

    public function test_an_article_summary_carries_what_the_home_page_displays(): void
    {
        $category = ArticleCategory::factory()->create(['name' => 'Admissions', 'slug' => 'admissions']);
        $cover = Media::factory()->create(['alt' => 'Mise en place']);
        $publishedAt = now()->subDays(2)->startOfSecond();

        Article::factory()->create([
            'slug' => 'demande-d-inscription',
            'title' => 'Demande d’inscription',
            'excerpt' => 'Le point sur la démarche.',
            'article_category_id' => $category->id,
            'cover_media_id' => $cover->id,
            'published_at' => $publishedAt,
        ]);

        $this->getJson($this->api('articles'))
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'demande-d-inscription')
            ->assertJsonPath('data.0.excerpt', 'Le point sur la démarche.')
            ->assertJsonPath('data.0.category.name', 'Admissions')
            ->assertJsonPath('data.0.cover.alt', 'Mise en place')
            ->assertJsonPath('data.0.published_at', $publishedAt->toIso8601String())
            ->assertJsonMissingPath('data.0.content');
    }

    public function test_it_paginates_and_limits_the_page_size(): void
    {
        Article::factory()->count(5)->create();

        $this->getJson($this->api('articles?per_page=3'))
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('meta.total', 5)
            ->assertJsonPath('meta.last_page', 2);

        $this->getJson($this->api('articles?per_page=3&page=2'))
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->getJson($this->api('articles?per_page=100'))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('per_page');
    }

    public function test_it_filters_by_category_and_search(): void
    {
        $admissions = ArticleCategory::factory()->create(['slug' => 'admissions']);
        $metiers = ArticleCategory::factory()->create(['slug' => 'metiers']);

        Article::factory()->create(['title' => 'Inscriptions ouvertes', 'article_category_id' => $admissions->id]);
        Article::factory()->create(['title' => 'Le métier de pâtissier', 'article_category_id' => $metiers->id]);

        $this->getJson($this->api('articles?category=metiers'))
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.title', 'Le métier de pâtissier');

        $this->getJson($this->api('articles?search=INSCRIPTIONS'))
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.title', 'Inscriptions ouvertes');
    }

    public function test_listed_categories_only_include_those_with_published_articles(): void
    {
        $visible = ArticleCategory::factory()->create(['name' => 'Métiers', 'slug' => 'metiers']);
        $hidden = ArticleCategory::factory()->create(['name' => 'Vide', 'slug' => 'vide']);

        Article::factory()->create(['article_category_id' => $visible->id]);
        Article::factory()->draft()->create(['article_category_id' => $hidden->id]);

        $this->getJson($this->api('articles'))
            ->assertOk()
            ->assertJsonPath('meta.categories', [['id' => $visible->id, 'slug' => 'metiers', 'name' => 'Métiers']]);
    }

    public function test_it_shows_an_article_with_related_ones_from_the_same_category(): void
    {
        $category = ArticleCategory::factory()->create();

        Article::factory()->create([
            'slug' => 'article-principal',
            'content' => '<p>Contenu complet.</p>',
            'article_category_id' => $category->id,
            'seo_description' => 'Description SEO.',
        ]);
        $related = Article::factory()->create(['article_category_id' => $category->id]);
        Article::factory()->create();
        Article::factory()->draft()->create(['article_category_id' => $category->id]);

        $this->getJson($this->api('articles/article-principal'))
            ->assertOk()
            ->assertJsonPath('data.content', '<p>Contenu complet.</p>')
            ->assertJsonPath('data.seo.description', 'Description SEO.')
            ->assertJsonCount(1, 'meta.related')
            ->assertJsonPath('meta.related.0.id', $related->id);
    }

    public function test_an_unpublished_article_is_not_found(): void
    {
        Article::factory()->draft()->create(['slug' => 'brouillon']);
        Article::factory()->scheduled()->create(['slug' => 'programme']);

        $this->getJson($this->api('articles/brouillon'))->assertNotFound();
        $this->getJson($this->api('articles/programme'))->assertNotFound();
        $this->getJson($this->api('articles/inconnu'))->assertNotFound();
    }
}
