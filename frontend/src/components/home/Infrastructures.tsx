import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { Gallery, HomeSettings } from "@/lib/api/schemas";
import { routes } from "@/lib/routes";

import { InfrastructureShowcase } from "./InfrastructureShowcase";

type InfrastructuresProps = {
  content: HomeSettings["infrastructures"];
  /** Galeries de la rubrique « infrastructure », une par espace. */
  galleries: Gallery[];
};

export function Infrastructures({ content, galleries }: InfrastructuresProps) {
  const t = getDictionary().home.infrastructures;

  if (galleries.length === 0) {
    return null;
  }

  const spaces = galleries.map((gallery) => ({
    id: gallery.id,
    title: gallery.title,
    description: gallery.description,
    photo: gallery.cover ?? gallery.media[0] ?? null,
  }));

  return (
    <section aria-labelledby="infrastructures-title" className="section-y bg-background">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="infrastructures-title"
            eyebrow={t.eyebrow}
            title={content.title}
            intro={content.intro}
            className="max-w-[40rem]"
          />
          <Reveal delay={0.08} className="shrink-0">
            <ArrowLink href={routes.infrastructures}>{t.cta}</ArrowLink>
          </Reveal>
        </div>

        <Reveal delay={0.05} className="mt-10 lg:mt-12">
          <InfrastructureShowcase spaces={spaces} label={t.listLabel} />
        </Reveal>
      </div>
    </section>
  );
}
