import { Meow_Script, Newsreader } from "next/font/google";

/*
 * Polices propres au hero de l'accueil. Déclarées ici plutôt que dans le
 * layout racine, elles ne sont préchargées que sur la page qui les utilise.
 */

/** Seconde partie du titre : romain à empattements, taille optique automatique. */
export const heroSerif = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

/** Mention manuscrite posée sur la composition photographique. */
export const heroScript = Meow_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
