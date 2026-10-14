import type { Article } from "@/lib/api/schemas";
import { formatDate } from "@/lib/format";

/** Catégorie et date de publication d'un article. */
export function ArticleMeta({ article }: { article: Article }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem]">
      {article.category ? (
        <span className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700">
          {article.category.name}
        </span>
      ) : null}
      {article.category && article.published_at ? (
        <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
      ) : null}
      {article.published_at ? (
        <time dateTime={article.published_at} className="text-muted">
          {formatDate(article.published_at)}
        </time>
      ) : null}
    </p>
  );
}
