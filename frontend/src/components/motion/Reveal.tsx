"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/*
 * Animations d'apparition au défilement.
 *
 * Toutes passent par des transformations et de l'opacité : sous
 * `prefers-reduced-motion`, <MotionProvider> neutralise les déplacements et il
 * ne reste qu'un fondu. L'attribut data-reveal permet à la page de rester
 * lisible sans JavaScript (voir le <noscript> du layout racine).
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

const TAGS = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
  article: motion.article,
  figure: motion.figure,
} as const;

type Tag = keyof typeof TAGS;

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** Délai avant l'apparition, en secondes. */
  delay?: number;
  /** Déplacement vertical de départ, en pixels. */
  y?: number;
};

/** Fait apparaître un élément par un fondu et une légère remontée. */
export function Reveal({ children, className, as = "div", delay = 0, y = 28 }: RevealProps) {
  const Component = TAGS[as] as typeof motion.div;

  return (
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </Component>
  );
}

const groupVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const itemVariants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_OUT } },
});

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** Écart entre deux éléments successifs, en secondes. */
  stagger?: number;
  delay?: number;
};

/** Conteneur dont les <RevealItem> apparaissent l'un après l'autre. */
export function RevealGroup({ children, className, as = "div", stagger = 0.09, delay = 0 }: RevealGroupProps) {
  const Component = TAGS[as] as typeof motion.div;

  return (
    <Component
      className={className}
      variants={groupVariants(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  );
}

export function RevealItem({ children, className, as = "div", y = 24 }: Omit<RevealProps, "delay">) {
  const Component = TAGS[as] as typeof motion.div;

  return (
    <Component data-reveal="" className={className} variants={itemVariants(y)}>
      {children}
    </Component>
  );
}

type RevealImageProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Classe de fond du voile : la couleur de la section qui porte l'image. */
  curtain?: string;
  /** Si vrai, l'image se révèle dès le chargement, sans attendre le défilement. */
  immediate?: boolean;
  /** Bord vers lequel le voile se retire. */
  origin?: "top" | "right";
};

/**
 * Révèle une photographie : un voile de la couleur du fond se retire pendant
 * que l'image, légèrement agrandie, reprend sa taille.
 */
export function RevealImage({
  children,
  className,
  delay = 0,
  curtain = "bg-surface",
  immediate = false,
  origin = "top",
}: RevealImageProps) {
  const vertical = origin === "top";
  const trigger = immediate ? { animate: "visible" } : { whileInView: "visible", viewport: VIEWPORT };

  return (
    <motion.div className={cn("relative overflow-hidden", className)} initial="hidden" {...trigger}>
      <motion.div
        className="h-full w-full"
        variants={{
          hidden: { scale: 1.12 },
          visible: { scale: 1, transition: { duration: 1.6, ease: EASE_OUT, delay } },
        }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden="true"
        data-reveal-curtain=""
        className={cn("pointer-events-none absolute inset-0", vertical ? "origin-top" : "origin-right", curtain)}
        variants={{
          hidden: vertical ? { scaleY: 1 } : { scaleX: 1 },
          visible: {
            ...(vertical ? { scaleY: 0 } : { scaleX: 0 }),
            transition: { duration: 1.15, ease: [0.65, 0, 0.35, 1], delay },
          },
        }}
      />
    </motion.div>
  );
}
