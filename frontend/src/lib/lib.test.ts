import { describe, expect, it } from "vitest";

import { CACHE_TAGS, isCacheTag } from "./api/tags";
import { cn } from "./cn";
import { formation } from "@/test/fixtures";

import { dateBadge, formatDate, formatTime, ordinal, paragraphsOf, phoneHref } from "./format";
import { diplomaCode, groupByLevel, offerFigures } from "./formations";
import { isActivePath, routes } from "./routes";

describe("formatDate", () => {
  it("écrit la date en français", () => {
    expect(formatDate("2026-10-13T17:00:00+00:00")).toBe("13 octobre 2026");
  });

  it("utilise le fuseau horaire du Maroc", () => {
    // 23 h 30 UTC le 31 décembre : déjà le 1er janvier à Casablanca (UTC+1).
    expect(formatDate("2026-12-31T23:30:00+00:00")).toBe("1 janvier 2027");
  });

  it("renvoie une chaîne vide pour une date absente ou invalide", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("pas une date")).toBe("");
  });
});

describe("phoneHref", () => {
  it("retire les espaces et conserve l'indicatif", () => {
    expect(phoneHref("+212 5 37 78 69 06")).toBe("tel:+212537786906");
  });
});

describe("ordinal", () => {
  it("numérote sur deux chiffres à partir de 01", () => {
    expect([0, 3, 11].map(ordinal)).toEqual(["01", "04", "12"]);
  });
});

describe("isActivePath", () => {
  it("reconnaît une page et ses sous-pages", () => {
    expect(isActivePath("/formations", routes.formations)).toBe(true);
    expect(isActivePath("/formations/cuisine", routes.formations)).toBe(true);
    expect(isActivePath("/formations-continues", routes.formations)).toBe(false);
  });

  it("ne marque l'accueil actif que sur l'accueil", () => {
    expect(isActivePath("/", routes.home)).toBe(true);
    expect(isActivePath("/contact", routes.home)).toBe(false);
  });
});

describe("isCacheTag", () => {
  it("n'accepte que les étiquettes connues", () => {
    expect(isCacheTag(CACHE_TAGS.formations)).toBe(true);
    expect(isCacheTag("inconnue")).toBe(false);
    expect(isCacheTag(42)).toBe(false);
  });
});

describe("cn", () => {
  it("ignore les valeurs vides", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });
});

describe("paragraphsOf", () => {
  it("extrait le texte brut des paragraphes sans injecter de HTML", () => {
    expect(paragraphsOf("<p>Premier &amp; <strong>second</strong></p><p>Fin<br>suite</p><script>x</script>")).toEqual([
      "Premier & second",
      "Fin",
      "suite",
      "x",
    ]);
  });

  it("renvoie une liste vide pour un contenu absent", () => {
    expect(paragraphsOf(null)).toEqual([]);
    expect(paragraphsOf("<p> </p>")).toEqual([]);
  });
});

describe("dateBadge et formatTime", () => {
  it("donnent le jour, le mois abrégé et l'heure à l'heure du Maroc", () => {
    expect(dateBadge("2026-10-13T08:30:00+00:00")).toEqual({ day: "13", month: "oct." });
    expect(formatTime("2026-10-13T08:30:00+00:00")).toBe("09:30");
  });

  it("ignorent une date invalide", () => {
    expect(dateBadge("pas une date")).toBeNull();
    expect(formatTime(null)).toBe("");
  });
});

describe("offre de formation", () => {
  const dt = formation({
    id: 2,
    level: "Technicien",
    diploma: "Diplôme de technicien (DT)",
    capacity: { groups: 1, per_group: 20, total: 20 },
  });
  const dts = formation({
    id: 3,
    level: "Technicien spécialisé",
    diploma: "Diplôme de technicien spécialisé (DTS)",
    capacity: { groups: 2, per_group: 20, total: 40 },
  });

  it("lit le sigle du diplôme dans son intitulé", () => {
    expect(diplomaCode(dt)).toBe("DT");
    expect(diplomaCode(dts)).toBe("DTS");
    expect(diplomaCode(formation())).toBeNull();
  });

  it("regroupe les formations par niveau et additionne les places", () => {
    const levels = groupByLevel([dt, dts, { ...dt, id: 4 }]);

    expect(levels.map((level) => [level.code, level.formations.length, level.places])).toEqual([
      ["DT", 2, 40],
      ["DTS", 1, 40],
    ]);
  });

  it("ne donne de total que si toutes les capacités sont connues", () => {
    expect(offerFigures([dt, dts])).toEqual({ programmes: 2, levels: 2, groups: 3, places: 60, perGroup: 20 });
    expect(offerFigures([dt, formation()])).toMatchObject({ programmes: 2, groups: 0, places: 0 });
  });
});
