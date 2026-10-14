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
    <section aria-labelledby="testimonials-title" className="section-y bg-background">
      <div className="container-page">
        <SectionHeader id="testimonials-title" eyebrow={t.eyebrow} title={content.title} />

        <RevealGroup
          as="ul"
          stagger={0.12}
          className={cn("mt-12 grid gap-x-8 gap-y-12 lg:mt-16", !single && "lg:grid-cols-2")}
        >
          {testimonials.map((testimonial) => (
            <RevealItem as="li" key={testimonial.id} className="border-t border-line pt-8">
              <figure className={cn(single && "max-w-[52rem]")}>
                <Quote aria-hidden="true" strokeWidth={1.25} className="size-8 text-cyan-500" />
                <blockquote
                  className={cn(
                    "mt-5 font-display leading-[1.35] text-ink",
                    single ? "text-2xl sm:text-[2rem]" : "text-[1.375rem] sm:text-2xl",
                  )}
                >
                  <p>{testimonial.quote}</p>
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4">
                  {testimonial.photo ? (
                    <Photo
                      media={testimonial.photo}
                      sizes="56px"
                      className="size-14 shrink-0 rounded-full"
                      hideIllustrativeLabel
                    />
                  ) : null}
                  <div>
                    <p className="font-bold text-ink">{testimonial.author_name}</p>
                    <p className="text-[0.9375rem] text-muted">
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
