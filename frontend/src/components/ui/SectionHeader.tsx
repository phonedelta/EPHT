import type { ReactNode } from "react";

import { AnimatedText } from "@/components/motion/AnimatedText";
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
  /** Sur fond cyan : le texte d'introduction passe au gris foncé (contraste AA). */
  tinted?: boolean;
  className?: string;
  children?: ReactNode;
};

/** Surtitre en capitales espacées. */
export function Eyebrow({ children, light = false, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return <p className={cn("eyebrow", light ? "text-cyan-300" : "text-cyan-700", className)}>{children}</p>;
}

/** Surtitre, titre de section et texte d'introduction facultatif. */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  id,
  light = false,
  tinted = false,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <Reveal className={className}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      {title ? <AnimatedText as="h2" id={id} text={title} className={cn("text-title mt-4", light && "text-white")} /> : null}
      {intro ? (
        <p className={cn("text-lead mt-4 max-w-[36rem]", light ? "text-white/70" : tinted ? "text-ink-soft" : "text-muted")}>
          {intro}
        </p>
      ) : null}
      {children}
    </Reveal>
  );
}
