import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";

import { PageHero } from "./PageHero";

/**
 * Page dont la route est prête mais le contenu pas encore fourni par l'école.
 * Elle l'annonce sobrement plutôt que d'afficher un contenu inventé.
 */
export function Placeholder({ title, path }: { title: string; path: string }) {
  const t = getDictionary();

  return (
    <PageHero
      eyebrow={t.placeholder.eyebrow}
      title={title}
      lead={t.placeholder.text}
      path={path}
      actions={
        <>
          <ButtonLink href={routes.home} size="lg">
            {t.common.backToHome}
          </ButtonLink>
          <ButtonLink href={routes.contact} variant="outline" size="lg" arrow={false}>
            {t.placeholder.contact}
          </ButtonLink>
        </>
      }
    />
  );
}
