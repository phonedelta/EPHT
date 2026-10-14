import { cacheLife, cacheTag } from "next/cache";

import { apiGet, type ApiResult } from "./client";
import {
  articleDetailSchema,
  articleListSchema,
  formationListSchema,
  formationSchema,
  galleryListSchema,
  siteSettingsSchema,
  testimonialListSchema,
  type Article,
  type ArticleDetail,
  type Formation,
  type Gallery,
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

export async function getFormation(slug: string): Promise<ApiResult<Formation>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.formations);

  return remember(await apiGet(`formations/${encodeURIComponent(slug)}`, formationSchema));
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

export async function getArticle(slug: string): Promise<ApiResult<ArticleDetail>> {
  "use cache";
  cacheTag(CACHE_TAGS.all, CACHE_TAGS.articles);

  return remember(await apiGet(`articles/${encodeURIComponent(slug)}`, articleDetailSchema));
}

/** Données d'un résultat, ou la valeur de repli si l'API n'a pas répondu. */
export function dataOr<T>(result: ApiResult<T>, fallback: T): T {
  return result.ok ? result.data : fallback;
}
