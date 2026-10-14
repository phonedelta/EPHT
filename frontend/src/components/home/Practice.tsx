import { Reveal, RevealGroup, RevealImage, RevealItem } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { HomeSettings, Media } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { ordinal } from "@/lib/format";

/*
 * Composition photographique sur douze colonnes (grands écrans) : une grande
 * image et deux verticales, à hauteur égale. Elle se resserre si l'une des
 * photographies manque.
 */
const LAYOUTS: Record<number, Array<{ span: string; frame: string; sizes: string }>> = {
  1: [{ span: "col-span-2 lg:col-span-12", frame: "aspect-[16/9]", sizes: "(min-width: 1320px) 1240px, 100vw" }],
  2: [
    { span: "col-span-2 lg:col-span-7", frame: "aspect-[16/10]", sizes: "(min-width: 1320px) 720px, (min-width: 1024px) 58vw, 100vw" },
    { span: "col-span-2 lg:col-span-5", frame: "aspect-[16/10]", sizes: "(min-width: 1320px) 510px, (min-width: 1024px) 42vw, 100vw" },
  ],
  3: [
    { span: "col-span-2 lg:col-span-6", frame: "aspect-[16/10]", sizes: "(min-width: 1320px) 610px, (min-width: 1024px) 50vw, 100vw" },
    { span: "col-span-1 lg:col-span-3", frame: "aspect-[3/4]", sizes: "(min-width: 1320px) 300px, (min-width: 1024px) 25vw, 50vw" },
    { span: "col-span-1 lg:col-span-3", frame: "aspect-[3/4]", sizes: "(min-width: 1320px) 300px, (min-width: 1024px) 25vw, 50vw" },
  ],
};

/** Formation pratique : composition photographique sur fond sombre. */
export function Practice({ content }: { content: HomeSettings["practice"] }) {
  const t = getDictionary().home.practice;

  if (!content.title && content.points.length === 0) {
    return null;
  }

  const photos = [content.image, content.image_secondary, content.image_tertiary].filter(
    (photo): photo is Media => photo !== null,
  );
  const layout = LAYOUTS[photos.length] ?? [];

  return (
    <section aria-labelledby="practice-title" className="on-dark section-y bg-ink text-white">
      <div className="container-page">
        <div className="grid items-end gap-y-5 lg:grid-cols-12 lg:gap-x-10">
          <SectionHeader id="practice-title" eyebrow={t.eyebrow} title={content.title} light className="lg:col-span-6" />
          {content.intro ? (
            <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8">
              <p className="text-lead text-white/70">{content.intro}</p>
            </Reveal>
          ) : null}
        </div>

        {photos.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-12 lg:h-[30rem] lg:grid-cols-12">
            {photos.map((photo, index) => (
              <RevealImage
                parallax
                key={photo.id}
                curtain="bg-ink"
                delay={index * 0.08}
                className={cn("rounded-lg", layout[index]?.span)}
              >
                <Photo
                  media={photo}
                  sizes={layout[index]?.sizes ?? "100vw"}
                  className={cn(layout[index]?.frame, "lg:aspect-auto lg:h-full")}
                />
              </RevealImage>
            ))}
          </div>
        ) : null}

        {content.points.length > 0 ? (
          <RevealGroup
            as="ol"
            stagger={0.06}
            className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5"
          >
            {content.points.map((point, index) => (
              <RevealItem as="li" key={point.title} className="relative border-t border-white/15 pt-5">
                <span aria-hidden="true" className="absolute -top-px left-0 h-px w-10 bg-cyan-400" />
                <span aria-hidden="true" className="font-display text-[0.8125rem] font-semibold text-cyan-400">
                  {ordinal(index)}
                </span>
                <h3 className="mt-2.5 font-display text-base font-semibold text-white">{point.title}</h3>
                {point.text ? <p className="mt-1.5 text-sm leading-relaxed text-white/65">{point.text}</p> : null}
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}
      </div>
    </section>
  );
}
