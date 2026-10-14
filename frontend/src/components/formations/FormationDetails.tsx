import { Check, ChevronDown, FileText } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getDictionary } from "@/i18n";
import type { DetailItem, FormationDetail } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";
import { ordinal } from "@/lib/format";

type DetailSection = { key: string; title: string; items: DetailItem[]; numbered?: boolean };

/** Rubriques renseignées par l'école, dans l'ordre de lecture. */
export function formationSections(formation: FormationDetail): DetailSection[] {
  const t = getDictionary().pages.formation.sections;

  return [
    { key: "objectives", title: t.objectives, items: formation.objectives },
    { key: "skills", title: t.skills, items: formation.skills },
    { key: "program", title: t.program, items: formation.program, numbered: true },
    { key: "requirements", title: t.requirements, items: formation.admission_requirements },
    { key: "careers", title: t.careers, items: formation.career_opportunities },
    { key: "documents", title: t.documents, items: formation.required_documents },
  ].filter((section) => section.items.length > 0);
}

/** Rubriques de la fiche en cartes : objectifs, programme, conditions d'accès… */
export function FormationSections({ sections }: { sections: DetailSection[] }) {
  return (
    <RevealGroup className="grid gap-5 md:grid-cols-2 lg:gap-6" stagger={0.06}>
      {sections.map((section) => (
        <RevealItem
          key={section.key}
          className={cn(
            "rounded-xl border border-line bg-surface p-6 sm:p-8",
            // Le programme, souvent plus long, occupe toute la largeur.
            section.numbered && "md:col-span-2",
          )}
        >
          <h3 className="text-subtitle">{section.title}</h3>
          <ul className={cn("mt-5 grid gap-3.5", section.numbered && "md:grid-cols-2 md:gap-x-10")}>
            {section.items.map((item, index) => (
              <li key={`${item.title}-${index}`} className="flex gap-3">
                {section.numbered ? (
                  <span aria-hidden="true" className="mt-0.5 font-display text-[0.8125rem] font-semibold text-cyan-700">
                    {ordinal(index)}
                  </span>
                ) : section.key === "documents" ? (
                  <FileText aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0 text-cyan-700" />
                ) : (
                  <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-cyan-100">
                    <Check strokeWidth={2} className="size-3 text-cyan-700" />
                  </span>
                )}
                <span>
                  <span className="block text-[0.9375rem] leading-relaxed text-ink">{item.title}</span>
                  {item.text ? <span className="mt-0.5 block text-sm leading-relaxed text-muted">{item.text}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/** Questions fréquentes, en accordéon natif (sans JavaScript), qui s'ouvre en douceur. */
export function FormationFaq({ faq }: { faq: FormationDetail["faq"] }) {
  return (
    <Reveal className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
      {faq.map((entry) => (
        <details key={entry.question} className="disclosure group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-display text-base font-semibold text-ink transition-colors duration-200 hover:text-cyan-700 sm:px-8 [&::-webkit-details-marker]:hidden">
            {entry.question}
            <ChevronDown
              aria-hidden="true"
              strokeWidth={1.75}
              className="size-5 shrink-0 text-cyan-700 transition-transform duration-300 ease-out-soft group-open:rotate-180"
            />
          </summary>
          <p className="px-6 pb-6 text-[0.9375rem] leading-relaxed text-muted sm:px-8">{entry.answer}</p>
        </details>
      ))}
    </Reveal>
  );
}
