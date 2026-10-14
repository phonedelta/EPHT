"use client";

import { ArrowUpRight, BriefcaseBusiness, Building2, Mail, MapPin } from "lucide-react";
import { useState } from "react";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/system/EmptyState";
import { buttonClasses } from "@/components/ui/Button";
import { FilterChips } from "@/components/ui/FilterChips";
import { getDictionary } from "@/i18n";
import type { JobOffer } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { formatDate, paragraphsOf } from "@/lib/format";

/** Offres de stage et d'emploi publiées, filtrables par type. */
export function JobOfferList({ offers }: { offers: JobOffer[] }) {
  const t = getDictionary().pages;
  const [type, setType] = useState<string | null>(null);

  if (offers.length === 0) {
    return <EmptyState icon={BriefcaseBusiness}>{t.careers.empty}</EmptyState>;
  }

  const types = [...new Map(offers.map((offer) => [offer.type.value, offer.type.label])).entries()];
  const visible = type ? offers.filter((offer) => offer.type.value === type) : offers;

  return (
    <div>
      {types.length > 1 ? (
        <FilterChips
          label={t.careers.filterLabel}
          value={type}
          onChange={setType}
          options={[
            { value: null, label: t.filters.all, count: offers.length },
            ...types.map(([value, label]) => ({
              value,
              label,
              count: offers.filter((offer) => offer.type.value === value).length,
            })),
          ]}
          className="mb-8"
        />
      ) : null}

      <RevealGroup key={type ?? "*"} as="ul" className="grid gap-5 lg:grid-cols-2 lg:gap-6" stagger={0.06}>
        {visible.map((offer) => (
          <RevealItem as="li" key={offer.id}>
            <OfferCard offer={offer} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

function OfferCard({ offer }: { offer: JobOffer }) {
  const t = getDictionary().pages.careers;
  const summary = paragraphsOf(offer.description)[0] ?? null;

  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8125rem]">
        <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 font-display text-xs font-semibold text-cyan-700">
          {offer.type.label}
        </span>
        {offer.published_at ? (
          <time dateTime={offer.published_at} className="text-muted">
            {formatDate(offer.published_at)}
          </time>
        ) : null}
      </div>

      <h3 className="mt-4 text-subtitle">{offer.title}</h3>

      {offer.company || offer.city ? (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-soft">
          {offer.company ? (
            <li className="flex items-center gap-1.5">
              <Building2 aria-hidden="true" strokeWidth={1.5} className="size-4 text-cyan-700" />
              {offer.company}
            </li>
          ) : null}
          {offer.city ? (
            <li className="flex items-center gap-1.5">
              <MapPin aria-hidden="true" strokeWidth={1.5} className="size-4 text-cyan-700" />
              {offer.city}
            </li>
          ) : null}
        </ul>
      ) : null}

      {summary ? <p className="mt-4 line-clamp-4 text-[0.9375rem] leading-relaxed text-muted">{summary}</p> : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
        {offer.expires_at ? (
          <p className="text-[0.8125rem] text-muted">{t.expires(formatDate(offer.expires_at))}</p>
        ) : (
          <span />
        )}
        {offer.apply_url ? (
          <a
            href={offer.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonClasses({ size: "sm" }))}
          >
            {t.apply}
            <ArrowUpRight aria-hidden="true" strokeWidth={1.75} className="size-4" />
          </a>
        ) : offer.apply_email ? (
          <a href={`mailto:${offer.apply_email}`} className={cn(buttonClasses({ size: "sm" }))}>
            <Mail aria-hidden="true" strokeWidth={1.75} className="size-4" />
            {t.applyByEmail}
          </a>
        ) : null}
      </div>
    </article>
  );
}
