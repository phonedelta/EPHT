<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Capacité d'accueil d'une formation : nombre de groupes ouverts et places
     * par groupe. Vides tant que l'école ne les a pas communiqués.
     */
    public function up(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->unsignedSmallInteger('group_count')->nullable()->after('duration_months');
            $table->unsignedSmallInteger('group_capacity')->nullable()->after('group_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropColumn(['group_count', 'group_capacity']);
        });
    }
};
