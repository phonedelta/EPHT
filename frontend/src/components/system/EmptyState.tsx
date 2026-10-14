import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
};

/** Message sobre à la place d'une liste encore vide. */
export function EmptyState({ icon: Icon, children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-xl border border-dashed border-line-strong bg-surface/70 p-6 sm:flex-row sm:items-center sm:p-8",
        className,
      )}
    >
      <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-cyan-100">
        <Icon strokeWidth={1.5} className="size-5 text-cyan-700" />
      </span>
      <p className="max-w-[40rem] text-[0.9375rem] leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}
