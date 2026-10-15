"use server";

import { postForm, type FormResult } from "@/lib/api/forms";

/** Champs envoyés à l'API, sous leurs noms Laravel. */
export type ApplicationInput = {
  formation: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  education_level: string;
  diploma_obtained: string;
  message: string;
  consent: boolean;
  submission_token: string;
  /** Champ piège : toujours vide pour un visiteur. */
  website: string;
};

export type ApplicationResult = FormResult<keyof ApplicationInput, { reference: string }>;

/** Transmet une demande d'inscription à l'API ; renvoie sa référence. */
export async function submitApplication(input: ApplicationInput): Promise<ApplicationResult> {
  const result = await postForm<keyof ApplicationInput>("applications", input);

  if (!result.ok) {
    return result;
  }

  const reference = (result.data as { reference?: unknown } | null)?.reference;

  return typeof reference === "string" ? { ok: true, data: { reference } } : { ok: false, reason: "unavailable" };
}
