import { Clock, MapPin } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { SchoolEvent } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { dateBadge, formatDate, formatTime, paragraphsOf } from "@/lib/format";

/** Événements de l'école : date en pastille, lieu, heure et présentation. */
export function EventList({ events, past = false }: { events: SchoolEvent[]; past?: boolean }) {
  return (
    <RevealGroup as="ul" className="grid gap-5 lg:grid-cols-2 lg:gap-6" stagger={0.06}>
      {events.map((event) => {
        const badge = dateBadge(event.starts_at);
        const time = formatTime(event.starts_at);
        const summary = event.summary ?? paragraphsOf(event.description)[0] ?? null;

        return (
          <RevealItem as="li" key={event.id}>
            <article
              className={cn(
                "flex h-full gap-5 rounded-xl border border-line bg-surface p-5 sm:p-6",
                past && "bg-surface/70",
              )}
            >
              {badge ? (
                <time
                  dateTime={event.starts_at}
                  className={cn(
                    "flex size-16 shrink-0 flex-col items-center justify-center rounded-lg font-display leading-none",
                    past ? "bg-line/60 text-ink-soft" : "bg-cyan-600 text-white",
                  )}
                >
                  <span className="text-xl font-semibold">{badge.day}</span>
                  <span className="mt-1 text-xs font-medium uppercase tracking-[0.08em]">{badge.month}</span>
                </time>
              ) : null}

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-semibold leading-snug text-ink sm:text-lg">{event.title}</h3>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-muted">
                  <li>{formatDate(event.starts_at)}</li>
                  {time && time !== "00:00" ? (
                    <li className="flex items-center gap-1.5">
                      <Clock aria-hidden="true" strokeWidth={1.5} className="size-3.5 text-cyan-700" />
                      {time}
                    </li>
                  ) : null}
                  {event.location ? (
                    <li className="flex items-center gap-1.5">
                      <MapPin aria-hidden="true" strokeWidth={1.5} className="size-3.5 text-cyan-700" />
                      {event.location}
                    </li>
                  ) : null}
                </ul>
                {summary ? <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{summary}</p> : null}
              </div>

              {event.cover ? (
                <Photo
                  media={event.cover}
                  sizes="112px"
                  className="hidden aspect-square w-28 shrink-0 rounded-lg sm:block"
                />
              ) : null}
            </article>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
