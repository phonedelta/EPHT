<?php

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

#[Signature('epht:create-admin {--name= : Nom complet} {--email= : Adresse e-mail}')]
#[Description("Crée un compte administrateur pour l'espace d'administration")]
class CreateAdminCommand extends Command
{
    /**
     * Le mot de passe est toujours saisi de façon masquée : il n'est jamais
     * accepté en argument, pour ne pas apparaître dans l'historique du shell
     * ni dans la liste des processus.
     */
    public function handle(): int
    {
        $name = $this->option('name') ?? text('Nom complet', required: true);
        $email = $this->option('email') ?? text('Adresse e-mail', required: true);
        $password = password('Mot de passe (12 caractères minimum)', required: true);
        $confirmation = password('Confirmez le mot de passe', required: true);

        $validator = Validator::make(
            [
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'password_confirmation' => $confirmation,
            ],
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', 'confirmed', Password::min(12)->letters()->mixedCase()->numbers()],
            ],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->components->error($error);
            }

            return self::FAILURE;
        }

        $user = new User([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);
        $user->role = UserRole::Admin;
        $user->is_active = true;
        $user->email_verified_at = now();
        $user->save();

        $this->components->info("Compte administrateur créé pour {$user->email}.");

        return self::SUCCESS;
    }
}
