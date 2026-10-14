"use client";

import { useEffect } from "react";

import { StatusPage } from "@/components/system/StatusPage";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Erreur inattendue dans une page publique : l'en-tête et le pied de page restent affichés. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = getDictionary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage eyebrow="Erreur" title={t.errors.errorTitle} text={t.errors.errorText}>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-14 items-center justify-center rounded-[2px] bg-cyan-400 px-7 font-semibold text-ink transition-colors duration-300 hover:bg-cyan-300"
      >
        {t.errors.retry}
      </button>
      <ButtonLink href={routes.home} variant="outline" arrow={false}>
        {t.common.backToHome}
      </ButtonLink>
    </StatusPage>
  );
}
