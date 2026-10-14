import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";

import { PageIntro } from "./PageIntro";

/**
 * Page dont la route est prête mais le contenu pas encore réalisé. Elle
 * l'annonce sobrement plutôt que d'afficher un contenu inventé.
 */
export function Placeholder({ title }: { title: string }) {
  const t = getDictionary();

  return (
    <PageIntro eyebrow={t.placeholder.eyebrow} title={title} text={t.placeholder.text}>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={routes.home}>{t.common.backToHome}</ButtonLink>
        <ButtonLink href={routes.contact} variant="outline" arrow={false}>
          {t.placeholder.contact}
        </ButtonLink>
      </div>
    </PageIntro>
  );
}
