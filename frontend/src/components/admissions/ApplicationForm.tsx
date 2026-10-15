"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { submitApplication, type ApplicationInput } from "@/app/(site)/admissions/actions";
import { EASE_OUT } from "@/components/motion/Reveal";
import { DiplomaBadge } from "@/components/formations/DiplomaBadge";
import { EMAIL_PATTERN, Field, Honeypot, PHONE_PATTERN, SELECT_ARROW } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/Button";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

export type FormationOption = {
  slug: string;
  title: string;
  /** Sigle du diplôme (DQ, DT, DTS), quand il est connu. */
  code: string | null;
  /** Niveau et capacité, quand ils sont connus. */
  details: string | null;
};

type Values = Omit<ApplicationInput, "submission_token">;
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Values = {
  formation: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  city: "",
  education_level: "",
  diploma_obtained: "",
  message: "",
  consent: false,
  website: "",
};

/** Champs vérifiés à chaque étape, dans l'ordre d'affichage. */
const STEP_FIELDS: FieldName[][] = [
  ["formation"],
  ["first_name", "last_name", "email", "phone", "city"],
  ["education_level", "diploma_obtained", "message"],
  ["consent", "website"],
];

const MESSAGE_MAX = 2000;

function validate(values: Values, fields: FieldName[]): Errors {
  const t = getDictionary().pages.admissions.form.errors;
  const errors: Errors = {};
  const blank = (field: FieldName) => String(values[field]).trim() === "";

  for (const field of fields) {
    if (field === "formation" && blank(field)) errors.formation = t.formation;
    if (field === "first_name" && blank(field)) errors.first_name = t.firstName;
    if (field === "last_name" && blank(field)) errors.last_name = t.lastName;
    if (field === "email" && !EMAIL_PATTERN.test(values.email.trim())) errors.email = t.email;
    if (field === "phone" && !PHONE_PATTERN.test(values.phone.trim())) errors.phone = t.phone;
    if (field === "city" && blank(field)) errors.city = t.city;
    if (field === "education_level" && blank(field)) errors.education_level = t.educationLevel;
    if (field === "message" && values.message.length > MESSAGE_MAX) errors.message = t.message;
    if (field === "consent" && !values.consent) errors.consent = t.consent;
  }

  return errors;
}

/**
 * Lit la formation présélectionnée depuis sa fiche (/admissions?formation=…).
 * Isolé sous <Suspense> : le reste du formulaire reste rendu d'avance, sans
 * dépendre des paramètres de la requête.
 */
function FormationFromUrl({ formations, onFound }: { formations: FormationOption[]; onFound: (slug: string) => void }) {
  const slug = useSearchParams().get("formation") ?? "";

  useEffect(() => {
    if (formations.some((formation) => formation.slug === slug)) {
      onFound(slug);
    }
  }, [formations, onFound, slug]);

  return null;
}

/** Jeton de soumission : un double envoi retrouve la même candidature. */
function newToken(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (digit) =>
    (Number(digit) ^ (Math.floor(Math.random() * 16) >> (Number(digit) / 4))).toString(16),
  );
}

type ApplicationFormProps = {
  formations: FormationOption[];
};

/**
 * Demande d'inscription en quatre étapes : formation, coordonnées, parcours,
 * vérification. Chaque étape est validée avant de passer à la suivante ; les
 * erreurs renvoyées par l'API ramènent à l'étape du champ concerné.
 */
export function ApplicationForm({ formations }: ApplicationFormProps) {
  const t = getDictionary().pages.admissions.form;
  const total = t.steps.length;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [alert, setAlert] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<string | null>(null);
  const focusPending = useRef(false);

  const preselect = useCallback((slug: string) => setValues((current) => ({ ...current, formation: slug })), []);

  function update<Field extends FieldName>(field: Field, value: Values[Field]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function goTo(target: number) {
    setDirection(target > step ? 1 : -1);
    setStep(target);
    setAlert(null);
    focusPending.current = true;

    // Sur mobile, le haut du formulaire peut être sorti de l'écran.
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function next() {
    const stepErrors = validate(values, STEP_FIELDS[step]);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) {
      focusFirstError(stepErrors);
      return;
    }

    goTo(step + 1);
  }

  function focusFirstError(found: Errors) {
    const field = STEP_FIELDS.flat().find((name) => found[name]);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-field="${field}"]`)?.focus());
  }

  async function submit() {
    const allErrors = validate(values, STEP_FIELDS.flat());

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const first = STEP_FIELDS.findIndex((fields) => fields.some((field) => allErrors[field]));
      if (first !== step) goTo(first);
      else focusFirstError(allErrors);
      return;
    }

    tokenRef.current ??= newToken();
    setSubmitting(true);
    setAlert(null);

    const result = await submitApplication({ ...values, submission_token: tokenRef.current }).catch(() => null);

    setSubmitting(false);

    if (result?.ok) {
      setReference(result.data.reference);
      return;
    }

    if (result?.reason === "invalid") {
      setErrors(result.errors);
      const first = STEP_FIELDS.findIndex((fields) => fields.some((field) => result.errors[field]));
      if (first >= 0 && first !== step) goTo(first);
      setAlert(t.errors.invalid);
      return;
    }

    setAlert(result?.reason === "rateLimited" ? t.errors.rateLimited : t.errors.unavailable);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;
    if (step < total - 1) next();
    else void submit();
  }

  function restart() {
    setValues(EMPTY);
    setErrors({});
    setAlert(null);
    setReference(null);
    tokenRef.current = null;
    setDirection(-1);
    setStep(0);
  }

  const focusHeading = (element: HTMLHeadingElement | null) => {
    if (element && focusPending.current) {
      focusPending.current = false;
      element.focus({ preventScroll: true });
    }
  };

  const selected = formations.find((formation) => formation.slug === values.formation);

  return (
    <div
      ref={cardRef}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgb(23_38_44/0.04),0_24px_48px_-24px_rgb(23_38_44/0.18)]"
    >
      <Suspense fallback={null}>
        <FormationFromUrl formations={formations} onFound={preselect} />
      </Suspense>

      <AnimatePresence mode="wait" initial={false}>
        {reference ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="px-6 py-12 text-center sm:px-10 sm:py-16"
            role="status"
          >
            <motion.span
              initial={{ scale: 0.6, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="mx-auto flex size-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-700"
            >
              <PartyPopper aria-hidden="true" strokeWidth={1.5} className="size-8" />
            </motion.span>
            <h3 className="mt-6 text-subtitle">{t.success.title}</h3>
            <p className="mx-auto mt-3 max-w-[30rem] text-[0.9375rem] leading-relaxed text-muted">
              {t.success.text(values.first_name.trim())}
            </p>

            <div className="mx-auto mt-8 max-w-[22rem] rounded-xl border border-dashed border-cyan-400 bg-cyan-50 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-cyan-700">{t.success.reference}</p>
              <p className="mt-1.5 font-display text-xl font-semibold tabular-nums tracking-[0.04em] text-ink">{reference}</p>
            </div>
            <p className="mx-auto mt-3 max-w-[22rem] text-[0.8125rem] text-muted">{t.success.keep}</p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href={routes.formations} className={buttonClasses()}>
                <span>{t.success.formations}</span>
                <ArrowRight aria-hidden="true" strokeWidth={1.75} className="size-4" />
              </Link>
              <button type="button" onClick={restart} className={buttonClasses({ variant: "outline" })}>
                {t.success.again}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Progress step={step} onSelect={goTo} />

            <div className="relative px-6 py-7 sm:px-8 sm:py-8">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.fieldset
                  key={step}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -24 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  className="min-w-0"
                >
                  <legend className="sr-only">{t.steps[step].title}</legend>
                  <h3 ref={focusHeading} tabIndex={-1} className="text-subtitle outline-none">
                    {t.steps[step].heading}
                  </h3>

                  <div className="mt-6">
                    {step === 0 ? (
                      <FormationStep
                        formations={formations}
                        value={values.formation}
                        error={errors.formation}
                        onChange={(slug) => update("formation", slug)}
                      />
                    ) : null}

                    {step === 1 ? (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField
                          name="first_name"
                          label={t.fields.firstName}
                          autoComplete="given-name"
                          values={values}
                          errors={errors}
                          onChange={update}
                        />
                        <TextField
                          name="last_name"
                          label={t.fields.lastName}
                          autoComplete="family-name"
                          values={values}
                          errors={errors}
                          onChange={update}
                        />
                        <TextField
                          name="email"
                          type="email"
                          label={t.fields.email}
                          autoComplete="email"
                          placeholder={t.placeholders.email}
                          values={values}
                          errors={errors}
                          onChange={update}
                        />
                        <TextField
                          name="phone"
                          type="tel"
                          label={t.fields.phone}
                          autoComplete="tel"
                          placeholder={t.placeholders.phone}
                          values={values}
                          errors={errors}
                          onChange={update}
                        />
                        <TextField
                          name="city"
                          label={t.fields.city}
                          autoComplete="address-level2"
                          placeholder={t.placeholders.city}
                          values={values}
                          errors={errors}
                          onChange={update}
                          className="sm:col-span-2"
                        />
                      </div>
                    ) : null}

                    {step === 2 ? (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field name="education_level" label={t.fields.educationLevel} error={errors.education_level}>
                          {(props) => (
                            <select
                              {...props}
                              value={values.education_level}
                              onChange={(event) => update("education_level", event.target.value)}
                              className={cn("appearance-none bg-[length:1rem] bg-[right_0.875rem_center] bg-no-repeat pr-10", SELECT_ARROW)}
                            >
                              <option value="" disabled>
                                {t.placeholders.educationLevel}
                              </option>
                              {t.educationLevels.map((level) => (
                                <option key={level} value={level}>
                                  {level}
                                </option>
                              ))}
                            </select>
                          )}
                        </Field>
                        <TextField
                          name="diploma_obtained"
                          label={t.fields.diplomaObtained}
                          placeholder={t.placeholders.diplomaObtained}
                          optional
                          values={values}
                          errors={errors}
                          onChange={update}
                        />
                        <Field
                          name="message"
                          label={t.fields.message}
                          optional
                          error={errors.message}
                          className="sm:col-span-2"
                          hint={t.characters(values.message.length, MESSAGE_MAX)}
                        >
                          {(props) => (
                            <textarea
                              {...props}
                              rows={5}
                              maxLength={MESSAGE_MAX}
                              placeholder={t.placeholders.message}
                              value={values.message}
                              onChange={(event) => update("message", event.target.value)}
                              className="resize-y"
                            />
                          )}
                        </Field>
                      </div>
                    ) : null}

                    {step === 3 ? (
                      <ReviewStep values={values} formation={selected?.title ?? values.formation} onEdit={goTo} errors={errors} onChange={update} />
                    ) : null}
                  </div>
                </motion.fieldset>
              </AnimatePresence>

              <Honeypot label={t.fields.website} value={values.website} onChange={(value) => update("website", value)} />
            </div>

            <AnimatePresence initial={false}>
              {alert ? (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-6 overflow-hidden sm:mx-8"
                >
                  <span className="mb-5 block rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {alert}
                  </span>
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="flex flex-col-reverse gap-3 border-t border-line bg-background/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  disabled={submitting}
                  className={cn(buttonClasses({ variant: "outline" }), "disabled:opacity-50")}
                >
                  <ArrowLeft aria-hidden="true" strokeWidth={1.75} className="size-4" />
                  <span>{t.back}</span>
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}

              <button
                type="submit"
                disabled={submitting || formations.length === 0}
                aria-busy={submitting}
                className={cn(buttonClasses({ size: "lg" }), "disabled:pointer-events-none disabled:opacity-60")}
              >
                {submitting ? (
                  <>
                    <LoaderCircle aria-hidden="true" strokeWidth={1.75} className="size-4 animate-spin" />
                    <span>{t.submitting}</span>
                  </>
                ) : (
                  <>
                    <span>{step < total - 1 ? t.next : t.submit}</span>
                    {step < total - 1 ? (
                      <ArrowRight aria-hidden="true" strokeWidth={1.75} className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
                    ) : (
                      <Check aria-hidden="true" strokeWidth={2} className="size-4" />
                    )}
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Barre de progression : une graduation par étape ; les étapes passées restent cliquables. */
function Progress({ step, onSelect }: { step: number; onSelect: (step: number) => void }) {
  const t = getDictionary().pages.admissions.form;

  return (
    <div className="border-b border-line px-6 pb-5 pt-6 sm:px-8">
      <p className="flex items-baseline justify-between gap-4 text-[0.8125rem]">
        <span className="font-medium text-ink" aria-live="polite">
          {t.progress(step + 1, t.steps.length)}
        </span>
        <span className="text-muted sm:hidden">{t.steps[step].title}</span>
      </p>

      <ol aria-label={t.stepsLabel} className="mt-3 grid grid-cols-4 gap-2">
        {t.steps.map((item, index) => {
          const done = index < step;
          const current = index === step;

          const content = (
            <>
              <span className="block h-1.5 overflow-hidden rounded-full bg-line">
                <motion.span
                  className="block h-full origin-left rounded-full bg-cyan-600"
                  initial={false}
                  animate={{ scaleX: index <= step ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                />
              </span>
              <span
                className={cn(
                  "mt-2.5 hidden items-center gap-1.5 text-[0.8125rem] sm:flex",
                  current ? "font-medium text-ink" : done ? "text-cyan-700" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-semibold tabular-nums transition-colors duration-200",
                    done ? "bg-cyan-600 text-white" : current ? "bg-ink text-white" : "bg-line text-muted",
                  )}
                >
                  {done ? <Check aria-hidden="true" strokeWidth={3} className="size-3" /> : index + 1}
                </span>
                {item.title}
              </span>
            </>
          );

          return (
            <li key={item.title} aria-current={current ? "step" : undefined}>
              {done ? (
                <button type="button" onClick={() => onSelect(index)} className="block w-full rounded-sm text-left hover:opacity-80">
                  {content}
                </button>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

type TextFieldProps = {
  name: Exclude<FieldName, "consent">;
  label: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  placeholder?: string;
  optional?: boolean;
  className?: string;
  values: Values;
  errors: Errors;
  onChange: <Name extends FieldName>(field: Name, value: Values[Name]) => void;
};

function TextField({ name, label, type = "text", autoComplete, placeholder, optional, className, values, errors, onChange }: TextFieldProps) {
  return (
    <Field name={name} label={label} error={errors[name]} optional={optional} className={className}>
      {(props) => (
        <input
          {...props}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          maxLength={name === "email" ? 255 : 100}
          inputMode={type === "tel" ? "tel" : type === "email" ? "email" : undefined}
          value={values[name]}
          onChange={(event) => onChange(name, event.target.value)}
        />
      )}
    </Field>
  );
}

type FormationStepProps = {
  formations: FormationOption[];
  value: string;
  error?: string;
  onChange: (slug: string) => void;
};

/** Choix de la formation : une carte par formation publiée. */
function FormationStep({ formations, value, error, onChange }: FormationStepProps) {
  const t = getDictionary().pages.admissions.form;

  if (formations.length === 0) {
    return <p className="rounded-xl border border-line bg-background px-5 py-4 text-[0.9375rem] text-muted">{t.noFormation}</p>;
  }

  return (
    <div role="radiogroup" aria-label={t.fields.formation} aria-invalid={Boolean(error)} aria-describedby={error ? "formation-error" : undefined}>
      <div className="grid gap-3 sm:grid-cols-2">
        {formations.map((formation, index) => {
          const checked = formation.slug === value;

          return (
            <label
              key={formation.slug}
              className={cn(
                "group relative flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-[border-color,background-color,box-shadow] duration-200",
                "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-cyan-500",
                checked
                  ? "border-cyan-600 bg-cyan-50 shadow-[inset_0_0_0_1px_var(--color-cyan-600)]"
                  : error
                    ? "border-red-300 hover:border-red-400"
                    : "border-line hover:border-line-strong hover:bg-background",
              )}
            >
              <input
                type="radio"
                name="formation"
                value={formation.slug}
                checked={checked}
                onChange={() => onChange(formation.slug)}
                data-field={index === 0 ? "formation" : undefined}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-200",
                  checked ? "border-cyan-600 bg-cyan-600 text-white" : "border-line-strong bg-surface group-hover:border-muted",
                )}
              >
                <motion.span initial={false} animate={{ scale: checked ? 1 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 28 }}>
                  <Check strokeWidth={3} className="size-3" />
                </motion.span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[0.9375rem] font-semibold leading-snug text-ink">{formation.title}</span>
                {formation.details ? <span className="mt-1 block text-[0.8125rem] font-normal text-muted">{formation.details}</span> : null}
              </span>
              {formation.code ? <DiplomaBadge code={formation.code} size="sm" /> : null}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id="formation-error" className="mt-3 text-[0.8125rem] text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type ReviewStepProps = {
  values: Values;
  formation: string;
  errors: Errors;
  onEdit: (step: number) => void;
  onChange: <Name extends FieldName>(field: Name, value: Values[Name]) => void;
};

/** Récapitulatif par étape, avec un lien pour corriger, puis l'accord du candidat. */
function ReviewStep({ values, formation, errors, onEdit, onChange }: ReviewStepProps) {
  const t = getDictionary().pages.admissions.form;
  const none = <span className="text-muted">{t.summary.none}</span>;

  const groups: Array<{ title: string; step: number; rows: Array<[string, ReactNode]> }> = [
    { title: t.summary.formation, step: 0, rows: [[t.fields.formation, formation]] },
    {
      title: t.summary.contact,
      step: 1,
      rows: [
        [t.summary.fullName, `${values.first_name} ${values.last_name}`.trim()],
        [t.fields.email, values.email],
        [t.fields.phone, values.phone],
        [t.fields.city, values.city],
      ],
    },
    {
      title: t.summary.education,
      step: 2,
      rows: [
        [t.fields.educationLevel, values.education_level],
        [t.fields.diplomaObtained, values.diploma_obtained.trim() || none],
        [t.fields.message, values.message.trim() || none],
      ],
    },
  ];

  return (
    <div>
      <div className="divide-y divide-line overflow-hidden rounded-xl border border-line">
        {groups.map((group) => (
          <section key={group.title} className="px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700">{group.title}</h4>
              <button
                type="button"
                onClick={() => onEdit(group.step)}
                className="text-[0.8125rem] font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-cyan-600"
              >
                {t.summary.edit}
              </button>
            </div>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-[0.9375rem] sm:grid-cols-[12rem_minmax(0,1fr)]">
              {group.rows.map(([label, value], index) => (
                <div key={index} className="contents">
                  <dt className="text-muted">{label}</dt>
                  <dd className="break-words text-ink [overflow-wrap:anywhere] whitespace-pre-line">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <label
        className={cn(
          "mt-6 flex cursor-pointer items-start gap-3 rounded-xl border p-4 font-normal transition-colors duration-200",
          errors.consent ? "border-red-300 bg-red-50/50" : values.consent ? "border-cyan-600 bg-cyan-50" : "border-line hover:bg-background",
        )}
      >
        <input
          type="checkbox"
          name="consent"
          data-field="consent"
          checked={values.consent}
          onChange={(event) => onChange("consent", event.target.checked)}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : undefined}
          className="mt-0.5 size-[1.125rem] shrink-0 cursor-pointer accent-cyan-600"
        />
        <span className="text-[0.875rem] leading-relaxed text-ink-soft">
          {t.consent}{" "}
          <Link href={routes.privacy} target="_blank" className="font-medium text-cyan-700 underline underline-offset-4">
            {t.privacyLink}
          </Link>
        </span>
      </label>
      {errors.consent ? (
        <p id="consent-error" className="mt-2 text-[0.8125rem] text-red-700">
          {errors.consent}
        </p>
      ) : null}
    </div>
  );
}
