"use client";

import { motion } from "motion/react";
import { useId } from "react";

import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";

import { DiplomaBadge } from "./DiplomaBadge";

export type DiplomaOption = { level: string; code: string | null; count: number };

type DiplomaSwitchProps = {
  options: DiplomaOption[];
  value: string | null;
  onChange: (level: string | null) => void;
  /** Nombre de formations sans filtre de diplôme. */
  total: number;
};

/**
 * Choix du niveau de diplôme : un sélecteur segmenté, chaque segment portant
 * le badge de son niveau. Le fond du segment actif glisse de l'un à l'autre.
 */
export function DiplomaSwitch({ options, value, onChange, total }: DiplomaSwitchProps) {
  const t = getDictionary().pages;
  const group = useId();
  const segments = [{ level: null, code: null, count: total }, ...options];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[0.8125rem] font-medium text-muted">{t.formations.levelLabel}</span>
      <div
        role="group"
        aria-label={t.formations.levelFilterLabel}
        className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-line bg-background p-1"
      >
        {segments.map((segment) => {
          const active = segment.level === value;

          return (
            <button
              key={segment.level ?? "*"}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(segment.level)}
              title={segment.level ?? undefined}
              className={cn(
                "relative inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors duration-200",
                active ? "text-ink" : "text-ink-soft hover:text-ink",
              )}
            >
              {active ? (
                <motion.span
                  aria-hidden="true"
                  layoutId={`${group}-active`}
                  className="absolute inset-0 rounded-lg bg-surface shadow-[0_1px_3px_rgb(23_38_44/0.12)] ring-1 ring-line"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              ) : null}
              {segment.code ? (
                <DiplomaBadge code={segment.code} size="sm" className="relative" />
              ) : (
                <span className="relative">{t.filters.all}</span>
              )}
              {segment.level ? <span className="relative hidden sm:inline">{segment.level}</span> : null}
              <span className="relative text-xs tabular-nums text-muted">{segment.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
