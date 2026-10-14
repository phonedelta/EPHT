"use client";

import { ArrowRight, ChevronDown, Menu } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { isActivePath, routes, type NavItem } from "@/lib/routes";

import { MobileMenu, type MobileMenuContact } from "./MobileMenu";

type HeaderBarProps = {
  navigation: NavItem[];
  /** Formations publiées, listées sous l'entrée « Formations ». */
  formations: NavItem[];
  contact: MobileMenuContact;
  siteName: string;
  /** Nom complet de l'école, affiché à côté du logo. */
  fullName: string | null;
};

/** « École Privée d’Hôtellerie et de Tourisme » → « École Privée » et « d’Hôtellerie et de Tourisme ». */
function splitFullName(name: string): [string, string | null] {
  const match = name.match(/^(.+?)\s+(d[’']\S.*)$/u);

  return match ? [match[1], match[2]] : [name, null];
}

/**
 * En-tête collant. Il se compacte dès que la page défile, s'efface quand on
 * descend dans la page et revient au premier mouvement vers le haut.
 */
export function HeaderBar({ navigation, formations, contact, siteName, fullName }: HeaderBarProps) {
  const t = getDictionary();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Entrée de menu survolée : l'indicateur turquoise y glisse, puis revient sur la page active.
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });
  const lastY = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [nameLead, nameRest] = fullName ? splitFullName(fullName) : [null, null];

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;

      setScrolled(y > 12);

      // Petits mouvements ignorés : l'en-tête ne clignote pas au moindre défilement.
      if (y < 160) {
        setHidden(false);
      } else if (Math.abs(delta) > 6) {
        setHidden(delta > 0);
      }

      lastY.current = y;
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus();
  }, []);

  return (
    <>
      <header
        // Nommé pour les transitions de page : l'en-tête reste immobile pendant que le contenu change.
        style={{ viewTransitionName: "site-header" }}
        className={cn(
          "sticky top-0 z-40 border-b transition-[transform,background-color,border-color] duration-300 ease-out-soft",
          scrolled ? "border-line bg-surface/90 backdrop-blur-md" : "border-transparent bg-surface",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        {/* Progression de la lecture dans la page. */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className={cn(
            "absolute inset-x-0 -bottom-px h-0.5 origin-left bg-cyan-500 transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "container-page flex items-center justify-between gap-4 transition-[height] duration-300 ease-out-soft min-[1440px]:gap-6",
            scrolled ? "h-16" : "h-16 lg:h-[4.75rem]",
          )}
        >
          <Link href={routes.home} aria-label={`${siteName} — ${t.nav.home}`} className="flex shrink-0 items-center gap-3.5">
            <span
              className={cn("block transition-[height] duration-300 ease-out-soft", scrolled ? "h-10" : "h-10 lg:h-[3.25rem]")}
            >
              <Logo title="" />
            </span>
            {nameLead ? (
              <span aria-hidden="true" className="flex items-center gap-3.5 max-[359px]:hidden">
                <span className="h-8 w-px bg-line-strong" />
                <span className="leading-tight">
                  <span className="block text-xs font-medium text-ink">{nameLead}</span>
                  {nameRest ? <span className="block text-[0.6875rem] text-muted">{nameRest}</span> : null}
                </span>
              </span>
            ) : null}
          </Link>

          <nav aria-label={t.nav.label} className="hidden xl:block">
            <ul
              className="flex items-center gap-4 min-[1440px]:gap-5"
              onMouseLeave={() => setHovered(null)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setHovered(null);
                }
              }}
            >
              {navigation.map((item) => {
                const active = isActivePath(pathname, item.href);
                const hasSubmenu = item.href === routes.formations && formations.length > 0;
                const marked = hovered === null ? active : hovered === item.href;

                return (
                  <li key={item.href} className={cn(hasSubmenu && "group/sub relative")}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onMouseEnter={() => setHovered(item.href)}
                      onFocus={() => setHovered(item.href)}
                      className={cn(
                        "group/nav relative inline-flex items-center gap-1 whitespace-nowrap py-2 text-[0.8125rem] font-medium transition-colors duration-200",
                        active ? "text-ink" : "text-ink hover:text-cyan-700",
                      )}
                    >
                      {item.label}
                      {hasSubmenu ? (
                        <ChevronDown
                          aria-hidden="true"
                          strokeWidth={1.75}
                          className="size-3.5 text-muted transition-transform duration-200 group-focus-within/sub:rotate-180 group-hover/sub:rotate-180"
                        />
                      ) : null}
                      {marked ? (
                        <motion.span
                          aria-hidden="true"
                          layoutId="nav-indicator"
                          layoutDependency={hovered}
                          className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-cyan-500"
                          transition={{ type: "spring", stiffness: 520, damping: 42 }}
                        />
                      ) : null}
                    </Link>

                    {hasSubmenu ? (
                      <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-[opacity,transform,visibility] duration-200 ease-out-soft group-focus-within/sub:visible group-focus-within/sub:translate-y-0 group-focus-within/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-y-0 group-hover/sub:opacity-100">
                        <ul className="rounded-lg border border-line bg-surface p-1.5 shadow-[0_16px_40px_-20px_rgb(23_38_44_/_0.28)]">
                          {formations.map((formation) => (
                            <li key={formation.href}>
                              <Link
                                href={formation.href}
                                aria-current={pathname === formation.href ? "page" : undefined}
                                className="block rounded-md px-3 py-2.5 text-sm text-ink-soft transition-colors duration-200 hover:bg-cyan-50 hover:text-ink aria-[current=page]:text-cyan-700"
                              >
                                {formation.label}
                              </Link>
                            </li>
                          ))}
                          <li className="mt-1 border-t border-line pt-1">
                            <Link
                              href={routes.formations}
                              className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-cyan-700 transition-colors duration-200 hover:bg-cyan-50"
                            >
                              {t.nav.allFormations}
                              <ArrowRight aria-hidden="true" strokeWidth={1.75} className="size-4" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            {/* Le bouton fixe lui-même son affichage : c'est son conteneur qui le masque sur mobile. */}
            <div className="hidden sm:block">
              <ButtonLink href={routes.admissions} size="sm" className="h-[2.625rem] whitespace-nowrap">
                {t.nav.apply}
              </ButtonLink>
            </div>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-label={t.nav.openMenu}
              className="grid size-10 place-items-center rounded-md border border-line-strong text-ink transition-colors duration-200 hover:border-ink/45 xl:hidden"
            >
              <Menu aria-hidden="true" strokeWidth={1.5} className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        navigation={navigation}
        formations={formations}
        contact={contact}
      />
    </>
  );
}
