import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow: string;
  title: string | null;
  intro?: string | null;
  /** Identifiant du titre, référencé par l'aria-labelledby de la section. */
  id?: string;
  /** Sur fond sombre. */
  light?: boolean;
  className?: string;
  children?: ReactNode;
};

/** Surtitre, titre de section et texte d'introduction facultatif. */
export function SectionHeader({ eyebrow, title, intro, id, light = false, className, children }: SectionHeaderProps) {
  return (
    <Reveal className={className}>
      <p className={cn("eyebrow flex items-center gap-3", light ? "text-cyan-300" : "text-cyan-700")}>
        <span aria-hidden="true" className={cn("h-px w-8", light ? "bg-cyan-300/70" : "bg-cyan-500")} />
        {eyebrow}
      </p>
      {title ? (
        <h2 id={id} className={cn("text-title mt-5", light && "text-white")}>
          {title}
        </h2>
      ) : null}
      {intro ? (
        <p className={cn("text-lead mt-5 max-w-[34rem]", light ? "text-white/75" : "text-ink-soft")}>{intro}</p>
      ) : null}
      {children}
    </Reveal>
  );
}
