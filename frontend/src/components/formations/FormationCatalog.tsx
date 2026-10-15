"use client";

import { GraduationCap } from "lucide-react";
import { useState } from "react";

import { FormationGrid } from "@/components/home/FormationGrid";
import { EmptyState } from "@/components/system/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { getDictionary } from "@/i18n";
import type { Formation } from "@/lib/api/schemas";
import { diplomaCode } from "@/lib/formations";

import { DiplomaSwitch } from "./DiplomaSwitch";

/**
 * Catalogue des formations, filtrable par famille de métiers et par niveau de
 * diplôme. Chaque carte garde le numéro de sa formation dans le catalogue complet.
 */
export function FormationCatalog({ formations }: { formations: Formation[] }) {
  const t = getDictionary().pages;
  const [family, setFamily] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  if (formations.length === 0) {
    return <EmptyState icon={GraduationCap}>{t.formations.empty}</EmptyState>;
  }

  // Familles présentes, sans doublon, dans l'ordre du catalogue.
  const families = [
    ...new Map(
      formations
        .map((formation) => formation.category)
        .filter((category) => category !== null)
        .map((category) => [category.slug, category]),
    ).values(),
  ];
  // Niveaux présents, du diplôme de qualification au technicien spécialisé.
  const levels = [...new Set(formations.map((formation) => formation.level).filter((value) => value !== null))];
  const codeOf = (value: string) => diplomaCode(formations.find((formation) => formation.level === value) ?? { diploma: null });

  const matchesFamily = (formation: Formation) => !family || formation.category?.slug === family;
  const matchesLevel = (formation: Formation) => !level || formation.level === level;
  const visible = formations.filter((formation) => matchesFamily(formation) && matchesLevel(formation));

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4">
          {families.length > 1 ? (
            <FilterChips
              label={t.formations.filterLabel}
              value={family}
              onChange={setFamily}
              options={[
                { value: null, label: t.filters.all, count: formations.filter(matchesLevel).length },
                ...families.map((category) => ({
                  value: category.slug,
                  label: category.name,
                  count: formations.filter((formation) => formation.category?.slug === category.slug && matchesLevel(formation))
                    .length,
                })),
              ]}
            />
          ) : null}
          {levels.length > 1 ? (
            <DiplomaSwitch
              value={level}
              onChange={setLevel}
              total={formations.filter(matchesFamily).length}
              options={levels.map((value) => ({
                level: value,
                code: codeOf(value),
                count: formations.filter((formation) => formation.level === value && matchesFamily(formation)).length,
              }))}
            />
          ) : null}
        </div>
        <p aria-live="polite" className="shrink-0 text-sm text-muted lg:pt-2">
          {t.formations.count(visible.length)}
        </p>
      </div>

      {/* La grille est recréée à chaque filtre : ses cartes réapparaissent l'une après l'autre. */}
      <FormationGrid
        key={`${family ?? "*"}|${level ?? "*"}`}
        formations={visible}
        positionOf={(formation) => formations.indexOf(formation)}
        className="mt-8"
      />
    </div>
  );
}
