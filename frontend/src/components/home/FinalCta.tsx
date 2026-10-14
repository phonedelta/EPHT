import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import type { HomeSettings } from "@/lib/api/schemas";
import { routes } from "@/lib/routes";

// Arc du croissant du logo, repris en filigrane.
const CRESCENT = "M36.4 112.53A65.45 65.45 0 1 1 148.82 47.27A65.45 65.45 0 0 0 36.4 112.53Z";

/** Appel final : demander une inscription ou contacter l'école. */
export function FinalCta({ content }: { content: HomeSettings["cta"] }) {
  const t = getDictionary().home.cta;

  if (!content.title) {
    return null;
  }

  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-cyan-400">
      <svg
        aria-hidden="true"
        viewBox="20 4 132 112"
        className="pointer-events-none absolute -right-[30%] top-1/2 h-[210%] -translate-y-[44%] text-cyan-300/45 md:-right-[10%]"
      >
        <path d={CRESCENT} fill="currentColor" />
      </svg>

      <div className="container-page relative grid items-end gap-y-10 py-20 lg:grid-cols-12 lg:gap-x-8 lg:py-28">
        <Reveal className="lg:col-span-7">
          <h2 id="cta-title" className="font-display text-[clamp(2.125rem,1.4rem+2.9vw,3.5rem)] leading-[1.08] text-ink">
            {content.title}
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9">
          {content.text ? <p className="text-lead text-ink/85">{content.text}</p> : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col xl:flex-row">
            <ButtonLink href={routes.admissions} variant="ink">
              {t.primary}
            </ButtonLink>
            <ButtonLink href={routes.contact} variant="outline-strong" arrow={false}>
              {t.secondary}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
