<?php

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
        Schema::create('formation_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formation_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary');
            $table->longText('description')->nullable();

            // Renseignés uniquement lorsqu'ils sont confirmés par l'école.
            $table->string('level', 64)->nullable();
            $table->string('diploma')->nullable();
            $table->string('duration_label', 64)->nullable();
            $table->unsignedSmallInteger('duration_months')->nullable();

            $table->jsonb('objectives')->nullable();
            $table->jsonb('skills')->nullable();
            $table->jsonb('program')->nullable();
            $table->jsonb('admission_requirements')->nullable();
            $table->jsonb('career_opportunities')->nullable();
            $table->jsonb('required_documents')->nullable();
            $table->jsonb('faq')->nullable();

            $table->foreignId('cover_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('gallery_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', PublicationStatus::values())->default(PublicationStatus::Draft->value);
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'sort_order']);
            $table->index('level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formations');
        Schema::dropIfExists('formation_categories');
    }
};
