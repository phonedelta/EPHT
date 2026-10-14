import { Quote } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDictionary } from "@/i18n";
import type { HomeSettings, Testimonial } from "@/lib/api/schemas";
import { cn } from "@/lib/cn";

type TestimonialsProps = {
  content: HomeSettings["testimonials"];
  /** Témoignages validés et publiés depuis l'administration. */
  testimonials: Testimonial[];
};

/**
 * Témoignages réels uniquement : tant qu'aucun n'est publié, la section
 * entière est absente de la page.
 */
export function Testimonials({ content, testimonials }: TestimonialsProps) {
  const t = getDictionary().home.testimonials;

  if (testimonials.length === 0) {
    return null;
  }

  const single = testimonials.length === 1;

  return (
    <section aria-labelledby="testimonials-title" className="section-y bg-cyan-100">
      <div className="container-page">
        <SectionHeader id="testimonials-title" eyebrow={t.eyebrow} title={content.title} />

        <RevealGroup as="ul" stagger={0.08} className={cn("mt-10 grid gap-5 lg:mt-12 lg:gap-6", !single && "lg:grid-cols-2")}>
          {testimonials.map((testimonial) => (
            <RevealItem as="li" key={testimonial.id} className="rounded-xl border border-line bg-surface p-6 sm:p-8">
              <figure className={cn("flex h-full flex-col", single && "max-w-[52rem]")}>
                <Quote aria-hidden="true" strokeWidth={1.5} className="size-6 text-cyan-500" />
                <blockquote
                  className={cn(
                    "mb-6 mt-4 font-display font-medium leading-[1.5] tracking-[-0.01em] text-ink",
                    single ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
                  )}
                >
                  <p>{testimonial.quote}</p>
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3.5 border-t border-line pt-5">
                  {testimonial.photo ? (
                    <Photo
                      media={testimonial.photo}
                      sizes="44px"
                      className="size-11 shrink-0 rounded-full"
                    />
                  ) : null}
                  <div>
                    <p className="font-display text-[0.9375rem] font-semibold text-ink">{testimonial.author_name}</p>
                    <p className="text-sm text-muted">
                      {[testimonial.author_role, testimonial.formation?.title].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
