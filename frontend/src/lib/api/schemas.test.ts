import { describe, expect, it } from "vitest";

import { formationSchema, siteSettingsSchema } from "./schemas";

describe("siteSettingsSchema", () => {
  it("fournit une structure complète quand l'API ne renvoie rien", () => {
    const settings = siteSettingsSchema.parse({});

    expect(settings.general.name).toBeNull();
    expect(settings.contact.address_lines).toEqual([]);
    expect(settings.social.facebook).toBeNull();
    expect(settings.home.hero.title).toEqual([]);
    expect(settings.home.hero.image).toBeNull();
    expect(settings.home.why.items).toEqual([]);
    expect(settings.home.admissions.steps).toEqual([]);
  });

  it("conserve les valeurs renvoyées et nettoie les textes vides", () => {
    const settings = siteSettingsSchema.parse({
      general: { name: "EPHT", tagline: "   " },
      contact: { email: " contact@epht.ma ", address_lines: ["Ligne 1", "Ligne 2"], whatsapp: null },
      home: {
        hero: { title: ["Apprenez un métier.", "Construisez votre avenir."] },
        why: { items: [{ title: "Un enseignement pratique", text: "En atelier." }] },
      },
    });

    expect(settings.general.name).toBe("EPHT");
    expect(settings.general.tagline).toBeNull();
    expect(settings.contact.email).toBe("contact@epht.ma");
    expect(settings.contact.address_lines).toEqual(["Ligne 1", "Ligne 2"]);
    expect(settings.contact.whatsapp).toBeNull();
    expect(settings.home.hero.title).toHaveLength(2);
    expect(settings.home.why.items[0]).toEqual({ title: "Un enseignement pratique", text: "En atelier." });
  });
});

describe("formationSchema", () => {
  const base = {
    id: 3,
    slug: "patisserie",
    title: "Pâtisserie",
    summary: "Les fondamentaux de la pâtisserie.",
    level: null,
    diploma: null,
    duration: null,
    published_at: null,
  };

  it("accepte une formation dont durée et diplôme ne sont pas confirmés", () => {
    const formation = formationSchema.parse(base);

    expect(formation.duration).toBeNull();
    expect(formation.diploma).toBeNull();
    expect(formation.category).toBeNull();
    expect(formation.cover).toBeNull();
  });

  it("rejette une réponse à laquelle il manque un champ obligatoire", () => {
    const withoutTitle: Record<string, unknown> = { ...base };
    delete withoutTitle.title;

    expect(formationSchema.safeParse(withoutTitle).success).toBe(false);
  });
});
