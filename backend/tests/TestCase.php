<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Préfixe commun des routes de l'API.
     */
    protected function api(string $path): string
    {
        return '/api/v1/'.ltrim($path, '/');
    }
}
