"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Réglages communs aux animations du site. Avec `reducedMotion="user"`, les
 * visiteurs qui ont demandé moins d'animations ne voient plus ni déplacement
 * ni zoom : seuls les fondus sont conservés.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
