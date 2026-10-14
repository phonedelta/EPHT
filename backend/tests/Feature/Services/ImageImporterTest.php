<?php

namespace Tests\Feature\Services;

use App\Enums\MediaType;
use App\Enums\MediaVisibility;
use App\Models\Media;
use App\Services\Media\ImageImporter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use Tests\TestCase;

class ImageImporterTest extends TestCase
{
    use RefreshDatabase;

    private string $directory;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        config(['epht.media.disk' => 'public']);

        $this->directory = sys_get_temp_dir().'/epht-importer-'.bin2hex(random_bytes(6));
        mkdir($this->directory);
    }

    protected function tearDown(): void
    {
        array_map('unlink', glob($this->directory.'/*') ?: []);
        rmdir($this->directory);

        parent::tearDown();
    }

    public function test_it_stores_a_public_jpeg_and_records_its_properties(): void
    {
        $source = $this->image('photo.png', 800, 600, [200, 30, 30]);

        $media = app(ImageImporter::class)->import($source, 'illustrations/photo.jpg', [
            'alt' => 'Une photo rouge',
            'credit' => 'Auteur',
            'is_illustrative' => true,
        ]);

        Storage::disk('public')->assertExists('illustrations/photo.jpg');

        $this->assertSame(MediaType::Image, $media->type);
        $this->assertSame(MediaVisibility::Public, $media->visibility);
        $this->assertSame('image/jpeg', $media->mime_type);
        $this->assertSame([800, 600], [$media->width, $media->height]);
        $this->assertSame(Storage::disk('public')->size('illustrations/photo.jpg'), $media->size);
        $this->assertSame('Une photo rouge', $media->alt);
        $this->assertTrue($media->is_illustrative);
        $this->assertNotNull($media->uuid);
        $this->assertStringEndsWith('/storage/illustrations/photo.jpg', (string) $media->url());

        // Couleur moyenne d'une image unie : proche de la couleur d'origine.
        [$red, $green, $blue] = sscanf((string) $media->dominant_color, '#%02x%02x%02x');
        $this->assertGreaterThan(180, $red);
        $this->assertLessThan(60, $green);
        $this->assertLessThan(60, $blue);
    }

    public function test_it_downsizes_images_larger_than_the_configured_limit(): void
    {
        config(['epht.media.max_dimension' => 400]);

        $media = app(ImageImporter::class)->import($this->image('large.jpg', 1600, 800), 'large.jpg');

        $this->assertSame([400, 200], [$media->width, $media->height]);

        $stored = getimagesizefromstring((string) Storage::disk('public')->get('large.jpg'));
        $this->assertSame([400, 200], [$stored[0], $stored[1]]);
    }

    public function test_importing_to_the_same_path_updates_the_existing_media(): void
    {
        $importer = app(ImageImporter::class);

        $first = $importer->import($this->image('a.jpg', 300, 200), 'illustrations/a.jpg', ['alt' => 'Avant']);
        $first->delete();

        $second = $importer->import($this->image('a.jpg', 600, 400), 'illustrations/a.jpg', ['alt' => 'Après']);

        $this->assertSame($first->id, $second->id);
        $this->assertFalse($second->trashed());
        $this->assertSame('Après', $second->alt);
        $this->assertSame(600, $second->width);
        $this->assertSame(1, Media::withTrashed()->count());
    }

    public function test_it_rejects_a_file_that_is_not_an_image_whatever_its_extension(): void
    {
        $fake = $this->directory.'/script.jpg';
        file_put_contents($fake, '<?php echo "pas une image";');

        try {
            app(ImageImporter::class)->import($fake, 'illustrations/script.jpg');
            $this->fail('Le fichier aurait dû être refusé.');
        } catch (InvalidArgumentException $e) {
            $this->assertStringContainsString('non pris en charge', $e->getMessage());
        }

        Storage::disk('public')->assertMissing('illustrations/script.jpg');
        $this->assertSame(0, Media::count());
    }

    public function test_it_rejects_a_missing_file(): void
    {
        $this->expectException(InvalidArgumentException::class);

        app(ImageImporter::class)->import($this->directory.'/absent.jpg', 'absent.jpg');
    }

    /**
     * @param  array{0: int, 1: int, 2: int}  $color
     */
    private function image(string $name, int $width, int $height, array $color = [120, 180, 200]): string
    {
        $image = imagecreatetruecolor($width, $height);
        imagefill($image, 0, 0, (int) imagecolorallocate($image, ...$color));

        $path = $this->directory.'/'.$name;
        str_ends_with($name, '.png') ? imagepng($image, $path) : imagejpeg($image, $path, 90);

        return $path;
    }
}
