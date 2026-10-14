<?php

namespace Tests\Feature\Api;

use Tests\TestCase;

class RootTest extends TestCase
{
    public function test_the_backend_root_identifies_the_api_without_serving_a_page(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/json')
            ->assertExactJson(['name' => config('app.name').' API', 'version' => 'v1', 'status' => 'ok']);
    }

    public function test_the_health_endpoint_responds(): void
    {
        $this->get('/up')->assertOk();
    }
}
