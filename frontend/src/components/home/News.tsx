import Link from "next/link";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { Article, HomeSettings } from "@/lib/api/schemas";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";

type NewsProps = {
  content: HomeSettings["news"];
  /** Derniers articles publiés, du plus récent au plus ancien. */
  articles: Article[];
};

function ArticleMeta({ article }: { article: Article }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem]">
      {article.category ? (
        <span className="font-bold uppercase tracking-[0.14em] text-cyan-700">{article.category.name}</span>
      ) : null}
      {article.category && article.published_at ? (
        <span aria-hidden="true" className="h-3 w-px bg-ink/20" />
      ) : null}
      {article.published_at ? (
        <time dateTime={article.published_at} className="text-muted">
          {formatDate(article.published_at)}
        </time>
      ) : null}
    </p>
  );
}

/** Les trois derniers articles : le plus récent en grand, les suivants en regard. */
export function News({ content, articles }: NewsProps) {
  const t = getDictionary().home.news;

  if (articles.length === 0) {
    return null;
  }

  const [featured, ...others] = articles;

  return (
    <section aria-labelledby="news-title" className="section-y bg-surface">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader id="news-title" eyebrow={t.eyebrow} title={content.title} className="max-w-[40rem]" />
          <Reveal delay={0.1} className="shrink-0">
            <ArrowLink href={routes.news}>{t.all}</ArrowLink>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid gap-x-8 gap-y-12 lg:mt-16 lg:grid-cols-12" stagger={0.12}>
          <RevealItem as="article" className="group relative lg:col-span-7">
            {featured.cover ? (
              <Photo
                media={featured.cover}
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="aspect-[3/2] lg:aspect-[16/10]"
                imageClassName="photo-zoom"
              />
            ) : null}
            <div className="mt-6">
              <ArticleMeta article={featured} />
              <h3 className="mt-3 font-display text-[1.75rem] leading-[1.15] text-ink sm:text-[2.125rem]">
                <Link href={routes.article(featured.slug)} className="after:absolute after:inset-0">
                  <span className="link-underline pb-0.5 group-hover:bg-[length:100%_1px]">{featured.title}</span>
                </Link>
              </h3>
              <p className="mt-3 max-w-[38rem] text-ink-soft">{featured.excerpt}</p>
            </div>
          </RevealItem>

          {others.length > 0 ? (
            <div className="grid content-start lg:col-span-5">
              {others.map((article) => (
                <RevealItem
                  as="article"
                  key={article.id}
                  className="group relative grid grid-cols-[6.5rem_minmax(0,1fr)] gap-5 border-t border-line py-7 first:border-t-0 first:pt-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6 lg:first:border-t lg:first:pt-7"
                >
                  {article.cover ? (
                    <Photo
                      media={article.cover}
                      sizes="(min-width: 640px) 144px, 104px"
                      className="aspect-[4/5]"
                      imageClassName="photo-zoom"
                      hideIllustrativeLabel
                    />
                  ) : (
                    <div aria-hidden="true" className="aspect-[4/5] bg-cyan-100" />
                  )}
                  <div className="self-center">
                    <ArticleMeta article={article} />
                    <h3 className="mt-2.5 font-display text-xl leading-snug text-ink sm:text-[1.375rem]">
                      <Link href={routes.article(article.slug)} className="after:absolute after:inset-0">
                        <span className="link-underline pb-0.5 group-hover:bg-[length:100%_1px]">{article.title}</span>
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[0.9375rem] text-ink-soft">{article.excerpt}</p>
                  </div>
                </RevealItem>
              ))}
            </div>
          ) : null}
        </RevealGroup>
      </div>
    </section>
  );
}
