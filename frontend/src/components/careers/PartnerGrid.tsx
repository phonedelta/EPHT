import { ArrowUpRight } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n";
import type { Partner } from "@/lib/api/schemas";

/** Partenaires publiés : logo, nom, présentation et site. */
export function PartnerGrid({ partners }: { partners: Partner[] }) {
  const t = getDictionary().pages.careers;

  return (
    <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
      {partners.map((partner) => (
        <RevealItem as="li" key={partner.id} className="flex flex-col rounded-xl border border-line bg-surface p-6">
          {partner.logo ? (
            <div className="relative h-14">
              <Photo
                media={partner.logo}
                sizes="160px"
                className="h-full w-40 bg-transparent!"
                imageClassName="object-contain! object-left!"
              />
            </div>
          ) : null}
          <h3 className="mt-5 font-display text-base font-semibold text-ink">{partner.name}</h3>
          {partner.description ? (
            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">{partner.description}</p>
          ) : null}
          {partner.website_url ? (
            <a
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-cyan-700 hover:text-ink"
            >
              {t.partnerSite}
              <ArrowUpRight aria-hidden="true" strokeWidth={1.75} className="size-4" />
            </a>
          ) : null}
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
