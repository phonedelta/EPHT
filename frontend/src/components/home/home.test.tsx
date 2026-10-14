import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { siteSettingsSchema } from "@/lib/api/schemas";
import { formation, gallery, media, testimonial } from "@/test/fixtures";

import { FormationCard } from "./FormationCard";
import { News } from "./News";
import { pickGalleryItems } from "./StudentLife";
import { Testimonials } from "./Testimonials";

const home = siteSettingsSchema.parse({}).home;

describe("FormationCard", () => {
  it("affiche le nom, la présentation et le lien vers la fiche", () => {
    render(<FormationCard formation={formation()} index={2} sizes="100vw" />);

    const link = screen.getByRole("link", { name: "Cuisine" });

    expect(link).toHaveAttribute("href", "/formations/cuisine");
    expect(screen.getByText("Une formation aux techniques culinaires.")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("n'affiche ni durée ni diplôme tant qu'ils ne sont pas confirmés", () => {
    render(<FormationCard formation={formation()} index={0} sizes="100vw" />);

    expect(screen.queryByText("Durée")).not.toBeInTheDocument();
    expect(screen.queryByText("Diplôme")).not.toBeInTheDocument();
  });

  it("affiche la durée et le diplôme une fois renseignés", () => {
    render(
      <FormationCard
        formation={formation({ diploma: "Diplôme de Technicien", duration: { label: "2 ans", months: 24 } })}
        index={0}
        sizes="100vw"
      />,
    );

    expect(screen.getByText("2 ans")).toBeInTheDocument();
    expect(screen.getByText("Diplôme de Technicien")).toBeInTheDocument();
  });
});

describe("Testimonials", () => {
  it("n'affiche rien tant qu'aucun témoignage n'est publié", () => {
    const { container } = render(<Testimonials content={{ title: "Ils parlent de l’EPHT." }} testimonials={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("affiche les témoignages publiés avec leur auteur", () => {
    render(
      <Testimonials
        content={{ title: "Ils parlent de l’EPHT." }}
        testimonials={[testimonial(), testimonial({ id: 2, author_name: "Yassine A.", formation: null })]}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Ils parlent de l’EPHT." })).toBeInTheDocument();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText("Une formation exigeante et concrète.")).toBeInTheDocument();
    expect(within(items[0]).getByText("Lauréate · Cuisine")).toBeInTheDocument();
    expect(within(items[1]).getByText("Yassine A.")).toBeInTheDocument();
  });
});

describe("News", () => {
  it("n'affiche rien sans article publié", () => {
    const { container } = render(<News content={home.news} articles={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("affiche catégorie, date, titre et résumé de chaque article", () => {
    render(
      <News
        content={{ title: "Les actualités de l’école." }}
        articles={[
          {
            id: 1,
            slug: "nouveau-site",
            title: "Le nouveau site est en ligne",
            excerpt: "Le site a été repensé.",
            category: { id: 1, slug: "vie-de-l-ecole", name: "Vie de l’école" },
            cover: media(),
            published_at: "2026-10-13T17:00:00+00:00",
          },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Le nouveau site est en ligne" })).toHaveAttribute(
      "href",
      "/actualites/nouveau-site",
    );
    expect(screen.getByText("Vie de l’école")).toBeInTheDocument();
    expect(screen.getByText("13 octobre 2026")).toBeInTheDocument();
    expect(screen.getByText("Le site a été repensé.")).toBeInTheDocument();
  });
});

describe("pickGalleryItems", () => {
  const first = gallery({
    id: 1,
    title: "Travaux pratiques",
    media: [media({ id: 1 }), media({ id: 2 }), media({ id: 3 }), media({ id: 4 })],
  });
  const second = gallery({
    id: 2,
    title: "Réalisations",
    category: { value: "realisations-etudiantes", label: "Réalisations étudiantes" },
    media: [media({ id: 5 }), media({ id: 6, url: null }), media({ id: 7 })],
  });

  it("alterne les galeries pour montrer chaque catégorie", () => {
    const items = pickGalleryItems([first, second], 4);

    expect(items.map((item) => item.media.id)).toEqual([1, 5, 2, 7]);
    expect(items[1]).toMatchObject({ title: "Réalisations", category: "Réalisations étudiantes" });
  });

  it("écarte les médias sans adresse publique et respecte la limite", () => {
    const items = pickGalleryItems([first, second]);

    expect(items).toHaveLength(6);
    expect(items.some((item) => item.media.id === 6)).toBe(false);
  });

  it("renvoie une liste vide sans galerie", () => {
    expect(pickGalleryItems([])).toEqual([]);
  });
});
