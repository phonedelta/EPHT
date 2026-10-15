import { Mail, Phone } from "lucide-react";

import { AnimatedText } from "@/components/motion/AnimatedText";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { SOCIAL_LABELS, SOCIAL_NETWORKS, SocialIcon } from "@/components/ui/SocialIcon";
import { getDictionary } from "@/i18n";
import type { ContactSettings, SocialSettings } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { phoneHref } from "@/lib/format";

type FollowSchoolProps = {
  social: SocialSettings;
  contact: ContactSettings;
};

/**
 * Suivre l'école sur ses réseaux, et la joindre pour une question : deux
 * cartes côte à côte. Rien n'est affiché sans réseau ni coordonnée renseignés.
 */
export function FollowSchool({ social, contact }: FollowSchoolProps) {
  const t = getDictionary().pages.news;
  const networks = SOCIAL_NETWORKS.filter((network) => social[network]);
  const hasContact = Boolean(contact.phone || contact.email);

  if (networks.length === 0 && !hasContact) {
    return null;
  }

  return (
    <section aria-labelledby="follow-title" className="section-y bg-background">
      <div className="container-page grid gap-5 lg:grid-cols-12 lg:gap-6">
        {networks.length > 0 ? (
          <Reveal
            className={cn(
              "relative isolate overflow-hidden rounded-2xl bg-cyan-500 p-7 sm:p-10",
              hasContact ? "lg:col-span-7" : "lg:col-span-12",
            )}
          >
            <SocialIcon
              network={networks[0]}
              className="pointer-events-none absolute -bottom-10 -right-6 -z-10 size-56 rotate-[-8deg] text-white/[0.14]"
            />
            <Eyebrow className="!text-ink">{t.followEyebrow}</Eyebrow>
            <AnimatedText as="h2" id="follow-title" text={t.followTitle} className="text-title mt-4 text-ink" />
            <p className="text-lead mt-4 max-w-[30rem] text-ink">{t.followText}</p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {networks.map((network) => (
                <li key={network}>
                  <a
                    href={social[network] ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses({ variant: "ink" })}
                  >
                    <SocialIcon network={network} className="size-4" />
                    <span>{t.followCta(SOCIAL_LABELS[network])}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {hasContact ? (
          <Reveal
            delay={0.1}
            className={cn(
              "flex flex-col rounded-2xl border border-line bg-surface p-7 sm:p-10",
              networks.length > 0 ? "lg:col-span-5" : "lg:col-span-12",
            )}
          >
            <h2 className="text-subtitle" id={networks.length > 0 ? undefined : "follow-title"}>
              {t.questionTitle}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{t.questionText}</p>
            <ul className="mt-auto grid gap-3 pt-8">
              {contact.phone ? (
                <li>
                  <a
                    href={phoneHref(contact.phone)}
                    className="group flex items-center gap-4 rounded-xl border border-line p-4 transition-colors duration-200 hover:border-cyan-600 hover:bg-cyan-50"
                  >
                    <span className="grid size-10 place-items-center rounded-lg bg-cyan-100 text-cyan-700">
                      <Phone aria-hidden="true" strokeWidth={1.75} className="size-[1.125rem]" />
                    </span>
                    <span className="font-medium tabular-nums text-ink">{contact.phone}</span>
                  </a>
                </li>
              ) : null}
              {contact.email ? (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="group flex items-center gap-4 rounded-xl border border-line p-4 transition-colors duration-200 hover:border-cyan-600 hover:bg-cyan-50"
                  >
                    <span className="grid size-10 place-items-center rounded-lg bg-cyan-100 text-cyan-700">
                      <Mail aria-hidden="true" strokeWidth={1.75} className="size-[1.125rem]" />
                    </span>
                    <span className="break-all font-medium text-ink">{contact.email}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
