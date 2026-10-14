import { Mail, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import type { ContactSettings } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { phoneHref } from "@/lib/format";

type ContactPanelProps = {
  eyebrow: string;
  title: string;
  text: string;
  contact: ContactSettings;
  className?: string;
};

/**
 * Encadré d'appel au contact : un texte et les moyens de joindre l'école
 * renseignés dans les paramètres (téléphone, e-mail).
 */
export function ContactPanel({ eyebrow, title, text, contact, className }: ContactPanelProps) {
  const t = getDictionary().pages.contact;

  return (
    <Reveal
      className={cn(
        "grid gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:p-10",
        className,
      )}
    >
      <div>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{eyebrow}</p>
        <h2 className="mt-3 text-subtitle">{title}</h2>
        <p className="mt-2 max-w-[40rem] text-[0.9375rem] leading-relaxed text-muted">{text}</p>
      </div>

      {contact.phone || contact.email ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          {contact.phone ? (
            <a href={phoneHref(contact.phone)} className={cn(buttonClasses(), "whitespace-nowrap")}>
              <Phone aria-hidden="true" strokeWidth={1.75} className="size-4" />
              <span>
                {t.call} <span className="tabular-nums">{contact.phone}</span>
              </span>
            </a>
          ) : null}
          {contact.email ? (
            <a href={`mailto:${contact.email}`} className={cn(buttonClasses({ variant: "outline" }), "whitespace-nowrap")}>
              <Mail aria-hidden="true" strokeWidth={1.75} className="size-4" />
              <span>{contact.email}</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </Reveal>
  );
}
