<?php

namespace App\Services\Applications;

use Illuminate\Support\Facades\DB;

/**
 * Attribue les références « EPHT-AAAA-NNNNNN », numérotées par année.
 */
class ApplicationReference
{
    /**
     * Réserve le numéro suivant de l'année. À appeler dans une transaction :
     * la ligne du compteur reste verrouillée jusqu'à sa validation.
     */
    public function next(?int $year = null): string
    {
        $year ??= (int) now()->format('Y');

        DB::table('application_counters')->insertOrIgnore(['year' => $year, 'last_number' => 0]);

        $current = DB::table('application_counters')->where('year', $year)->lockForUpdate()->value('last_number');
        $number = (int) $current + 1;

        DB::table('application_counters')->where('year', $year)->update(['last_number' => $number]);

        return sprintf('EPHT-%d-%06d', $year, $number);
    }
}
