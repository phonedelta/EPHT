import type { Metadata } from "next";

import { defaultLocale } from "@/i18n/config";
import type { Media, SiteSettings } from "@/lib/api/schemas";
import { SITE_URL } from "@/lib/env";

const FALLBACK_NAME = "EPHT";

function ogImages(image: Media | null) {
  if (!image?.url) {
    return undefined;
  }

  return [
    {
      url: image.url,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
      alt: image.alt,
    },
  ];
}

/**
 * Métadonnées communes à tout le site. Les titres, descriptions et mots-clés
 * viennent des paramètres SEO gérés dans l'administration.
 */
export function siteMetadata(settings: SiteSettings | null): Metadata {
  const name = settings?.general.name ?? FALLBACK_NAME;
  const seo = settings?.seo;
  const description = seo?.default_description ?? settings?.general.description ?? undefined;
  const title = seo?.default_title ?? name;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: seo?.title_template ?? `%s | ${name}`,
    },
    description,
    keywords: seo?.keywords.length ? seo.keywords : undefined,
    applicationName: name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "fr_MA",
      siteName: settings?.general.full_name ?? name,
      title,
      description,
      url: "/",
      images: ogImages(seo?.og_image ?? settings?.home.hero.image ?? null),
    },
    twitter: { card: "summary_large_image", title, description },
    formatDetection: { telephone: false },
  };
}

type PageMetadataInput = {
  title: string;
  description?: string | null;
  /** Chemin de la page, pour le lien canonique. */
  path: string;
  image?: Media | null;
  /** Page à exclure des moteurs de recherche. */
  noIndex?: boolean;
};

/** Métadonnées d'une page intérieure. */
export function pageMetadata({ title, description, path, image = null, noIndex = false }: PageMetadataInput): Metadata {
  return {
    title,
    description: description ?? undefined,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: description ?? undefined,
      url: path,
      images: ogImages(image),
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

/**
 * Données structurées de l'établissement (schema.org). Seules les
 * informations présentes dans les paramètres sont déclarées.
 */
export function organizationJsonLd(settings: SiteSettings): Record<string, unknown> {
  const { general, contact, social } = settings;
  const sameAs = Object.values(social).filter((url): url is string => Boolean(url));
  const hasAddress = contact.address_lines.length > 0 || contact.city;

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: general.full_name ?? general.name ?? FALLBACK_NAME,
    alternateName: general.name ?? undefined,
    description: general.description ?? undefined,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-epht.svg`,
    email: contact.email ?? undefined,
    telephone: contact.phone ?? undefined,
    address: hasAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: contact.address_lines.slice(0, -1).join(", ") || undefined,
          addressLocality: contact.city ?? undefined,
          addressCountry: "MA",
        }
      : undefined,
    geo:
      contact.latitude !== null && contact.longitude !== null
        ? { "@type": "GeoCoordinates", latitude: contact.latitude, longitude: contact.longitude }
        : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export function websiteJsonLd(settings: SiteSettings): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: settings.general.full_name ?? settings.general.name ?? FALLBACK_NAME,
    url: SITE_URL,
    inLanguage: defaultLocale,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
