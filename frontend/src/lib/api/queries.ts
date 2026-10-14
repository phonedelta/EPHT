import { cacheLife, cacheTag } from "next/cache";

import { apiGet, apiGetWithMeta, type ApiResult } from "./client";
import {
  articleDetailMetaSchema,
  articleDetailSchema,
  articleListSchema,
  articlePageMetaSchema,
  eventListSchema,
  formationDetailSchema,
  formationListSchema,
  galleryListSchema,
  jobOfferListSchema,
  partnerListSchema,
  siteSettingsSchema,
  testimonialListSchema,
  type Article,
  type ArticleCategory,
  type ArticleDetail,
  type Formation,
  type FormationDetail,
  type Gallery,
  type JobOffer,
  type Partner,
  type SchoolEvent,
  type SiteSettings,
  type Testimonial,
} from "./schemas";
import { CACHE_TAGS } from "./tags";

/**
 * Lectures de l'API mises en cache par Next.js.
 *
 * Un résultat valide est conservé selon le profil « content » et invalidé à la
 * demande par Laravel. Un échec n'est gardé qu'une minute : la page est
 * régénérée dès que l'API répond à nouveau, sans redéploiement.
 */
function remember<T>(result: ApiResult<T>): ApiResult<T> {
  if (result.ok) {
    cacheLife("content");
  } else {
    cacheLife("minutes");
  }

  return result;
}

export async function getSiteSettings(): Promise<ApiResult<SiteSettings>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.settings);

  return remember(await apiGet("site-settings", siteSettingsSchema));
}

export async function getFormations(): Promise<ApiResult<Formation[]>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.formations);

  return remember(await apiGet("formations", formationListSchema));
}

export async function getFormation(slug: string): Promise<ApiResult<FormationDetail>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.formations, CACHE_TAGS.galleries);

  return remember(await apiGet(`formations/${encodeURIComponent(slug)}`, formationDetailSchema));
}

export async function getGalleries(section: "infrastructure" | "student_life"): Promise<ApiResult<Gallery[]>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.galleries);

  return remember(await apiGet("galleries", galleryListSchema, { section }));
}

export async function getTestimonials(): Promise<ApiResult<Testimonial[]>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.testimonials);

  return remember(await apiGet("testimonials", testimonialListSchema));
}

export async function getLatestArticles(limit: number): Promise<ApiResult<Article[]>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.articles);

  return remember(await apiGet("articles", articleListSchema, { per_page: limit }));
}

// Taille de page maximale acceptée par l'API, et nombre de pages lues au plus.
const ARTICLES_PER_PAGE = 24;
const MAX_ARTICLE_PAGES = 10;

export type ArticleIndex = { articles: Article[]; categories: ArticleCategory[] };

/**
 * Tous les articles publiés, du plus récent au plus ancien, et leurs
 * catégories. La liste est filtrée et paginée dans le navigateur : la page
 * des actualités reste ainsi entièrement pré-rendue.
 */
export async function getAllArticles(): Promise<ApiResult<ArticleIndex>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.articles);

  const index: ArticleIndex = { articles: [], categories: [] };

  for (let page = 1; page <= MAX_ARTICLE_PAGES; page++) {
    const result = await apiGetWithMeta("articles", articleListSchema, articlePageMetaSchema, {
      per_page: ARTICLES_PER_PAGE,
      page,
    });

    if (!result.ok) {
      return remember(result);
    }

    index.articles.push(...result.data.data);

    if (page === 1) {
      index.categories = result.data.meta.categories;
    }

    if (page >= result.data.meta.last_page) {
      break;
    }
  }

  return remember({ ok: true, data: index });
}

export async function getArticle(slug: string): Promise<ApiResult<{ article: ArticleDetail; related: Article[] }>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.articles);

  const result = await apiGetWithMeta(`articles/${encodeURIComponent(slug)}`, articleDetailSchema, articleDetailMetaSchema);

  return remember(result.ok ? { ok: true, data: { article: result.data.data, related: result.data.meta.related } } : result);
}

export async function getEvents(period: "upcoming" | "past"): Promise<ApiResult<SchoolEvent[]>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.events);

  return remember(await apiGet("events", eventListSchema, { period }));
}

export async function getJobOffers(): Promise<ApiResult<JobOffer[]>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.jobOffers);

  return remember(await apiGet("job-offers", jobOfferListSchema));
}

export async function getPartners(): Promise<ApiResult<Partner[]>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.partners);

  return remember(await apiGet("partners", partnerListSchema));
}

/** Données d'un résultat, ou la valeur de repli si l'API n'a pas répondu. */
export function dataOr<T>(result: ApiResult<T>, fallback: T): T {
  return result.ok ? result.data : fallback;
}
