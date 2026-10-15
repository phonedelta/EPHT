import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { Formation } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { groupByLevel } from "@/lib/formations";
import { routes } from "@/lib/routes";

import { DiplomaBadge, levelFill } from "./DiplomaBadge";

type DiplomaLevelsProps = {
  formations: Formation[];
  /** Filière commune aux programmes, quand elle est renseignée. */
  sector: string | null;
};

// Décalage vertical de chaque marche sur grand écran : le niveau le plus élevé est le plus haut.
const STEPS: Record<number, string[]> = {
  2: ["lg:mt-12", "lg:mt-0"],
  3: ["lg:mt-24", "lg:mt-12", "lg:mt-0"],
};

/**
 * Les programmes rangés par niveau de diplôme, présentés comme un escalier :
 * du diplôme de qualification au technicien spécialisé. Chaque marche donne
 * ses formations et une jauge de ses places dans l'offre totale.
 */
export function DiplomaLevels({ formations, sector }: DiplomaLevelsProps) {
  const t = getDictionary().pages.formations;
  const levels = groupByLevel(formations);
  const totalPlaces = levels.reduce((sum, level) => sum + level.places, 0);

  if (levels.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="levels-title" className="section-y relative isolate overflow-hidden bg-background">
      {/* Trame de points, très discrète, derrière l'escalier. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(var(--color-line-strong)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_top,black,transparent)] opacity-60"
      />

      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="levels-title"
            eyebrow={t.overviewEyebrow}
            title={t.overviewTitle}
            intro={t.overviewIntro}
            className="max-w-[40rem]"
          />

          {/* Progression des niveaux, en un coup d'œil. */}
          <div className="flex shrink-0 flex-col gap-3 lg:items-end">
            <ol aria-hidden="true" className="flex items-center gap-1.5">
              {levels.map((level, index) => (
                <li key={level.level} className="flex items-center gap-1.5">
                  {level.code ? <DiplomaBadge code={level.code} /> : null}
                  {index < levels.length - 1 ? <ChevronRight strokeWidth={2} className="size-4 text-muted" /> : null}
                </li>
              ))}
            </ol>
            {sector ? (
              <p className="text-sm text-muted">
                {t.sector} · <span className="font-medium text-ink">{sector}</span>
              </p>
            ) : null}
          </div>
        </div>

        <RevealGroup
          as="ol"
          stagger={0.12}
          className={cn(
            "mt-12 grid items-start gap-5 lg:mt-14 lg:gap-6",
            levels.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2",
          )}
        >
          {levels.map((level, index) => {
            // La marche la plus haute se détache sur fond sombre.
            const top = index === levels.length - 1 && levels.length > 1;
            const share = totalPlaces > 0 ? Math.round((level.places / totalPlaces) * 100) : 0;

            return (
              <RevealItem
                as="li"
                key={level.level}
                className={cn(
                  "group relative flex flex-col rounded-2xl border p-6 shadow-[0_24px_48px_-36px_rgb(23_38_44/0.45)] sm:p-7",
                  STEPS[levels.length]?.[index],
                  top ? "on-dark border-transparent bg-ink text-white" : "border-line bg-surface",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  {level.code ? (
                    <DiplomaBadge code={level.code} size="lg" className={cn(top && "bg-white/10 ring-white/25")} />
                  ) : null}
                  <span className={cn("font-display text-sm font-semibold tabular-nums", top ? "text-white/40" : "text-line-strong")}>
                    {String(index + 1).padStart(2, "0")} / {String(levels.length).padStart(2, "0")}
                  </span>
                </div>

                <h3 className={cn("text-subtitle mt-6", top && "text-white")}>{level.level}</h3>
                {level.diploma ? (
                  <p className={cn("mt-1 text-[0.8125rem]", top ? "text-white/55" : "text-muted")}>{level.diploma}</p>
                ) : null}
                {level.code && t.levels[level.code] ? (
                  <p className={cn("mt-4 text-[0.9375rem] leading-relaxed", top ? "text-white/75" : "text-ink-soft")}>
                    {t.levels[level.code]}
                  </p>
                ) : null}

                {level.places > 0 ? (
                  <div className="mt-6">
                    <div className="flex items-baseline justify-between text-[0.8125rem]">
                      <span className={top ? "text-white/60" : "text-muted"}>{t.programmesCount(level.formations.length)}</span>
                      <span className={cn("font-semibold tabular-nums", top ? "text-white" : "text-ink")}>
                        {t.placesCount(level.places)}
                      </span>
                    </div>
                    <div
                      role="img"
                      aria-label={`${t.placesCount(level.places)} / ${t.placesCount(totalPlaces)}`}
                      className={cn("mt-2 h-1.5 overflow-hidden rounded-full", top ? "bg-white/10" : "bg-line")}
                    >
                      <span
                        className={cn("block h-full rounded-full", top ? "bg-cyan-300" : levelFill(level.code))}
                        style={{ width: `${Math.max(share, 4)}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                <ul className={cn("mt-6 grid gap-2 border-t pt-5", top ? "border-white/10" : "border-line")}>
                  {level.formations.map((formation) => (
                    <li key={formation.id}>
                      <Link
                        href={routes.formation(formation.slug)}
                        className={cn(
                          "group/link flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-[0.9375rem] font-medium transition-[background-color,border-color] duration-200",
                          top
                            ? "border-white/10 text-white hover:border-white/25 hover:bg-white/[0.06]"
                            : "border-line text-ink hover:border-cyan-200 hover:bg-cyan-50",
                        )}
                      >
                        <span className="leading-snug">{formation.title}</span>
                        <ArrowRight
                          aria-hidden="true"
                          strokeWidth={1.75}
                          className={cn(
                            "size-4 shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5",
                            top ? "text-cyan-300" : "text-cyan-700",
                          )}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
