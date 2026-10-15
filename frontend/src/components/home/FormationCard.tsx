import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

import { DiplomaBadge } from "@/components/formations/DiplomaBadge";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import type { Formation } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { ordinal } from "@/lib/format";
import { diplomaCode } from "@/lib/formations";
import { routes } from "@/lib/routes";

type FormationCardProps = {
  formation: Formation;
  index: number;
  /** Largeurs d'affichage de la photographie. */
  sizes: string;
  /** Carte en pleine largeur sur deux colonnes : photographie et texte côte à côte. */
  wide?: boolean;
  /** Carte étroite, alignée avec les autres sur une seule ligne (grand écran). */
  compact?: boolean;
  className?: string;
};

/**
 * Formation dans la liste de l'accueil. Durée, diplôme et capacité n'apparaissent
 * que s'ils sont renseignés, c'est-à-dire confirmés par l'école.
 */
export function FormationCard({ formation, index, sizes, wide = false, compact = false, className }: FormationCardProps) {
  const t = getDictionary().home.formations;
  const duration = formation.duration?.label ?? (formation.duration?.months ? `${formation.duration.months} mois` : null);
  const code = diplomaCode(formation);
  const places = formation.capacity?.per_group ?? null;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_20px_40px_-30px_rgb(23_38_44_/_0.45)]",
        wide && "md:grid md:grid-cols-2",
        wide && compact && "xl:flex",
        className,
      )}
    >
      {code ? (
        <DiplomaBadge code={code} title={formation.diploma} className="absolute left-4 top-4 z-10 shadow-[0_2px_8px_rgb(23_38_44/0.25)]" />
      ) : null}

      {formation.cover ? (
        <Photo
          media={formation.cover}
          sizes={sizes}
          className={cn(
            "aspect-[16/10]",
            wide && "md:aspect-auto md:h-full md:min-h-[18rem]",
            compact && "xl:aspect-[4/3]",
            wide && compact && "xl:h-auto xl:min-h-0",
          )}
          imageClassName="photo-zoom"
        />
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            "aspect-[16/10] bg-cyan-100",
            wide && "md:aspect-auto md:h-full",
            compact && "xl:aspect-[4/3]",
            wide && compact && "xl:h-auto",
          )}
        />
      )}

      <div className={cn("flex flex-1 flex-col p-6 lg:p-7", compact && "xl:p-6")}>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="font-display text-[0.8125rem] font-semibold text-cyan-700">
            {ordinal(index)}
          </span>
          {formation.category ? (
            <>
              <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
              <p className="eyebrow text-muted">{formation.category.name}</p>
            </>
          ) : null}
        </div>

        <h3 className={cn("text-subtitle mt-3", compact && "xl:text-[1.125rem]")}>
          {/* Le lien couvre toute la carte ; son intitulé reste le nom de la formation. */}
          <Link href={routes.formation(formation.slug)} className="after:absolute after:inset-0">
            {formation.title}
          </Link>
        </h3>

        <p className="mt-2.5 max-w-[34rem] text-[0.9375rem] leading-relaxed text-muted">{formation.summary}</p>

        {duration ? (
          <dl className="mt-5 flex flex-wrap gap-2 text-[0.8125rem]">
            <div className="flex gap-1.5 rounded-md bg-cyan-50 px-2.5 py-1">
              <dt className="text-ink-soft">{t.duration}</dt>
              <dd className="font-medium text-ink">{duration}</dd>
            </div>
          </dl>
        ) : null}

        {/* Pied de carte : diplôme et capacité, puis l'invitation à consulter la fiche. */}
        <div className="mt-auto pt-6">
          {formation.diploma || places ? (
            <dl className="flex items-center justify-between gap-3 border-t border-line pt-4 text-[0.8125rem]">
              {formation.diploma ? (
                <div className="min-w-0">
                  <dt className="sr-only">{formation.level ? t.level : t.diploma}</dt>
                  <dd className="leading-snug text-muted">{formation.level ?? formation.diploma}</dd>
                </div>
              ) : null}
              {places ? (
                <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-cyan-50 px-2.5 py-1 font-medium text-cyan-800">
                  <dt className="sr-only">{t.capacity}</dt>
                  <Users aria-hidden="true" strokeWidth={1.75} className="size-3.5" />
                  <dd className="tabular-nums">{t.places(places)}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <p aria-hidden="true" className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-cyan-700">
            {t.cta}
            <ArrowRight
              strokeWidth={1.75}
              className="size-4 transition-transform duration-200 ease-out-soft group-hover:translate-x-1"
            />
          </p>
        </div>
      </div>
    </article>
  );
}
