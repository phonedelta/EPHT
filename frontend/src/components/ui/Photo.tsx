import Image from "next/image";

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
};

/**
 * Photographie de la médiathèque, recadrée pour remplir son cadre autour du
 * point d'intérêt défini dans l'administration.
 */
export function Photo({ media, sizes, className, imageClassName, preload = false, quality = 75 }: PhotoProps) {
  if (!media.url) {
    return null;
  }

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
    </div>
  );
}
