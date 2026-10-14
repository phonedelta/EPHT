import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RevealImage } from "@/components/motion/Reveal";
import { PageIntro } from "@/components/system/PageIntro";
import { ArrowLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import { dataOr, getArticle, getLatestArticles } from "@/lib/api/queries";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// La page est produite en entier avant d'être envoyée : une adresse inconnue
// reçoit ainsi un vrai statut 404, et non un squelette suivi d'une erreur.
export const ensureStatic = "navigation";

const PLACEHOLDER = "__aucun-article__";

export async function generateStaticParams() {
  const articles = dataOr(await getLatestArticles(12), []);

  return articles.length > 0 ? articles.map(({ slug }) => ({ slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/actualites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticle(slug);

  if (!result.ok) {
    return {};
  }

  return pageMetadata({
    title: result.data.title,
    description: result.data.excerpt,
    path: routes.article(slug),
    image: result.data.cover,
  });
}

/**
 * Texte brut des paragraphes d'un contenu HTML. Tant que l'éditeur et le
 * nettoyage côté serveur ne sont pas en place, aucun HTML venu de l'API n'est
 * injecté dans la page.
 */
function paragraphsOf(html: string): string[] {
  return html
    .split(/<\/p>|<br\s*\/?>/i)
    .map((chunk) =>
      chunk
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'")
        .trim(),
    )
    .filter(Boolean);
}

export default async function ArticlePage({ params }: PageProps<"/actualites/[slug]">) {
  const { slug } = await params;
  const result = slug === PLACEHOLDER ? null : await getArticle(slug);

  if (!result?.ok) {
    notFound();
  }

  const t = getDictionary();
  const article = result.data;

  return (
    <article>
      <PageIntro eyebrow={article.category?.name ?? t.nav.news} title={article.title} text={article.excerpt}>
        {article.published_at ? (
          <p className="mt-6 text-[0.9375rem] text-muted">
            <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
          </p>
        ) : null}
      </PageIntro>

      <div className="container-page py-14 md:py-20">
        {article.cover ? (
          <RevealImage>
            <Photo media={article.cover} sizes="(min-width: 1344px) 1248px, 100vw" className="aspect-[16/9] lg:aspect-[21/9]" />
          </RevealImage>
        ) : null}

        <div className="mx-auto mt-12 grid max-w-[42rem] gap-5 text-[1.0625rem] leading-[1.75] text-ink-soft">
          {paragraphsOf(article.content).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="mt-6 border-t border-line pt-8">
            <ArrowLink href={routes.news}>{t.home.news.all}</ArrowLink>
          </div>
        </div>
      </div>
    </article>
  );
}
