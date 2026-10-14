"use client";

import { GraduationCap } from "lucide-react";
import { useState } from "react";

import { FormationGrid } from "@/components/home/FormationGrid";
import { EmptyState } from "@/components/system/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { getDictionary } from "@/i18n";
import type { Formation } from "@/lib/api/schemas";

/**
 * Catalogue des formations, filtrable par famille de métiers. Chaque carte
 * garde le numéro de sa formation dans le catalogue complet.
 */
export function FormationCatalog({ formations }: { formations: Formation[] }) {
  const t = getDictionary().pages;
  const [family, setFamily] = useState<string | null>(null);

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
  const visible = family ? formations.filter((formation) => formation.category?.slug === family) : formations;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {families.length > 1 ? (
          <FilterChips
            label={t.formations.filterLabel}
            value={family}
            onChange={setFamily}
            options={[
              { value: null, label: t.filters.all, count: formations.length },
              ...families.map((category) => ({
                value: category.slug,
                label: category.name,
                count: formations.filter((formation) => formation.category?.slug === category.slug).length,
              })),
            ]}
          />
        ) : (
          <span />
        )}
        <p aria-live="polite" className="text-sm text-muted">
          {t.formations.count(visible.length)}
        </p>
      </div>

      {/* La grille est recréée à chaque filtre : ses cartes réapparaissent l'une après l'autre. */}
      <FormationGrid
        key={family ?? "*"}
        formations={visible}
        positionOf={(formation) => formations.indexOf(formation)}
        className="mt-8"
      />
    </div>
  );
}
