<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ListEventsRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EventController extends Controller
{
    /**
     * Événements publiés : à venir (par défaut, du plus proche au plus lointain)
     * ou passés (du plus récent au plus ancien).
     */
    public function index(ListEventsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $past = ($filters['period'] ?? 'upcoming') === 'past';

        $events = Event::query()
            ->published()
            ->with('cover')
            ->when(
                $past,
                fn (Builder $query) => $query->whereRaw('coalesce(ends_at, starts_at) < ?', [now()])->orderByDesc('starts_at'),
                fn (Builder $query) => $query->whereRaw('coalesce(ends_at, starts_at) >= ?', [now()])->orderBy('starts_at'),
            )
            ->paginate((int) ($filters['per_page'] ?? 12))
            ->withQueryString();

        return EventResource::collection($events);
    }
}
