<?php

namespace App\Services\Media;

use App\Enums\MediaType;
use App\Enums\MediaVisibility;
use App\Models\Media;
use finfo;
use GdImage;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use RuntimeException;

/**
 * Importe une photographie dans la médiathèque publique.
 *
 * L'image est redressée, réduite si nécessaire puis réencodée en JPEG : les
 * métadonnées d'origine (EXIF, position GPS) ne sont jamais conservées.
 */
class ImageImporter
{
    private const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    /**
     * Importe le fichier vers le chemin indiqué du disque des médias. Un média
     * existant au même emplacement est mis à jour plutôt que dupliqué.
     *
     * @param  array<string, mixed>  $attributes  Texte alternatif, crédit, dossier…
     */
    public function import(string $sourcePath, string $targetPath, array $attributes = []): Media
    {
        if (! is_file($sourcePath)) {
            throw new InvalidArgumentException("Fichier introuvable : {$sourcePath}");
        }

        $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($sourcePath);

        if (! in_array($mimeType, self::ALLOWED_MIME_TYPES, true)) {
            throw new InvalidArgumentException("Type de fichier non pris en charge : {$mimeType}");
        }

        $image = @imagecreatefromstring((string) file_get_contents($sourcePath));

        if ($image === false) {
            throw new RuntimeException("Image illisible : {$sourcePath}");
        }

        $image = $this->applyExifOrientation($image, $sourcePath, $mimeType);
        $image = $this->fitWithin($image, (int) config('epht.media.max_dimension'));
        $binary = $this->encodeJpeg($image, (int) config('epht.media.jpeg_quality'));

        $disk = (string) config('epht.media.disk');

        if (! Storage::disk($disk)->put($targetPath, $binary, 'public')) {
            throw new RuntimeException("Écriture impossible sur le disque « {$disk} » : {$targetPath}");
        }

        $media = Media::withTrashed()->firstOrNew(['disk' => $disk, 'path' => $targetPath]);

        $media->fill([
            ...$attributes,
            'type' => MediaType::Image,
            'visibility' => MediaVisibility::Public,
            'original_name' => basename($sourcePath),
            'mime_type' => 'image/jpeg',
            'size' => strlen($binary),
            'width' => imagesx($image),
            'height' => imagesy($image),
            'dominant_color' => $this->dominantColor($image),
        ]);
        $media->deleted_at = null;
        $media->save();

        return $media;
    }

    private function applyExifOrientation(GdImage $image, string $path, string $mimeType): GdImage
    {
        if ($mimeType !== 'image/jpeg' || ! function_exists('exif_read_data')) {
            return $image;
        }

        $orientation = (int) (@exif_read_data($path)['Orientation'] ?? 1);

        // imagerotate() tourne dans le sens anti-horaire.
        $angle = match ($orientation) {
            3 => 180,
            6 => -90,
            8 => 90,
            default => 0,
        };

        if ($angle === 0) {
            return $image;
        }

        return imagerotate($image, $angle, 0) ?: $image;
    }

    private function fitWithin(GdImage $image, int $maxDimension): GdImage
    {
        $width = imagesx($image);
        $height = imagesy($image);
        $longest = max($width, $height);

        if ($longest <= $maxDimension) {
            return $image;
        }

        $ratio = $maxDimension / $longest;
        $targetWidth = max(1, (int) round($width * $ratio));
        $targetHeight = max(1, (int) round($height * $ratio));

        $resized = imagecreatetruecolor($targetWidth, $targetHeight);
        imagecopyresampled($resized, $image, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

        return $resized;
    }

    private function encodeJpeg(GdImage $image, int $quality): string
    {
        // Un JPEG n'a pas de transparence : on aplatit sur fond blanc.
        $canvas = imagecreatetruecolor(imagesx($image), imagesy($image));
        imagefill($canvas, 0, 0, (int) imagecolorallocate($canvas, 255, 255, 255));
        imagecopy($canvas, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));
        imageinterlace($canvas, true);

        ob_start();
        imagejpeg($canvas, null, $quality);

        return (string) ob_get_clean();
    }

    /**
     * Couleur moyenne de l'image, affichée par le frontend pendant le chargement.
     */
    private function dominantColor(GdImage $image): string
    {
        $pixel = imagecreatetruecolor(1, 1);
        imagecopyresampled($pixel, $image, 0, 0, 0, 0, 1, 1, imagesx($image), imagesy($image));

        return sprintf('#%06x', imagecolorat($pixel, 0, 0) & 0xFFFFFF);
    }
}
