<?php

use App\Enums\SettingType;
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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();

            // Clé pointée, préfixée par le groupe : « contact.email », « home.hero.title »…
            $table->string('key', 128)->unique();
            $table->string('group', 48)->index();
            $table->enum('type', SettingType::values())->default(SettingType::String->value);
            $table->jsonb('value')->nullable();

            // Seuls les paramètres publics sont exposés par l'API publique.
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
