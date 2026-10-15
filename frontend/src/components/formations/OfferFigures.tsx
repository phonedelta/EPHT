import { Armchair, BookOpen, GraduationCap, UsersRound, type LucideIcon } from "lucide-react";

import { CountUp } from "@/components/motion/CountUp";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import type { Formation } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { offerFigures } from "@/lib/formations";

type OfferFiguresProps = {
  formations: Formation[];
  /** Sur fond cyan : panneau blanc plein plutôt que translucide. */
  tinted?: boolean;
  className?: string;
};

type Figure = { icon: LucideIcon; value: number; label: string; accent?: boolean };

/**
 * Chiffres clés de l'offre de formation, calculés sur les formations publiées :
 * aucun chiffre n'est écrit dans le code. Le total des places est mis en avant.
 */
export function OfferFigures({ formations, tinted = false, className }: OfferFiguresProps) {
  const t = getDictionary().pages.formations.figures;
  const figures = offerFigures(formations);

  if (figures.programmes === 0) {
    return null;
  }

  const items: Figure[] = [
    { icon: BookOpen, value: figures.programmes, label: t.programmes(figures.programmes) },
    ...(figures.levels > 0 ? [{ icon: GraduationCap, value: figures.levels, label: t.levels(figures.levels) }] : []),
    ...(figures.groups > 0 ? [{ icon: UsersRound, value: figures.groups, label: t.groups(figures.groups) }] : []),
    ...(figures.places > 0 ? [{ icon: Armchair, value: figures.places, label: t.places, accent: true }] : []),
  ];

  return (
    <div className={className}>
      <RevealGroup
        as="ul"
        aria-label={t.label}
        stagger={0.07}
        className={cn(
          "grid grid-cols-2 gap-2 rounded-2xl border p-2",
          items.length >= 4 ? "sm:grid-cols-4" : items.length === 3 ? "sm:grid-cols-3" : "",
          tinted ? "border-cyan-200 bg-surface" : "border-line bg-surface/80 backdrop-blur-sm",
        )}
      >
        {items.map(({ icon: Icon, value, label, accent }) => (
          <RevealItem
            as="li"
            key={label}
            y={8}
            className={cn(
              "flex flex-col justify-between gap-4 rounded-xl p-4",
              accent ? "on-dark bg-ink text-white" : "bg-background",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "grid size-9 place-items-center rounded-lg",
                accent ? "bg-white/10 text-cyan-300" : "bg-cyan-100 text-cyan-700",
              )}
            >
              <Icon strokeWidth={1.75} className="size-[1.125rem]" />
            </span>
            <span>
              <CountUp
                value={value}
                className={cn(
                  "block font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] tabular-nums",
                  accent ? "text-white" : "text-ink",
                )}
              />
              <span
                className={cn("mt-1.5 block min-h-[2.5em] text-[0.8125rem] leading-[1.25]", accent ? "text-white/70" : "text-muted")}
              >
                {label}
              </span>
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
      {figures.perGroup ? (
        <p className="mt-3 flex items-center gap-2 text-[0.8125rem] text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-cyan-500" />
          {t.perGroup(figures.perGroup)}
        </p>
      ) : null}
    </div>
  );
}
