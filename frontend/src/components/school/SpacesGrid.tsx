import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { Gallery } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { ordinal } from "@/lib/format";
import { routes } from "@/lib/routes";

/**
 * Largeur d'une carte sur grand écran (grille de six colonnes) : trois cartes
 * par rangée, et la dernière rangée, si elle est incomplète, reste pleine.
 */
function spanOf(index: number, total: number): string {
  const remainder = total % 3;
  const inLastRow = index >= total - remainder;

  if (remainder === 2 && inLastRow) {
    return "lg:col-span-3";
  }

  if (remainder === 1 && inLastRow) {
    return "lg:col-span-2 lg:col-start-3";
  }

  return "lg:col-span-2";
}

/** Aperçu des espaces de l'école ; chaque carte mène à sa présentation. */
export function SpacesGrid({ spaces }: { spaces: Gallery[] }) {
  return (
    <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6" stagger={0.06}>
      {spaces.map((space, index) => {
        const photo = space.cover ?? space.media[0] ?? null;
        // Sur deux colonnes, une dernière carte isolée est centrée.
        const lastAlone = spaces.length % 2 === 1 && index === spaces.length - 1;

        return (
          <RevealItem
            as="li"
            key={space.id}
            className={cn(
              spanOf(index, spaces.length),
              lastAlone && "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.625rem)] lg:mx-0 lg:w-auto",
            )}
          >
            <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_20px_40px_-30px_rgb(23_38_44_/_0.45)]">
              {photo ? (
                <Photo
                  media={photo}
                  sizes="(min-width: 1320px) 400px, (min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[16/10]"
                  imageClassName="photo-zoom"
                />
              ) : (
                <div aria-hidden="true" className="aspect-[16/10] bg-cyan-100" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <span aria-hidden="true" className="font-display text-[0.8125rem] font-semibold text-cyan-700">
                  {ordinal(index)}
                </span>
                <h3 className="mt-2 text-subtitle">
                  <Link href={`${routes.infrastructures}#${space.slug}`} className="after:absolute after:inset-0">
                    {space.title}
                  </Link>
                </h3>
                {space.description ? (
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{space.description}</p>
                ) : null}
                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="mt-auto size-4 translate-y-4 text-cyan-700 transition-transform duration-200 ease-out-soft group-hover:translate-x-1"
                />
              </div>
            </article>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
