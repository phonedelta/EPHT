"use client";

import { Mail, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { Logo } from "@/components/brand/Logo";
import { EASE_OUT } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { phoneHref } from "@/lib/format";
import { isActivePath, routes, type NavItem } from "@/lib/routes";

export type MobileMenuContact = {
  phone: string | null;
  email: string | null;
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  navigation: NavItem[];
  formations: NavItem[];
  contact: MobileMenuContact;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menu plein écran des petits écrans. Se comporte comme une boîte de
 * dialogue : le focus y reste enfermé, Échap le ferme et la page ne défile
 * plus derrière lui.
 */
export function MobileMenu({ open, onClose, navigation, formations, contact }: MobileMenuProps) {
  const t = getDictionary();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const openedOn = useRef(pathname);

  // Un lien du menu a été suivi : la navigation referme le menu.
  useEffect(() => {
    if (open && pathname !== openedOn.current) {
      onClose();
    }

    openedOn.current = pathname;
  }, [open, pathname, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel.current) {
        return;
      }

      const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.label}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-surface xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="container-page flex h-[4.75rem] shrink-0 items-center justify-between border-b border-line">
            <Link href={routes.home} aria-label={t.nav.home} className="block h-[3.25rem]">
              <Logo title="" />
            </Link>
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              aria-label={t.nav.closeMenu}
              className="grid size-12 place-items-center rounded-[2px] border border-line text-ink transition-colors duration-300 hover:border-ink"
            >
              <X aria-hidden="true" strokeWidth={1.5} className="size-6" />
            </button>
          </div>

          <motion.nav
            aria-label={t.nav.label}
            className="container-page flex-1 py-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } } }}
          >
            <ul>
              {navigation.map((item) => {
                const active = isActivePath(pathname, item.href);
                const children = item.href === routes.formations ? formations : [];

                return (
                  <motion.li
                    key={item.href}
                    className="border-b border-line"
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between py-4 font-display text-[1.625rem] leading-tight",
                        active ? "text-cyan-700" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                    {children.length > 0 ? (
                      <ul className="-mt-1 grid gap-0.5 pb-4 pl-4">
                        {children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} className="block py-1.5 text-[0.9375rem] text-ink-soft">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>

          <div className="container-page shrink-0 border-t border-line bg-background py-6">
            <ButtonLink href={routes.admissions} className="w-full">
              {t.nav.apply}
            </ButtonLink>
            {contact.phone || contact.email ? (
              <ul className="mt-5 grid gap-2.5 text-[0.9375rem] text-ink-soft">
                {contact.phone ? (
                  <li>
                    <a href={phoneHref(contact.phone)} className="inline-flex items-center gap-3">
                      <Phone aria-hidden="true" strokeWidth={1.5} className="size-4 text-cyan-700" />
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
                {contact.email ? (
                  <li>
                    <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3">
                      <Mail aria-hidden="true" strokeWidth={1.5} className="size-4 text-cyan-700" />
                      {contact.email}
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
