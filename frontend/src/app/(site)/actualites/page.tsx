import type { Metadata } from "next";

import { FinalCta } from "@/components/home/FinalCta";
import { PageTransition } from "@/components/motion/PageTransition";
import { StudentLife } from "@/components/home/StudentLife";
import { FollowSchool } from "@/components/news/FollowSchool";
import { NewsList } from "@/components/news/NewsList";
import { PageHero } from "@/components/system/PageHero";
import { UnavailablePage } from "@/components/system/StatusPage";
import { getDictionary } from "@/i18n";
import { dataOr, getAllArticles, getGalleries, getSiteSettings } from "@/lib/api/queries";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: getDictionary().nav.news,
  description: getDictionary().pages.news.lead,
  path: routes.news,
});

/** Toutes les actualités, filtrables par catégorie. */
export default async function NewsPage() {
  const [settingsResult, articlesResult, studentLifeResult] = await Promise.all([
    getSiteSettings(),
    getAllArticles(),
    getGalleries("student_life"),
  ]);

  if (!settingsResult.ok) {
    return <UnavailablePage />;
  }

  const t = getDictionary();
  const { home, social, contact } = settingsResult.data;
  const index = dataOr(articlesResult, { articles: [], categories: [] });

  return (
    <PageTransition>
      <PageHero
        eyebrow={t.nav.news}
        title={home.news.title ?? t.nav.news}
        crumb={t.nav.news}
        lead={t.pages.news.lead}
        path={routes.news}
      />

      <section aria-label={t.nav.news} className="section-y bg-surface">
        <div className="container-page">
          <NewsList articles={index.articles} categories={index.categories} />
        </div>
      </section>

      <FollowSchool social={social} contact={contact} />
      <StudentLife content={home.student_life} galleries={dataOr(studentLifeResult, [])} />
      <FinalCta content={home.cta} />
    </PageTransition>
  );
}
