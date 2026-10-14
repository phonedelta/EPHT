<?php

namespace App\Support;

final class Typography
{
    private const NBSP = "\u{00A0}";

    private const NARROW_NBSP = "\u{202F}";

    /**
     * Applique les usages typographiques français à un texte saisi au clavier :
     * apostrophe courbe et espaces insécables devant la ponctuation haute,
     * pour qu'un « ? » ou un « : » ne soit jamais rejeté seul à la ligne.
     */
    public static function french(string $text): string
    {
        $text = preg_replace("/(?<=\p{L})'(?=\p{L})/u", '’', $text) ?? $text;
        $text = preg_replace('/ (?=[?!;])/u', self::NARROW_NBSP, $text) ?? $text;
        $text = preg_replace('/ (?=:(?:\s|$))/u', self::NBSP, $text) ?? $text;
        $text = preg_replace('/« /u', '«'.self::NBSP, $text) ?? $text;

        return preg_replace('/ »/u', self::NBSP.'»', $text) ?? $text;
    }

    /**
     * Applique french() à toutes les chaînes d'une structure imbriquée.
     *
     * @template TValue
     *
     * @param  TValue  $value
     * @return TValue
     */
    public static function frenchDeep(mixed $value): mixed
    {
        if (is_string($value)) {
            return self::french($value);
        }

        if (is_array($value)) {
            return array_map(self::frenchDeep(...), $value);
        }

        return $value;
    }
}
