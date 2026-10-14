import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { HomeSettings } from "@/lib/api/schemas";
import { routes } from "@/lib/routes";

import { StepsTimeline } from "./StepsTimeline";

/** Processus d'admission, étape par étape, avec l'accès à l'inscription. */
export function Admissions({ content }: { content: HomeSettings["admissions"] }) {
  const t = getDictionary().home.admissions;

  if (!content.title && content.steps.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="admissions-title" className="section-y bg-cyan-100">
      <div className="container-page">
        <div className="grid items-end gap-y-6 lg:grid-cols-12 lg:gap-x-10">
          <SectionHeader id="admissions-title" eyebrow={t.eyebrow} title={content.title} className="lg:col-span-6" />
          <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8">
            {content.intro ? <p className="text-lead text-ink-soft">{content.intro}</p> : null}
            <ButtonLink href={routes.admissions} variant="ink" className="mt-6">
              {t.cta}
            </ButtonLink>
          </Reveal>
        </div>

        {content.steps.length > 0 ? (
          <StepsTimeline steps={content.steps} label={t.stepsLabel} className="mt-12 lg:mt-14" />
        ) : null}
      </div>
    </section>
  );
}
