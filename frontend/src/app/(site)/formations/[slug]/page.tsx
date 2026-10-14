import { CalendarClock, GraduationCap, Layers, ScrollText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FormationFaq, FormationSections, formationSections } from "@/components/formations/FormationDetails";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { FinalCta } from "@/components/home/FinalCta";
import { FormationGrid } from "@/components/home/FormationGrid";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { ContactPanel } from "@/components/system/ContactPanel";
import { PageHero } from "@/components/system/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import { dataOr, getFormation, getFormations, getSiteSettings } from "@/lib/api/queries";
import { siteSettingsSchema } from "@/lib/api/schemas";
import { paragraphsOf } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// La page est produite en entier avant d'être envoyée : une adresse inconnue
// reçoit ainsi un vrai statut 404, et non un squelette suivi d'une erreur.
export const ensureStatic = "navigation";

// Valeur de repli quand aucune formation n'est connue au moment du build :
// Next.js exige au moins un paramètre pour valider la route.
const PLACEHOLDER = "__aucune-formation__";

export async function generateStaticParams() {
  const formations = dataOr(await getFormations(), []);

  return formations.length > 0 ? formations.map(({ slug }) => ({ slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/formations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getFormation(slug);

  if (!result.ok) {
    return {};
  }

  return pageMetadata({
    title: result.data.seo.title ?? result.data.title,
    description: result.data.seo.description ?? result.data.summary,
    path: routes.formation(slug),
    image: result.data.cover,
  });
}

/**
 * Fiche d'une formation. Chaque rubrique (présentation, objectifs, programme,
 * conditions d'accès, débouchés, documents, questions fréquentes, galerie)
 * n'apparaît que si l'école l'a renseignée : rien n'est rédigé à sa place.
 */
export default async function FormationPage({ params }: PageProps<"/formations/[slug]">) {
  const { slug } = await params;
  const result = slug === PLACEHOLDER ? null : await getFormation(slug);

  if (!result?.ok) {
    notFound();
  }

  const t = getDictionary();
  const formation = result.data;
  const [settingsResult, formationsResult] = await Promise.all([getSiteSettings(), getFormations()]);
  const settings = dataOr(settingsResult, siteSettingsSchema.parse({}));
  const allFormations = dataOr(formationsResult, []);
  const others = allFormations.filter((other) => other.id !== formation.id);

  const description = paragraphsOf(formation.description);
  const sections = formationSections(formation);
  const gallery = (formation.gallery?.media ?? [])
    .filter((media) => media.url !== null)
    .map((media) => ({ media, title: formation.title, category: null }));
  const duration = formation.duration?.label ?? (formation.duration?.months ? `${formation.duration.months} mois` : null);

  // Repères de la formation : seuls ceux que l'école a confirmés sont affichés.
  const facts = [
    formation.category ? { icon: Layers, label: t.pages.formation.facts.family, value: formation.category.name } : null,
    formation.level ? { icon: GraduationCap, label: t.pages.formation.facts.level, value: formation.level } : null,
    formation.diploma ? { icon: ScrollText, label: t.pages.formation.facts.diploma, value: formation.diploma } : null,
    duration ? { icon: CalendarClock, label: t.pages.formation.facts.duration, value: duration } : null,
  ].filter((fact) => fact !== null);

  return (
    <PageTransition>
      <PageHero
        eyebrow={formation.category?.name ?? t.nav.formations}
        title={formation.title}
        lead={formation.summary}
        parents={[{ label: t.nav.formations, href: routes.formations }]}
        path={routes.formation(formation.slug)}
        image={formation.cover}
        secondaryImage={gallery.find((item) => item.media.id !== formation.cover?.id)?.media ?? null}
        actions={
          <>
            <ButtonLink href={routes.admissions} size="lg">
              {t.nav.apply}
            </ButtonLink>
            <ButtonLink href={routes.formations} variant="outline" size="lg" arrow={false}>
              {t.nav.allFormations}
            </ButtonLink>
          </>
        }
      >
        {facts.length > 0 ? (
          <dl className="mt-9 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-3">
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-cyan-100">
                  <fact.icon strokeWidth={1.5} className="size-5 text-cyan-700" />
                </span>
                <div className="leading-snug">
                  <dt className="text-[0.8125rem] text-muted">{fact.label}</dt>
                  <dd className="text-[0.9375rem] font-medium text-ink">{fact.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        ) : null}
      </PageHero>

      {description.length > 0 ? (
        <section aria-labelledby="overview-title" className="section-y bg-surface">
          <div className="container-page grid gap-y-6 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-4">
              <Reveal y={10}>
                <p className="eyebrow text-cyan-700">{t.pages.formation.overviewEyebrow}</p>
              </Reveal>
              <AnimatedText as="h2" id="overview-title" text={formation.title} className="text-title mt-4" />
            </div>
            <Reveal delay={0.06} className="grid gap-4 text-[1.0625rem] leading-[1.75] text-ink-soft lg:col-span-7 lg:col-start-6">
              {description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {sections.length > 0 ? (
        <section aria-label={formation.title} className="section-y bg-background">
          <div className="container-page">
            <FormationSections sections={sections} />
          </div>
        </section>
      ) : null}

      {description.length === 0 && sections.length === 0 ? (
        <section className="section-y bg-surface">
          <div className="container-page">
            <ContactPanel
              eyebrow={t.pages.formation.overviewEyebrow}
              title={t.pages.formation.pendingTitle}
              text={t.pages.formation.pending}
              contact={settings.contact}
            />
          </div>
        </section>
      ) : null}

      {formation.faq.length > 0 ? (
        <section aria-labelledby="faq-title" className="section-y bg-surface">
          <div className="container-page grid gap-y-8 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-4">
              <AnimatedText as="h2" id="faq-title" text={t.pages.formation.faqEyebrow} className="text-title" />
            </div>
            <div className="lg:col-span-8">
              <FormationFaq faq={formation.faq} />
            </div>
          </div>
        </section>
      ) : null}

      {gallery.length > 0 ? (
        <section aria-labelledby="gallery-title" className="section-y bg-background">
          <div className="container-page">
            <SectionHeader
              id="gallery-title"
              eyebrow={t.pages.formation.galleryEyebrow}
              title={formation.gallery?.title ?? formation.title}
              className="mb-10"
            />
            <PhotoGallery items={gallery} filterLabel={t.pages.filters.label} />
          </div>
        </section>
      ) : null}

      {others.length > 0 ? (
        <section aria-labelledby="others-title" className="section-y bg-cyan-100">
          <div className="container-page">
            <SectionHeader
              id="others-title"
              eyebrow={t.pages.formation.othersEyebrow}
              title={t.pages.formation.othersTitle}
              tinted
            />
            <FormationGrid
              formations={others}
              positionOf={(other) => allFormations.indexOf(other)}
              className="mt-10 lg:mt-12"
            />
          </div>
        </section>
      ) : null}

      <FinalCta content={settings.home.cta} />
    </PageTransition>
  );
}
