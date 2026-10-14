import { RevealGroup, RevealImage, RevealItem } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { HomeSettings } from "@/lib/api/schemas";
import { ordinal } from "@/lib/format";

/** Formation pratique : grande composition photographique sur fond sombre. */
export function Practice({ content }: { content: HomeSettings["practice"] }) {
  const t = getDictionary().home.practice;

  if (!content.title && content.points.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="practice-title" className="on-dark section-y bg-ink text-white">
      <div className="container-page">
        <div className="grid items-end gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          <SectionHeader
            id="practice-title"
            eyebrow={t.eyebrow}
            title={content.title}
            intro={content.intro}
            light
            className="lg:col-span-6"
          />
          {content.image_tertiary ? (
            <RevealImage curtain="bg-ink" delay={0.1} className="hidden lg:col-span-4 lg:col-start-9 lg:block">
              <Photo media={content.image_tertiary} sizes="32vw" className="aspect-[16/10]" />
            </RevealImage>
          ) : null}
        </div>

        {content.image || content.image_secondary ? (
          <div className="mt-12 grid items-end gap-5 sm:grid-cols-12 lg:mt-8 lg:gap-8">
            {content.image ? (
              <RevealImage curtain="bg-ink" className="sm:col-span-12 lg:col-span-8">
                <Photo
                  media={content.image}
                  sizes="(min-width: 1024px) 64vw, 100vw"
                  className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[3/2]"
                />
              </RevealImage>
            ) : null}
            {content.image_secondary ? (
              <RevealImage curtain="bg-ink" delay={0.15} className="col-span-1 sm:col-span-6 lg:col-span-4">
                <Photo
                  media={content.image_secondary}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] sm:aspect-[4/5]"
                />
              </RevealImage>
            ) : null}
            {content.image_tertiary ? (
              <RevealImage curtain="bg-ink" delay={0.2} className="hidden sm:col-span-6 sm:block lg:hidden">
                <Photo media={content.image_tertiary} sizes="50vw" className="aspect-[4/5]" />
              </RevealImage>
            ) : null}
          </div>
        ) : null}

        {content.points.length > 0 ? (
          <RevealGroup
            as="ol"
            stagger={0.08}
            className="mt-14 grid border-t border-white/15 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5"
          >
            {content.points.map((point, index) => (
              <RevealItem
                as="li"
                key={point.title}
                className="border-b border-white/15 py-7 sm:pr-8 lg:border-b-0 lg:pb-0 lg:pr-7"
              >
                <span aria-hidden="true" className="font-display text-lg text-cyan-300">
                  {ordinal(index)}
                </span>
                <h3 className="mt-3 text-[1.0625rem] font-bold text-white">{point.title}</h3>
                {point.text ? <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/70">{point.text}</p> : null}
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}
      </div>
    </section>
  );
}
