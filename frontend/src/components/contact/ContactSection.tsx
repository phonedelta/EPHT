import { ArrowUpRight, BookOpen, Briefcase, Building2, PenLine, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { AnimatedText } from "@/components/motion/AnimatedText";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";

import { ContactForm } from "./ContactForm";

const TOPICS: Record<string, { href: string; icon: LucideIcon }> = {
  formations: { href: routes.formations, icon: BookOpen },
  apply: { href: routes.apply(), icon: PenLine },
  careers: { href: routes.careers, icon: Briefcase },
  infrastructures: { href: routes.infrastructures, icon: Building2 },
};

/**
 * Formulaire de contact, précédé des pages qui répondent aux questions les
 * plus courantes : une partie des visiteurs trouve sa réponse sans écrire.
 */
export function ContactSection() {
  const t = getDictionary().pages.contact;

  return (
    <section aria-labelledby="contact-form-title" className="section-y bg-cyan-100">
      <div className="container-page grid gap-y-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12">
        <div className="lg:col-span-4">
          <Reveal>
            <Eyebrow>{t.formEyebrow}</Eyebrow>
          </Reveal>
          <AnimatedText as="h2" id="contact-form-title" text={t.formTitle} className="text-title mt-4" />
          <Reveal delay={0.1}>
            <p className="text-lead mt-4 text-ink-soft">{t.formLead}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1">
          <ContactForm />
        </Reveal>

        <div className="border-t border-cyan-200 pt-8 lg:col-span-4 lg:self-start">
          <Reveal>
            <h3 className="text-[0.9375rem] font-semibold text-ink">{t.topicsTitle}</h3>
          </Reveal>
          <RevealGroup as="ul" className="mt-4 grid gap-2.5" stagger={0.06}>
            {t.topics.map((topic) => {
              const { href, icon: Icon } = TOPICS[topic.key];

              return (
                <RevealItem as="li" key={topic.key}>
                  <Link
                    href={href}
                    className="group flex items-center gap-4 rounded-xl border border-transparent bg-surface/70 p-3.5 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px hover:border-cyan-200 hover:bg-surface"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-700 transition-colors duration-200 group-hover:bg-cyan-600 group-hover:text-white">
                      <Icon aria-hidden="true" strokeWidth={1.75} className="size-[1.125rem]" />
                    </span>
                    <span className="min-w-0 flex-1 text-[0.875rem] leading-snug">
                      <span className="block font-medium text-ink">{topic.title}</span>
                      <span className="text-muted">{topic.text}</span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="size-4 shrink-0 text-muted transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-700"
                    />
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
