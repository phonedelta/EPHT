import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { HomeSettings } from "@/lib/api/schemas";
import { ordinal } from "@/lib/format";

/** Raisons de choisir l'école : une liste sobre, sans chiffres. */
export function WhyChoose({ content }: { content: HomeSettings["why"] }) {
  const t = getDictionary().home.why;

  if (content.items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="why-title" className="section-y bg-surface">
      <div className="container-page grid gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-4">
          <SectionHeader
            id="why-title"
            eyebrow={t.eyebrow}
            title={content.title}
            intro={content.intro}
            className="lg:sticky lg:top-32"
          />
        </div>

        <RevealGroup as="ol" stagger={0.1} className="border-b border-line lg:col-span-7 lg:col-start-6">
          {content.items.map((item, index) => (
            <RevealItem
              as="li"
              key={item.title}
              className="grid gap-x-8 gap-y-3 border-t border-line py-8 md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.15fr)] md:py-9"
            >
              <span aria-hidden="true" className="font-display text-[1.75rem] leading-none text-cyan-600">
                {ordinal(index)}
              </span>
              <h3 className="text-subtitle">{item.title}</h3>
              {item.text ? <p className="text-ink-soft md:pt-1">{item.text}</p> : null}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
