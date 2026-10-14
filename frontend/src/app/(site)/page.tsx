import { About } from "@/components/home/About";
import { Admissions } from "@/components/home/Admissions";
import { FinalCta } from "@/components/home/FinalCta";
import { Formations } from "@/components/home/Formations";
import { Hero } from "@/components/home/Hero";
import { Infrastructures } from "@/components/home/Infrastructures";
import { News } from "@/components/home/News";
import { Practice } from "@/components/home/Practice";
import { StudentLife } from "@/components/home/StudentLife";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChoose } from "@/components/home/WhyChoose";
import { PageTransition } from "@/components/motion/PageTransition";
import { JsonLd } from "@/components/system/JsonLd";
import { StatusPage } from "@/components/system/StatusPage";
import { getDictionary } from "@/i18n";
import {
  dataOr,
  getFormations,
  getGalleries,
  getLatestArticles,
  getSiteSettings,
  getTestimonials,
} from "@/lib/api/queries";
import type { Media } from "@/lib/api/schemas";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/**
 * Page d'accueil. Tout son contenu vient de l'API Laravel ; chaque lecture
 * est mise en cache puis rafraîchie quand le contenu change.
 */
export default async function HomePage() {
  const [settingsResult, formationsResult, infrastructureResult, studentLifeResult, testimonialsResult, articlesResult] =
    await Promise.all([
      getSiteSettings(),
      getFormations(),
      getGalleries("infrastructure"),
      getGalleries("student_life"),
      getTestimonials(),
      getLatestArticles(3),
    ]);

  if (!settingsResult.ok) {
    const t = getDictionary().errors;

    return <StatusPage eyebrow="503" title={t.unavailableTitle} text={t.unavailableText} />;
  }

  const settings = settingsResult.data;
  const { home } = settings;
  const formations = dataOr(formationsResult, []);

  // Carrousel du hero : sa photographie, puis celles de la pédagogie et de l'école, sans doublon.
  const heroImages = [home.hero.image, home.practice.image, home.about.image].filter(
    (media, position, list): media is Media =>
      media !== null && list.findIndex((other) => other?.id === media.id) === position,
  );

  return (
    <PageTransition>
      <JsonLd data={[organizationJsonLd(settings), websiteJsonLd(settings)]} />
      <Hero
        title={home.hero.title}
        description={home.hero.description}
        images={heroImages}
        secondaryImage={home.hero.secondary_image}
      />
      <About content={home.about} />
      <Formations content={home.formations} formations={formations} />
      <Practice content={home.practice} />
      <WhyChoose content={home.why} />
      <Infrastructures content={home.infrastructures} galleries={dataOr(infrastructureResult, [])} />
      <Admissions content={home.admissions} />
      <StudentLife content={home.student_life} galleries={dataOr(studentLifeResult, [])} />
      <Testimonials content={home.testimonials} testimonials={dataOr(testimonialsResult, [])} />
      <News content={home.news} articles={dataOr(articlesResult, [])} />
      <FinalCta content={home.cta} />
    </PageTransition>
  );
}
