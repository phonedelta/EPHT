import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { TitledText } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { ordinal } from "@/lib/format";

const COLUMNS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

type StepsTimelineProps = {
  steps: TitledText[];
  /** Nom de la liste, annoncé aux lecteurs d'écran. */
  label: string;
  className?: string;
};

/**
 * Étapes numérotées : une frise horizontale sur grand écran, verticale sur
 * mobile. Un trait fin relie chaque étape à la suivante.
 */
export function StepsTimeline({ steps, label, className }: StepsTimelineProps) {
  return (
    <RevealGroup
      as="ol"
      stagger={0.1}
      aria-label={label}
      className={cn("grid lg:gap-8", COLUMNS[steps.length] ?? "lg:grid-cols-4", className)}
    >
      {steps.map((step, index) => {
        const last = index === steps.length - 1;

        return (
          <RevealItem as="li" key={step.title} className="relative pb-8 pl-14 last:pb-0 lg:pb-0 lg:pl-0">
            {last ? null : (
              // Trait vers l'étape suivante : vertical sur mobile, horizontal sur grand écran.
              <span
                aria-hidden="true"
                className="absolute bottom-2 left-5 top-12 w-px bg-cyan-300 lg:bottom-auto lg:left-[3.25rem] lg:right-[-1.25rem] lg:top-5 lg:h-px lg:w-auto"
              />
            )}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border border-cyan-500 bg-surface font-display text-sm font-semibold text-cyan-700 lg:static"
            >
              {ordinal(index)}
            </span>
            <h3 className="pt-2 font-display text-base font-semibold text-ink lg:mt-5 lg:pt-0">{step.title}</h3>
            {step.text ? <p className="mt-1.5 max-w-[22rem] text-sm leading-relaxed text-ink-soft">{step.text}</p> : null}
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
