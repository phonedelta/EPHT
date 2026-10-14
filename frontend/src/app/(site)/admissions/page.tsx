import type { Metadata } from "next";

import { FormationGrid } from "@/components/home/FormationGrid";
import { StepsTimeline } from "@/components/home/StepsTimeline";
import { PageTransition } from "@/components/motion/PageTransition";
import { ContactPanel } from "@/components/system/ContactPanel";
import { PageHero } from "@/components/system/PageHero";
import { UnavailablePage } from "@/components/system/StatusPage";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import { dataOr, getFormations, getSiteSettings } from "@/lib/api/queries";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const home = dataOr(await getSiteSettings(), null)?.home;

  return pageMetadata({
    title: getDictionary().nav.admissions,
    description: home?.admissions.intro,
    path: routes.admissions,
    image: home?.practice.image,
  });
}

/** Admissions : les étapes de l'inscription, le choix de la formation, le contact. */
export default async function AdmissionsPage() {
  const [settingsResult, formationsResult] = await Promise.all([getSiteSettings(), getFormations()]);

  if (!settingsResult.ok) {
    return <UnavailablePage />;
  }

  const t = getDictionary();
  const { home, contact } = settingsResult.data;
  const formations = dataOr(formationsResult, []);

  return (
    <PageTransition>
      <PageHero
        eyebrow={t.nav.admissions}
        title={home.admissions.title ?? t.nav.admissions}
        crumb={t.nav.admissions}
        lead={home.admissions.intro}
        path={routes.admissions}
        image={home.practice.image}
        secondaryImage={home.hero.secondary_image}
        actions={
          <>
            <ButtonLink href={routes.formations} size="lg">
              {t.home.hero.primaryCta}
            </ButtonLink>
            <ButtonLink href={routes.contact} variant="outline" size="lg" arrow={false}>
              {t.home.cta.secondary}
            </ButtonLink>
          </>
        }
      />

      {home.admissions.steps.length > 0 ? (
        <section aria-labelledby="steps-title" className="section-y bg-surface">
          <div className="container-page">
            <SectionHeader id="steps-title" eyebrow={t.pages.admissions.stepsEyebrow} title={t.pages.admissions.stepsTitle} />
            <StepsTimeline steps={home.admissions.steps} label={t.home.admissions.stepsLabel} className="mt-12 lg:mt-14" />
          </div>
        </section>
      ) : null}

      {formations.length > 0 ? (
        <section aria-labelledby="choose-title" className="section-y bg-cyan-100">
          <div className="container-page">
            <SectionHeader
              id="choose-title"
              eyebrow={t.pages.admissions.chooseEyebrow}
              title={t.pages.admissions.chooseTitle}
              intro={home.formations.intro}
              tinted
              className="max-w-[40rem]"
            />
            <FormationGrid formations={formations} className="mt-10 lg:mt-12" />
          </div>
        </section>
      ) : null}

      <section className="section-y bg-surface">
        <div className="container-page">
          <ContactPanel
            eyebrow={t.pages.admissions.onlineEyebrow}
            title={t.pages.admissions.onlineTitle}
            text={t.pages.admissions.onlineText}
            contact={contact}
          />
        </div>
      </section>
    </PageTransition>
  );
}
