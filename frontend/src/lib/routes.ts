import type { Dictionary } from "@/i18n/dictionaries/fr";

/** Ancre du formulaire d'inscription sur la page Admissions. */
export const APPLY_ANCHOR = "inscription";

/** Adresses des pages du site public. */
export const routes = {
  home: "/",
  school: "/ecole",
  formations: "/formations",
  formation: (slug: string) => `/formations/${slug}`,
  admissions: "/admissions",
  /** Formulaire d'inscription, sur la page Admissions ; la formation peut être présélectionnée. */
  apply: (formation?: string) =>
    `/admissions${formation ? `?formation=${encodeURIComponent(formation)}` : ""}#${APPLY_ANCHOR}`,
  infrastructures: "/infrastructures",
  studentLife: "/vie-a-l-epht",
  careers: "/stages-carrieres",
  news: "/actualites",
  article: (slug: string) => `/actualites/${slug}`,
  contact: "/contact",
  legal: "/mentions-legales",
  privacy: "/politique-de-confidentialite",
} as const;

export type NavItem = { href: string; label: string };

/** Entrées du menu principal, dans l'ordre d'affichage. */
export function mainNavigation(t: Dictionary): NavItem[] {
  return [
    { href: routes.school, label: t.nav.school },
    { href: routes.formations, label: t.nav.formations },
    { href: routes.admissions, label: t.nav.admissions },
    { href: routes.infrastructures, label: t.nav.infrastructures },
    { href: routes.studentLife, label: t.nav.studentLife },
    { href: routes.careers, label: t.nav.careers },
    { href: routes.news, label: t.nav.news },
    { href: routes.contact, label: t.nav.contact },
  ];
}

/** Vrai si `pathname` est la page `href` ou l'une de ses sous-pages. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
