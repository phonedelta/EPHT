import { Clock, Mail, MapPin, MessageCircle, Phone, Share2, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { FinalCta } from "@/components/home/FinalCta";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PageHero } from "@/components/system/PageHero";
import { UnavailablePage } from "@/components/system/StatusPage";
import { buttonClasses } from "@/components/ui/Button";
import { SOCIAL_LABELS, SOCIAL_NETWORKS, SocialIcon } from "@/components/ui/SocialIcon";
import { getDictionary } from "@/i18n";
import { getSiteSettings } from "@/lib/api/queries";
import { cn } from "@/lib/cn";
import { phoneHref } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: getDictionary().nav.contact,
  description: getDictionary().pages.contact.lead,
  path: routes.contact,
});

const linkClass = "text-ink transition-colors duration-200 hover:text-cyan-700";

// Colonnes de la grille selon le nombre de cartes : aucune rangée ne reste à moitié vide.
const GRID_COLUMNS: Record<number, string> = {
  1: "",
  2: "md:grid-cols-2",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

function ContactCard({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <RevealItem
      as="li"
      className="group flex gap-5 rounded-xl border border-line bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_20px_40px_-30px_rgb(23_38_44_/_0.45)] sm:p-7"
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-cyan-100 transition-colors duration-300 group-hover:bg-cyan-600"
      >
        <Icon strokeWidth={1.5} className="size-5 text-cyan-700 transition-colors duration-300 group-hover:text-white" />
      </span>
      <div className="min-w-0">
        <h2 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</h2>
        <div className="mt-2 text-[0.9375rem] leading-relaxed text-ink">{children}</div>
      </div>
    </RevealItem>
  );
}

/**
 * Coordonnées de l'école, telles que renseignées dans les paramètres du site.
 * WhatsApp, horaires et plan n'apparaissent qu'une fois fournis par l'école.
 */
export default async function ContactPage() {
  const settingsResult = await getSiteSettings();

  if (!settingsResult.ok) {
    return <UnavailablePage />;
  }

  const t = getDictionary();
  const { contact, social, home } = settingsResult.data;
  const networks = SOCIAL_NETWORKS.filter((network) => social[network]);
  const position =
    contact.latitude !== null && contact.longitude !== null ? { lat: contact.latitude, lon: contact.longitude } : null;
  const numbers = [contact.phone, contact.mobile].filter((number) => number !== null);

  const cards = [
    contact.address_lines.length > 0 ? (
      <ContactCard key="address" icon={MapPin} label={t.pages.contact.address}>
        <address className="not-italic">
          {contact.address_lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        {contact.map_url ? (
          <a
            href={contact.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-cyan-700 hover:text-ink"
          >
            {t.pages.contact.map}
          </a>
        ) : null}
      </ContactCard>
    ) : null,
    numbers.length > 0 ? (
      <ContactCard key="phone" icon={Phone} label={t.pages.contact.phone}>
        <ul className="grid gap-1 tabular-nums">
          {numbers.map((number) => (
            <li key={number}>
              <a href={phoneHref(number)} className={linkClass}>
                {number}
              </a>
            </li>
          ))}
        </ul>
      </ContactCard>
    ) : null,
    contact.email ? (
      <ContactCard key="email" icon={Mail} label={t.pages.contact.email}>
        <a href={`mailto:${contact.email}`} className={cn(linkClass, "break-all")}>
          {contact.email}
        </a>
      </ContactCard>
    ) : null,
    contact.whatsapp ? (
      <ContactCard key="whatsapp" icon={MessageCircle} label={t.pages.contact.whatsapp}>
        <a
          href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClass, "tabular-nums")}
        >
          {contact.whatsapp}
        </a>
      </ContactCard>
    ) : null,
    contact.opening_hours.length > 0 ? (
      <ContactCard key="hours" icon={Clock} label={t.pages.contact.hours}>
        <ul className="grid gap-1">
          {contact.opening_hours.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </ContactCard>
    ) : null,
    networks.length > 0 ? (
      <ContactCard key="social" icon={Share2} label={t.pages.contact.social}>
        <ul className="flex flex-wrap gap-2.5">
          {networks.map((network) => (
            <li key={network}>
              <a
                href={social[network] ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SOCIAL_LABELS[network]} (nouvel onglet)`}
                className="grid size-10 place-items-center rounded-full border border-line-strong text-ink transition-colors duration-200 hover:border-cyan-600 hover:bg-cyan-600 hover:text-white"
              >
                <SocialIcon network={network} className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </ContactCard>
    ) : null,
  ].filter((card) => card !== null);

  return (
    <PageTransition>
      <PageHero
        eyebrow={t.pages.contact.eyebrow}
        title={t.pages.contact.title}
        crumb={t.nav.contact}
        lead={t.pages.contact.lead}
        path={routes.contact}
        actions={
          contact.phone || contact.email ? (
            <>
              {contact.phone ? (
                <a href={phoneHref(contact.phone)} className={cn(buttonClasses({ size: "lg" }), "whitespace-nowrap")}>
                  <Phone aria-hidden="true" strokeWidth={1.75} className="size-4" />
                  {t.pages.contact.call}
                </a>
              ) : null}
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className={cn(buttonClasses({ variant: "outline", size: "lg" }), "whitespace-nowrap")}
                >
                  <Mail aria-hidden="true" strokeWidth={1.75} className="size-4" />
                  {t.pages.contact.write}
                </a>
              ) : null}
            </>
          ) : null
        }
      />

      {cards.length > 0 || position ? (
        <section aria-label={t.pages.contact.eyebrow} className="section-y bg-surface">
          <div className="container-page">
            {cards.length > 0 ? (
              <RevealGroup
                as="ul"
                className={cn("grid gap-5 lg:gap-6", GRID_COLUMNS[cards.length] ?? "md:grid-cols-2 lg:grid-cols-3")}
                stagger={0.06}
              >
                {cards}
              </RevealGroup>
            ) : null}

            {position ? (
              <Reveal className="mt-10 overflow-hidden rounded-2xl border border-line">
                <iframe
                  title={t.pages.contact.mapTitle}
                  loading="lazy"
                  className="block h-[22rem] w-full md:h-[26rem]"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${position.lon - 0.008}%2C${position.lat - 0.005}%2C${position.lon + 0.008}%2C${position.lat + 0.005}&layer=mapnik&marker=${position.lat}%2C${position.lon}`}
                />
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      <FinalCta content={home.cta} showContact={false} />
    </PageTransition>
  );
}
