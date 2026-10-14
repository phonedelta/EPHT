"use client";

import { Maximize2 } from "lucide-react";
import { useState } from "react";

import { Lightbox, type LightboxItem } from "@/components/gallery/Lightbox";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { Reveal, RevealImage } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import type { Gallery } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { ordinal } from "@/lib/format";

/**
 * Les espaces de l'école, l'un après l'autre : grande photographie et texte
 * en alternance, vignettes des autres photos de l'espace. Toutes s'ouvrent
 * dans une même visionneuse.
 */
export function SpacesShowcase({ spaces }: { spaces: Gallery[] }) {
  const t = getDictionary().pages.infrastructures;
  const [index, setIndex] = useState<number | null>(null);

  // Toutes les photos de la page, dans l'ordre des espaces, pour la visionneuse.
  const items: LightboxItem[] = spaces.flatMap((space) =>
    space.media
      .filter((media) => media.url !== null)
      .map((media) => ({ media, title: space.title, category: null })),
  );
  const open = (mediaId: number) => setIndex(items.findIndex((item) => item.media.id === mediaId));

  return (
    <>
      <div className="grid gap-16 lg:gap-24">
        {spaces.map((space, position) => {
          const main = space.cover ?? space.media[0] ?? null;
          const others = space.media.filter((media) => media.id !== main?.id && media.url !== null);
          const reversed = position % 2 === 1;

          return (
            <section
              key={space.id}
              id={space.slug}
              aria-labelledby={`${space.slug}-title`}
              className="grid scroll-mt-28 items-center gap-y-8 lg:grid-cols-12 lg:gap-x-12"
            >
              {main ? (
                <div className={cn("lg:col-span-7", reversed && "lg:order-2 lg:col-start-6")}>
                  <button
                    type="button"
                    onClick={() => open(main.id)}
                    aria-label={`${t.open} : ${main.alt}`}
                    className="group relative block w-full text-left"
                  >
                    <RevealImage parallax className="rounded-2xl">
                      <Photo
                        media={main}
                        sizes="(min-width: 1320px) 700px, (min-width: 1024px) 56vw, 100vw"
                        className="aspect-[16/10]"
                        imageClassName="photo-zoom"
                      />
                    </RevealImage>
                    <span
                      aria-hidden="true"
                      className="absolute right-4 top-4 grid size-10 scale-90 place-items-center rounded-full bg-surface/95 text-ink opacity-0 transition-[opacity,transform] duration-300 ease-out-soft group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
                    >
                      <Maximize2 strokeWidth={1.75} className="size-4" />
                    </span>
                  </button>
                </div>
              ) : null}

              <div className={cn("lg:col-span-5", reversed && "lg:order-1 lg:col-start-1")}>
                <Reveal y={10}>
                  <p className="font-display text-sm font-semibold text-cyan-700">
                    {ordinal(position)}
                    <span className="text-muted/70"> / {ordinal(spaces.length - 1)}</span>
                  </p>
                </Reveal>
                <AnimatedText as="h2" id={`${space.slug}-title`} text={space.title} className="text-title mt-3" />
                {space.description ? (
                  <Reveal delay={0.15}>
                    <p className="text-lead mt-4 text-muted">{space.description}</p>
                  </Reveal>
                ) : null}

                {others.length > 0 ? (
                  <Reveal delay={0.2}>
                    <ul className="mt-7 grid grid-cols-3 gap-3">
                      {others.slice(0, 6).map((media) => (
                        <li key={media.id}>
                          <button
                            type="button"
                            onClick={() => open(media.id)}
                            aria-label={`${t.open} : ${media.alt}`}
                            className="group block w-full overflow-hidden rounded-lg"
                          >
                            <Photo media={media} sizes="160px" className="aspect-square" imageClassName="photo-zoom" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <Lightbox items={items} index={index} onChange={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
