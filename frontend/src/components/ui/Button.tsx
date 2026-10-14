import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const VARIANTS = {
  // Action principale : le turquoise profond, texte blanc (contraste 4,6:1).
  primary: "bg-cyan-600 text-white hover:bg-cyan-700",
  // Action principale sur fond turquoise ou clair, quand le turquoise ne ressortirait pas.
  ink: "bg-ink text-white hover:bg-cyan-800",
  // Action secondaire sur fond clair : filet turquoise.
  outline: "border-[1.5px] border-cyan-600 bg-surface text-ink hover:bg-cyan-50",
  // Action secondaire sur fond turquoise : filet plus marqué.
  "outline-strong": "border border-ink/35 text-ink hover:border-ink hover:bg-ink/[0.04]",
  // Action secondaire sur fond sombre ou photographique.
  "outline-light": "border border-white/30 text-white hover:border-white/70 hover:bg-white/[0.06]",
} as const;

const SIZES = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[2.875rem] px-6 text-[0.9375rem]",
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

/** Classes communes aux boutons, liens comme boutons natifs. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  spread = false,
}: Pick<ButtonLinkProps, "variant" | "size" | "spread"> = {}): string {
  return cn(
    "group/button inline-flex items-center gap-2.5 rounded-md font-medium tracking-[0.005em] transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out-soft hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
    spread ? "justify-between" : "justify-center",
    VARIANTS[variant],
    SIZES[size],
  );
}

/** Lien présenté comme un bouton. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = true,
  spread = false,
  className,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(buttonClasses({ variant, size, spread }), className)}>
      <span>{children}</span>
      {arrow ? (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.75}
          className="size-4 shrink-0 transition-transform duration-200 ease-out-soft group-hover/button:translate-x-0.5"
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
        "group/link inline-flex items-center gap-2 text-[0.9375rem] font-medium",
        light ? "text-white" : "text-ink",
        className,
      )}
    >
      <span className="link-underline pb-0.5 group-hover/link:bg-[length:100%_1px]">{children}</span>
      <ArrowRight
        aria-hidden="true"
        strokeWidth={1.75}
        className={cn(
          "size-4 shrink-0 transition-transform duration-200 ease-out-soft group-hover/link:translate-x-1",
          light ? "text-cyan-300" : "text-cyan-700",
        )}
      />
    </Link>
  );
}
