"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";

import { EASE_OUT } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { Media } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { ordinal } from "@/lib/format";

export type InfrastructureSpace = {
  id: number;
  title: string;
  description: string | null;
  photo: Media | null;
};

type InfrastructureShowcaseProps = {
  spaces: InfrastructureSpace[];
  /** Nom de la liste, annoncé aux lecteurs d'écran. */
  label: string;
};

/**
 * Galerie des espaces de l'école : une liste d'onglets et, en regard, la
 * photographie et la description de l'espace sélectionné. Survol, clic et
 * flèches du clavier changent d'espace.
 */
export function InfrastructureShowcase({ spaces, label }: InfrastructureShowcaseProps) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const current = spaces[active];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = spaces.length - 1;
    const target = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowRight: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }[event.key];

    if (target === undefined) {
      return;
    }

    event.preventDefault();
    setActive(target);
    tabs.current[target]?.focus();
  };

  if (!current) {
    return null;
  }

  return (
    <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
        className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 md:-mx-9 md:px-9 lg:col-span-5 lg:mx-0 lg:block lg:overflow-visible lg:border-b lg:border-line lg:px-0 lg:pb-0"
      >
        {spaces.map((space, index) => {
          const selected = index === active;

          return (
            <button
              key={space.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              onKeyDown={onKeyDown}
              className={cn(
                "group/tab relative flex shrink-0 items-baseline gap-5 whitespace-nowrap border-b-2 px-1 py-3 text-left transition-colors duration-300 lg:w-full lg:whitespace-normal lg:border-b-0 lg:border-t lg:border-line lg:px-0 lg:py-6",
                selected ? "border-cyan-500 text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "hidden font-display text-lg transition-colors duration-300 lg:block",
                  selected ? "text-cyan-600" : "text-muted/70",
                )}
              >
                {ordinal(index)}
              </span>
              <span className="font-display text-xl leading-tight lg:text-[1.75rem]">{space.title}</span>
              {/* Trait qui se déploie devant l'espace sélectionné (grands écrans). */}
              <span
                aria-hidden="true"
                className={cn(
                  "ml-auto hidden h-px origin-right self-center bg-cyan-500 transition-[width] duration-500 ease-out-expo lg:block",
                  selected ? "w-12" : "w-0 group-hover/tab:w-6",
                )}
              />
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        className="lg:col-span-7"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-cyan-100 lg:aspect-[3/2]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: EASE_OUT }}
            >
              {current.photo ? (
                <Photo
                  media={current.photo}
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="h-full w-full"
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence initial={false} mode="wait">
          <motion.p
            key={current.id}
            className="mt-5 min-h-[3.25rem] max-w-[36rem] text-ink-soft"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {current.description}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
