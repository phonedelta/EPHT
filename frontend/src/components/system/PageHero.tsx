import type { ReactNode } from "react";

import { AnimatedText } from "@/components/motion/AnimatedText";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/system/JsonLd";
import { getDictionary } from "@/i18n";
import type { Media } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/seo";

import { PageVisual } from "./PageVisual";

export type Crumb = { label: string; href: string };

type PageHeroProps = {
  eyebrow: string;
  title: string;
  /** Nom court de la page dans le fil d'Ariane ; le titre par défaut. */
  crumb?: string;
  lead?: string | null;
  /** Pages parentes, de la plus haute à la plus proche ; l'accueil est ajouté d'office. */
  parents?: Crumb[];
  /** Adresse de la page, pour le fil d'Ariane structuré. */
  path: string;
  image?: Media | null;
  /** Vignette posée en biais devant la photographie principale. */
  secondaryImage?: Media | null;
  /** Boutons d'action, sous le texte d'introduction. */
  actions?: ReactNode;
  /** Repères affichés sous les actions. */
  children?: ReactNode;
};

/**
 * En-tête d'une page intérieure, dans la composition du hero de l'accueil :
 * fond dégradé, surtitre, titre dont les mots montent un à un,
 * introduction et, à droite, la photographie de la page sur son aplat cyan.
 */
export function PageHero({
  eyebrow,
  title,
  crumb = title,
  lead,
  parents = [],
  path,
  image = null,
  secondaryImage = null,
  actions,
  children,
}: PageHeroProps) {
  const t = getDictionary();
  const crumbs: Crumb[] = [{ label: t.nav.home, href: routes.home }, ...parents];

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(110deg,#f7fbfb_0%,#f3f9fa_45%,#e9f5f7_100%)]">
      <JsonLd data={breadcrumbJsonLd([...crumbs, { label: crumb, href: path }])} />

      {/* Grand aplat diagonal, très pâle, comme sur l'accueil. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[5%] -top-[60%] -z-10 hidden h-[200%] w-[55%] rotate-[32deg] rounded-[7rem] bg-[#e4f3f6]/70 lg:block"
      />

      <div
        className={cn(
          "container-page relative grid gap-y-10 pb-14 pt-12 md:pb-16 lg:pt-16",
          image && "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-x-12",
        )}
      >
        <div className={cn(image ? "max-w-[36rem]" : "max-w-[46rem]", !image && "lg:py-8")}>
          <Reveal delay={0.05} y={10}>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              {eyebrow}
            </p>
          </Reveal>
          <AnimatedText
            as="h1"
            immediate
            delay={0.1}
            text={title}
            className="mt-4 font-display text-[clamp(2.125rem,0.95rem+2.8vw,3.125rem)] font-[650] leading-[1.06] tracking-[-0.03em] text-[#0f1a1f]"
          />
          {lead ? (
            <Reveal delay={0.3}>
              <p className="mt-5 text-[1.0625rem] leading-[1.6] text-muted sm:text-lg">{lead}</p>
            </Reveal>
          ) : null}

          {actions ? (
            <Reveal delay={0.4} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              {actions}
            </Reveal>
          ) : null}

          {children ? <Reveal delay={0.5}>{children}</Reveal> : null}
        </div>

        {image ? <PageVisual image={image} secondary={secondaryImage} /> : null}
      </div>
    </section>
  );
}
