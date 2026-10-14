<?php

namespace Tests\Unit\Support;

use App\Support\SearchTerm;
use PHPUnit\Framework\TestCase;

class SearchTermTest extends TestCase
{
    public function test_it_wraps_the_term_for_a_contains_search(): void
    {
        $this->assertSame('%cuisine%', SearchTerm::contains('  cuisine '));
    }

    public function test_it_neutralizes_like_wildcards(): void
    {
        $this->assertSame('%100\\% p\\_tisserie\\\\%', SearchTerm::contains('100% p_tisserie\\'));
    }
}
