import type { ReactNode } from "react";

type StatusPageProps = {
  /** Repère discret : code d'erreur ou surtitre. */
  eyebrow: string;
  title: string;
  text: string;
  children?: ReactNode;
};

/** Écran d'état : page introuvable, erreur, service indisponible. */
export function StatusPage({ eyebrow, title, text, children }: StatusPageProps) {
  return (
    <section className="bg-background">
      <div className="container-page flex min-h-[60svh] flex-col justify-center py-20 md:py-28">
        <p className="eyebrow flex items-center gap-3 text-cyan-700">
          <span aria-hidden="true" className="h-px w-8 bg-cyan-500" />
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-[20ch] font-display text-[clamp(2.25rem,1.4rem+3.4vw,3.75rem)] leading-[1.06] text-ink">
          {title}
        </h1>
        <p className="text-lead mt-6 max-w-[34rem] text-ink-soft">{text}</p>
        {children ? <div className="mt-9 flex flex-col gap-3 sm:flex-row">{children}</div> : null}
      </div>
    </section>
  );
}
