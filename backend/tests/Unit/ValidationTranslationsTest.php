<?php

namespace Tests\Unit;

use Illuminate\Support\Arr;
use PHPUnit\Framework\TestCase;

class ValidationTranslationsTest extends TestCase
{
    /**
     * Une règle sans message français s'afficherait sous la forme de sa clé
     * technique (« validation.max.numeric ») dans les formulaires.
     */
    public function test_every_framework_validation_message_has_a_french_translation(): void
    {
        $root = dirname(__DIR__, 2);

        $english = $this->messages(require $root.'/vendor/laravel/framework/src/Illuminate/Translation/lang/en/validation.php');
        $french = $this->messages(require $root.'/lang/fr/validation.php');

        $this->assertSame([], array_values(array_diff(array_keys($english), array_keys($french))));

        foreach ($french as $key => $message) {
            $this->assertNotSame($english[$key] ?? null, $message, "Le message « {$key} » n'est pas traduit.");
        }
    }

    public function test_translations_keep_the_placeholders_of_the_original_messages(): void
    {
        $root = dirname(__DIR__, 2);

        $english = $this->messages(require $root.'/vendor/laravel/framework/src/Illuminate/Translation/lang/en/validation.php');
        $french = $this->messages(require $root.'/lang/fr/validation.php');

        foreach ($english as $key => $message) {
            preg_match_all('/:[a-z_]+/', $message, $expected);
            preg_match_all('/:[a-z_]+/', $french[$key], $actual);

            $this->assertEqualsCanonicalizing(
                array_unique($expected[0]),
                array_unique($actual[0]),
                "Variables différentes pour « {$key} ».",
            );
        }
    }

    /**
     * @param  array<string, mixed>  $lines
     * @return array<string, string>
     */
    private function messages(array $lines): array
    {
        return Arr::dot(Arr::except($lines, ['custom', 'attributes']));
    }
}
