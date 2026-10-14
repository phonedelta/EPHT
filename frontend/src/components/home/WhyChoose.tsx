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
      <div className="container-page grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <SectionHeader
            id="why-title"
            eyebrow={t.eyebrow}
            title={content.title}
            intro={content.intro}
            className="lg:sticky lg:top-28"
          />
        </div>

        <RevealGroup as="ol" stagger={0.08} className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {content.items.map((item, index) => (
            <RevealItem as="li" key={item.title} className="relative border-t border-line pb-8 pt-6 sm:pb-10">
              <span aria-hidden="true" className="absolute -top-px left-0 h-0.5 w-8 rounded-full bg-cyan-500" />
              <span aria-hidden="true" className="font-display text-[0.8125rem] font-semibold text-cyan-700">
                {ordinal(index)}
              </span>
              <h3 className="text-subtitle mt-3">{item.title}</h3>
              {item.text ? <p className="mt-2 max-w-[26rem] text-[0.9375rem] leading-relaxed text-muted">{item.text}</p> : null}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
