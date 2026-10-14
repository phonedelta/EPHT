import type { Metadata } from "next";

import { FinalCta } from "@/components/home/FinalCta";
import { Practice } from "@/components/home/Practice";
import { WhyChoose } from "@/components/home/WhyChoose";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SpacesGrid } from "@/components/school/SpacesGrid";
import { PageHero } from "@/components/system/PageHero";
import { UnavailablePage } from "@/components/system/StatusPage";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import { dataOr, getGalleries, getSiteSettings } from "@/lib/api/queries";
import { ordinal } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const about = dataOr(await getSiteSettings(), null)?.home.about;

  return pageMetadata({
    title: getDictionary().nav.school,
    description: about?.lead,
    path: routes.school,
    image: about?.image,
  });
}

/** L'école : son projet, sa pédagogie, ses engagements et ses espaces. */
export default async function SchoolPage() {
  const [settingsResult, spacesResult] = await Promise.all([getSiteSettings(), getGalleries("infrastructure")]);

  if (!settingsResult.ok) {
    return <UnavailablePage />;
  }

  const t = getDictionary();
  const { home } = settingsResult.data;
  const { about } = home;
  const spaces = dataOr(spacesResult, []);

  return (
    <PageTransition>
      <PageHero
        eyebrow={t.nav.school}
        title={about.title ?? t.nav.school}
        crumb={t.nav.school}
        lead={about.lead}
        path={routes.school}
        image={about.image}
        secondaryImage={home.practice.image_secondary}
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

      {about.body.length > 0 || about.pillars.length > 0 ? (
        <section aria-labelledby="project-title" className="section-y bg-surface">
          <div className="container-page grid gap-y-10 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-5">
              <Reveal y={10}>
                <p className="eyebrow text-cyan-700">{t.nav.school}</p>
              </Reveal>
              <AnimatedText as="h2" id="project-title" text={t.pages.school.projectEyebrow} className="text-title mt-4" />
              <Reveal delay={0.1} className="mt-5 grid gap-4 text-[0.9375rem] leading-[1.75] text-muted">
                {about.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Reveal>
            </div>

            {about.pillars.length > 0 ? (
              <RevealGroup as="ol" className="grid gap-4 lg:col-span-7" stagger={0.08}>
                {about.pillars.map((pillar, index) => (
                  <RevealItem
                    as="li"
                    key={pillar.title}
                    className="group flex gap-5 rounded-xl border border-line bg-background p-6 transition-[border-color,box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_20px_40px_-30px_rgb(23_38_44_/_0.45)] sm:p-7"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-full bg-cyan-100 font-display text-sm font-semibold text-cyan-700 transition-colors duration-300 group-hover:bg-cyan-600 group-hover:text-white"
                    >
                      {ordinal(index)}
                    </span>
                    <div>
                      <h3 className="text-subtitle">{pillar.title}</h3>
                      {pillar.text ? <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{pillar.text}</p> : null}
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            ) : null}
          </div>
        </section>
      ) : null}

      <Practice content={home.practice} />
      <WhyChoose content={home.why} />

      {spaces.length > 0 ? (
        <section aria-labelledby="spaces-title" className="section-y bg-background">
          <div className="container-page">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeader
                id="spaces-title"
                eyebrow={t.pages.school.spacesEyebrow}
                title={home.infrastructures.title}
                intro={home.infrastructures.intro}
                className="max-w-[40rem]"
              />
              <Reveal delay={0.08} className="shrink-0">
                <ArrowLink href={routes.infrastructures}>{t.pages.school.spacesCta}</ArrowLink>
              </Reveal>
            </div>
            <div className="mt-10 lg:mt-12">
              <SpacesGrid spaces={spaces} />
            </div>
          </div>
        </section>
      ) : null}

      <FinalCta content={home.cta} />
    </PageTransition>
  );
}
