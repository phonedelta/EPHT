import type { Metadata } from "next";

import { EventList } from "@/components/events/EventList";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { FinalCta } from "@/components/home/FinalCta";
import { News } from "@/components/home/News";
import { Practice } from "@/components/home/Practice";
import { pickGalleryItems } from "@/components/home/StudentLife";
import { Testimonials } from "@/components/home/Testimonials";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/system/PageHero";
import { UnavailablePage } from "@/components/system/StatusPage";
import { YearMoments } from "@/components/student-life/YearMoments";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import { dataOr, getEvents, getGalleries, getLatestArticles, getSiteSettings, getTestimonials } from "@/lib/api/queries";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// Toutes les photos de la rubrique, sans la limite de l'aperçu de l'accueil.
const ALL_ITEMS = 120;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, galleries] = await Promise.all([getSiteSettings(), getGalleries("student_life")]);

  return pageMetadata({
    title: getDictionary().nav.studentLife,
    description: dataOr(settings, null)?.home.student_life.intro,
    path: routes.studentLife,
    image: pickGalleryItems(dataOr(galleries, []), 1)[0]?.media ?? null,
  });
}

/** La vie à l'école : galerie, événements et témoignages. */
export default async function StudentLifePage() {
  const [settingsResult, galleriesResult, upcomingResult, pastResult, testimonialsResult, articlesResult] = await Promise.all([
    getSiteSettings(),
    getGalleries("student_life"),
    getEvents("upcoming"),
    getEvents("past"),
    getTestimonials(),
    getLatestArticles(3),
  ]);

  if (!settingsResult.ok) {
    return <UnavailablePage />;
  }

  const t = getDictionary();
  const { home } = settingsResult.data;
  const items = pickGalleryItems(dataOr(galleriesResult, []), ALL_ITEMS);
  const upcoming = dataOr(upcomingResult, []);
  const past = dataOr(pastResult, []);

  return (
    <PageTransition>
      <PageHero
        eyebrow={t.nav.studentLife}
        title={home.student_life.title ?? t.nav.studentLife}
        crumb={t.nav.studentLife}
        lead={home.student_life.intro}
        path={routes.studentLife}
        image={items[0]?.media ?? null}
        secondaryImage={items[1]?.media ?? null}
      />

      <YearMoments galleries={dataOr(galleriesResult, [])} />

      {items.length > 0 ? (
        <section aria-labelledby="gallery-title" className="section-y bg-background">
          <div className="container-page">
            <SectionHeader
              id="gallery-title"
              eyebrow={t.pages.studentLife.galleryEyebrow}
              title={t.pages.studentLife.galleryTitle}
              className="mb-10"
            />
            <PhotoGallery items={items} filterLabel={t.pages.filters.label} />
          </div>
        </section>
      ) : null}

      {upcoming.length > 0 ? (
        <section aria-labelledby="upcoming-title" className="section-y bg-surface">
          <div className="container-page">
            <SectionHeader
              id="upcoming-title"
              eyebrow={t.pages.studentLife.upcomingEyebrow}
              title={t.pages.studentLife.upcomingTitle}
              className="mb-10"
            />
            <EventList events={upcoming} />
          </div>
        </section>
      ) : null}

      {past.length > 0 ? (
        <section aria-labelledby="past-title" className="section-y bg-background">
          <div className="container-page">
            <SectionHeader
              id="past-title"
              eyebrow={t.pages.studentLife.pastEyebrow}
              title={t.pages.studentLife.pastTitle}
              className="mb-10"
            />
            <EventList events={past} past />
          </div>
        </section>
      ) : null}

      <Practice content={home.practice} />
      <Testimonials content={home.testimonials} testimonials={dataOr(testimonialsResult, [])} />
      <News content={home.news} articles={dataOr(articlesResult, [])} />
      <FinalCta content={home.cta} />
    </PageTransition>
  );
}
