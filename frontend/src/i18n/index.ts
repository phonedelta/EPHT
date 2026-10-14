import { defaultLocale, type Locale } from "./config";
import { fr, type Dictionary } from "./dictionaries/fr";

const dictionaries: Record<Locale, Dictionary> = { fr };

/** Textes d'interface pour la langue demandée (français par défaut). */
export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}
