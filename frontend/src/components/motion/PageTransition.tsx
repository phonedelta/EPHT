import { ViewTransition, type ReactNode } from "react";

/**
 * Transition entre deux pages : l'ancienne s'efface en remontant, la nouvelle
 * apparaît en douceur (API View Transitions, voir globals.css). L'en-tête
 * reste immobile. Sans prise en charge par le navigateur, le changement de
 * page est simplement instantané.
 *
 * À placer dans chaque page, et non dans un layout : un layout persiste d'une
 * page à l'autre, et l'entrée comme la sortie ne s'y déclencheraient jamais.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {/* Un seul élément : le contenu de la page s'anime d'un bloc. */}
      <div>{children}</div>
    </ViewTransition>
  );
}
