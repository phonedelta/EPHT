"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { EASE_OUT } from "./Reveal";

type CountUpProps = {
  value: number;
  className?: string;
  /** Durée du décompte, en secondes. */
  duration?: number;
};

/**
 * Nombre qui défile de 0 à sa valeur à son entrée à l'écran. La valeur finale
 * est rendue côté serveur : sans JavaScript ou sous mouvement réduit, elle
 * s'affiche directement.
 */
export function CountUp({ value, className, duration = 1.1 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;

    if (!element || !inView || reduced) {
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        element.textContent = String(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [duration, inView, reduced, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
