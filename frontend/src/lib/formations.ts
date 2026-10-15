import type { Formation } from "@/lib/api/schemas";

/** Sigle du diplôme (« DT ») lu dans son intitulé (« Diplôme de technicien (DT) »). */
export function diplomaCode(formation: Pick<Formation, "diploma">): string | null {
  return formation.diploma?.match(/\(([A-Z]{2,4})\)\s*$/)?.[1] ?? null;
}

export type DiplomaLevel = {
  code: string | null;
  level: string;
  diploma: string | null;
  formations: Formation[];
  places: number;
};

/**
 * Formations regroupées par niveau de diplôme, dans l'ordre du catalogue
 * (qui va du diplôme de qualification au technicien spécialisé).
 */
export function groupByLevel(formations: Formation[]): DiplomaLevel[] {
  const levels = new Map<string, DiplomaLevel>();

  for (const formation of formations) {
    if (!formation.level) continue;

    const entry = levels.get(formation.level) ?? {
      code: diplomaCode(formation),
      level: formation.level,
      diploma: formation.diploma,
      formations: [],
      places: 0,
    };

    entry.formations.push(formation);
    entry.places += formation.capacity?.total ?? 0;
    levels.set(formation.level, entry);
  }

  return [...levels.values()];
}

export type OfferFigures = {
  programmes: number;
  levels: number;
  groups: number;
  places: number;
  perGroup: number | null;
};

/**
 * Chiffres clés de l'offre, calculés sur les formations publiées. Un total
 * n'est donné que si toutes les formations ont leur capacité renseignée.
 */
export function offerFigures(formations: Formation[]): OfferFigures {
  const capacities = formations.map((formation) => formation.capacity);
  const complete = capacities.length > 0 && capacities.every((capacity) => capacity?.total != null);
  const perGroup = new Set(capacities.map((capacity) => capacity?.per_group ?? null));

  return {
    programmes: formations.length,
    levels: new Set(formations.map((formation) => formation.level).filter(Boolean)).size,
    groups: complete ? capacities.reduce((sum, capacity) => sum + (capacity?.groups ?? 0), 0) : 0,
    places: complete ? capacities.reduce((sum, capacity) => sum + (capacity?.total ?? 0), 0) : 0,
    perGroup: perGroup.size === 1 ? [...perGroup][0] : null,
  };
}
