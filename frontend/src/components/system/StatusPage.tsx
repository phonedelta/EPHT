import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";

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
      <div className="container-page flex min-h-[60svh] flex-col justify-center py-16 md:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-display mt-5 max-w-[20ch] text-ink">{title}</h1>
        <p className="text-lead mt-5 max-w-[34rem] text-muted">{text}</p>
        {children ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div> : null}
      </div>
    </section>
  );
}

/** L'API ne répond pas : la page l'annonce plutôt que d'afficher un contenu partiel. */
export function UnavailablePage() {
  const t = getDictionary().errors;

  return <StatusPage eyebrow="503" title={t.unavailableTitle} text={t.unavailableText} />;
}
