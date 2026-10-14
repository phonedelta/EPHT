import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { formationSections } from "@/components/formations/FormationDetails";
import { FormationCatalog } from "@/components/formations/FormationCatalog";
import { mosaicPlacement } from "@/components/gallery/PhotoGallery";
import { NEWS_PAGE_SIZE, NewsList } from "@/components/news/NewsList";
import { formationDetailSchema, type Article } from "@/lib/api/schemas";
import { formation, media } from "@/test/fixtures";

const restauration = { id: 1, slug: "restauration", name: "Restauration" };
const patisserie = { id: 2, slug: "patisserie", name: "Pâtisserie" };

function article(id: number, category: { id: number; slug: string; name: string } | null): Article {
  return {
    id,
    slug: `article-${id}`,
    title: `Article ${id}`,
    excerpt: `Résumé ${id}`,
    category,
    cover: media({ id }),
    published_at: "2026-10-13T17:00:00+00:00",
  };
}

describe("FormationCatalog", () => {
  const formations = [
    formation({ id: 1, slug: "technicien", title: "Technicien en restauration", category: restauration }),
    formation({ id: 2, slug: "agent", title: "Agent de restauration", category: restauration }),
    formation({ id: 3, slug: "patisserie", title: "Pâtisserie", category: patisserie }),
  ];

  it("filtre les formations par famille et met à jour leur nombre", () => {
    render(<FormationCatalog formations={formations} />);

    expect(screen.getByText("3 formations")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Pâtisserie/ }));

    expect(screen.getByText("1 formation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pâtisserie" })).toHaveAttribute("href", "/formations/patisserie");
    expect(screen.queryByRole("link", { name: "Agent de restauration" })).not.toBeInTheDocument();
  });

  it("garde le numéro de chaque formation dans le catalogue complet", () => {
    render(<FormationCatalog formations={formations} />);

    fireEvent.click(screen.getByRole("button", { name: /Pâtisserie/ }));

    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("annonce un catalogue vide sans afficher de filtre", () => {
    render(<FormationCatalog formations={[]} />);

    expect(screen.getByText("Aucune formation n’est publiée pour le moment.")).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });
});

describe("NewsList", () => {
  it("met en avant le plus récent et filtre par catégorie", () => {
    const articles = [article(1, restauration), article(2, patisserie), article(3, restauration)];

    render(<NewsList articles={articles} categories={[restauration, patisserie]} />);

    expect(screen.getAllByRole("article")).toHaveLength(3);

    fireEvent.click(within(screen.getByRole("group")).getByRole("button", { name: /Pâtisserie/ }));

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Article 2" })).toHaveAttribute("href", "/actualites/article-2");
  });

  it("affiche les articles suivants par séries", () => {
    const articles = Array.from({ length: NEWS_PAGE_SIZE + 4 }, (_, index) => article(index + 1, restauration));

    render(<NewsList articles={articles} categories={[restauration]} />);

    expect(screen.getAllByRole("article")).toHaveLength(NEWS_PAGE_SIZE + 1);

    fireEvent.click(screen.getByRole("button", { name: "Voir plus d’actualités" }));

    expect(screen.getAllByRole("article")).toHaveLength(NEWS_PAGE_SIZE + 4);
    expect(screen.queryByRole("button", { name: "Voir plus d’actualités" })).not.toBeInTheDocument();
  });
});

describe("formationSections", () => {
  it("ne garde que les rubriques renseignées par l'école, dans l'ordre de lecture", () => {
    const detail = formationDetailSchema.parse({
      ...formation(),
      description: null,
      objectives: ["Maîtriser les cuissons"],
      skills: [],
      program: [{ title: "Module 1", description: "Les bases" }, "Module 2"],
      admission_requirements: null,
      career_opportunities: [],
      required_documents: [],
      faq: [],
      gallery: null,
      seo: { title: null, description: null },
    });

    const sections = formationSections(detail);

    expect(sections.map((section) => section.key)).toEqual(["objectives", "program"]);
    expect(sections[1].items).toEqual([
      { title: "Module 1", text: "Les bases" },
      { title: "Module 2", text: null },
    ]);
  });
});

describe("mosaicPlacement", () => {
  it("place six photos en colonnes qui s'arrêtent à la même ligne", () => {
    const placements = Array.from({ length: 6 }, (_, position) => mosaicPlacement(position, 6));

    expect(placements).toEqual([
      { column: "1", row: "1 / span 7" },
      { column: "2", row: "1 / span 5" },
      { column: "3", row: "1 / span 7" },
      { column: "1", row: "8 / span 5" },
      { column: "2", row: "6 / span 7" },
      { column: "3", row: "8 / span 5" },
    ]);
  });

  it("aligne les photos restantes sur une rangée pleine", () => {
    expect(mosaicPlacement(6, 8)).toEqual({ column: "1 / span 2", row: "13 / span 6" });
    expect(mosaicPlacement(7, 8)).toEqual({ column: "3 / span 1", row: "13 / span 6" });
    expect(mosaicPlacement(0, 1)).toEqual({ column: "1 / span 3", row: "1 / span 6" });
    expect(mosaicPlacement(2, 3)).toEqual({ column: "3 / span 1", row: "1 / span 6" });
  });
});
