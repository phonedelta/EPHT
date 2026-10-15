import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { DiplomaBadge } from "@/components/formations/DiplomaBadge";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { Formation } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { diplomaCode, offerFigures } from "@/lib/formations";
import { routes } from "@/lib/routes";

type CapacityTableProps = {
  formations: Formation[];
  eyebrow: string;
  title: string;
  /** Filière commune aux programmes, quand elle est renseignée. */
  sector: string | null;
};

// Au-delà, un groupe est résumé par son nombre : la grille de places resterait illisible.
const MAX_SEATS = 40;

const SEAT_TONES: Record<string, string> = { DQ: "bg-cyan-300", DT: "bg-cyan-600", DTS: "bg-ink" };

/** Une place par carré, groupe par groupe. */
function Seats({ groups, perGroup, code }: { groups: number; perGroup: number; code: string | null }) {
  if (perGroup > MAX_SEATS) {
    return null;
  }

  return (
    <span aria-hidden="true" className="flex flex-wrap gap-2">
      {Array.from({ length: Math.max(groups, 1) }, (_, group) => (
        <span key={group} className="grid grid-cols-10 gap-[3px]">
          {Array.from({ length: perGroup }, (_, seat) => (
            <span key={seat} className={cn("size-[7px] rounded-[2px]", SEAT_TONES[code ?? ""] ?? "bg-cyan-600")} />
          ))}
        </span>
      ))}
    </span>
  );
}

/**
 * Les programmes et leurs capacités d'accueil, comme dans l'annexe de la
 * convention : diplôme, groupes, places par groupe et total. Chaque place est
 * dessinée, pour rendre la taille des groupes tangible.
 */
export function CapacityTable({ formations, eyebrow, title, sector }: CapacityTableProps) {
  const t = getDictionary().pages.formations;
  const listed = formations.flatMap((formation) => (formation.capacity ? [{ formation, capacity: formation.capacity }] : []));
  const figures = offerFigures(listed.map(({ formation }) => formation));

  if (listed.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="capacity-title" className="section-y bg-surface">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader id="capacity-title" eyebrow={eyebrow} title={title} intro={sector ? `${t.sector} · ${sector}` : null} />

          {figures.places > 0 ? (
            <Reveal delay={0.08} className="flex shrink-0 items-center gap-5 rounded-2xl bg-ink px-6 py-4 text-white">
              <div>
                <CountUp
                  value={figures.places}
                  className="block font-display text-[2.25rem] font-semibold leading-none tracking-[-0.03em] tabular-nums"
                />
                <span className="mt-1 block text-[0.8125rem] text-white/65">{t.figures.places}</span>
              </div>
              <span aria-hidden="true" className="h-10 w-px bg-white/15" />
              <div>
                <CountUp
                  value={figures.groups}
                  className="block font-display text-[2.25rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-cyan-300"
                />
                <span className="mt-1 block text-[0.8125rem] text-white/65">{t.figures.groups(figures.groups)}</span>
              </div>
            </Reveal>
          ) : null}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-line lg:mt-12">
          {/* En-têtes de colonnes, à partir de la tablette. */}
          <div
            aria-hidden="true"
            className="hidden grid-cols-[minmax(0,1.5fr)_7rem_minmax(0,1fr)_2.5rem] items-center gap-6 bg-background px-6 py-3 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-muted md:grid"
          >
            <span>{t.table.programme}</span>
            <span>{t.table.diploma}</span>
            <span>{t.table.capacity}</span>
            <span />
          </div>

          <RevealGroup as="ul" stagger={0.05} aria-label={t.table.caption} className="divide-y divide-line">
            {listed.map(({ formation, capacity }) => {
              const code = diplomaCode(formation);

              return (
                <RevealItem as="li" key={formation.id} y={8}>
                  <Link
                    href={routes.formation(formation.slug)}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-5 transition-colors duration-200 hover:bg-cyan-50/60 sm:px-6 md:grid-cols-[minmax(0,1.5fr)_7rem_minmax(0,1fr)_2.5rem] md:gap-6"
                  >
                    <span className="min-w-0">
                      <span className="block font-display text-[1rem] font-semibold leading-snug text-ink">{formation.title}</span>
                      {formation.level ? <span className="mt-0.5 block text-[0.8125rem] text-muted">{formation.level}</span> : null}
                    </span>

                    <span className="row-start-1 col-start-2 md:col-start-auto md:row-start-auto">
                      {code ? <DiplomaBadge code={code} title={formation.diploma} /> : <span className="text-muted">—</span>}
                    </span>

                    <span className="col-span-2 flex items-center gap-4 md:col-span-1">
                      <Seats groups={capacity.groups ?? 1} perGroup={capacity.per_group} code={code} />
                      <span className="text-[0.8125rem] leading-snug text-ink-soft">
                        <span className="font-semibold tabular-nums text-ink">{capacity.per_group}</span> {t.table.perGroupShort}
                        {capacity.groups ? (
                          <span className="block text-muted">
                            {capacity.groups} {t.figures.groups(capacity.groups)}
                          </span>
                        ) : null}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="hidden size-10 place-items-center rounded-full border border-line text-cyan-700 transition-[background-color,border-color,color] duration-200 group-hover:border-cyan-600 group-hover:bg-cyan-600 group-hover:text-white md:grid"
                    >
                      <ArrowUpRight strokeWidth={1.75} className="size-4" />
                    </span>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>

          {figures.places > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-line-strong bg-background px-5 py-4 sm:px-6">
              <span className="font-display font-semibold text-ink">{t.table.total}</span>
              <span className="text-[0.9375rem] text-ink-soft">
                <span className="font-semibold tabular-nums text-ink">{figures.groups}</span> {t.figures.groups(figures.groups)} ·{" "}
                <span className="font-semibold tabular-nums text-ink">{figures.places}</span> {t.figures.places}
              </span>
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-[0.8125rem] text-muted">{t.capacityNote}</p>
      </div>
    </section>
  );
}
