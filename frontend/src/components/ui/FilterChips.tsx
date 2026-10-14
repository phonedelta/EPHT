"use client";

import { motion } from "motion/react";
import { useId } from "react";

import { cn } from "@/lib/cn";

export type FilterOption = {
  /** `null` : l'option « Tout ». */
  value: string | null;
  label: string;
  count?: number;
};

type FilterChipsProps = {
  /** Nom du groupe, annoncé aux lecteurs d'écran. */
  label: string;
  options: FilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
};

/** Rangée de filtres en pastilles ; le fond de la pastille active glisse de l'une à l'autre. */
export function FilterChips({ label, options, value, onChange, className }: FilterChipsProps) {
  const group = useId();

  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value ?? "*"}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200",
              active
                ? "border-ink text-white"
                : "border-line-strong bg-surface text-ink-soft hover:border-cyan-600 hover:text-ink",
            )}
          >
            {active ? (
              <motion.span
                aria-hidden="true"
                layoutId={`${group}-active`}
                className="absolute -inset-px rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            ) : null}
            <span className="relative">{option.label}</span>
            {option.count !== undefined ? (
              <span
                className={cn(
                  "relative rounded-full px-1.5 text-xs leading-5 tabular-nums",
                  active ? "bg-white/15 text-white" : "bg-cyan-50 text-cyan-700",
                )}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
