<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;

/**
 * Appelle le point d'entrée de revalidation du frontend.
 *
 * Unique jusqu'à son exécution : plusieurs modifications rapprochées portant
 * sur les mêmes étiquettes ne produisent qu'un seul appel.
 */
class RevalidateFrontendCache implements ShouldBeUniqueUntilProcessing, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $uniqueFor = 60;

    /**
     * @param  list<string>  $tags
     */
    public function __construct(public array $tags) {}

    public function uniqueId(): string
    {
        $tags = $this->tags;
        sort($tags);

        return md5(implode('|', $tags));
    }

    /**
     * @return list<int>
     */
    public function backoff(): array
    {
        return [5, 30];
    }

    public function handle(): void
    {
        $secret = config('epht.frontend.revalidate_secret');

        if (blank($secret)) {
            return;
        }

        Http::timeout(5)
            ->acceptJson()
            ->withHeaders(['X-Revalidate-Secret' => $secret])
            ->post(config('epht.frontend.url').'/api/revalidate', ['tags' => $this->tags])
            ->throw();
    }
}
