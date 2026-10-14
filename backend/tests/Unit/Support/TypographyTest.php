<?php

namespace Tests\Unit\Support;

use App\Support\Typography;
use PHPUnit\Framework\TestCase;

class TypographyTest extends TestCase
{
    public function test_it_curls_apostrophes_between_letters(): void
    {
        $this->assertSame('l’EPHT, d’application, aujourd’hui', Typography::french("l'EPHT, d'application, aujourd'hui"));
    }

    public function test_it_binds_high_punctuation_to_the_preceding_word(): void
    {
        $this->assertSame("Pourquoi choisir l’EPHT\u{202F}?", Typography::french("Pourquoi choisir l'EPHT ?"));
        $this->assertSame("Bienvenue\u{202F}!", Typography::french('Bienvenue !'));
        $this->assertSame("Service, cuisine\u{00A0}: deux métiers", Typography::french('Service, cuisine : deux métiers'));
        $this->assertSame("«\u{00A0}Vie à l’EPHT\u{00A0}»", Typography::french("« Vie à l'EPHT »"));
    }

    public function test_it_leaves_urls_times_and_plain_text_untouched(): void
    {
        $this->assertSame('https://www.epht.ma/formations', Typography::french('https://www.epht.ma/formations'));
        $this->assertSame('Ouvert de 9:00 à 17:00', Typography::french('Ouvert de 9:00 à 17:00'));
        $this->assertSame('Apprenez un métier.', Typography::french('Apprenez un métier.'));
    }

    public function test_it_is_idempotent(): void
    {
        $once = Typography::french("Prêt à construire l'avenir ? Oui : dès aujourd'hui !");

        $this->assertSame($once, Typography::french($once));
    }

    public function test_it_processes_nested_structures(): void
    {
        $this->assertSame(
            ['title' => 'L’école', 'items' => [['text' => "Pourquoi\u{202F}?"]], 'count' => 3, 'empty' => null],
            Typography::frenchDeep(['title' => "L'école", 'items' => [['text' => 'Pourquoi ?']], 'count' => 3, 'empty' => null]),
        );
    }
}
