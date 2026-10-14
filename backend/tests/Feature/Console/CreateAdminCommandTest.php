<?php

namespace Tests\Feature\Console;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CreateAdminCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_an_active_administrator_with_a_hashed_password(): void
    {
        $this->artisan('epht:create-admin')
            ->expectsQuestion('Nom complet', 'Direction EPHT')
            ->expectsQuestion('Adresse e-mail', 'direction@epht.ma')
            ->expectsQuestion('Mot de passe (12 caractères minimum)', 'Un-Mot-De-Passe-2026')
            ->expectsQuestion('Confirmez le mot de passe', 'Un-Mot-De-Passe-2026')
            ->assertSuccessful();

        $user = User::query()->where('email', 'direction@epht.ma')->firstOrFail();

        $this->assertSame(UserRole::Admin, $user->role);
        $this->assertTrue($user->is_active);
        $this->assertNotSame('Un-Mot-De-Passe-2026', $user->password);
        $this->assertTrue(Hash::check('Un-Mot-De-Passe-2026', $user->password));
    }

    public function test_it_refuses_a_weak_password(): void
    {
        $this->artisan('epht:create-admin', ['--name' => 'Direction', '--email' => 'direction@epht.ma'])
            ->expectsQuestion('Mot de passe (12 caractères minimum)', 'motdepasse')
            ->expectsQuestion('Confirmez le mot de passe', 'motdepasse')
            ->assertFailed();

        $this->assertSame(0, User::count());
    }

    public function test_it_refuses_a_mismatched_confirmation_and_a_duplicate_email(): void
    {
        $this->artisan('epht:create-admin', ['--name' => 'Direction', '--email' => 'direction@epht.ma'])
            ->expectsQuestion('Mot de passe (12 caractères minimum)', 'Un-Mot-De-Passe-2026')
            ->expectsQuestion('Confirmez le mot de passe', 'Autre-Mot-De-Passe-2026')
            ->assertFailed();

        User::factory()->create(['email' => 'direction@epht.ma']);

        $this->artisan('epht:create-admin', ['--name' => 'Direction', '--email' => 'direction@epht.ma'])
            ->expectsQuestion('Mot de passe (12 caractères minimum)', 'Un-Mot-De-Passe-2026')
            ->expectsQuestion('Confirmez le mot de passe', 'Un-Mot-De-Passe-2026')
            ->assertFailed();

        $this->assertSame(1, User::count());
    }
}
