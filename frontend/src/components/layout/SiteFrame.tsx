import type { ReactNode } from "react";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { dataOr, getFormations, getSiteSettings } from "@/lib/api/queries";
import { siteSettingsSchema } from "@/lib/api/schemas";

import { Footer } from "./Footer";
import { Header } from "./Header";

/**
 * Habillage commun aux pages publiques : en-tête, contenu, pied de page.
 *
 * Si l'API ne répond pas, le cadre reste affiché avec des paramètres vides :
 * la navigation fonctionne et chaque page signale son contenu indisponible.
 */
export async function SiteFrame({ children }: { children: ReactNode }) {
  const [settingsResult, formationsResult] = await Promise.all([getSiteSettings(), getFormations()]);

  const settings = dataOr(settingsResult, siteSettingsSchema.parse({}));
  const formations = dataOr(formationsResult, []);

  return (
    <MotionProvider>
      <Header settings={settings} formations={formations} />
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer settings={settings} formations={formations} />
    </MotionProvider>
  );
}
