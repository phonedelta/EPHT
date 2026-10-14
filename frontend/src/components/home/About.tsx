import { Reveal, RevealGroup, RevealImage, RevealItem } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { HomeSettings } from "@/lib/api/schemas";
import { routes } from "@/lib/routes";

/** Présentation de l'école : photographie et texte éditorial. */
export function About({ content }: { content: HomeSettings["about"] }) {
  const t = getDictionary().home.about;

  if (!content.title && !content.lead && content.body.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="about-title" className="section-y bg-surface">
      <div className="container-page grid items-center gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        {content.image ? (
          <RevealImage className="lg:col-span-5">
            <Photo
              media={content.image}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/5]"
            />
          </RevealImage>
        ) : null}

        <div className={content.image ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-8"}>
          <SectionHeader id="about-title" eyebrow={t.eyebrow} title={content.title} />

          {content.lead ? (
            <Reveal delay={0.08}>
              <p className="mt-7 font-display text-[1.375rem] leading-[1.4] text-ink sm:text-2xl sm:leading-[1.4]">
                {content.lead}
              </p>
            </Reveal>
          ) : null}

          {content.body.length > 0 ? (
            <Reveal delay={0.14} className="mt-6 grid gap-4">
              {content.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
          ) : null}

          {content.pillars.length > 0 ? (
            <RevealGroup as="div" className="mt-10 border-b border-line">
              {content.pillars.map((pillar) => (
                <RevealItem
                  key={pillar.title}
                  className="grid gap-x-8 gap-y-1 border-t border-line py-5 sm:grid-cols-[11.5rem_minmax(0,1fr)]"
                >
                  <h3 className="text-[0.9375rem] font-bold text-ink">{pillar.title}</h3>
                  {pillar.text ? <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{pillar.text}</p> : null}
                </RevealItem>
              ))}
            </RevealGroup>
          ) : null}

          <Reveal delay={0.1} className="mt-8">
            <ArrowLink href={routes.school}>{t.cta}</ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
