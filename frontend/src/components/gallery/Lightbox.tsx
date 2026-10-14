"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import { EASE_OUT } from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import type { Media } from "@/lib/api/schemas";

export type LightboxItem = {
  media: Media;
  /** Titre affiché sous la photographie (nom de la galerie, par exemple). */
  title: string | null;
  category: string | null;
};

type LightboxProps = {
  items: LightboxItem[];
  /** Position de l'élément affiché ; `null` : la visionneuse est fermée. */
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
};

const SWIPE_DISTANCE = 70;

/**
 * Visionneuse plein écran. Flèches du clavier, boutons ou balayage pour
 * passer d'un média à l'autre ; Échap, bouton ou clic sur le fond pour fermer.
 */
export function Lightbox({ items, index, onChange, onClose }: LightboxProps) {
  const t = getDictionary();
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const total = items.length;

  const go = useCallback(
    (step: number) => {
      if (index !== null && total > 1) {
        onChange((index + step + total) % total);
      }
    },
    [index, total, onChange],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    root.style.overflow = "hidden";
    closeButton.current?.focus();

    return () => {
      root.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        go(1);
      } else if (event.key === "ArrowLeft") {
        go(-1);
      } else if (event.key === "Tab" && dialog.current) {
        // Le focus reste dans la visionneuse.
        const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("button, a[href]"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, go, onClose]);

  const item = index === null ? null : items[index];

  return (
    <AnimatePresence>
      {item && index !== null ? (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={t.lightbox.label}
          className="on-dark fixed inset-0 z-[70] flex flex-col bg-ink/[0.97] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-5 md:px-8">
            <p aria-live="polite" className="text-[0.8125rem] font-semibold tracking-[0.14em] text-white/70">
              {t.lightbox.counter(index + 1, total)}
            </p>
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              aria-label={t.lightbox.close}
              className="grid size-11 place-items-center rounded-full border border-white/25 transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
            >
              <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                onClose();
              }
            }}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.figure
                key={item.media.id}
                className="relative h-full w-full max-w-6xl"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                drag={total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_DISTANCE) {
                    go(1);
                  } else if (info.offset.x > SWIPE_DISTANCE) {
                    go(-1);
                  }
                }}
              >
                {item.media.type === "video" && item.media.url ? (
                  <video
                    controls
                    playsInline
                    src={item.media.url}
                    aria-label={item.media.alt}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : item.media.url ? (
                  <Image
                    src={item.media.url}
                    alt={item.media.alt}
                    fill
                    sizes="(min-width: 1280px) 1152px, 100vw"
                    quality={85}
                    draggable={false}
                    className="select-none object-contain"
                  />
                ) : null}
              </motion.figure>
            </AnimatePresence>

            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t.lightbox.previous}
                  className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/60 transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink md:left-6 md:size-12"
                >
                  <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t.lightbox.next}
                  className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/60 transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink md:right-6 md:size-12"
                >
                  <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-5" />
                </button>
              </>
            ) : null}
          </div>

          <div className="shrink-0 px-5 py-5 text-center md:px-8">
            {item.category ? <p className="eyebrow text-cyan-300">{item.category}</p> : null}
            {item.title ? <p className="mt-2 font-display text-lg text-white">{item.title}</p> : null}
            <p className="mt-1.5 text-[0.8125rem] text-white/60">
              {[
                item.media.caption,
                item.media.is_illustrative ? t.common.illustrativePhoto : null,
                item.media.credit ? `${t.common.photoCredit} : ${item.media.credit}` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
