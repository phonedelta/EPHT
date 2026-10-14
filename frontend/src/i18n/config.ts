/**
 * Langues du site.
 *
 * Le site est publié en français. Pour ajouter une langue : déclarer son code
 * ici, créer son dictionnaire dans `dictionaries/` et l'enregistrer dans
 * `index.ts`. Les textes d'interface ne sont jamais écrits en dur dans les
 * composants, ce qui rend cet ajout indépendant de leur code.
 */
export const locales = ["fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";
