<?php

use App\Enums\JobOfferType;
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
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->enum('type', JobOfferType::values());
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('company');
            $table->string('city');
            $table->longText('description');
            $table->string('apply_url', 2048)->nullable();
            $table->string('apply_email')->nullable();
            $table->enum('status', PublicationStatus::values())->default(PublicationStatus::Draft->value);
            $table->timestamp('published_at')->nullable();

            // Passé cette date, l'offre n'est plus exposée par l'API publique.
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'type', 'expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_offers');
    }
};
