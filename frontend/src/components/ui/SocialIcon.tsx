import type { ReactNode, SVGProps } from "react";

/*
 * Pictogrammes des réseaux sociaux. Lucide ne fournit plus d'icônes de
 * marques : celles-ci sont dessinées ici sur la même grille (24 × 24).
 */
const GLYPHS = {
  facebook: (
    <path d="M13.5 22v-8.25h2.77l.42-3.22H13.5V8.47c0-.93.26-1.57 1.6-1.57h1.7V4.02c-.3-.04-1.31-.13-2.49-.13-2.46 0-4.15 1.5-4.15 4.26v2.38H7.38v3.22h2.78V22z" />
  ),
  instagram: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.15" />
    </>
  ),
  linkedin: (
    <>
      <circle cx="5.3" cy="5.4" r="1.9" />
      <path d="M3.7 9h3.2v11.4H3.7zM9.7 9h3.05v1.6c.6-1.1 1.9-1.9 3.55-1.9 3 0 4.1 1.9 4.1 4.9v6.8h-3.2v-6.1c0-1.6-.5-2.7-2-2.7-1.55 0-2.3 1.1-2.3 2.8v6H9.7z" />
    </>
  ),
  youtube: (
    <path
      fillRule="evenodd"
      d="M4.6 6h14.8A2.6 2.6 0 0 1 22 8.6v6.8a2.6 2.6 0 0 1-2.6 2.6H4.6A2.6 2.6 0 0 1 2 15.4V8.6A2.6 2.6 0 0 1 4.6 6zM10 9.2v5.6l4.8-2.8z"
    />
  ),
  tiktok: (
    <path d="M14.1 3h2.8c.2 1.9 1.4 3.3 3.3 3.5v2.8c-1.2 0-2.3-.3-3.3-.9v6.2a5.3 5.3 0 1 1-5.3-5.3c.3 0 .5 0 .8.1v2.9a2.45 2.45 0 1 0 1.7 2.3z" />
  ),
} as const satisfies Record<string, ReactNode>;

export type SocialNetwork = keyof typeof GLYPHS;

export const SOCIAL_NETWORKS = Object.keys(GLYPHS) as SocialNetwork[];

export const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export function SocialIcon({ network, ...props }: { network: SocialNetwork } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {GLYPHS[network]}
    </svg>
  );
}
