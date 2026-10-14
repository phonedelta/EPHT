<?php

use App\Enums\GallerySection;
use App\Enums\PublicationStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('section', GallerySection::values());

            // Sous-catégorie libre au sein d'une section (ex. « soutenances »).
            $table->string('category', 48)->nullable();

            $table->foreignId('cover_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->enum('status', PublicationStatus::values())->default(PublicationStatus::Draft->value);
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['section', 'status', 'sort_order']);
            $table->index('category');
        });

        Schema::create('gallery_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_id')->constrained()->cascadeOnDelete();
            $table->foreignId('media_id')->constrained('media')->cascadeOnDelete();
            $table->string('caption', 500)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['gallery_id', 'media_id']);
            $table->index(['gallery_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_media');
        Schema::dropIfExists('galleries');
    }
};
