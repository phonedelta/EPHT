import { CalendarHeart, ChefHat, DoorOpen, GraduationCap, Mic, Sparkles, type LucideIcon } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { Gallery, Media } from "@/lib/api/schemas";

// Ordre d'affichage et pictogramme de chaque catégorie de publication.
const CATEGORIES: Array<{ value: string; icon: LucideIcon }> = [
  { value: "travaux-pratiques", icon: ChefHat },
  { value: "realisations-etudiantes", icon: Sparkles },
  { value: "evenements", icon: CalendarHeart },
  { value: "conferences", icon: Mic },
  { value: "soutenances", icon: GraduationCap },
  { value: "portes-ouvertes", icon: DoorOpen },
];

type Moment = { value: string; icon: LucideIcon; title: string; text: string; photo: Media | null; count: number };

/**
 * Les temps forts de l'année, une carte par catégorie. Les catégories qui ont
 * des photos publiées les montrent, en grand ; les autres restent sobres.
 */
export function YearMoments({ galleries }: { galleries: Gallery[] }) {
  const t = getDictionary().pages.studentLife;

  const moments: Moment[] = CATEGORIES.flatMap(({ value, icon }) => {
    const entry = t.moments[value];

    if (!entry) {
      return [];
    }

    const media = galleries
      .filter((gallery) => gallery.category?.value === value)
      .flatMap((gallery) => (gallery.cover?.url ? [gallery.cover, ...gallery.media] : gallery.media))
      .filter((item) => item.url !== null && item.type === "image");
    const unique = media.filter((item, index) => media.findIndex((other) => other.id === item.id) === index);

    return [{ value, icon, title: entry[0], text: entry[1], photo: unique[0] ?? null, count: unique.length }];
  });

  // Les catégories illustrées d'abord : elles ouvrent la grille sur deux colonnes.
  const featured = moments.filter((moment) => moment.photo).slice(0, 2);
  const others = moments.filter((moment) => !featured.includes(moment));
  const sorted = [...featured, ...others];

  // Largeurs sur 12 colonnes : aucune rangée ne reste à moitié vide.
  const featuredSpan = featured.length === 1 ? "lg:col-span-12" : "lg:col-span-6";
  const otherSpan =
    others.length % 4 === 0 ? "lg:col-span-3" : others.length % 3 === 0 ? "lg:col-span-4" : others.length % 2 === 0 ? "lg:col-span-6" : "lg:col-span-4";

  return (
    <section aria-labelledby="moments-title" className="section-y bg-surface">
      <div className="container-page">
        <SectionHeader
          id="moments-title"
          eyebrow={t.momentsEyebrow}
          title={t.momentsTitle}
          intro={t.momentsIntro}
          className="max-w-[40rem]"
        />

        <RevealGroup as="ul" stagger={0.07} className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-12 lg:gap-5">
          {sorted.map((moment, index) => {
            const Icon = moment.icon;
            const isFeatured = index < featured.length;

            return (
              <RevealItem
                as="li"
                key={moment.value}
                className={isFeatured ? featuredSpan : otherSpan}
              >
                {isFeatured && moment.photo ? (
                  <article className="group relative isolate flex h-full min-h-[19rem] flex-col justify-end overflow-hidden rounded-2xl p-6 text-white sm:p-7 lg:min-h-[22rem]">
                    <Photo
                      media={moment.photo}
                      sizes="(min-width: 1024px) 600px, (min-width: 640px) 50vw, 100vw"
                      className="!absolute inset-0 -z-20"
                      imageClassName="transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_26_31/0)_25%,rgb(16_26_31/0.82)_100%)]"
                    />
                    <span className="mb-auto inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      <Icon aria-hidden="true" strokeWidth={1.75} className="size-3.5" />
                      {t.photos(moment.count)}
                    </span>
                    <h3 className="mt-6 text-subtitle text-white">{moment.title}</h3>
                    <p className="mt-2 max-w-[28rem] text-[0.9375rem] leading-relaxed text-white/80">{moment.text}</p>
                  </article>
                ) : (
                  <article className="group flex h-full flex-col rounded-2xl border border-line bg-background p-6 transition-[border-color,box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_20px_40px_-30px_rgb(23_38_44_/_0.45)] sm:p-7">
                    <span className="grid size-11 place-items-center rounded-xl bg-cyan-100 text-cyan-700 transition-colors duration-300 group-hover:bg-cyan-600 group-hover:text-white">
                      <Icon aria-hidden="true" strokeWidth={1.75} className="size-5" />
                    </span>
                    <h3 className="mt-5 text-subtitle">{moment.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{moment.text}</p>
                  </article>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
