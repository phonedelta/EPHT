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
