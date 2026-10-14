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

/**
 * Horaires d'ouverture : un champ JSON libre dans l'administration, ramené ici
 * à des lignes de texte (« Lundi – vendredi : 8 h 30 – 18 h »).
 */
const openingHours = z
  .unknown()
  .optional()
  .transform((value): string[] => {
    const line = (entry: unknown): string | null => {
      if (typeof entry === "string") {
        return entry.trim() || null;
      }

      if (entry && typeof entry === "object") {
        const record = entry as Record<string, unknown>;
        const label = [record.days, record.day, record.label].find((part) => typeof part === "string");
        const hours = [record.hours, record.time, record.value].find((part) => typeof part === "string");

        return [label, hours].filter(Boolean).join(" : ") || null;
      }

      return null;
    };

    const entries = Array.isArray(value) ? value : value === null || value === undefined ? [] : [value];

    return entries.map(line).filter((entry): entry is string => entry !== null);
  });

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
    opening_hours: openingHours,
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

// --- Fiche d'une formation ----------------------------------------------------

/**
 * Élément d'une liste éditoriale de la fiche (objectif, module du programme…) :
 * un simple texte, ou un titre accompagné d'un détail.
 */
const detailItem = z
  .union([
    z.string(),
    z
      .object({
        title: z.string().optional(),
        label: z.string().optional(),
        name: z.string().optional(),
        text: z.string().nullish(),
        description: z.string().nullish(),
        content: z.string().nullish(),
      })
      .passthrough(),
  ])
  .transform((item) => {
    if (typeof item === "string") {
      return { title: item.trim(), text: null };
    }

    return {
      title: (item.title ?? item.label ?? item.name ?? "").trim(),
      text: (item.text ?? item.description ?? item.content ?? "").trim() || null,
    };
  });

export type DetailItem = z.infer<typeof detailItem>;

const detailList = list(detailItem).transform((items) => items.filter((item) => item.title !== ""));

export const formationDetailSchema = formationSchema.extend({
  description: text,
  objectives: detailList,
  skills: detailList,
  program: detailList,
  admission_requirements: detailList,
  career_opportunities: detailList,
  required_documents: detailList,
  faq: list(z.object({ question: z.string(), answer: z.string() })),
  gallery: gallerySchema.nullish().transform((value) => value ?? null),
  seo: z.object({ title: text, description: text }).prefault({}),
});

export type FormationDetail = z.infer<typeof formationDetailSchema>;

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

export type ArticleCategory = z.infer<typeof category>;

/** `meta` d'une page de la liste des articles. */
export const articlePageMetaSchema = z.object({
  last_page: z.number(),
  categories: list(category),
});

export const articleDetailSchema = articleSchema.extend({
  content: z.string(),
  seo: z.object({ title: text, description: text }).prefault({}),
});

export type ArticleDetail = z.infer<typeof articleDetailSchema>;

/** `meta` d'un article : jusqu'à trois articles de la même catégorie. */
export const articleDetailMetaSchema = z.object({ related: list(articleSchema) }).prefault({});

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

// --- Événements, offres, partenaires -------------------------------------------

export const eventSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  summary: text,
  description: text,
  location: text,
  starts_at: z.string(),
  ends_at: z.string().nullable(),
  cover: optionalMedia,
});

export type SchoolEvent = z.infer<typeof eventSchema>;

export const eventListSchema = z.array(eventSchema);

export const jobOfferSchema = z.object({
  id: z.number(),
  slug: z.string(),
  type: z.object({ value: z.string(), label: z.string() }),
  title: z.string(),
  company: text,
  city: text,
  description: text,
  apply_url: text,
  apply_email: text,
  published_at: z.string().nullable(),
  expires_at: z.string().nullable(),
});

export type JobOffer = z.infer<typeof jobOfferSchema>;

export const jobOfferListSchema = z.array(jobOfferSchema);

export const partnerSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  description: text,
  website_url: text,
  logo: optionalMedia,
});

export type Partner = z.infer<typeof partnerSchema>;

export const partnerListSchema = z.array(partnerSchema);
