import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  text?: string | null;
  children?: ReactNode;
};

/** En-tête d'une page intérieure : surtitre, titre et texte d'introduction. */
export function PageIntro({ eyebrow, title, text, children }: PageIntroProps) {
  return (
    <section className="border-b border-line bg-background">
      <div className="container-page py-16 md:py-24 lg:py-28">
        <Reveal y={20}>
          <p className="eyebrow flex items-center gap-3 text-cyan-700">
            <span aria-hidden="true" className="h-px w-8 bg-cyan-500" />
            {eyebrow}
          </p>
          <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.25rem,1.4rem+3.4vw,3.75rem)] leading-[1.06] text-ink">
            {title}
          </h1>
          {text ? <p className="text-lead mt-6 max-w-[38rem] text-ink-soft">{text}</p> : null}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
