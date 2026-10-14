"use client";

import { ChefHat, GraduationCap, Users } from "lucide-react";
import { motion } from "motion/react";

import { EASE_OUT } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import type { Media } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

import { heroSerif } from "./heroFonts";
import { HeroVisual } from "./HeroVisual";

type HeroProps = {
  /** Lignes du titre : la première en linéale, les suivantes en romain turquoise. */
  title: string[];
  description: string | null;
  /** Photographies principales du carrousel, dans l'ordre d'affichage. */
  images: Media[];
  secondaryImage: Media | null;
};

// Pictogrammes des trois repères, dans l'ordre du dictionnaire.
const FEATURE_ICONS = [GraduationCap, ChefHat, Users];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE_OUT, delay },
});

export function Hero({ title, description, images, secondaryImage }: HeroProps) {
  const t = getDictionary().home.hero;

  // « École hôtelière · Salé » : le lieu, dernier segment, ressort en foncé.
  const eyebrowParts = t.eyebrow.split(" · ");
  const place = eyebrowParts.pop();
  const lead = eyebrowParts.join(" · ");

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-[linear-gradient(110deg,#f7fbfb_0%,#f3f9fa_45%,#e9f5f7_100%)]"
    >
      {/* Grand aplat diagonal, très pâle, derrière la composition. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[5%] -top-[40%] -z-10 hidden h-[170%] w-[60%] rotate-[32deg] rounded-[7rem] bg-[#e4f3f6]/70 lg:block"
      />

      <div className="container-page relative grid gap-y-12 pb-14 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_51.6%] lg:items-start lg:gap-x-10 lg:pb-12 lg:pt-10">
        <div className="max-w-[35rem] lg:pt-12">
          <motion.p
            {...fadeUp(0.05)}
            data-reveal=""
            className="font-display text-xs font-semibold uppercase tracking-[0.18em]"
          >
            {lead ? <span className="text-cyan-700">{lead} · </span> : null}
            <span className="text-ink">{place}</span>
          </motion.p>

          {title.length > 0 ? (
            <h1
              id="hero-title"
              className="mt-6 font-display text-[clamp(2.375rem,0.55rem+3.55vw,3.5rem)] font-[650] leading-[1.02] tracking-[-0.035em] text-[#0f1a1f]"
            >
              {title.map((line, index) => (
                // Chaque ligne monte derrière un masque : le texte reste dans le flux pour les lecteurs d'écran.
                <span key={line} className={cn("-mb-[0.12em] block overflow-hidden pb-[0.12em]", index === 1 && "mt-[0.25em]")}>
                  <motion.span
                    className={cn(
                      "block",
                      index > 0 &&
                        cn(
                          heroSerif.className,
                          "text-[1.12em] font-medium leading-[1] tracking-[-0.012em] text-cyan-700",
                        ),
                    )}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 + index * 0.08 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
          ) : null}

          {description ? (
            <motion.p
              {...fadeUp(0.35)}
              data-reveal=""
              className="mt-2 max-w-[30rem] text-[1.0625rem] leading-[1.5] text-muted sm:text-[1.1875rem]"
            >
              {description}
            </motion.p>
          ) : null}

          <motion.div {...fadeUp(0.45)} data-reveal="" className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <ButtonLink href={routes.formations} size="lg" className="whitespace-nowrap">
              {t.primaryCta}
            </ButtonLink>
            <ButtonLink href={routes.admissions} variant="outline" size="lg" arrow={false} className="whitespace-nowrap">
              {t.secondaryCta}
            </ButtonLink>
          </motion.div>

          <motion.ul
            {...fadeUp(0.55)}
            data-reveal=""
            className="mt-7 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:flex-wrap sm:gap-x-6 min-[1440px]:gap-x-8"
          >
            {t.features.map((lines, position) => {
              const Icon = FEATURE_ICONS[position] ?? GraduationCap;

              return (
                <li key={lines.join(" ")} className="flex items-center gap-4">
                  <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-cyan-100">
                    <Icon strokeWidth={1.5} className="size-5 text-cyan-700" />
                  </span>
                  <span className="text-[0.8125rem] leading-snug text-ink-soft">
                    <span className="block">{lines[0]}</span> <span className="block">{lines[1]}</span>
                  </span>
                </li>
              );
            })}
          </motion.ul>
        </div>

        {images.length > 0 ? (
          <div className="mx-auto w-full max-w-[36rem] lg:max-w-none">
            <HeroVisual slides={images} secondary={secondaryImage} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
