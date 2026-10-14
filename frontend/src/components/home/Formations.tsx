import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { Formation, HomeSettings } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

import { FormationCard } from "./FormationCard";

type FormationsProps = {
  content: HomeSettings["formations"];
  formations: Formation[];
};

// Mosaïque : une grande carte et une plus étroite, inversées à la ligne suivante.
const WIDE = { span: "lg:col-span-7", sizes: "(min-width: 1024px) 56vw, (min-width: 768px) 50vw, 100vw" };
const NARROW = { span: "lg:col-span-5", sizes: "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw" };
const FULL = { span: "md:col-span-2 lg:col-span-12", sizes: "100vw" };

function layoutFor(index: number, total: number) {
  // Une dernière carte isolée occupe toute la largeur.
  if (total % 2 === 1 && index === total - 1) {
    return FULL;
  }

  return index % 4 === 0 || index % 4 === 3 ? WIDE : NARROW;
}

/** Formations publiées, telles que renvoyées par l'API. */
export function Formations({ content, formations }: FormationsProps) {
  const t = getDictionary().home.formations;

  return (
    <section aria-labelledby="formations-title" className="section-y bg-background">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="formations-title"
            eyebrow={t.eyebrow}
            title={content.title}
            intro={content.intro}
            className="max-w-[40rem]"
          />
          {formations.length > 0 ? (
            <Reveal delay={0.1} className="shrink-0">
              <ArrowLink href={routes.formations}>{t.all}</ArrowLink>
            </Reveal>
          ) : null}
        </div>

        {formations.length > 0 ? (
          <RevealGroup className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:mt-20 lg:grid-cols-12" stagger={0.12}>
            {formations.map((formation, index) => {
              const layout = layoutFor(index, formations.length);

              return (
                <RevealItem key={formation.id} className={cn(layout.span)}>
                  <FormationCard formation={formation} index={index} sizes={layout.sizes} />
                </RevealItem>
              );
            })}
          </RevealGroup>
        ) : (
          <p className="mt-12 border-t border-line pt-8 text-muted">{t.empty}</p>
        )}
      </div>
    </section>
  );
}
