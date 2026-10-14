import { getDictionary } from "@/i18n";
import type { Formation, SiteSettings } from "@/lib/api/schemas";
import { mainNavigation, routes } from "@/lib/routes";

import { HeaderBar } from "./HeaderBar";
import { TopBar } from "./TopBar";

type HeaderProps = {
  settings: SiteSettings;
  formations: Formation[];
};

/** En-tête du site public : bandeau de coordonnées et barre de navigation. */
export function Header({ settings, formations }: HeaderProps) {
  const t = getDictionary();

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
      >
        {t.common.skipToContent}
      </a>
      <TopBar contact={settings.contact} social={settings.social} />
      <HeaderBar
        navigation={mainNavigation(t)}
        formations={formations.map((formation) => ({
          href: routes.formation(formation.slug),
          label: formation.title,
        }))}
        contact={{ phone: settings.contact.phone, email: settings.contact.email }}
        siteName={settings.general.name ?? "EPHT"}
        fullName={settings.general.full_name}
      />
    </>
  );
}
