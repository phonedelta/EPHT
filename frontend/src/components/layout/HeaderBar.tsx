"use client";

import { ChevronDown, Menu } from "lucide-react";
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
};

/**
 * En-tête collant. Il se compacte dès que la page défile, s'efface quand on
 * descend dans la page et revient au premier mouvement vers le haut.
 */
export function HeaderBar({ navigation, formations, contact, siteName }: HeaderBarProps) {
  const t = getDictionary();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);

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
        className={cn(
          "sticky top-0 z-40 border-b bg-surface transition-[transform,border-color,box-shadow] duration-500 ease-out-expo",
          scrolled ? "border-line shadow-[0_1px_0_0_rgb(24_37_43_/_0.03)]" : "border-transparent",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "container-page flex items-center justify-between gap-6 transition-[height] duration-500 ease-out-expo",
            scrolled ? "h-[4.25rem] lg:h-[4.75rem]" : "h-[4.75rem] lg:h-[5.75rem]",
          )}
        >
          <Link
            href={routes.home}
            aria-label={`${siteName} — ${t.nav.home}`}
            className={cn(
              "block shrink-0 transition-[height] duration-500 ease-out-expo",
              scrolled ? "h-11 lg:h-[3.25rem]" : "h-[3.25rem] lg:h-16",
            )}
          >
            <Logo title="" />
          </Link>

          <nav aria-label={t.nav.label} className="hidden xl:block">
            <ul className="flex items-center gap-5 min-[1440px]:gap-7">
              {navigation.map((item) => {
                const active = isActivePath(pathname, item.href);
                const hasSubmenu = item.href === routes.formations && formations.length > 0;

                return (
                  <li key={item.href} className={cn(hasSubmenu && "group/sub relative")}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "link-underline inline-flex items-center gap-1.5 whitespace-nowrap py-2 text-sm font-medium transition-colors duration-300 min-[1440px]:text-[0.9375rem]",
                        active ? "text-ink" : "text-ink-soft hover:text-ink",
                      )}
                    >
                      {item.label}
                      {hasSubmenu ? (
                        <ChevronDown
                          aria-hidden="true"
                          strokeWidth={1.75}
                          className="size-3.5 transition-transform duration-300 group-focus-within/sub:rotate-180 group-hover/sub:rotate-180"
                        />
                      ) : null}
                    </Link>

                    {hasSubmenu ? (
                      <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-[opacity,transform,visibility] duration-300 ease-out-expo group-focus-within/sub:visible group-focus-within/sub:translate-y-0 group-focus-within/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-y-0 group-hover/sub:opacity-100">
                        <ul className="border border-line bg-surface p-2 shadow-[0_18px_40px_-24px_rgb(24_37_43_/_0.35)]">
                          {formations.map((formation) => (
                            <li key={formation.href}>
                              <Link
                                href={formation.href}
                                className="block px-4 py-2.5 text-[0.9375rem] text-ink-soft transition-colors duration-200 hover:bg-cyan-50 hover:text-ink"
                              >
                                {formation.label}
                              </Link>
                            </li>
                          ))}
                          <li className="mt-1 border-t border-line pt-1">
                            <Link
                              href={routes.formations}
                              className="block px-4 py-2.5 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-cyan-700 transition-colors duration-200 hover:bg-cyan-50"
                            >
                              {t.nav.allFormations}
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
              <ButtonLink href={routes.admissions} size="md" arrow={false} className="whitespace-nowrap">
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
              className="grid size-12 place-items-center rounded-[2px] border border-line text-ink transition-colors duration-300 hover:border-ink xl:hidden"
            >
              <Menu aria-hidden="true" strokeWidth={1.5} className="size-6" />
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
