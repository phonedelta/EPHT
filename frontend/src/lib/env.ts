/**
 * Variables d'environnement lues côté serveur.
 * Aucune valeur de ce module n'est envoyée au navigateur.
 */

function origin(value: string | undefined, fallback: string): string {
  return (value ?? fallback).replace(/\/+$/, "");
}

/** Origine de l'API Laravel, telle que le serveur Next.js la joint. */
export const API_URL = origin(process.env.API_URL, "http://localhost:8010");

/** Origine publique du site (liens canoniques, sitemap, Open Graph). */
export const SITE_URL = origin(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000");

/** Secret partagé avec Laravel pour l'invalidation du cache. */
export const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? "";
