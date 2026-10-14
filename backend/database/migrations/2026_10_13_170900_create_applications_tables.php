<?php

use App\Enums\ApplicationStatus;
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
        // Compteur annuel des références « EPHT-AAAA-NNNNNN ». La ligne de l'année
        // est verrouillée pendant l'incrément : deux candidatures simultanées ne
        // peuvent pas recevoir le même numéro.
        Schema::create('application_counters', function (Blueprint $table) {
            $table->unsignedSmallInteger('year')->primary();
            $table->unsignedInteger('last_number')->default(0);
        });

        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('reference', 20)->unique();

            // Une formation ne peut pas être supprimée tant que des candidatures y sont liées.
            $table->foreignId('formation_id')->constrained()->restrictOnDelete();

            $table->string('last_name', 100);
            $table->string('first_name', 100);
            $table->string('email');
            $table->string('phone', 32);
            $table->string('city', 100);
            $table->string('education_level', 100);
            $table->string('diploma_obtained')->nullable();
            $table->text('message')->nullable();

            $table->enum('status', ApplicationStatus::values())->default(ApplicationStatus::New->value);
            $table->timestamp('consent_given_at');

            // Jeton généré par le formulaire : une seconde soumission identique
            // (double clic, nouvel essai réseau) retrouve la candidature existante.
            $table->uuid('submission_token')->nullable()->unique();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index('email');
            $table->index('created_at');
        });

        Schema::create('application_documents', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->string('type', 48);
            $table->string('original_name');

            // Toujours un disque privé : jamais d'URL publique.
            $table->string('disk', 32);
            $table->string('path');
            $table->string('mime_type', 127);
            $table->unsignedBigInteger('size');
            $table->char('sha256', 64);
            $table->timestamps();

            $table->index(['application_id', 'type']);
        });

        Schema::create('application_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->text('body');
            $table->timestamps();

            $table->index(['application_id', 'created_at']);
        });

        Schema::create('application_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('from_status', ApplicationStatus::values())->nullable();
            $table->enum('to_status', ApplicationStatus::values());
            $table->string('comment', 500)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['application_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_status_histories');
        Schema::dropIfExists('application_notes');
        Schema::dropIfExists('application_documents');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('application_counters');
    }
};
