"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { EASE_OUT, RevealImage } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { Media } from "@/lib/api/schemas";

/**
 * Photographie d'une page intérieure sur un aplat cyan dont l'angle inférieur
 * droit est coupé en biais, avec une vignette facultative en perspective.
 * Au défilement, les trois plans glissent à des vitesses différentes : la
 * composition gagne en profondeur sans jamais se déformer.
 */
export function PageVisual({ image, secondary }: { image: Media; secondary: Media | null }) {
  const container = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const depth = !reduceMotion;

  return (
    <div ref={container} className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
      <div className="relative aspect-[5/4]">
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 500 400"
          className="absolute inset-0 h-full w-full overflow-visible"
          style={depth ? { y: blobY } : undefined}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.05 }}
        >
          <defs>
            <linearGradient id="page-visual-blob" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#dcf1f5" />
              <stop offset="0.55" stopColor="#cdebf0" />
              <stop offset="1" stopColor="#b9e3ea" />
            </linearGradient>
          </defs>
          <path
            d="M74 66h376q50 0 50 50v120q0 40-38 58L252 384q-28 12-60 12H74q-50 0-50-50V116q0-50 50-50Z"
            fill="url(#page-visual-blob)"
          />
        </motion.svg>

        <motion.div className="absolute left-[13%] top-0 h-[86%] w-[81%]" style={depth ? { y: photoY } : undefined}>
          <RevealImage
            immediate
            origin="right"
            curtain="bg-[#eef7f8]"
            delay={0.1}
            className="h-full w-full rounded-2xl shadow-[0_30px_60px_-34px_rgb(23_38_44_/_0.55)]"
          >
            <Photo
              media={image}
              preload
              quality={85}
              sizes="(min-width: 1320px) 480px, (min-width: 1024px) 38vw, 84vw"
              className="h-full w-full"
            />
          </RevealImage>
        </motion.div>

        {secondary ? (
          <motion.div className="absolute bottom-[3%] left-0 w-[30%]" style={depth ? { y: cardY } : undefined}>
            <motion.div
              data-reveal=""
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.45 }}
            >
              {/* La perspective est portée par un élément à part : Motion pilote déjà la transformation du parent. */}
              <div className="rounded-xl bg-white p-1.5 shadow-[0_24px_44px_-22px_rgb(23_38_44_/_0.5)] [transform:perspective(600px)_rotateY(-14deg)_skewY(-6deg)]">
                <Photo media={secondary} sizes="(min-width: 1024px) 180px, 30vw" className="aspect-[4/5] rounded-lg" />
              </div>
            </motion.div>
          </motion.div>
        ) : null}

        {/* Trame de points, à droite de la photographie. */}
        <div
          aria-hidden="true"
          className="absolute -right-[7%] bottom-[8%] hidden h-[28%] w-[8%] bg-[radial-gradient(circle,#c6e2e9_1.6px,transparent_1.9px)] bg-[length:1rem_1rem] min-[1400px]:block"
        />
      </div>
    </div>
  );
}
