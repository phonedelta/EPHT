import { describe, expect, it } from "vitest";

import { CACHE_TAGS, isCacheTag } from "./api/tags";
import { cn } from "./cn";
import { dateBadge, formatDate, formatTime, ordinal, paragraphsOf, phoneHref } from "./format";
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
