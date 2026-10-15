"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, LoaderCircle, MailCheck, Send } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import { sendContactMessage, type ContactInput } from "@/app/(site)/contact/actions";
import { EMAIL_PATTERN, Field, Honeypot, PHONE_PATTERN } from "@/components/forms/fields";
import { EASE_OUT } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

type FieldName = keyof ContactInput;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: ContactInput = { name: "", email: "", phone: "", subject: "", message: "", consent: false, website: "" };

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 5000;

function validate(values: ContactInput): Errors {
  const t = getDictionary().pages.contact.errors;
  const errors: Errors = {};

  if (values.name.trim() === "") errors.name = t.name;
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = t.email;
  if (values.phone.trim() !== "" && !PHONE_PATTERN.test(values.phone.trim())) errors.phone = t.phone;
  if (values.subject === "") errors.subject = t.subject;
  if (values.message.trim().length < MESSAGE_MIN) errors.message = t.message;
  if (!values.consent) errors.consent = t.consent;

  return errors;
}

/** Ordre des champs, pour placer le focus sur la première erreur. */
const ORDER: FieldName[] = ["name", "email", "phone", "subject", "message", "consent"];

/** Formulaire de contact : un message enregistré par l'API, traité par l'école. */
export function ContactForm() {
  const t = getDictionary().pages.contact;

  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [alert, setAlert] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  function update<Name extends FieldName>(field: Name, value: ContactInput[Name]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function focusFirstError(found: Errors) {
    const field = ORDER.find((name) => found[name]);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-contact-field="${field}"]`)?.focus());
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    setSubmitting(true);
    setAlert(null);

    const result = await sendContactMessage(values).catch(() => null);

    setSubmitting(false);

    if (result?.ok) {
      setSentTo(values.name.trim().split(/\s+/)[0] ?? "");
      return;
    }

    if (result?.reason === "invalid") {
      setErrors(result.errors);
      setAlert(t.errors.invalid);
      focusFirstError(result.errors);
      return;
    }

    setAlert(result?.reason === "rateLimited" ? t.errors.rateLimited : t.errors.unavailable);
  }

  function restart() {
    setValues(EMPTY);
    setErrors({});
    setAlert(null);
    setSentTo(null);
  }

  // Les champs du module partagé portent data-field ; ce formulaire a son propre attribut
  // pour ne pas croiser ceux du formulaire d'inscription sur une même page.
  const control = (name: FieldName) => ({ "data-contact-field": name });

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgb(23_38_44/0.04),0_24px_48px_-24px_rgb(23_38_44/0.18)]">
      <AnimatePresence mode="wait" initial={false}>
        {sentTo !== null ? (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="px-6 py-14 text-center sm:px-10"
          >
            <motion.span
              initial={{ scale: 0.6, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="mx-auto flex size-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-700"
            >
              <MailCheck aria-hidden="true" strokeWidth={1.5} className="size-8" />
            </motion.span>
            <h3 className="mt-6 text-subtitle">{t.success.title}</h3>
            <p className="mx-auto mt-3 max-w-[28rem] text-[0.9375rem] leading-relaxed text-muted">{t.success.text(sentTo)}</p>
            <button type="button" onClick={restart} className={cn(buttonClasses({ variant: "outline" }), "mt-8")}>
              {t.success.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative grid gap-5 p-6 sm:grid-cols-2 sm:p-8"
          >
            <Field name="name" label={t.fields.name} error={errors.name} className="sm:col-span-2">
              {(props) => (
                <input
                  {...props}
                  {...control("name")}
                  autoComplete="name"
                  maxLength={150}
                  value={values.name}
                  onChange={(event) => update("name", event.target.value)}
                />
              )}
            </Field>
            <Field name="email" label={t.fields.email} error={errors.email}>
              {(props) => (
                <input
                  {...props}
                  {...control("email")}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={255}
                  placeholder={t.placeholders.email}
                  value={values.email}
                  onChange={(event) => update("email", event.target.value)}
                />
              )}
            </Field>
            <Field name="phone" label={t.fields.phone} error={errors.phone} optional>
              {(props) => (
                <input
                  {...props}
                  {...control("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={32}
                  placeholder={t.placeholders.phone}
                  value={values.phone}
                  onChange={(event) => update("phone", event.target.value)}
                />
              )}
            </Field>

            <fieldset className="sm:col-span-2">
              <legend className="text-sm font-medium text-ink">
                {t.fields.subject}
                <span aria-hidden="true" className="ml-0.5 text-cyan-700">
                  *
                </span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {t.subjects.map((subject, index) => {
                  const checked = values.subject === subject;

                  return (
                    <label
                      key={subject}
                      className={cn(
                        "relative inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,color] duration-200",
                        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-cyan-500",
                        checked
                          ? "border-ink bg-ink text-white"
                          : errors.subject
                            ? "border-red-300 text-ink-soft hover:border-red-400"
                            : "border-line-strong text-ink-soft hover:border-ink hover:text-ink",
                      )}
                    >
                      <input
                        type="radio"
                        name="subject"
                        value={subject}
                        checked={checked}
                        onChange={() => update("subject", subject)}
                        className="sr-only"
                        {...(index === 0 ? control("subject") : {})}
                      />
                      {checked ? <Check aria-hidden="true" strokeWidth={2.5} className="size-3.5" /> : null}
                      {subject}
                    </label>
                  );
                })}
              </div>
              {errors.subject ? <p className="mt-2 text-[0.8125rem] text-red-700">{errors.subject}</p> : null}
            </fieldset>

            <Field
              name="message"
              label={t.fields.message}
              error={errors.message}
              hint={t.characters(values.message.length, MESSAGE_MAX)}
              className="sm:col-span-2"
            >
              {(props) => (
                <textarea
                  {...props}
                  {...control("message")}
                  rows={6}
                  maxLength={MESSAGE_MAX}
                  placeholder={t.placeholders.message}
                  value={values.message}
                  onChange={(event) => update("message", event.target.value)}
                  className="resize-y"
                />
              )}
            </Field>

            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 font-normal">
                <input
                  type="checkbox"
                  name="consent"
                  checked={values.consent}
                  onChange={(event) => update("consent", event.target.checked)}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "contact-consent-error" : undefined}
                  className="mt-0.5 size-[1.125rem] shrink-0 cursor-pointer accent-cyan-600"
                  {...control("consent")}
                />
                <span className="text-[0.875rem] leading-relaxed text-ink-soft">
                  {t.consent}{" "}
                  <Link href={routes.privacy} target="_blank" className="font-medium text-cyan-700 underline underline-offset-4">
                    {t.privacyLink}
                  </Link>
                </span>
              </label>
              {errors.consent ? (
                <p id="contact-consent-error" className="mt-2 text-[0.8125rem] text-red-700">
                  {errors.consent}
                </p>
              ) : null}
            </div>

            <Honeypot label={t.fields.website} value={values.website} onChange={(value) => update("website", value)} />

            <AnimatePresence initial={false}>
              {alert ? (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden sm:col-span-2"
                >
                  <span className="block rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{alert}</span>
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="flex justify-end border-t border-line pt-5 sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className={cn(buttonClasses({ size: "lg" }), "w-full disabled:pointer-events-none disabled:opacity-60 sm:w-auto")}
              >
                {submitting ? (
                  <LoaderCircle aria-hidden="true" strokeWidth={1.75} className="size-4 animate-spin" />
                ) : (
                  <Send aria-hidden="true" strokeWidth={1.75} className="size-4" />
                )}
                <span>{submitting ? t.submitting : t.submit}</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
