"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useState } from "react";

import { EASE_OUT } from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";

/** Défilement à partir duquel le bouton apparaît, en pixels. */
const THRESHOLD = 720;

/**
 * Bouton de retour en haut de page. Il apparaît après un premier défilement ;
 * son anneau turquoise indique la progression dans la page.
 */
export function BackToTop() {
  const t = getDictionary().common;
  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => setVisible(value > THRESHOLD));

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label={t.backToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
          className="group fixed bottom-5 right-5 z-30 grid size-12 place-items-center rounded-full bg-surface text-ink shadow-[0_14px_32px_-14px_rgb(23_38_44_/_0.45)] ring-1 ring-line transition-colors duration-200 hover:text-cyan-700 md:bottom-7 md:right-7"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-cyan-500"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp
            aria-hidden="true"
            strokeWidth={1.75}
            className="size-[1.125rem] transition-transform duration-200 ease-out-soft group-hover:-translate-y-0.5"
          />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
