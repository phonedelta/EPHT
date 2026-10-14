import Link from "next/link";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArticleMeta } from "@/components/news/ArticleMeta";
import { ArrowLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { Article, HomeSettings } from "@/lib/api/schemas";
import { routes } from "@/lib/routes";

type NewsProps = {
  content: HomeSettings["news"];
  /** Derniers articles publiés, du plus récent au plus ancien. */
  articles: Article[];
};

/** Les trois derniers articles : le plus récent en grand, les suivants en regard. */
export function News({ content, articles }: NewsProps) {
  const t = getDictionary().home.news;

  if (articles.length === 0) {
    return null;
  }

  const [featured, ...others] = articles;

  return (
    <section aria-labelledby="news-title" className="section-y bg-background">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader id="news-title" eyebrow={t.eyebrow} title={content.title} className="max-w-[40rem]" />
          <Reveal delay={0.08} className="shrink-0">
            <ArrowLink href={routes.news}>{t.all}</ArrowLink>
          </Reveal>
        </div>

        <RevealGroup className="mt-10 grid gap-x-10 gap-y-10 lg:mt-12 lg:grid-cols-12" stagger={0.08}>
          <RevealItem as="article" className="group relative lg:col-span-7">
            {featured.cover ? (
              <Photo
                media={featured.cover}
                sizes="(min-width: 1320px) 700px, (min-width: 1024px) 56vw, 100vw"
                className="aspect-[16/10] rounded-xl"
                imageClassName="photo-zoom"
              />
            ) : null}
            <div className="mt-5">
              <ArticleMeta article={featured} />
              <h3 className="mt-3 text-[1.375rem] font-semibold leading-[1.25] tracking-[-0.02em] sm:text-[1.625rem]">
                <Link
                  href={routes.article(featured.slug)}
                  className="transition-colors duration-200 after:absolute after:inset-0 group-hover:text-cyan-700"
                >
                  {featured.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-[38rem] text-[0.9375rem] leading-relaxed text-muted">{featured.excerpt}</p>
            </div>
          </RevealItem>

          {others.length > 0 ? (
            <div className="grid content-start lg:col-span-5">
              {others.map((article) => (
                <RevealItem
                  as="article"
                  key={article.id}
                  className="group relative grid grid-cols-[7rem_minmax(0,1fr)] gap-5 border-t border-line py-6 sm:grid-cols-[10rem_minmax(0,1fr)] lg:first:border-t-0 lg:first:pt-0"
                >
                  {article.cover ? (
                    <Photo
                      media={article.cover}
                      sizes="(min-width: 640px) 160px, 112px"
                      className="aspect-[4/3] rounded-lg"
                      imageClassName="photo-zoom"
                    />
                  ) : (
                    <div aria-hidden="true" className="aspect-[4/3] rounded-lg bg-cyan-100" />
                  )}
                  <div className="self-center">
                    <ArticleMeta article={article} />
                    <h3 className="mt-2 text-base font-semibold leading-snug tracking-[-0.01em] sm:text-lg">
                      <Link
                        href={routes.article(article.slug)}
                        className="transition-colors duration-200 after:absolute after:inset-0 group-hover:text-cyan-700"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{article.excerpt}</p>
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
