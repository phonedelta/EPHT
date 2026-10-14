import type { Metadata } from "next";

import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

/**
 * Entrée de l'espace d'administration. La route est réservée ; la connexion
 * (Laravel Sanctum) et le tableau de bord sont réalisés dans une phase suivante.
 */
export default function AdminPage() {
  const t = getDictionary();

  return (
    <main className="grid flex-1 place-items-center bg-background px-5 py-20">
      <div className="w-full max-w-[26rem] rounded-xl border border-line bg-surface p-8 text-center sm:p-10">
        <div className="mx-auto h-16 w-fit">
          <Logo />
        </div>
        <p className="eyebrow mt-7 text-cyan-700">{t.placeholder.eyebrow}</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink">Administration</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          L’espace d’administration sera disponible lors d’une prochaine étape du projet.
        </p>
        <ButtonLink href={routes.home} variant="outline" arrow={false} className="mt-7 w-full">
          {t.common.backToHome}
        </ButtonLink>
      </div>
    </main>
  );
}
