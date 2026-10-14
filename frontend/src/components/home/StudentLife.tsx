import type { LightboxItem } from "@/components/gallery/Lightbox";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { Gallery, HomeSettings } from "@/lib/api/schemas";
import { routes } from "@/lib/routes";

import { StudentLifeGallery } from "./StudentLifeGallery";

type StudentLifeProps = {
  content: HomeSettings["student_life"];
  /** Galeries de la rubrique « vie étudiante ». */
  galleries: Gallery[];
};

const MAX_ITEMS = 6;

/**
 * Alterne les galeries pour que l'aperçu de l'accueil montre chaque catégorie
 * plutôt que les six premières photos d'une seule.
 */
export function pickGalleryItems(galleries: Gallery[], limit = MAX_ITEMS): LightboxItem[] {
  const queues = galleries.map((gallery) =>
    gallery.media
      .filter((media) => media.url !== null)
      .map((media) => ({ media, title: gallery.title, category: gallery.category?.label ?? null })),
  );

  const items: LightboxItem[] = [];
  const seen = new Set<number>();

  for (let round = 0; items.length < limit && queues.some((queue) => round < queue.length); round++) {
    for (const queue of queues) {
      const item = queue[round];

      if (item && !seen.has(item.media.id) && items.length < limit) {
        seen.add(item.media.id);
        items.push(item);
      }
    }
  }

  return items;
}

export function StudentLife({ content, galleries }: StudentLifeProps) {
  const t = getDictionary().home.studentLife;
  const items = pickGalleryItems(galleries);

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="student-life-title" className="section-y bg-surface">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="student-life-title"
            eyebrow={t.eyebrow}
            title={content.title}
            intro={content.intro}
            className="max-w-[40rem]"
          />
          <Reveal delay={0.08} className="shrink-0">
            <ArrowLink href={routes.studentLife}>{t.cta}</ArrowLink>
          </Reveal>
        </div>

        <div className="mt-10 lg:mt-12">
          <StudentLifeGallery items={items} />
        </div>
      </div>
    </section>
  );
}
