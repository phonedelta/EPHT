import { useId } from "react";

import { cn } from "@/lib/cn";

/*
 * Logo officiel de l'EPHT, tracé en vectoriel d'après le fichier du site
 * historique. La géométrie provient de docs/brand/geometry.json : ne pas la
 * retoucher à la main, régénérer avec docs/brand/build-logo.mjs.
 */
const VIEW_BOX = "3.5 4 147.5 110.5";
const WIDTH = 147.5;
const HEIGHT = 110.5;

const CRESCENT =
  "M36.4 112.53A65.45 65.45 0 1 1 148.82 47.27A65.45 65.45 0 0 0 36.4 112.53Z";
const WORDMARK =
  "M53 70.5H70.3V73.7H54.8V78.6H70.3V81.8H54.8V86.7H70.3V89.9H53A2.2 2.2 0 0 1 50.8 87.7V72.7A2.2 2.2 0 0 1 53 70.5ZM75.8 70.5H92.3A2.9 2.9 0 0 1 95.2 73.4V78.9A2.9 2.9 0 0 1 92.3 81.8H79.8V89.9H75.8ZM79.8 73.7V78.6H90.5A0.7 0.7 0 0 0 91.2 77.9V74.4A0.7 0.7 0 0 0 90.5 73.7ZM101.4 70.5H105.4V78.6H117V70.5H121V89.9H117V81.8H105.4V89.9H101.4ZM126.8 70.5H146.6V73.7H138.7V89.9H134.7V73.7H126.8Z";
const STRIPES =
  "M5.3 61.6H40.7M5.3 63.75H40.7M5.3 65.89H40.7M5.3 68.04H40.7M5.3 70.18H40.7M5.3 72.33H40.7M5.3 74.48H40.7M5.3 76.62H40.7M5.3 78.77H40.7M5.3 80.92H40.7M5.3 83.06H40.7M5.3 85.21H40.7M5.3 87.35H40.7M5.3 89.5H40.7";

const PALETTES = {
  // Couleurs d'origine, pour les fonds clairs.
  positive: { ink: "#0E1216", stripeTop: "#DDE0E1", stripeBottom: "#A9AEB1" },
  // Lettres et point en blanc, pour les fonds sombres.
  negative: { ink: "#FFFFFF", stripeTop: "#3A4A52", stripeBottom: "#7E9099" },
} as const;

type LogoProps = {
  variant?: keyof typeof PALETTES;
  /** Nom annoncé aux lecteurs d'écran. Vide : le logo est décoratif. */
  title?: string;
  className?: string;
};

export function Logo({ variant = "positive", title = "EPHT", className }: LogoProps) {
  const id = useId();
  const colors = PALETTES[variant];
  const gradient = `${id}-crescent`;
  const stripes = `${id}-stripes`;
  const halo = `${id}-halo`;
  const clip = `${id}-clip`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEW_BOX}
      width={WIDTH}
      height={HEIGHT}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={cn("block h-full w-auto", className)}
    >
      <defs>
        <linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="34" y1="112" x2="122" y2="6">
          <stop offset="0" stopColor="#5AAEC4" />
          <stop offset="0.32" stopColor="#7CC1D4" />
          <stop offset="0.62" stopColor="#9DD6E4" />
          <stop offset="1" stopColor="#B8E3EE" />
        </linearGradient>
        <linearGradient id={stripes} gradientUnits="userSpaceOnUse" x1="0" y1="61.6" x2="0" y2="89.5">
          <stop offset="0" stopColor={colors.stripeTop} />
          <stop offset="0.55" stopColor={colors.stripeBottom} />
        </linearGradient>
        {/* Le point est détouré dans le croissant : l'écart reste visible sur tous les fonds. */}
        <mask id={halo} maskUnits="userSpaceOnUse" x="0" y="0" width="160" height="127">
          <rect width="160" height="127" fill="#fff" />
          <circle cx="49.24" cy="14.82" r="11.2" />
        </mask>
        <clipPath id={clip}>
          <path d={CRESCENT} />
        </clipPath>
      </defs>
      <path d={STRIPES} fill="none" stroke={`url(#${stripes})`} strokeWidth="1" />
      <path d={CRESCENT} fill={`url(#${gradient})`} mask={`url(#${halo})`} />
      <path
        d={STRIPES}
        fill="none"
        stroke="#2E8AA3"
        strokeOpacity="0.22"
        strokeWidth="1"
        clipPath={`url(#${clip})`}
      />
      <circle cx="49.24" cy="14.82" r="9" fill={colors.ink} />
      <path d={WORDMARK} fill={colors.ink} fillRule="evenodd" />
    </svg>
  );
}
