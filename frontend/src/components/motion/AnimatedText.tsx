"use client";

import { motion } from "motion/react";
import { Fragment } from "react";

import { EASE_OUT } from "./Reveal";

const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, span: motion.span } as const;

type AnimatedTextProps = {
  text: string;
  as?: keyof typeof TAGS;
  id?: string;
  className?: string;
  /** Délai avant la première ligne, en secondes. */
  delay?: number;
  /** Anime dès l'affichage plutôt qu'à l'arrivée dans l'écran (titres du haut de page). */
  immediate?: boolean;
};

const VIEWPORT = { once: true, margin: "0px 0px -8% 0px" } as const;

const word = {
  hidden: { y: "105%" },
  visible: { y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/**
 * Titre dont les mots montent un à un derrière un masque. Le texte reste
 * entier dans la page (lecteurs d'écran, moteurs de recherche) ; seules les
 * espaces ordinaires séparent les mots, si bien qu'un signe précédé d'une
 * espace insécable (« avenir ? ») ne se retrouve jamais seul.
 */
export function AnimatedText({ text, as = "h2", id, className, delay = 0, immediate = false }: AnimatedTextProps) {
  const Tag = TAGS[as] as typeof motion.h2;
  const words = text.split(" ").filter(Boolean);
  const trigger = immediate ? { animate: "visible" } : { whileInView: "visible", viewport: VIEWPORT };

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      {...trigger}
      variants={{ visible: { transition: { staggerChildren: 0.035, delayChildren: delay } } }}
    >
      {words.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          {/* Le masque déborde un peu en haut et en bas : accents et jambages ne sont pas coupés. */}
          <span className="-mb-[0.18em] -mt-[0.12em] inline-block overflow-hidden pb-[0.18em] pt-[0.12em] align-top">
            <motion.span data-reveal="" className="inline-block" variants={word}>
              {item}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
