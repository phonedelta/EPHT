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
 * Menu des petits écrans : un panneau qui glisse depuis la droite. Il se
 * comporte comme une boîte de dialogue : le focus y reste enfermé, Échap ou un
 * clic sur le voile le ferme et la page ne défile plus derrière lui.
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
          key="mobile-menu"
          className="fixed inset-0 z-50 xl:hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.label}
            className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col overflow-y-auto bg-surface shadow-[0_0_60px_-20px_rgb(23_38_44_/_0.45)]"
            variants={{ hidden: { x: "100%", opacity: 0 }, visible: { x: 0, opacity: 1 } }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5 sm:px-8">
              <Link href={routes.home} aria-label={t.nav.home} className="block h-10">
                <Logo title="" />
              </Link>
              <button
                ref={closeButton}
                type="button"
                onClick={onClose}
                aria-label={t.nav.closeMenu}
                className="grid size-10 place-items-center rounded-md border border-line-strong text-ink transition-colors duration-200 hover:border-ink/45"
              >
                <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
              </button>
            </div>

            <nav aria-label={t.nav.label} className="flex-1 px-5 py-4 sm:px-8">
              <motion.ul
                variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } } }}
              >
                {navigation.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  const children = item.href === routes.formations ? formations : [];

                  return (
                    <motion.li
                      key={item.href}
                      className="border-b border-line last:border-b-0"
                      variants={{
                        hidden: { opacity: 0, x: 16 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_OUT } },
                      }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 py-3.5 font-display text-lg font-medium tracking-[-0.01em]",
                          active ? "text-cyan-700" : "text-ink",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn("size-1.5 rounded-full", active ? "bg-cyan-500" : "bg-transparent")}
                        />
                        {item.label}
                      </Link>
                      {children.length > 0 ? (
                        <ul className="-mt-1.5 grid gap-0.5 pb-3.5 pl-[1.125rem]">
                          {children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "block py-1.5 text-[0.9375rem]",
                                  pathname === child.href ? "text-cyan-700" : "text-muted",
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            <div className="shrink-0 border-t border-line bg-background px-5 py-6 sm:px-8">
              <ButtonLink href={routes.admissions} className="w-full">
                {t.nav.apply}
              </ButtonLink>
              {contact.phone || contact.email ? (
                <ul className="mt-5 grid gap-2.5 text-[0.9375rem] text-ink-soft">
                  {contact.phone ? (
                    <li>
                      <a href={phoneHref(contact.phone)} className="inline-flex items-center gap-3 hover:text-ink">
                        <Phone aria-hidden="true" strokeWidth={1.5} className="size-4 text-cyan-700" />
                        {contact.phone}
                      </a>
                    </li>
                  ) : null}
                  {contact.email ? (
                    <li>
                      <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3 hover:text-ink">
                        <Mail aria-hidden="true" strokeWidth={1.5} className="size-4 text-cyan-700" />
                        {contact.email}
                      </a>
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
