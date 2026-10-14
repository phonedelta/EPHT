import { z } from "zod";

/**
 * Formes des réponses de l'API Laravel.
 *
 * Chaque réponse est validée à l'entrée du frontend : une donnée absente ou
 * mal formée est détectée ici plutôt qu'au milieu d'un composant. Les textes
 * éditoriaux sont tous facultatifs — l'administration peut les vider — et
 * arrivent sous la forme `string | null`.
 */

/** Texte facultatif : vide ou absent devient `null`. */
const text = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || null);

const list = <T extends z.ZodType>(item: T) =>
  z
    .array(item)
    .nullish()
    .transform((value) => value ?? []);

// --- Médias ----------------------------------------------------------------

export const mediaSchema = z.object({
  id: z.number(),
  type: z.enum(["image", "video", "document"]),
  url: z.string().nullable(),
  external_url: z.string().nullable(),
  mime_type: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  alt: z.string(),
  title: z.string().nullable(),
  caption: z.string().nullable(),
  credit: z.string().nullable(),
  credit_url: z.string().nullable(),
  is_illustrative: z.boolean(),
  dominant_color: z.string().nullable(),
  focal_point: z.object({ x: z.number(), y: z.number() }),
});

export type Media = z.infer<typeof mediaSchema>;

const optionalMedia = mediaSchema.nullish().transform((value) => value ?? null);

// --- Paramètres du site ------------------------------------------------------

const titledText = z.object({ title: z.string(), text: text });

export type TitledText = z.infer<typeof titledText>;

const general = z
  .object({
    name: text,
    full_name: text,
    tagline: text,
    description: text,
    logo: optionalMedia,
  })
  .prefault({});

const contact = z
  .object({
    address_lines: list(z.string()),
    district: text,
    city: text,
    country: text,
    phone: text,
    mobile: text,
    email: text,
    whatsapp: text,
    latitude: z.number().nullish().transform((value) => value ?? null),
    longitude: z.number().nullish().transform((value) => value ?? null),
    map_url: text,
  })
  .prefault({});

const social = z
  .object({
    facebook: text,
    instagram: text,
    linkedin: text,
    youtube: text,
    tiktok: text,
  })
  .prefault({});

const seo = z
  .object({
    default_title: text,
    title_template: text,
    default_description: text,
    keywords: list(z.string()),
    og_image: optionalMedia,
  })
  .prefault({});

const section = z.object({ title: text, intro: text }).prefault({});

const home = z
  .object({
    hero: z
      .object({
        title: list(z.string()),
        description: text,
        image: optionalMedia,
        secondary_image: optionalMedia,
      })
      .prefault({}),
    about: z
      .object({
        title: text,
        lead: text,
        body: list(z.string()),
        pillars: list(titledText),
        image: optionalMedia,
      })
      .prefault({}),
    formations: section,
    practice: z
      .object({
        title: text,
        intro: text,
        points: list(titledText),
        image: optionalMedia,
        image_secondary: optionalMedia,
        image_tertiary: optionalMedia,
      })
      .prefault({}),
    why: z.object({ title: text, intro: text, items: list(titledText) }).prefault({}),
    infrastructures: section,
    admissions: z.object({ title: text, intro: text, steps: list(titledText) }).prefault({}),
    student_life: section,
    testimonials: z.object({ title: text }).prefault({}),
    news: z.object({ title: text }).prefault({}),
    cta: z.object({ title: text, text: text }).prefault({}),
  })
  .prefault({});

export const siteSettingsSchema = z.object({ general, contact, social, seo, home });

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type ContactSettings = SiteSettings["contact"];
export type SocialSettings = SiteSettings["social"];
export type HomeSettings = SiteSettings["home"];

// --- Formations --------------------------------------------------------------

const category = z.object({ id: z.number(), slug: z.string(), name: z.string() });

export const formationSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  // Nuls tant que l'école ne les a pas confirmés : rien n'est alors affiché.
  level: z.string().nullable(),
  diploma: z.string().nullable(),
  duration: z.object({ label: z.string().nullable(), months: z.number().nullable() }).nullable(),
  category: category.nullish().transform((value) => value ?? null),
  cover: optionalMedia,
  published_at: z.string().nullable(),
});

export type Formation = z.infer<typeof formationSchema>;

export const formationListSchema = z.array(formationSchema);

// --- Galeries ----------------------------------------------------------------

export const gallerySchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  section: z.string(),
  category: z.object({ value: z.string(), label: z.string() }).nullable(),
  cover: optionalMedia,
  media: list(mediaSchema),
  published_at: z.string().nullable(),
});

export type Gallery = z.infer<typeof gallerySchema>;

export const galleryListSchema = z.array(gallerySchema);

// --- Articles ----------------------------------------------------------------

export const articleSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  category: category.nullish().transform((value) => value ?? null),
  cover: optionalMedia,
  published_at: z.string().nullable(),
});

export type Article = z.infer<typeof articleSchema>;

export const articleListSchema = z.array(articleSchema);

export const articleDetailSchema = articleSchema.extend({ content: z.string() });

export type ArticleDetail = z.infer<typeof articleDetailSchema>;

// --- Témoignages -------------------------------------------------------------

export const testimonialSchema = z.object({
  id: z.number(),
  author_name: z.string(),
  author_role: z.string().nullable(),
  quote: z.string(),
  formation: z
    .object({ slug: z.string(), title: z.string() })
    .nullish()
    .transform((value) => value ?? null),
  photo: optionalMedia,
});

export type Testimonial = z.infer<typeof testimonialSchema>;

export const testimonialListSchema = z.array(testimonialSchema);
