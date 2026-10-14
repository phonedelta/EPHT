import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { Formation } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";

import { FormationCard } from "./FormationCard";

// Grand écran : les formations s'alignent sur une seule ligne, jusqu'à quatre par rangée.
const XL_GRID: Record<number, string> = { 3: "xl:grid-cols-3", 4: "xl:grid-cols-4" };

/** Largeurs d'affichage de la photographie selon le nombre de colonnes sur grand écran. */
function photoSizes(xlColumns: number | null): string {
  if (xlColumns === null) {
    return "(min-width: 1320px) 610px, (min-width: 768px) 50vw, 100vw";
  }

  return `(min-width: 1320px) ${Math.round(1240 / xlColumns)}px, (min-width: 1280px) ${Math.round(100 / xlColumns)}vw, (min-width: 768px) 50vw, 100vw`;
}

type FormationGridProps = {
  formations: Formation[];
  /** Numéro affiché sur chaque carte : sa place dans le catalogue complet. */
  positionOf?: (formation: Formation, index: number) => number;
  className?: string;
};

/**
 * Cartes de formations : une colonne sur mobile, deux sur tablette, toutes
 * alignées sur une ligne sur grand écran (jusqu'à quatre).
 */
export function FormationGrid({ formations, positionOf = (_, index) => index, className }: FormationGridProps) {
  const xlColumns = formations.length >= 3 ? Math.min(formations.length, 4) : null;
  const sizes = photoSizes(xlColumns);

  return (
    <RevealGroup
      className={cn("grid gap-5 md:grid-cols-2 lg:gap-6", xlColumns !== null && XL_GRID[xlColumns], className)}
      stagger={0.08}
    >
      {formations.map((formation, index) => {
        // Sur deux colonnes, une dernière carte isolée occupe toute la largeur.
        const wide = formations.length % 2 === 1 && index === formations.length - 1 && formations.length > 1;

        return (
          <RevealItem key={formation.id} className={cn(wide && "md:col-span-2", wide && xlColumns !== null && "xl:col-span-1")}>
            <FormationCard
              formation={formation}
              index={positionOf(formation, index)}
              sizes={sizes}
              wide={wide}
              compact={xlColumns !== null}
            />
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
