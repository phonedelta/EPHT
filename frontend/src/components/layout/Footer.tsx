import { cacheLife } from "next/cache";
import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { SOCIAL_LABELS, SOCIAL_NETWORKS, SocialIcon } from "@/components/ui/SocialIcon";
import { getDictionary } from "@/i18n";
import type { Formation, SiteSettings } from "@/lib/api/schemas";
import { phoneHref } from "@/lib/format";
import { mainNavigation, routes } from "@/lib/routes";

type FooterProps = {
  settings: SiteSettings;
  formations: Formation[];
};

// L'année courante dépend de l'horloge : elle est calculée dans un cache d'un
// jour pour que le pied de page reste pré-rendu.
async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}

const linkClass =
  "link-underline pb-0.5 text-white/75 transition-colors duration-300 hover:text-white";

export async function Footer({ settings, formations }: FooterProps) {
  const t = getDictionary();
  const { general, contact, social } = settings;
  const year = await currentYear();
  const networks = SOCIAL_NETWORKS.filter((network) => social[network]);
  const name = general.name ?? "EPHT";

  return (
    <footer className="on-dark bg-ink text-[0.9375rem] text-white/75">
      <div className="container-page grid gap-x-10 gap-y-14 pb-16 pt-20 md:grid-cols-2 lg:grid-cols-12 lg:pb-20 lg:pt-24">
        <div className="lg:col-span-4">
          <Link href={routes.home} aria-label={`${name} — ${t.nav.home}`} className="block h-20 w-fit">
            <Logo variant="negative" title="" />
          </Link>
          {general.full_name ? (
            <p className="mt-6 font-display text-xl leading-snug text-white">{general.full_name}</p>
          ) : null}
          {general.description ? (
            <p className="mt-4 max-w-[26rem] leading-relaxed text-white/65">{general.description}</p>
          ) : null}
        </div>

        <nav aria-label={t.footer.navigation} className="lg:col-span-2 lg:col-start-6">
          <h2 className="eyebrow text-cyan-300">{t.footer.navigation}</h2>
          <ul className="mt-6 grid gap-3">
            {mainNavigation(t).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {formations.length > 0 ? (
          <nav aria-label={t.footer.formations} className="lg:col-span-2">
            <h2 className="eyebrow text-cyan-300">{t.footer.formations}</h2>
            <ul className="mt-6 grid gap-3">
              {formations.map((formation) => (
                <li key={formation.id}>
                  <Link href={routes.formation(formation.slug)} className={linkClass}>
                    {formation.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="lg:col-span-3">
          <h2 className="eyebrow text-cyan-300">{t.footer.contact}</h2>
          <address className="mt-6 grid gap-5 not-italic">
            {contact.address_lines.length > 0 ? (
              <p className="leading-relaxed">
                {contact.address_lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            ) : null}
            <dl className="grid gap-2">
              {contact.phone ? (
                <div className="flex gap-3">
                  <dt className="w-[5.5rem] shrink-0 text-white/50">{t.footer.phone}</dt>
                  <dd>
                    <a href={phoneHref(contact.phone)} className={linkClass}>
                      {contact.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contact.mobile ? (
                <div className="flex gap-3">
                  <dt className="w-[5.5rem] shrink-0 text-white/50">{t.footer.mobile}</dt>
                  <dd>
                    <a href={phoneHref(contact.mobile)} className={linkClass}>
                      {contact.mobile}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contact.email ? (
                <div className="flex gap-3">
                  <dt className="w-[5.5rem] shrink-0 text-white/50">{t.footer.email}</dt>
                  <dd>
                    <a href={`mailto:${contact.email}`} className={linkClass}>
                      {contact.email}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </address>

          {networks.length > 0 ? (
            <ul aria-label={t.footer.follow} className="mt-7 flex gap-3">
              {networks.map((network) => (
                <li key={network}>
                  <a
                    href={social[network] ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SOCIAL_LABELS[network]} (nouvel onglet)`}
                    className="grid size-10 place-items-center rounded-full border border-white/20 text-white/80 transition-colors duration-300 hover:border-cyan-300 hover:bg-cyan-300 hover:text-ink"
                  >
                    <SocialIcon network={network} className="size-[1.125rem]" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-7 text-[0.8125rem] text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {name}
            {general.full_name ? ` — ${general.full_name}` : ""}. {t.footer.rights}
          </p>
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            <li>
              <Link href={routes.legal} className={linkClass}>
                {t.footer.legal}
              </Link>
            </li>
            <li>
              <Link href={routes.privacy} className={linkClass}>
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
