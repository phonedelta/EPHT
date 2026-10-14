"use client";

import { Maximize2, Play } from "lucide-react";
import { useState } from "react";

import { Lightbox, type LightboxItem } from "@/components/gallery/Lightbox";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";

/*
 * Mosaïque asymétrique sur douze colonnes et trois rangées (grands écrans).
 * Avec moins de six médias, la grille revient à des tuiles régulières.
 */
const MOSAIC = [
  "lg:col-span-5 lg:row-span-2",
  "lg:col-span-4",
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-4 lg:col-start-6 lg:row-span-2 lg:row-start-2",
  "lg:col-span-5 lg:col-start-1 lg:row-start-3",
  "lg:col-span-3 lg:col-start-10 lg:row-start-3",
];

const MOSAIC_SIZES = [
  "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw",
  "(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw",
  "(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw",
  "(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw",
  "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw",
  "(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw",
];

const REGULAR_SIZES = "(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw";

/** Sur deux colonnes : la première tuile, et la dernière si elle se retrouvait seule. */
function isWideOnMobile(position: number, total: number): boolean {
  return position === 0 || (position === total - 1 && total % 2 === 0);
}

export function StudentLifeGallery({ items }: { items: LightboxItem[] }) {
  const { common, home } = getDictionary();
  const t = home.studentLife;
  const [index, setIndex] = useState<number | null>(null);
  const mosaic = items.length === MOSAIC.length;

  return (
    <>
      <RevealGroup
        as="ul"
        stagger={0.07}
        className={cn(
          "grid grid-cols-2 gap-3 md:gap-4",
          mosaic ? "lg:auto-rows-[13.5rem] lg:grid-cols-12" : "lg:grid-cols-3",
        )}
      >
        {items.map((item, position) => {
          const isVideo = item.media.type === "video";

          return (
            <RevealItem
              as="li"
              key={item.media.id}
              className={cn(
                // Petits écrans : les tuiles pleine largeur évitent une case orpheline.
                isWideOnMobile(position, items.length) && (mosaic ? "col-span-2" : "col-span-2 lg:col-span-1"),
                mosaic && MOSAIC[position],
              )}
            >
              <button
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`${isVideo ? t.play : t.open} : ${item.media.alt}`}
                className={cn(
                  "group relative block w-full overflow-hidden text-left",
                  isWideOnMobile(position, items.length) ? "aspect-[16/10]" : "aspect-[4/3]",
                  mosaic ? "lg:aspect-auto lg:h-full" : isWideOnMobile(position, items.length) && "lg:aspect-[4/3]",
                )}
              >
                <Photo
                  media={item.media}
                  sizes={mosaic ? MOSAIC_SIZES[position] : REGULAR_SIZES}
                  className="h-full w-full"
                  imageClassName="photo-zoom"
                  hideIllustrativeLabel
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span className="absolute inset-x-4 bottom-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] uppercase leading-tight tracking-[0.14em] text-white md:inset-x-5 md:bottom-4">
                  {item.category ? <span className="font-bold">{item.category}</span> : null}
                  {item.media.is_illustrative ? (
                    <span className="hidden text-white/75 sm:inline">{common.illustrativePhoto}</span>
                  ) : null}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-surface text-ink opacity-0 transition-[opacity,transform] duration-500 ease-out-expo group-hover:opacity-100 group-focus-visible:opacity-100 md:right-5 md:top-5 [@media(hover:none)]:opacity-100"
                >
                  {isVideo ? (
                    <Play strokeWidth={1.75} className="size-4 translate-x-px" />
                  ) : (
                    <Maximize2 strokeWidth={1.75} className="size-4" />
                  )}
                </span>
              </button>
            </RevealItem>
          );
        })}
      </RevealGroup>

      {/* Sur petit écran, la mention figure une fois sous la mosaïque plutôt que sur chaque tuile. */}
      {items.some((item) => item.media.is_illustrative) ? (
        <p className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted sm:hidden">
          {common.illustrativePhoto}
        </p>
      ) : null}

      <Lightbox items={items} index={index} onChange={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
