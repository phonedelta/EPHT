"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { EASE_OUT } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import type { Media } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";

import { heroScript } from "./heroFonts";

type HeroVisualProps = {
  /** Photographies principales, présentées l'une après l'autre. */
  slides: Media[];
  /** Vignette posée en biais devant la photographie principale. */
  secondary: Media | null;
};

/** Durée d'affichage d'une photographie, en millisecondes. */
const INTERVAL = 5000;

/*
 * Composition photographique du hero, dessinée sur une boîte de proportions
 * fixes (640 × 560). Chaque élément y est placé en pourcentage et les textes
 * sont dimensionnés en unités de conteneur (cqw) : le dessin reste le même du
 * mobile au grand écran.
 *
 * Le carrousel défile seul, sauf si le visiteur a demandé moins d'animations ;
 * il s'interrompt au survol ou au focus, et s'arrête dès qu'on le manipule.
 */
export function HeroVisual({ slides, secondary }: HeroVisualProps) {
  const t = getDictionary().home.hero;
  const reduceMotion = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  // Profondeur au défilement : chaque plan de la composition glisse à sa propre vitesse.
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -44]);
  const taglineY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const gradientId = `hero-blob-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const total = slides.length;
  const current = slides[index];

  useEffect(() => {
    if (!autoplay || paused || reduceMotion || total < 2) {
      return;
    }

    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % total), INTERVAL);

    return () => window.clearTimeout(timer);
  }, [index, autoplay, paused, reduceMotion, total]);

  const show = (position: number) => {
    setAutoplay(false);
    setIndex((position + total) % total);
  };

  if (!current) {
    return null;
  }

  return (
    <div
      ref={container}
      className="@container relative aspect-[8/7] w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Aplat cyan derrière la photographie principale, l'angle inférieur droit coupé en biais. */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 640 560"
        className="absolute inset-0 h-full w-full overflow-visible"
        style={reduceMotion ? undefined : { y: blobY }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#dcf1f5" />
            <stop offset="0.55" stopColor="#cdebf0" />
            <stop offset="1" stopColor="#b9e3ea" />
          </linearGradient>
        </defs>
        <path
          d="M108 93h510q60 0 60 60v147q0 50-48 72L290 528q-35 17-75 17H108q-60 0-60-60V153q0-60 60-60Z"
          fill={`url(#${gradientId})`}
        />
      </motion.svg>

      {/* Trame de points, à droite de la photographie. */}
      <div
        aria-hidden="true"
        className="absolute left-[102%] top-[65.4%] hidden h-[21.6%] w-[8.4%] bg-[radial-gradient(circle,#c6e2e9_1.6px,transparent_1.9px)] bg-[length:1rem_1rem] min-[1400px]:block"
      />

      {/* Photographie principale. */}
      <motion.div
        role="group"
        aria-roledescription="carrousel"
        aria-label={t.carousel.label}
        className="absolute left-[17.8%] top-[2.5%] h-[85.5%] w-[82.3%] overflow-hidden rounded-[3.2cqw] bg-cyan-100 shadow-[0_30px_60px_-34px_rgb(23_38_44_/_0.55)]"
        style={reduceMotion ? undefined : { y: photoY }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <div aria-live={autoplay && !paused ? "off" : "polite"} className="absolute inset-0">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={current.id}
              role="group"
              aria-roledescription="photo"
              aria-label={`${index + 1} / ${total}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <Photo
                media={current}
                preload={current.id === slides[0]?.id}
                quality={85}
                sizes="(min-width: 1320px) 530px, (min-width: 1024px) 42vw, 84vw"
                className="h-full w-full"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Vignette en biais, devant la photographie principale. */}
      {secondary ? (
        <motion.div className="absolute left-0 top-[49.6%] w-[34.5%]" style={reduceMotion ? undefined : { y: cardY }}>
          <motion.div
            data-reveal=""
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.35 }}
          >
            <div className="rounded-[2.8cqw] bg-white p-[1.25cqw] shadow-[0_30px_50px_-24px_rgb(23_38_44_/_0.5)] [transform:perspective(600px)_rotateY(-14deg)_skewY(-6.8deg)]">
              <Photo
                media={secondary}
                sizes="(min-width: 1320px) 230px, (min-width: 1024px) 18vw, 36vw"
                className="aspect-[4/5] rounded-[1.8cqw]"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      {/* Mention manuscrite et ses traits. */}
      <motion.svg
        role="img"
        aria-label={t.tagline.join(" ")}
        viewBox="0 0 172 155"
        style={reduceMotion ? undefined : { y: taglineY }}
        className="absolute left-[-7.4%] top-[32.1%] hidden w-[22.3%] overflow-visible sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
      >
        <g className={heroScript.className} fill="#1c2e36" fontSize="32">
          <text x="20" y="86" transform="rotate(-13 20 86)">
            {t.tagline[0]}
          </text>
          <text x="16" y="124" transform="rotate(-16 16 124)">
            {t.tagline[1]}
          </text>
        </g>
        <g fill="none" stroke="#2a9ab3" strokeLinecap="round" strokeWidth="2.2">
          <path d="M141 39 152 19" />
          <path d="M154 56 171 45" />
          <path d="M157 67h14" />
          <path d="M160 73l11 1" strokeOpacity="0.6" />
          <path d="M32 147c26-12 52-22 78-32-9 5-17 10-25 15 28-9 55-17 83-25" />
        </g>
      </motion.svg>

      {/* Navigation du carrousel. */}
      {total > 1 ? (
        <div className="absolute left-[40%] right-[1.25%] top-[95.7%] flex -translate-y-1/2 items-center justify-between gap-3 lg:left-[58.6%]">
          <div className="flex items-center gap-2">
            {slides.map((slide, position) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => show(position)}
                aria-label={t.carousel.show(position + 1)}
                aria-current={position === index ? "true" : undefined}
                className="group/dot py-2.5"
              >
                <span
                  className={cn(
                    "block h-1 w-7 rounded-full transition-colors duration-300 lg:w-9",
                    position === index ? "bg-cyan-600" : "bg-[#d0e2e7] group-hover/dot:bg-cyan-300",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => show(index - 1)}
              aria-label={t.carousel.previous}
              className="grid size-9 place-items-center rounded-full bg-white text-ink shadow-[0_10px_24px_-12px_rgb(23_38_44_/_0.35)] transition-transform duration-200 hover:-translate-y-0.5 lg:size-[2.625rem]"
            >
              <ChevronLeft aria-hidden="true" strokeWidth={1.75} className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => show(index + 1)}
              aria-label={t.carousel.next}
              className="grid size-9 place-items-center rounded-full bg-white text-ink shadow-[0_10px_24px_-12px_rgb(23_38_44_/_0.35)] transition-transform duration-200 hover:-translate-y-0.5 lg:size-[2.625rem]"
            >
              <ChevronRight aria-hidden="true" strokeWidth={1.75} className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
