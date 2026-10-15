"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, type ReactNode } from "react";

import { getDictionary } from "@/i18n";

/*
 * Briques communes aux formulaires du site (inscription, contact).
 * L'apparence des champs eux-mêmes est définie dans globals.css.
 */

// Chevron de la liste déroulante, en gris « muted ».
export const SELECT_ARROW =
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2366757b' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]";

export type FieldControlProps = {
  id: string;
  name: string;
  "data-field": string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
};

type FieldProps = {
  name: string;
  label: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  className?: string;
  children: (props: FieldControlProps) => ReactNode;
};

/** Libellé, champ, mention facultative et message d'erreur reliés pour les lecteurs d'écran. */
export function Field({ name, label, error, optional = false, hint, className, children }: FieldProps) {
  const t = getDictionary().forms;
  const id = `application-${useId().replace(/:/g, "")}`;
  const described = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id}>
          {label}
          {optional ? null : (
            <span aria-hidden="true" className="ml-0.5 text-cyan-700">
              *
            </span>
          )}
        </label>
        {optional ? <span className="text-xs text-muted">{t.optional}</span> : null}
      </div>
      <div className="mt-1.5">
        {children({
          id,
          name,
          "data-field": name,
          "aria-invalid": Boolean(error),
          "aria-describedby": described || undefined,
          "aria-required": optional ? undefined : true,
        })}
      </div>
      <div className="mt-1.5 flex justify-between gap-3 text-[0.8125rem]">
        <AnimatePresence initial={false}>
          {error ? (
            <motion.p
              id={`${id}-error`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-700"
            >
              {error}
            </motion.p>
          ) : null}
        </AnimatePresence>
        {hint ? (
          <p id={`${id}-hint`} className="ml-auto tabular-nums text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

type HoneypotProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

/** Champ piège, hors de l'écran : un visiteur ne le voit ni ne le remplit, un robot si. */
export function Honeypot({ label, value, onChange }: HoneypotProps) {
  const id = `website-${useId().replace(/:/g, "")}`;

  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>{label}</label>
      <input id={id} name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

/** Adresse e-mail plausible ; l'API fait la vérification définitive. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Même règle que l'API : chiffres, espaces, points, tirets, indicatif international. */
export const PHONE_PATTERN = /^\+?[0-9][0-9 .-]{7,30}$/;
