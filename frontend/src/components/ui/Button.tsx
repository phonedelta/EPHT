import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const VARIANTS = {
  // Action principale : le cyan du logo, texte sombre.
  primary: "bg-cyan-400 text-ink hover:bg-cyan-300",
  // Action principale sur fond cyan ou clair, quand le cyan ne ressortirait pas.
  ink: "bg-ink text-white hover:bg-cyan-900",
  // Action secondaire sur fond clair.
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white",
  // Action secondaire sur fond cyan : filet plus marqué.
  "outline-strong": "border border-ink/45 text-ink hover:border-ink hover:bg-ink hover:text-white",
  // Action secondaire sur fond sombre ou photographique.
  "outline-light": "border border-white/40 text-white hover:border-white hover:bg-white hover:text-ink",
} as const;

const SIZES = {
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-7 text-base",
} as const;

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  /** Affiche la flèche, qui glisse vers la droite au survol. */
  arrow?: boolean;
  /** Texte à gauche et flèche à droite, pour un bouton en pleine largeur. */
  spread?: boolean;
  className?: string;
};

/** Lien présenté comme un bouton. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "lg",
  arrow = true,
  spread = false,
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group/button inline-flex items-center gap-3 rounded-[2px] font-semibold tracking-[0.005em] transition-colors duration-300",
        spread ? "justify-between" : "justify-center",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      <span>{children}</span>
      {arrow ? (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.75}
          className="size-[1.125rem] shrink-0 transition-transform duration-500 ease-out-expo group-hover/button:translate-x-1"
        />
      ) : null}
    </Link>
  );
}

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Sur fond sombre. */
  light?: boolean;
};

/** Lien de texte suivi d'une flèche, pour les actions secondaires. */
export function ArrowLink({ href, children, className, light = false }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-3 text-[0.9375rem] font-semibold",
        light ? "text-white" : "text-ink",
        className,
      )}
    >
      <span className="link-underline pb-1 group-hover/link:bg-[length:100%_1px]">{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "grid size-9 place-items-center rounded-full border transition-colors duration-300",
          light
            ? "border-white/35 group-hover/link:border-cyan-300 group-hover/link:bg-cyan-300 group-hover/link:text-ink"
            : "border-ink/20 group-hover/link:border-cyan-400 group-hover/link:bg-cyan-400",
        )}
      >
        <ArrowRight
          strokeWidth={1.75}
          className="size-4 transition-transform duration-500 ease-out-expo group-hover/link:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
