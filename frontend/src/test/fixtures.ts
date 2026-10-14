import type { Formation, Gallery, Media, Testimonial } from "@/lib/api/schemas";

/** Données d'exemple pour les tests, au format renvoyé par l'API. */

export function media(overrides: Partial<Media> = {}): Media {
  return {
    id: 1,
    type: "image",
    url: "http://localhost:8010/storage/tests/photo.jpg",
    external_url: null,
    mime_type: "image/jpeg",
    width: 1600,
    height: 1067,
    alt: "Photographie de test",
    title: null,
    caption: null,
    credit: null,
    credit_url: null,
    is_illustrative: false,
    dominant_color: "#336677",
    focal_point: { x: 50, y: 50 },
    ...overrides,
  };
}

export function formation(overrides: Partial<Formation> = {}): Formation {
  return {
    id: 1,
    slug: "cuisine",
    title: "Cuisine",
    summary: "Une formation aux techniques culinaires.",
    level: null,
    diploma: null,
    duration: null,
    category: { id: 1, slug: "cuisine", name: "Cuisine" },
    cover: media(),
    published_at: "2026-10-01T09:00:00+00:00",
    ...overrides,
  };
}

export function testimonial(overrides: Partial<Testimonial> = {}): Testimonial {
  return {
    id: 1,
    author_name: "Salma B.",
    author_role: "Lauréate",
    quote: "Une formation exigeante et concrète.",
    formation: { slug: "cuisine", title: "Cuisine" },
    photo: null,
    ...overrides,
  };
}

export function gallery(overrides: Partial<Gallery> = {}): Gallery {
  return {
    id: 1,
    slug: "galerie",
    title: "Galerie",
    description: null,
    section: "student_life",
    category: { value: "travaux-pratiques", label: "Travaux pratiques" },
    cover: null,
    media: [],
    published_at: null,
    ...overrides,
  };
}
