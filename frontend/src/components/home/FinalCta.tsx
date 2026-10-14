import { AnimatedText } from "@/components/motion/AnimatedText";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import type { HomeSettings } from "@/lib/api/schemas";
import { routes } from "@/lib/routes";

// Arc du croissant du logo, repris en filigrane.
const CRESCENT = "M36.4 112.53A65.45 65.45 0 1 1 148.82 47.27A65.45 65.45 0 0 0 36.4 112.53Z";

type FinalCtaProps = {
  content: HomeSettings["cta"];
  /** Affiche le lien vers la page Contact (inutile sur cette page même). */
  showContact?: boolean;
};

/** Appel final : demander une inscription ou contacter l'école. */
export function FinalCta({ content, showContact = true }: FinalCtaProps) {
  const t = getDictionary().home.cta;

  if (!content.title) {
    return null;
  }

  return (
    <section aria-labelledby="cta-title" className="bg-surface py-14 md:py-20">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-2xl bg-cyan-500 px-6 py-12 sm:px-10 md:px-14 md:py-16 lg:px-16">
          <svg
            aria-hidden="true"
            viewBox="20 4 132 112"
            className="pointer-events-none absolute -right-[38%] top-1/2 -z-10 h-[170%] -translate-y-1/2 text-white/[0.16] sm:-right-[18%] lg:-right-[6%]"
          >
            <path d={CRESCENT} fill="currentColor" />
          </svg>

          <div className="grid items-center gap-y-8 lg:grid-cols-12 lg:gap-x-10">
            <AnimatedText as="h2" id="cta-title" text={content.title} className="text-title text-ink lg:col-span-6" />

            <div className="lg:col-span-5 lg:col-start-8">
              {content.text ? <p className="text-lead text-ink">{content.text}</p> : null}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={routes.admissions} variant="ink">
                  {t.primary}
                </ButtonLink>
                {showContact ? (
                  <ButtonLink href={routes.contact} variant="outline-strong" arrow={false}>
                    {t.secondary}
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
