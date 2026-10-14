import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FinalCta } from "@/components/home/FinalCta";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal, RevealGroup, RevealImage, RevealItem } from "@/components/motion/Reveal";
import { ArticleCard } from "@/components/news/ArticleCard";
import { PageHero } from "@/components/system/PageHero";
import { ArrowLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import { dataOr, getAllArticles, getArticle, getSiteSettings } from "@/lib/api/queries";
import { siteSettingsSchema } from "@/lib/api/schemas";
import { formatDate, paragraphsOf } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// La page est produite en entier avant d'être envoyée : une adresse inconnue
// reçoit ainsi un vrai statut 404, et non un squelette suivi d'une erreur.
export const ensureStatic = "navigation";

const PLACEHOLDER = "__aucun-article__";

export async function generateStaticParams() {
  const articles = dataOr(await getAllArticles(), { articles: [], categories: [] }).articles;

  return articles.length > 0 ? articles.map(({ slug }) => ({ slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/actualites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticle(slug);

  if (!result.ok) {
    return {};
  }

  const { article } = result.data;

  return pageMetadata({
    title: article.seo.title ?? article.title,
    description: article.seo.description ?? article.excerpt,
    path: routes.article(slug),
    image: article.cover,
  });
}

/** Article complet, suivi des articles de la même catégorie. */
export default async function ArticlePage({ params }: PageProps<"/actualites/[slug]">) {
  const { slug } = await params;
  const result = slug === PLACEHOLDER ? null : await getArticle(slug);

  if (!result?.ok) {
    notFound();
  }

  const t = getDictionary();
  const { article, related } = result.data;
  const settings = dataOr(await getSiteSettings(), siteSettingsSchema.parse({}));

  return (
    <PageTransition>
      <article>
        <PageHero
          eyebrow={article.category?.name ?? t.nav.news}
          title={article.title}
          lead={article.excerpt}
          parents={[{ label: t.nav.news, href: routes.news }]}
          path={routes.article(article.slug)}
        >
          {article.published_at ? (
            <p className="mt-6 text-[0.9375rem] text-muted">
              <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
            </p>
          ) : null}
        </PageHero>

        <div className="bg-surface pb-16 pt-10 md:pb-20 md:pt-12">
          <div className="container-page">
            {article.cover ? (
              <RevealImage parallax className="rounded-2xl">
                <Photo
                  media={article.cover}
                  preload
                  sizes="(min-width: 1320px) 1240px, 100vw"
                  className="aspect-[16/9] lg:aspect-[21/9]"
                />
              </RevealImage>
            ) : null}

            <Reveal className="mx-auto mt-12 grid max-w-[42rem] gap-5 text-[1.0625rem] leading-[1.8] text-ink-soft">
              {paragraphsOf(article.content).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="mt-6 border-t border-line pt-8">
                <ArrowLink href={routes.news}>{t.home.news.all}</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="section-y bg-background">
          <div className="container-page">
            <SectionHeader
              id="related-title"
              eyebrow={t.pages.news.relatedEyebrow}
              title={t.pages.news.relatedTitle}
              className="mb-10"
            />
            <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6" stagger={0.06}>
              {related.map((item) => (
                <RevealItem key={item.id}>
                  <ArticleCard article={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      <FinalCta content={settings.home.cta} />
    </PageTransition>
  );
}
