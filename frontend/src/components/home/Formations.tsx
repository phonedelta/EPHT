import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { Formation, HomeSettings } from "@/lib/api/schemas";
import { routes } from "@/lib/routes";

import { FormationGrid } from "./FormationGrid";

type FormationsProps = {
  content: HomeSettings["formations"];
  formations: Formation[];
};

/**
 * Formations publiées, telles que renvoyées par l'API : une colonne sur
 * mobile, deux sur tablette, toutes alignées sur une ligne sur grand écran.
 */
export function Formations({ content, formations }: FormationsProps) {
  const t = getDictionary().home.formations;

  return (
    <section aria-labelledby="formations-title" className="section-y bg-cyan-100">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="formations-title"
            eyebrow={t.eyebrow}
            title={content.title}
            intro={content.intro}
            tinted
            className="max-w-[40rem]"
          />
          {formations.length > 0 ? (
            <Reveal delay={0.08} className="shrink-0">
              <ArrowLink href={routes.formations}>{t.all}</ArrowLink>
            </Reveal>
          ) : null}
        </div>

        {formations.length > 0 ? (
          <FormationGrid formations={formations} className="mt-10 lg:mt-12" />
        ) : (
          <p className="mt-10 border-t border-cyan-200 pt-8 text-ink-soft">{t.empty}</p>
        )}
      </div>
    </section>
  );
}
