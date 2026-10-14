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
  const { home, contact } = settings;
  const formations = dataOr(formationsResult, []);

  // Familles de formations publiées, sans doublon, dans l'ordre du catalogue.
  const formationFamilies = [...new Set(formations.map((formation) => formation.category?.name ?? formation.title))];
  const campus = [contact.district, contact.city].filter(Boolean).join(", ") || null;

  return (
    <>
      <JsonLd data={[organizationJsonLd(settings), websiteJsonLd(settings)]} />
      <Hero
        title={home.hero.title}
        description={home.hero.description}
        image={home.hero.image}
        secondaryImage={home.hero.secondary_image}
        formationFamilies={formationFamilies}
        campus={campus}
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
    </>
  );
}
