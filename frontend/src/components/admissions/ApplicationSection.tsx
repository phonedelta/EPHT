import { Clock, LifeBuoy, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { AnimatedText } from "@/components/motion/AnimatedText";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { ContactSettings, Formation } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { phoneHref } from "@/lib/format";
import { diplomaCode } from "@/lib/formations";
import { APPLY_ANCHOR, routes } from "@/lib/routes";

import { ApplicationForm, type FormationOption } from "./ApplicationForm";

const LINK = "mt-1 block w-fit font-medium text-cyan-700 underline-offset-4 hover:underline";

// Arc du croissant du logo, repris en filigrane.
const CRESCENT = "M36.4 112.53A65.45 65.45 0 1 1 148.82 47.27A65.45 65.45 0 0 0 36.4 112.53Z";

type ApplicationSectionProps = {
  formations: Formation[];
  contact: ContactSettings;
};

/**
 * Section du formulaire d'inscription, cible des boutons « Demander une
 * inscription » : la présentation et les garanties à gauche, le formulaire à droite.
 */
export function ApplicationSection({ formations, contact }: ApplicationSectionProps) {
  const t = getDictionary().pages.admissions.form;
  const tf = getDictionary().home.formations;

  const options: FormationOption[] = formations.map((formation) => ({
    slug: formation.slug,
    title: formation.title,
    code: diplomaCode(formation),
    // Niveau et places par groupe, quand ils sont renseignés ; le sigle du diplôme a son badge.
    details:
      [formation.level, formation.capacity ? tf.places(formation.capacity.per_group) : null]
        .filter(Boolean)
        .join(" · ") || null,
  }));

  const assurances = [
    { icon: Clock, title: t.assurances.time[0], text: t.assurances.time[1] },
    {
      icon: ShieldCheck,
      title: t.assurances.privacy[0],
      text: t.assurances.privacy[1],
      link: { href: routes.privacy, label: t.privacyLink },
    },
    {
      icon: LifeBuoy,
      title: t.assurances.help[0],
      text: t.assurances.help[1],
      link: contact.phone
        ? { href: phoneHref(contact.phone), label: contact.phone }
        : contact.email
          ? { href: `mailto:${contact.email}`, label: contact.email }
          : null,
    },
  ];

  return (
    <section
      id={APPLY_ANCHOR}
      aria-labelledby="apply-title"
      className="section-y relative isolate overflow-hidden bg-cyan-100"
    >
      <svg
        aria-hidden="true"
        viewBox="20 4 132 112"
        className="pointer-events-none absolute -left-[30%] top-10 -z-10 h-[34rem] text-white/60 lg:-left-[12%]"
      >
        <path d={CRESCENT} fill="currentColor" />
      </svg>

      {/* Sur mobile : présentation, formulaire, puis garanties. Sur grand écran, présentation et garanties à gauche. */}
      <div className="container-page grid gap-y-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12">
        <div className="lg:col-span-4">
          <Reveal>
            <Eyebrow>{t.eyebrow}</Eyebrow>
          </Reveal>
          <AnimatedText as="h2" id="apply-title" text={t.title} className="text-title mt-4" />
          <Reveal delay={0.1}>
            <p className="text-lead mt-4 text-ink-soft">{t.lead}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1">
          <ApplicationForm formations={options} />
        </Reveal>

        <Reveal as="ul" delay={0.15} className="flex flex-col gap-5 border-t border-cyan-200 pt-8 lg:col-span-4 lg:self-start">
          {assurances.map(({ icon: Icon, title, text, link }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface text-cyan-700 shadow-[0_1px_2px_rgb(23_38_44/0.06)]">
                <Icon aria-hidden="true" strokeWidth={1.75} className="size-5" />
              </span>
              <span className="text-[0.9375rem] leading-relaxed">
                <span className="block font-medium text-ink">{title}</span>
                <span className="text-ink-soft">{text}</span>
                {link?.href.startsWith("/") ? (
                  <Link href={link.href} className={LINK}>
                    {link.label}
                  </Link>
                ) : link ? (
                  <a href={link.href} className={cn(LINK, "tabular-nums")}>
                    {link.label}
                  </a>
                ) : null}
              </span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
