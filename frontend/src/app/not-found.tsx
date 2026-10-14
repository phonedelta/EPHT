import type { Metadata } from "next";

import { SiteFrame } from "@/components/layout/SiteFrame";
import { StatusPage } from "@/components/system/StatusPage";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: getDictionary().errors.notFoundTitle,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const t = getDictionary();

  return (
    <SiteFrame>
      <StatusPage eyebrow="404" title={t.errors.notFoundTitle} text={t.errors.notFoundText}>
        <ButtonLink href={routes.home}>{t.common.backToHome}</ButtonLink>
        <ButtonLink href={routes.formations} variant="outline" arrow={false}>
          {t.nav.formations}
        </ButtonLink>
      </StatusPage>
    </SiteFrame>
  );
}
