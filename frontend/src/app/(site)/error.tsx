"use client";

import { useEffect } from "react";

import { StatusPage } from "@/components/system/StatusPage";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
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
        className={buttonClasses()}
      >
        {t.errors.retry}
      </button>
      <ButtonLink href={routes.home} variant="outline" arrow={false}>
        {t.common.backToHome}
      </ButtonLink>
    </StatusPage>
  );
}
