import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import type { Formation } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { ordinal } from "@/lib/format";
import { routes } from "@/lib/routes";

type FormationCardProps = {
  formation: Formation;
  index: number;
  /** Largeurs d'affichage de la photographie. */
  sizes: string;
  className?: string;
};

/**
 * Formation dans la liste de l'accueil. Durée et diplôme n'apparaissent que
 * s'ils sont renseignés, c'est-à-dire confirmés par l'école.
 */
export function FormationCard({ formation, index, sizes, className }: FormationCardProps) {
  const t = getDictionary().home.formations;
  const duration = formation.duration?.label ?? (formation.duration?.months ? `${formation.duration.months} mois` : null);

  return (
    <article className={cn("group relative flex flex-col", className)}>
      {formation.cover ? (
        <Photo
          media={formation.cover}
          sizes={sizes}
          className="h-[clamp(15rem,60vw,24rem)] lg:h-[27rem]"
          imageClassName="photo-zoom"
        />
      ) : (
        <div aria-hidden="true" className="h-[clamp(15rem,60vw,24rem)] bg-cyan-100 lg:h-[27rem]" />
      )}

      <div className="mt-6 flex items-baseline gap-4">
        <span aria-hidden="true" className="font-display text-xl text-cyan-600">
          {ordinal(index)}
        </span>
        {formation.category ? <p className="eyebrow text-muted">{formation.category.name}</p> : null}
      </div>

      <h3 className="text-subtitle mt-3">
        {/* Le lien couvre toute la carte ; son intitulé reste le nom de la formation. */}
        <Link href={routes.formation(formation.slug)} className="after:absolute after:inset-0">
          {formation.title}
        </Link>
      </h3>

      <p className="mt-3 max-w-[32rem] text-ink-soft">{formation.summary}</p>

      {duration || formation.diploma ? (
        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[0.9375rem]">
          {duration ? (
            <div className="flex gap-2">
              <dt className="text-muted">{t.duration}</dt>
              <dd className="font-semibold text-ink">{duration}</dd>
            </div>
          ) : null}
          {formation.diploma ? (
            <div className="flex gap-2">
              <dt className="text-muted">{t.diploma}</dt>
              <dd className="font-semibold text-ink">{formation.diploma}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      <p aria-hidden="true" className="mt-6 inline-flex items-center gap-3 text-[0.9375rem] font-semibold text-ink">
        <span className="link-underline pb-1 group-hover:bg-[length:100%_1px]">{t.cta}</span>
        <ArrowRight
          strokeWidth={1.75}
          className="size-4 text-cyan-700 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
        />
      </p>
    </article>
  );
}
