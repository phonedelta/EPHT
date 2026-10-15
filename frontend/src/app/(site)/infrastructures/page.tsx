import type { Metadata } from "next";

import { FinalCta } from "@/components/home/FinalCta";
import { Formations } from "@/components/home/Formations";
import { Practice } from "@/components/home/Practice";
import { SpacesShowcase } from "@/components/infrastructures/SpacesShowcase";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/system/PageHero";
import { UnavailablePage } from "@/components/system/StatusPage";
import { getDictionary } from "@/i18n";
import { dataOr, getFormations, getGalleries, getSiteSettings } from "@/lib/api/queries";
import type { Gallery } from "@/lib/api/schemas";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const photoOf = (space: Gallery | undefined) => space?.cover ?? space?.media[0] ?? null;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, spaces] = await Promise.all([getSiteSettings(), getGalleries("infrastructure")]);

  return pageMetadata({
    title: getDictionary().nav.infrastructures,
    description: dataOr(settings, null)?.home.infrastructures.intro,
    path: routes.infrastructures,
    image: photoOf(dataOr(spaces, [])[0]),
  });
}

/** Les espaces de l'école, présentés l'un après l'autre. */
export default async function InfrastructuresPage() {
  const [settingsResult, spacesResult, formationsResult] = await Promise.all([
    getSiteSettings(),
    getGalleries("infrastructure"),
    getFormations(),
  ]);

  if (!settingsResult.ok) {
    return <UnavailablePage />;
  }

  const t = getDictionary();
  const { home } = settingsResult.data;
  const spaces = dataOr(spacesResult, []);
  // L'en-tête montre deux espaces de la suite de la page, pas le premier présenté juste en dessous.
  const heroSpaces = spaces.length > 2 ? [spaces[2], spaces[1]] : [spaces[0], undefined];

  return (
    <PageTransition>
      <PageHero
        eyebrow={t.nav.infrastructures}
        title={home.infrastructures.title ?? t.nav.infrastructures}
        crumb={t.nav.infrastructures}
        lead={home.infrastructures.intro}
        path={routes.infrastructures}
        image={photoOf(heroSpaces[0])}
        secondaryImage={photoOf(heroSpaces[1])}
      >
        {spaces.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-2">
            {spaces.map((space) => (
              <li key={space.id}>
                <a
                  href={`#${space.slug}`}
                  className="inline-flex h-9 items-center rounded-full border border-line-strong bg-surface px-4 text-sm font-medium text-ink-soft transition-[border-color,color,transform] duration-200 hover:-translate-y-px hover:border-cyan-600 hover:text-ink"
                >
                  {space.title}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </PageHero>

      {spaces.length > 0 ? (
        <div className="section-y bg-surface">
          <div className="container-page">
            <SpacesShowcase spaces={spaces} />
          </div>
        </div>
      ) : null}

      <Practice content={home.practice} />
      <Formations content={home.formations} formations={dataOr(formationsResult, [])} />
      <FinalCta content={home.cta} />
    </PageTransition>
  );
}
