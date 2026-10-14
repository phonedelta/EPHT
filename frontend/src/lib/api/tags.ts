/**
 * Étiquettes de cache posées sur les lectures de l'API.
 *
 * Laravel les renvoie au point d'entrée /api/revalidate lorsqu'un contenu
 * change (backend/app/Models/Concerns/InvalidatesFrontendCache.php) : les deux
 * listes doivent rester identiques.
 */
export const CACHE_TAGS = {
  /** Portée par toutes les lectures : rafraîchit l'ensemble du site. */
  all: "content",
  settings: "settings",
  formations: "formations",
  articles: "articles",
  galleries: "galleries",
  testimonials: "testimonials",
  events: "events",
  jobOffers: "job-offers",
  partners: "partners",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

const KNOWN_TAGS = new Set<string>(Object.values(CACHE_TAGS));

export function isCacheTag(value: unknown): value is CacheTag {
  return typeof value === "string" && KNOWN_TAGS.has(value);
}
