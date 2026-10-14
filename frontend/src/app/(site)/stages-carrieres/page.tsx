import type { Metadata } from "next";

import { JobOfferList } from "@/components/careers/JobOfferList";
import { PartnerGrid } from "@/components/careers/PartnerGrid";
import { FinalCta } from "@/components/home/FinalCta";
import { Practice } from "@/components/home/Practice";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/system/PageHero";
import { UnavailablePage } from "@/components/system/StatusPage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import { dataOr, getJobOffers, getPartners, getSiteSettings } from "@/lib/api/queries";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary();

  return pageMetadata({
    title: t.nav.careers,
    description: t.pages.careers.lead,
    path: routes.careers,
    image: dataOr(await getSiteSettings(), null)?.home.hero.image,
  });
}

/** Offres de stage et d'emploi, partenaires de l'école. */
export default async function CareersPage() {
  const [settingsResult, offersResult, partnersResult] = await Promise.all([
    getSiteSettings(),
    getJobOffers(),
    getPartners(),
  ]);

  if (!settingsResult.ok) {
    return <UnavailablePage />;
  }

  const t = getDictionary();
  const { home } = settingsResult.data;
  const partners = dataOr(partnersResult, []);

  return (
    <PageTransition>
      <PageHero
        eyebrow={t.pages.careers.eyebrow}
        title={t.pages.careers.title}
        crumb={t.nav.careers}
        lead={t.pages.careers.lead}
        path={routes.careers}
        image={home.hero.image}
      />

      <section aria-labelledby="offers-title" className="section-y bg-surface">
        <div className="container-page">
          <SectionHeader id="offers-title" eyebrow={t.pages.careers.offersEyebrow} title={t.pages.careers.offersTitle} className="mb-10" />
          <JobOfferList offers={dataOr(offersResult, [])} />
        </div>
      </section>

      <Practice content={home.practice} />

      {partners.length > 0 ? (
        <section aria-labelledby="partners-title" className="section-y bg-background">
          <div className="container-page">
            <SectionHeader
              id="partners-title"
              eyebrow={t.pages.careers.partnersEyebrow}
              title={t.pages.careers.partnersTitle}
              className="mb-10"
            />
            <PartnerGrid partners={partners} />
          </div>
        </section>
      ) : null}

      <FinalCta content={home.cta} />
    </PageTransition>
  );
}
