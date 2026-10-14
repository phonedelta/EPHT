import type { MetadataRoute } from "next";

import { dataOr, getAllArticles, getFormations } from "@/lib/api/queries";
import { SITE_URL } from "@/lib/env";
import { routes } from "@/lib/routes";

/** Plan du site : pages fixes, formations et articles publiés dans l'API. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [formations, articles] = await Promise.all([getFormations(), getAllArticles()]);

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...[
      routes.school,
      routes.formations,
      routes.admissions,
      routes.infrastructures,
      routes.studentLife,
      routes.careers,
      routes.news,
      routes.contact,
    ].map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];

  const formationPages: MetadataRoute.Sitemap = dataOr(formations, []).map((formation) => ({
    url: `${SITE_URL}${routes.formation(formation.slug)}`,
    lastModified: formation.published_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = dataOr(articles, { articles: [], categories: [] }).articles.map((article) => ({
    url: `${SITE_URL}${routes.article(article.slug)}`,
    lastModified: article.published_at ?? undefined,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...pages, ...formationPages, ...articlePages];
}
