import { defaultLocale } from "@/i18n/config";

// Les dates sont stockées en UTC et affichées à l'heure du Maroc.
const TIME_ZONE = "Africa/Casablanca";

const longDate = new Intl.DateTimeFormat(defaultLocale, {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

/** « 13 octobre 2026 » — chaîne vide si la date est absente ou invalide. */
export function formatDate(iso: string | null): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);

  return Number.isNaN(date.getTime()) ? "" : longDate.format(date);
}

/** Lien `tel:` à partir d'un numéro saisi avec des espaces. */
export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Numéro d'ordre sur deux chiffres : 1 → « 01 ». */
export function ordinal(index: number): string {
  return String(index + 1).padStart(2, "0");
}

const dayOfMonth = new Intl.DateTimeFormat(defaultLocale, { day: "numeric", timeZone: TIME_ZONE });
const shortMonth = new Intl.DateTimeFormat(defaultLocale, { month: "short", timeZone: TIME_ZONE });
const timeOfDay = new Intl.DateTimeFormat(defaultLocale, { hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE });

/** Jour et mois abrégé d'une date, pour un calendrier : « 13 », « oct. ». */
export function dateBadge(iso: string): { day: string; month: string } | null {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return { day: dayOfMonth.format(date), month: shortMonth.format(date) };
}

/** Heure à l'heure du Maroc : « 09:30 » — chaîne vide si la date est invalide. */
export function formatTime(iso: string | null): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);

  return Number.isNaN(date.getTime()) ? "" : timeOfDay.format(date);
}

/**
 * Texte brut des paragraphes d'un contenu HTML. Tant que l'éditeur et le
 * nettoyage côté serveur ne sont pas en place, aucun HTML venu de l'API n'est
 * injecté dans la page.
 */
export function paragraphsOf(html: string | null): string[] {
  if (!html) {
    return [];
  }

  return html
    .split(/<\/p>|<\/li>|<br\s*\/?>/i)
    .map((chunk) =>
      chunk
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'")
        .trim(),
    )
    .filter(Boolean);
}
