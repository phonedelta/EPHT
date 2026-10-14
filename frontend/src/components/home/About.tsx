import { Reveal, RevealGroup, RevealImage, RevealItem } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { HomeSettings } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

/** Présentation de l'école : photographie et texte éditorial. */
export function About({ content }: { content: HomeSettings["about"] }) {
  const t = getDictionary().home.about;

  if (!content.title && !content.lead && content.body.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="about-title" className="section-y bg-surface">
      <div className="container-page grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16">
        {content.image ? (
          <RevealImage parallax className="rounded-xl lg:col-span-5">
            <Photo
              media={content.image}
              sizes="(min-width: 1320px) 500px, (min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]"
            />
          </RevealImage>
        ) : null}

        <div className={content.image ? "lg:col-span-7" : "lg:col-span-9"}>
          <SectionHeader id="about-title" eyebrow={t.eyebrow} title={content.title} />

          {content.lead ? (
            <Reveal delay={0.06}>
              <p className="mt-5 font-display text-lg font-medium leading-[1.55] tracking-[-0.01em] text-ink sm:text-xl sm:leading-[1.55]">
                {content.lead}
              </p>
            </Reveal>
          ) : null}

          {content.body.length > 0 ? (
            <Reveal
              delay={0.1}
              className={cn("mt-5 grid gap-4 text-[0.9375rem] leading-[1.7] text-ink-soft", content.body.length > 1 && "md:grid-cols-2 md:gap-8")}
            >
              {content.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
          ) : null}

          {content.pillars.length > 0 ? (
            <RevealGroup as="div" className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-8">
              {content.pillars.map((pillar) => (
                <RevealItem key={pillar.title} className="relative border-t border-line pt-5">
                  {/* Repère turquoise posé sur le filet. */}
                  <span aria-hidden="true" className="absolute -top-px left-0 h-0.5 w-8 rounded-full bg-cyan-500" />
                  <h3 className="font-display text-[0.9375rem] font-semibold text-ink">{pillar.title}</h3>
                  {pillar.text ? <p className="mt-1.5 text-sm leading-relaxed text-muted">{pillar.text}</p> : null}
                </RevealItem>
              ))}
            </RevealGroup>
          ) : null}

          <Reveal delay={0.08} className="mt-8">
            <ArrowLink href={routes.school}>{t.cta}</ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
