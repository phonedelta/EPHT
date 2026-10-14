"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

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

/** Durée d'affichage d'un espace, en millisecondes. */
const INTERVAL = 5000;

/**
 * Galerie des espaces de l'école : une rangée d'onglets et, en dessous, la
 * photographie et la description de l'espace sélectionné. Survol, clic et
 * flèches du clavier changent d'espace.
 *
 * Tant que la galerie est à l'écran, les espaces défilent seuls toutes les
 * cinq secondes, sauf si le visiteur a demandé moins d'animations. Le défilement
 * s'interrompt au survol ou au focus, et s'arrête dès qu'un espace est choisi.
 */
export function InfrastructureShowcase({ spaces, label }: InfrastructureShowcaseProps) {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tablist = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const inView = useInView(root, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const current = spaces[active];
  const total = spaces.length;

  useEffect(() => {
    if (!autoplay || paused || !inView || reduceMotion || total < 2) {
      return;
    }

    const timer = window.setTimeout(() => setActive((value) => (value + 1) % total), INTERVAL);

    return () => window.clearTimeout(timer);
  }, [active, autoplay, paused, inView, reduceMotion, total]);

  // Sur petit écran, la rangée d'onglets défile pour garder l'espace actif
  // visible, sans faire défiler la page.
  useEffect(() => {
    const list = tablist.current;
    const tab = tabs.current[active];

    if (!list || !tab || list.scrollWidth <= list.clientWidth) {
      return;
    }

    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [active, reduceMotion]);

  const choose = (index: number) => {
    setAutoplay(false);
    setActive(index);
  };

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
    choose(target);
    tabs.current[target]?.focus();
  };

  if (!current) {
    return null;
  }

  return (
    <div
      ref={root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={tablist}
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        className="relative -mx-5 flex gap-6 overflow-x-auto border-b border-line px-5 [scrollbar-width:none] md:-mx-8 md:px-8 lg:mx-0 lg:gap-8 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
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
              onClick={() => choose(index)}
              onMouseEnter={() => setActive(index)}
              onKeyDown={onKeyDown}
              className={cn(
                "relative flex shrink-0 items-baseline gap-2 whitespace-nowrap pb-4 pt-1 text-left text-[0.9375rem] font-medium transition-colors duration-200",
                selected ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "font-display text-xs font-semibold transition-colors duration-200",
                  selected ? "text-cyan-700" : "text-muted/70",
                )}
              >
                {ordinal(index)}
              </span>
              {space.title}
              {selected ? (
                <motion.span
                  aria-hidden="true"
                  layoutId={`${baseId}-indicator`}
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-cyan-500"
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        className="mt-8 grid items-center gap-y-6 rounded-xl lg:mt-10 lg:grid-cols-12 lg:gap-x-10"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-cyan-100 lg:col-span-8">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              {current.photo ? (
                <Photo
                  media={current.photo}
                  sizes="(min-width: 1320px) 810px, (min-width: 1024px) 64vw, 100vw"
                  className="h-full w-full"
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <p aria-hidden="true" className="font-display text-sm font-semibold text-cyan-700">
                {ordinal(active)}
                <span className="text-muted/70"> / {ordinal(spaces.length - 1)}</span>
              </p>
              <h3 className="text-subtitle mt-3">{current.title}</h3>
              {current.description ? (
                <p className="mt-3 max-w-[30rem] text-[0.9375rem] leading-relaxed text-muted">{current.description}</p>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {/* Progression dans la liste des espaces. */}
          <div aria-hidden="true" className="mt-6 h-0.5 w-full max-w-[12rem] overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full origin-left rounded-full bg-cyan-500"
              initial={false}
              animate={{ scaleX: (active + 1) / spaces.length }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
