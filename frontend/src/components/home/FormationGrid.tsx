import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { Formation } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";

import { FormationCard } from "./FormationCard";

// Largeur d'une carte : deux par rangée sur tablette, jusqu'à quatre sur grand écran.
// Les rangées incomplètes sont centrées.
const MD_WIDTH = "md:w-[calc((100%-var(--gap))/2)]";
const XL_WIDTH: Record<number, string> = {
  3: "xl:w-[calc((100%-2*var(--gap))/3)]",
  4: "xl:w-[calc((100%-3*var(--gap))/4)]",
};

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
 * Cartes de formations : une colonne sur mobile, deux sur tablette, jusqu'à
 * quatre par rangée sur grand écran. Une dernière rangée incomplète est centrée.
 */
export function FormationGrid({ formations, positionOf = (_, index) => index, className }: FormationGridProps) {
  const xlColumns = formations.length >= 3 ? Math.min(formations.length, 4) : null;
  const sizes = photoSizes(xlColumns);

  return (
    <RevealGroup
      className={cn("flex flex-wrap justify-center gap-[var(--gap)] [--gap:1.25rem] lg:[--gap:1.5rem]", className)}
      stagger={0.08}
    >
      {formations.map((formation, index) => {
        // Sur deux colonnes, une dernière carte isolée occupe toute la largeur.
        const wide = formations.length % 2 === 1 && index === formations.length - 1 && formations.length > 1;

        return (
          <RevealItem key={formation.id} className={cn("w-full", !wide && MD_WIDTH, xlColumns !== null && XL_WIDTH[xlColumns])}>
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
