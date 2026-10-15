import { ArrowRight, Building2, Check, GraduationCap, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

type Audience = {
  key: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  points: readonly string[];
  cta: string;
  href: string;
  dark: boolean;
};

/**
 * Deux publics, deux cartes : les étudiants qui cherchent un stage, les
 * entreprises qui proposent une offre (par e-mail à l'école, sinon via la page Contact).
 */
export function Audiences({ email }: { email: string | null }) {
  const t = getDictionary().pages.careers;

  const audiences: Audience[] = [
    { key: "students", icon: GraduationCap, ...t.students, href: "#offres", dark: false },
    {
      key: "companies",
      icon: Building2,
      ...t.companies,
      href: email ? `mailto:${email}?subject=${encodeURIComponent("Proposition d’offre de stage ou d’emploi")}` : routes.contact,
      dark: true,
    },
  ];

  return (
    <section aria-labelledby="audiences-title" className="section-y bg-surface">
      <div className="container-page">
        <SectionHeader id="audiences-title" eyebrow={t.audiencesEyebrow} title={t.audiencesTitle} className="max-w-[40rem]" />

        <RevealGroup as="ul" stagger={0.1} className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-6">
          {audiences.map(({ key, icon: Icon, eyebrow, title, points, cta, href, dark }) => {
            const external = !href.startsWith("/");
            const linkClass = cn(buttonClasses({ variant: dark ? "primary" : "ink" }), "mt-auto w-full sm:w-fit");
            const label = (
              <>
                <span>{cta}</span>
                <ArrowRight aria-hidden="true" strokeWidth={1.75} className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
              </>
            );

            return (
              <RevealItem
                as="li"
                key={key}
                className={cn(
                  "relative isolate flex flex-col overflow-hidden rounded-2xl p-7 sm:p-9 lg:p-10",
                  dark ? "on-dark bg-ink text-white" : "border border-line bg-cyan-50",
                )}
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={1}
                  className={cn(
                    "pointer-events-none absolute -right-6 -top-6 -z-10 size-44",
                    dark ? "text-white/[0.06]" : "text-cyan-600/[0.08]",
                  )}
                />
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-xl",
                    dark ? "bg-white/10 text-cyan-300" : "bg-surface text-cyan-700 shadow-[0_1px_2px_rgb(23_38_44/0.06)]",
                  )}
                >
                  <Icon aria-hidden="true" strokeWidth={1.75} className="size-6" />
                </span>
                <p className={cn("eyebrow mt-6", dark ? "text-cyan-300" : "text-cyan-700")}>{eyebrow}</p>
                <h3 className={cn("text-subtitle mt-3", dark && "text-white")}>{title}</h3>

                <ul className="mb-8 mt-6 grid gap-3">
                  {points.map((point) => (
                    <li key={point} className={cn("flex gap-3 text-[0.9375rem] leading-relaxed", dark ? "text-white/75" : "text-ink-soft")}>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-1 grid size-5 shrink-0 place-items-center rounded-full",
                          dark ? "bg-cyan-500/20 text-cyan-300" : "bg-cyan-600 text-white",
                        )}
                      >
                        <Check strokeWidth={3} className="size-3" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                {external ? (
                  <a href={href} className={linkClass}>
                    {label}
                  </a>
                ) : (
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
