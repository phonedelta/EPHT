import type { Metadata } from "next";

import { DiplomaLevels } from "@/components/formations/DiplomaLevels";
import { FormationCatalog } from "@/components/formations/FormationCatalog";
import { OfferFigures } from "@/components/formations/OfferFigures";
import { Admissions } from "@/components/home/Admissions";
import { FinalCta } from "@/components/home/FinalCta";
import { Practice } from "@/components/home/Practice";
import { WhyChoose } from "@/components/home/WhyChoose";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/system/PageHero";
import { UnavailablePage } from "@/components/system/StatusPage";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import { dataOr, getFormations, getSiteSettings } from "@/lib/api/queries";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const home = dataOr(await getSiteSettings(), null)?.home;

  return pageMetadata({
    title: getDictionary().nav.formations,
    description: home?.formations.intro,
    path: routes.formations,
    image: home?.practice.image_tertiary,
  });
}

/** Catalogue des formations, filtrable par famille de métiers. */
export default async function FormationsPage() {
  const [settingsResult, formationsResult] = await Promise.all([getSiteSettings(), getFormations()]);

  if (!settingsResult.ok) {
    return <UnavailablePage />;
  }

  const t = getDictionary();
  const { home } = settingsResult.data;
  const formations = dataOr(formationsResult, []);

  return (
    <PageTransition>
      <PageHero
        eyebrow={t.pages.formations.eyebrow}
        title={home.formations.title ?? t.nav.formations}
        crumb={t.nav.formations}
        lead={home.formations.intro}
        path={routes.formations}
        image={home.practice.image_tertiary}
        actions={
          <ButtonLink href={routes.apply()} size="lg">
            {t.nav.apply}
          </ButtonLink>
        }
      >
        <OfferFigures formations={formations} className="mt-10" />
      </PageHero>

      <section aria-label={t.nav.formations} className="section-y bg-surface">
        <div className="container-page">
          <FormationCatalog formations={formations} />
        </div>
      </section>

      <DiplomaLevels formations={formations} sector={home.formations.sector} />
      <Practice content={home.practice} />
      <WhyChoose content={home.why} />
      <Admissions content={home.admissions} />
      <FinalCta content={home.cta} />
    </PageTransition>
  );
}
