import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import type { Article } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

import { ArticleMeta } from "./ArticleMeta";

type ArticleCardProps = {
  article: Article;
  /** Article mis en avant : photographie et texte côte à côte sur grand écran. */
  featured?: boolean;
  sizes?: string;
  className?: string;
};

/** Carte d'un article ; le lien couvre toute la carte. */
export function ArticleCard({ article, featured = false, sizes, className }: ArticleCardProps) {
  const t = getDictionary().common;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_20px_40px_-30px_rgb(23_38_44_/_0.45)]",
        featured && "lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]",
        className,
      )}
    >
      {article.cover ? (
        <Photo
          media={article.cover}
          sizes={
            sizes ??
            (featured
              ? "(min-width: 1320px) 660px, (min-width: 1024px) 53vw, 100vw"
              : "(min-width: 1320px) 400px, (min-width: 768px) 50vw, 100vw")
          }
          className={cn("aspect-[16/10]", featured && "lg:aspect-auto lg:h-full lg:min-h-[22rem]")}
          imageClassName="photo-zoom"
        />
      ) : (
        <div aria-hidden="true" className={cn("aspect-[16/10] bg-cyan-100", featured && "lg:aspect-auto lg:h-full")} />
      )}

      <div className={cn("flex flex-1 flex-col p-6", featured && "lg:justify-center lg:p-10")}>
        <ArticleMeta article={article} />
        <h3
          className={cn(
            "mt-3 font-semibold tracking-[-0.015em] text-ink transition-colors duration-200 group-hover:text-cyan-700",
            featured ? "text-[1.375rem] leading-[1.25] sm:text-[1.75rem]" : "text-lg leading-snug",
          )}
        >
          <Link href={routes.article(article.slug)} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className={cn("mt-2.5 text-[0.9375rem] leading-relaxed text-muted", !featured && "line-clamp-3")}>
          {article.excerpt}
        </p>
        <p aria-hidden="true" className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.9375rem] font-medium text-cyan-700">
          {t.readMore}
          <ArrowRight
            strokeWidth={1.75}
            className="size-4 transition-transform duration-200 ease-out-soft group-hover:translate-x-1"
          />
        </p>
      </div>
    </article>
  );
}
