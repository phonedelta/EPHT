"use client";

import { Maximize2, Play } from "lucide-react";
import { useState } from "react";

import { Lightbox, type LightboxItem } from "@/components/gallery/Lightbox";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";

/*
 * Mosaïque éditoriale sur trois colonnes et douze rangées (grands écrans) :
 * chaque colonne alterne une photographie haute et une plus basse, et toutes
 * s'arrêtent à la même ligne. Les médias restent dans leur ordre d'origine,
 * qui est aussi l'ordre de lecture au clavier.
 */
const MASONRY = [
  "lg:col-start-1 lg:row-start-1 lg:row-span-7",
  "lg:col-start-2 lg:row-start-1 lg:row-span-5",
  "lg:col-start-3 lg:row-start-1 lg:row-span-7",
  "lg:col-start-1 lg:row-start-8 lg:row-span-5",
  "lg:col-start-2 lg:row-start-6 lg:row-span-7",
  "lg:col-start-3 lg:row-start-8 lg:row-span-5",
];

const MASONRY_SIZES = "(min-width: 1320px) 400px, (min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw";
const WIDE_SIZES = "(min-width: 1320px) 400px, (min-width: 1024px) 32vw, 100vw";

/** Sur deux colonnes : la première tuile, et la dernière si elle se retrouvait seule. */
function isWideOnMobile(position: number, total: number): boolean {
  return position === 0 || (position === total - 1 && total % 2 === 0);
}

export function StudentLifeGallery({ items }: { items: LightboxItem[] }) {
  const t = getDictionary().home.studentLife;
  const [index, setIndex] = useState<number | null>(null);
  const masonry = items.length === MASONRY.length;

  return (
    <>
      <RevealGroup
        as="ul"
        stagger={0.06}
        className={cn(
          "grid grid-cols-2 gap-3 md:gap-4",
          masonry ? "lg:h-[46rem] lg:grid-cols-3 lg:grid-rows-12" : "lg:grid-cols-3",
        )}
      >
        {items.map((item, position) => {
          const isVideo = item.media.type === "video";
          const wide = isWideOnMobile(position, items.length);

          return (
            <RevealItem
              as="li"
              key={item.media.id}
              className={cn(wide && "col-span-2 lg:col-span-1", masonry && MASONRY[position])}
            >
              <button
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`${isVideo ? t.play : t.open} : ${item.media.alt}`}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-lg text-left",
                  wide ? "aspect-[16/10]" : "aspect-[4/3]",
                  masonry ? "lg:aspect-auto lg:h-full" : "lg:aspect-[4/3]",
                )}
              >
                <Photo
                  media={item.media}
                  sizes={wide ? WIDE_SIZES : MASONRY_SIZES}
                  className="h-full w-full"
                  imageClassName="photo-zoom"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span className="absolute inset-x-4 bottom-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] uppercase leading-tight tracking-[0.12em] text-white md:inset-x-5 md:bottom-4">
                  {item.category ? <span className="font-display font-semibold">{item.category}</span> : null}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-3.5 top-3.5 grid size-9 scale-90 place-items-center rounded-full bg-surface/95 text-ink opacity-0 transition-[opacity,transform] duration-300 ease-out-soft group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
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

      <Lightbox items={items} index={index} onChange={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
