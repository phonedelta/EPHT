import type { Metadata } from "next";

import { FinalCta } from "@/components/home/FinalCta";
import { PageTransition } from "@/components/motion/PageTransition";
import { NewsList } from "@/components/news/NewsList";
import { PageHero } from "@/components/system/PageHero";
import { UnavailablePage } from "@/components/system/StatusPage";
import { getDictionary } from "@/i18n";
import { dataOr, getAllArticles, getSiteSettings } from "@/lib/api/queries";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: getDictionary().nav.news,
  description: getDictionary().pages.news.lead,
  path: routes.news,
});

/** Toutes les actualités, filtrables par catégorie. */
export default async function NewsPage() {
  const [settingsResult, articlesResult] = await Promise.all([getSiteSettings(), getAllArticles()]);

  if (!settingsResult.ok) {
    return <UnavailablePage />;
  }

  const t = getDictionary();
  const { home } = settingsResult.data;
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

      <FinalCta content={home.cta} />
    </PageTransition>
  );
}
