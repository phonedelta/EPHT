import Image from "next/image";

import { getDictionary } from "@/i18n";
import type { Media } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";

type PhotoProps = {
  media: Media;
  /** Largeurs d'affichage, pour que le navigateur choisisse la bonne taille. */
  sizes: string;
  /** Classes du cadre : elles fixent la taille ou le ratio de l'image. */
  className?: string;
  imageClassName?: string;
  /** À réserver à l'image principale visible dès l'ouverture de la page. */
  preload?: boolean;
  quality?: 60 | 75 | 85;
  /** Masque la mention « Photo d'illustration » (vignettes trop petites). */
  hideIllustrativeLabel?: boolean;
};

/**
 * Photographie de la médiathèque, recadrée pour remplir son cadre autour du
 * point d'intérêt défini dans l'administration.
 *
 * Une image d'illustration porte toujours sa mention : elle n'est jamais
 * présentée comme une vue de l'établissement. La mention disparaît d'elle-même
 * dès qu'une photographie officielle la remplace.
 */
export function Photo({
  media,
  sizes,
  className,
  imageClassName,
  preload = false,
  quality = 75,
  hideIllustrativeLabel = false,
}: PhotoProps) {
  if (!media.url) {
    return null;
  }

  const t = getDictionary();

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: media.dominant_color ?? undefined }}
    >
      <Image
        src={media.url}
        alt={media.alt}
        fill
        sizes={sizes}
        quality={quality}
        preload={preload}
        className={cn("object-cover", imageClassName)}
        style={{ objectPosition: `${media.focal_point.x}% ${media.focal_point.y}%` }}
      />
      {media.is_illustrative && !hideIllustrativeLabel ? (
        <span className="pointer-events-none absolute bottom-0 left-0 bg-ink/60 px-2.5 py-1.5 text-[0.625rem] font-semibold uppercase leading-none tracking-[0.14em] text-white">
          {t.common.illustrativePhoto}
        </span>
      ) : null}
    </div>
  );
}
