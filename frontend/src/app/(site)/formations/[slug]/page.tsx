import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RevealImage } from "@/components/motion/Reveal";
import { PageIntro } from "@/components/system/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import { dataOr, getFormation, getFormations } from "@/lib/api/queries";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// La page est produite en entier avant d'être envoyée : une adresse inconnue
// reçoit ainsi un vrai statut 404, et non un squelette suivi d'une erreur.
export const ensureStatic = "navigation";

// Valeur de repli quand aucune formation n'est connue au moment du build :
// Next.js exige au moins un paramètre pour valider la route.
const PLACEHOLDER = "__aucune-formation__";

export async function generateStaticParams() {
  const formations = dataOr(await getFormations(), []);

  return formations.length > 0 ? formations.map(({ slug }) => ({ slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/formations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getFormation(slug);

  if (!result.ok) {
    return {};
  }

  return pageMetadata({
    title: result.data.title,
    description: result.data.summary,
    path: routes.formation(slug),
    image: result.data.cover,
  });
}

/**
 * Fiche d'une formation. Cette première version affiche les informations
 * publiées par l'API ; la fiche complète (objectifs, programme, débouchés,
 * galerie, FAQ) sera réalisée avec le catalogue.
 */
export default async function FormationPage({ params }: PageProps<"/formations/[slug]">) {
  const { slug } = await params;
  const result = slug === PLACEHOLDER ? null : await getFormation(slug);

  if (!result?.ok) {
    notFound();
  }

  const t = getDictionary();
  const formation = result.data;

  return (
    <>
      <PageIntro
        eyebrow={formation.category?.name ?? t.nav.formations}
        title={formation.title}
        text={formation.summary}
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={routes.admissions}>{t.nav.apply}</ButtonLink>
          <ButtonLink href={routes.formations} variant="outline" arrow={false}>
            {t.nav.allFormations}
          </ButtonLink>
        </div>
      </PageIntro>

      {formation.cover ? (
        <div className="container-page py-14 md:py-20">
          <RevealImage>
            <Photo media={formation.cover} sizes="(min-width: 1344px) 1248px, 100vw" className="aspect-[16/9] lg:aspect-[21/9]" />
          </RevealImage>
          <p className="mt-8 max-w-[38rem] text-muted">{t.placeholder.text}</p>
        </div>
      ) : null}
    </>
  );
}
