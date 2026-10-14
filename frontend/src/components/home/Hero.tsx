"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { EASE_OUT, RevealImage } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import type { Media } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

type HeroProps = {
  /** Lignes du titre, affichées l'une sous l'autre. */
  title: string[];
  description: string | null;
  image: Media | null;
  secondaryImage: Media | null;
  /** Familles de formations publiées et localisation, pour le bandeau de repères. */
  formationFamilies: string[];
  campus: string | null;
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE_OUT, delay },
});

export function Hero({ title, description, image, secondaryImage, formationFamilies, campus }: HeroProps) {
  const t = getDictionary().home.hero;

  const facts = [
    formationFamilies.length > 0 ? { label: t.facts.formations, value: formationFamilies.join(" · "), href: routes.formations } : null,
    campus ? { label: t.facts.campus, value: campus, href: routes.contact } : null,
    { label: t.facts.admissions, value: t.facts.admissionsValue, href: routes.admissions },
  ].filter((fact) => fact !== null);

  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip bg-surface">
      <div className="container-page grid gap-y-10 pt-10 lg:grid-cols-12 lg:gap-x-8 lg:pt-14">
        <div className="flex flex-col justify-center lg:col-span-5 lg:pb-20 xl:pr-4">
          <motion.p {...fadeUp(0.05)} data-reveal="" className="eyebrow flex items-center gap-3 text-cyan-700">
            <span aria-hidden="true" className="h-px w-8 bg-cyan-500" />
            {t.eyebrow}
          </motion.p>

          {title.length > 0 ? (
            <h1 id="hero-title" className="text-display mt-6 text-ink">
              {title.map((line, index) => (
                // Chaque ligne monte derrière un masque : le texte reste dans le flux pour les lecteurs d'écran.
                <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                  <motion.span
                    className={cn("block", index > 0 && "italic text-cyan-700")}
                    initial={{ y: "108%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.05, ease: EASE_OUT, delay: 0.15 + index * 0.12 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
          ) : null}

          {description ? (
            <motion.p {...fadeUp(0.5)} data-reveal="" className="text-lead mt-7 max-w-[28rem] text-ink-soft">
              {description}
            </motion.p>
          ) : null}

          <motion.div {...fadeUp(0.64)} data-reveal="" className="mt-9 flex flex-col gap-3 sm:max-w-[22rem]">
            <ButtonLink href={routes.formations} spread>
              {t.primaryCta}
            </ButtonLink>
            <ButtonLink href={routes.admissions} variant="outline" spread>
              {t.secondaryCta}
            </ButtonLink>
          </motion.div>
        </div>

        {image ? (
          <div className="relative lg:col-span-7 lg:-mr-[max(3rem,calc((100vw-84rem)/2+3rem))]">
            <RevealImage immediate origin="right" delay={0.1} className="-mx-5 md:-mx-9 lg:mx-0">
              <Photo
                media={image}
                preload
                quality={85}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="h-[clamp(20rem,62vw,30rem)] lg:h-[clamp(30rem,calc(100svh-13rem),44rem)]"
              />
            </RevealImage>

            {secondaryImage ? (
              <motion.div
                data-reveal=""
                className="absolute -bottom-10 left-0 hidden w-44 border-[6px] border-surface sm:block lg:-left-8 lg:bottom-12 lg:w-48 xl:-left-10 xl:w-56"
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.85 }}
              >
                <Photo
                  media={secondaryImage}
                  sizes="(min-width: 1280px) 240px, 208px"
                  className="aspect-[4/5]"
                  hideIllustrativeLabel
                />
              </motion.div>
            ) : null}
          </div>
        ) : null}
      </div>

      <motion.div {...fadeUp(0.9)} data-reveal="" className="container-page mt-16 sm:mt-24 lg:mt-0">
        <dl className="grid border-t border-line sm:grid-cols-3">
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              className={cn(
                "flex flex-col gap-2 py-6 sm:py-7",
                index > 0 && "border-t border-line sm:border-l sm:border-t-0 sm:pl-8",
              )}
            >
              <dt className="eyebrow text-muted">{fact.label}</dt>
              <dd className="font-display text-lg leading-snug text-ink sm:text-xl">
                <Link href={fact.href} className="link-underline pb-0.5">
                  {fact.value}
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
