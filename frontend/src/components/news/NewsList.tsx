"use client";

import { Newspaper } from "lucide-react";
import { useState } from "react";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/system/EmptyState";
import { buttonClasses } from "@/components/ui/Button";
import { FilterChips } from "@/components/ui/FilterChips";
import { getDictionary } from "@/i18n";
import type { Article, ArticleCategory } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";

import { ArticleCard } from "./ArticleCard";

/** Nombre d'articles ajoutés à chaque clic sur « Voir plus ». */
export const NEWS_PAGE_SIZE = 9;

type NewsListProps = {
  articles: Article[];
  categories: ArticleCategory[];
};

/**
 * Liste des actualités : filtre par catégorie, article le plus récent mis en
 * avant, puis les suivants par séries de neuf.
 */
export function NewsList({ articles, categories }: NewsListProps) {
  const t = getDictionary().pages;
  const [category, setCategory] = useState<string | null>(null);
  const [visible, setVisible] = useState(NEWS_PAGE_SIZE + 1);

  if (articles.length === 0) {
    return <EmptyState icon={Newspaper}>{t.news.empty}</EmptyState>;
  }

  const filtered = category ? articles.filter((article) => article.category?.slug === category) : articles;
  const [featured, ...others] = filtered.slice(0, visible);
  // Seules les catégories qui ont au moins un article sont proposées.
  const options = [
    { value: null, label: t.filters.all, count: articles.length },
    ...categories
      .map((item) => ({
        value: item.slug,
        label: item.name,
        count: articles.filter((article) => article.category?.slug === item.slug).length,
      }))
      .filter((option) => option.count > 0),
  ];

  return (
    <div>
      {options.length > 2 ? (
        <FilterChips
          label={t.news.filterLabel}
          options={options}
          value={category}
          onChange={(value) => {
            setCategory(value);
            setVisible(NEWS_PAGE_SIZE + 1);
          }}
        />
      ) : null}

      {featured ? (
        <RevealGroup key={category ?? "*"} className="mt-8 grid gap-5 lg:gap-6" stagger={0.06}>
          <RevealItem>
            <ArticleCard article={featured} featured />
          </RevealItem>
          {others.length > 0 ? (
            // Deux colonnes tant qu'il y a moins de trois articles : la rangée reste pleine.
            <div className={cn("grid gap-5 md:grid-cols-2 lg:gap-6", others.length >= 3 && "lg:grid-cols-3")}>
              {others.map((article) => (
                <RevealItem key={article.id}>
                  <ArticleCard article={article} />
                </RevealItem>
              ))}
            </div>
          ) : null}
        </RevealGroup>
      ) : null}

      {filtered.length > visible ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((count) => count + NEWS_PAGE_SIZE)}
            className={buttonClasses({ variant: "outline" })}
          >
            {t.news.more}
          </button>
        </div>
      ) : null}
    </div>
  );
}
