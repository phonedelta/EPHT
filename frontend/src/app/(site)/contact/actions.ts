"use server";

import { postForm, type FormResult } from "@/lib/api/forms";

/** Champs envoyés à l'API, sous leurs noms Laravel. */
export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
  /** Champ piège : toujours vide pour un visiteur. */
  website: string;
};

export type ContactResult = FormResult<keyof ContactInput, null>;

/** Transmet un message du formulaire de contact à l'API. */
export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const result = await postForm<keyof ContactInput>("contact", input);

  return result.ok ? { ok: true, data: null } : result;
}
