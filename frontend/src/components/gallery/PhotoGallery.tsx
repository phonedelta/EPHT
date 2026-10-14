"use client";

import { Maximize2, Play } from "lucide-react";
import { motion } from "motion/react";
import { useState, type CSSProperties } from "react";

import { EASE_OUT } from "@/components/motion/Reveal";
import { FilterChips } from "@/components/ui/FilterChips";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";

import { Lightbox, type LightboxItem } from "./Lightbox";

/*
 * Grand écran : mosaïque éditoriale sur trois colonnes, comme sur l'accueil.
 * Les photos sont placées par séries de six ; dans chaque série, les colonnes
 * alternent une photo haute et une photo basse et s'arrêtent à la même ligne.
 * Les photos restantes forment des rangées de trois au plus.
 */
const BLOCK = [
  { column: 1, row: 1, span: 7 },
  { column: 2, row: 1, span: 5 },
  { column: 3, row: 1, span: 7 },
  { column: 1, row: 8, span: 5 },
  { column: 2, row: 6, span: 7 },
  { column: 3, row: 8, span: 5 },
];
const BLOCK_ROWS = 12;
const REMAINDER_ROWS = 6;
// Largeur des photos d'une rangée incomplète, en colonnes.
const REMAINDER_SPANS: Record<number, number[]> = { 1: [3], 2: [2, 1], 3: [1, 1, 1] };

/** Colonne et rangées d'une photo de la mosaïque, en valeurs CSS `grid-column` et `grid-row`. */
export function mosaicPlacement(position: number, total: number): { column: string; row: string } {
  const blocks = Math.floor(total / BLOCK.length);
  const block = Math.floor(position / BLOCK.length);

  if (block < blocks) {
    const cell = BLOCK[position % BLOCK.length];

    return { column: `${cell.column}`, row: `${block * BLOCK_ROWS + cell.row} / span ${cell.span}` };
  }

  const index = position - blocks * BLOCK.length;
  const rowIndex = Math.floor(index / 3);
  const spans = REMAINDER_SPANS[Math.min(3, total - blocks * BLOCK.length - rowIndex * 3)];
  const indexInRow = index % 3;
  const start = 1 + spans.slice(0, indexInRow).reduce((sum, span) => sum + span, 0);

  return {
    column: `${start} / span ${spans[indexInRow]}`,
    row: `${blocks * BLOCK_ROWS + rowIndex * REMAINDER_ROWS + 1} / span ${REMAINDER_ROWS}`,
  };
}

type PhotoGalleryProps = {
  items: LightboxItem[];
  /** Nom du filtre, annoncé aux lecteurs d'écran. */
  filterLabel: string;
};

/**
 * Galerie photographique : mosaïque sur grand écran, grille régulière sur
 * tablette et mobile. Un filtre par catégorie apparaît dès qu'il y en a deux ;
 * un clic ouvre la visionneuse sur la sélection en cours.
 */
export function PhotoGallery({ items, filterLabel }: PhotoGalleryProps) {
  const { home, pages } = getDictionary();
  const [category, setCategory] = useState<string | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  const categories = [...new Set(items.map((item) => item.category).filter((label) => label !== null))];
  const visible = category ? items.filter((item) => item.category === category) : items;

  return (
    <>
      {categories.length > 1 ? (
        <FilterChips
          label={filterLabel}
          value={category}
          onChange={(value) => {
            setCategory(value);
            setIndex(null);
          }}
          options={[
            { value: null, label: pages.filters.all, count: items.length },
            ...categories.map((label) => ({
              value: label,
              label,
              count: items.filter((item) => item.category === label).length,
            })),
          ]}
          className="mb-8"
        />
      ) : null}

      {/* La liste est recréée à chaque changement de filtre : ses photos réapparaissent l'une après l'autre. */}
      <ul key={category ?? "*"} className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:auto-rows-[3.25rem] lg:grid-cols-3">
        {visible.map((item, position) => {
          const isVideo = item.media.type === "video";
          const placement = mosaicPlacement(position, visible.length);
          const lastAlone = visible.length % 2 === 1 && position === visible.length - 1;

          return (
            <motion.li
              key={item.media.id}
              data-reveal=""
              style={{ "--column": placement.column, "--row": placement.row } as CSSProperties}
              className={cn(
                "lg:[grid-column:var(--column)] lg:[grid-row:var(--row)]",
                // Sur deux colonnes, une dernière photo isolée occupe toute la largeur.
                lastAlone && "sm:col-span-2",
              )}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: (position % 3) * 0.07 }}
            >
              <button
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`${isVideo ? home.studentLife.play : home.studentLife.open} : ${item.media.alt}`}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-lg text-left lg:aspect-auto lg:h-full",
                  lastAlone ? "aspect-[4/3] sm:aspect-[16/7]" : "aspect-[4/3]",
                )}
              >
                <Photo
                  media={item.media}
                  sizes="(min-width: 1320px) 400px, (min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full"
                  imageClassName="photo-zoom"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span className="absolute inset-x-4 bottom-3.5 text-[0.6875rem] uppercase leading-tight tracking-[0.12em] text-white md:inset-x-5 md:bottom-4">
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
            </motion.li>
          );
        })}
      </ul>

      <Lightbox items={visible} index={index} onChange={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
