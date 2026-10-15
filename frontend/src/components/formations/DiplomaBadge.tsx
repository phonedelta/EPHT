import { cn } from "@/lib/cn";

/*
 * Teinte de chaque niveau de diplôme, du plus clair au plus soutenu : la
 * progression DQ → DT → DTS se lit aussi à la couleur, partout sur le site.
 */
const TONES: Record<string, string> = {
  DQ: "bg-cyan-100 text-cyan-800 ring-cyan-200",
  DT: "bg-cyan-600 text-white ring-cyan-600",
  DTS: "bg-ink text-white ring-ink",
};

const SIZES = {
  sm: "h-6 px-2 text-[0.6875rem]",
  md: "h-7 px-2.5 text-xs",
  lg: "h-9 px-3.5 text-sm",
} as const;

type DiplomaBadgeProps = {
  code: string;
  /** Intitulé complet du diplôme, annoncé aux lecteurs d'écran et affiché au survol. */
  title?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
};

/** Sigle du diplôme (DQ, DT, DTS) dans sa teinte de niveau. */
export function DiplomaBadge({ code, title, size = "md", className }: DiplomaBadgeProps) {
  return (
    <span
      title={title ?? undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md font-display font-semibold tracking-[0.08em] ring-1 ring-inset",
        TONES[code] ?? "bg-surface text-ink ring-line-strong",
        SIZES[size],
        className,
      )}
    >
      {code}
      {title ? <span className="sr-only"> — {title}</span> : null}
    </span>
  );
}

/** Couleur de remplissage d'une jauge, accordée au niveau. */
export function levelFill(code: string | null): string {
  return code === "DTS" ? "bg-ink" : code === "DQ" ? "bg-cyan-400" : "bg-cyan-600";
}
