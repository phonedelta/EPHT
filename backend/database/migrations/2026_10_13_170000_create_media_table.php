<?php

use App\Enums\MediaType;
use App\Enums\MediaVisibility;
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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->enum('type', MediaType::values())->default(MediaType::Image->value);
            $table->enum('visibility', MediaVisibility::values())->default(MediaVisibility::Public->value);

            // Fichier stocké via Laravel Storage, ou vidéo hébergée ailleurs.
            $table->string('disk', 32);
            $table->string('path')->nullable();
            $table->string('external_url', 2048)->nullable();

            $table->string('original_name')->nullable();
            $table->string('mime_type', 127)->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->char('dominant_color', 7)->nullable();

            // Point d'intérêt de l'image (en %), conservé lors des recadrages.
            $table->unsignedTinyInteger('focal_x')->default(50);
            $table->unsignedTinyInteger('focal_y')->default(50);

            $table->string('alt')->nullable();
            $table->string('title')->nullable();
            $table->string('caption', 500)->nullable();
            $table->string('credit')->nullable();
            $table->string('credit_url', 2048)->nullable();
            $table->string('license', 64)->nullable();

            // Photographie d'illustration : ne représente pas l'établissement.
            $table->boolean('is_illustrative')->default(false);

            $table->string('folder', 64)->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['disk', 'path']);
            $table->index(['type', 'visibility']);
            $table->index('folder');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
