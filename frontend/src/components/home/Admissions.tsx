import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { HomeSettings } from "@/lib/api/schemas";
import { ordinal } from "@/lib/format";
import { routes } from "@/lib/routes";

/** Processus d'admission, étape par étape. */
export function Admissions({ content }: { content: HomeSettings["admissions"] }) {
  const t = getDictionary().home.admissions;

  if (!content.title && content.steps.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="admissions-title" className="section-y bg-cyan-50">
      <div className="container-page">
        <div className="grid items-end gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <SectionHeader
            id="admissions-title"
            eyebrow={t.eyebrow}
            title={content.title}
            className="lg:col-span-6"
          />
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            {content.intro ? <p className="text-lead text-ink-soft">{content.intro}</p> : null}
            <ButtonLink href={routes.admissions} variant="ink" className="mt-7">
              {t.cta}
            </ButtonLink>
          </Reveal>
        </div>

        {content.steps.length > 0 ? (
          <RevealGroup
            as="ol"
            stagger={0.12}
            aria-label={t.stepsLabel}
            className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
          >
            {content.steps.map((step, index) => (
              <RevealItem as="li" key={step.title} className="relative border-t border-cyan-700/25 pb-10 pt-7">
                {/* Repère sur le filet : marque la progression d'une étape à l'autre. */}
                <span aria-hidden="true" className="absolute -top-[5px] left-0 size-[9px] rounded-full bg-cyan-600" />
                <span aria-hidden="true" className="font-display text-[2.75rem] leading-none text-cyan-700">
                  {ordinal(index)}
                </span>
                <h3 className="mt-5 text-[1.0625rem] font-bold text-ink">{step.title}</h3>
                {step.text ? <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{step.text}</p> : null}
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}
      </div>
    </section>
  );
}
