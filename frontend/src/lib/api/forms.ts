import { headers } from "next/headers";

import { API_URL } from "@/lib/env";

/**
 * Résultat de l'envoi d'un formulaire : les erreurs de validation de l'API
 * (un message par champ), un excès de demandes ou un service indisponible.
 */
export type FormResult<Field extends string, Data> =
  | { ok: true; data: Data }
  | { ok: false; reason: "invalid"; errors: Partial<Record<Field, string>> }
  | { ok: false; reason: "rateLimited" | "unavailable" };

const TIMEOUT_MS = 10000;

/**
 * Envoie un formulaire à l'API Laravel depuis le serveur Next.js : l'adresse
 * de l'API n'est pas exposée au navigateur. L'adresse IP du visiteur est
 * relayée pour que la limite de débit s'applique à chaque visiteur, et non au
 * serveur.
 */
export async function postForm<Field extends string>(
  path: string,
  body: Record<string, unknown>,
): Promise<FormResult<Field, unknown>> {
  const requestHeaders = await headers();
  const clientIp = requestHeaders.get("x-forwarded-for") ?? requestHeaders.get("x-real-ip");
  const url = new URL(`/api/v1/${path}`, API_URL);

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": "fr",
        "Content-Type": "application/json",
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    console.error(`[api] Envoi impossible vers ${url}`, error instanceof Error ? error.message : error);

    return { ok: false, reason: "unavailable" };
  }

  const payload = (await response.json().catch(() => null)) as { data?: unknown; errors?: Record<string, unknown> } | null;

  if (response.ok && payload?.data !== undefined) {
    return { ok: true, data: payload.data };
  }

  if (response.status === 422 && payload?.errors) {
    const errors: Partial<Record<Field, string>> = {};

    for (const [field, messages] of Object.entries(payload.errors)) {
      if (Array.isArray(messages) && typeof messages[0] === "string") {
        errors[field as Field] = messages[0];
      }
    }

    return { ok: false, reason: "invalid", errors };
  }

  if (response.status === 429) {
    return { ok: false, reason: "rateLimited" };
  }

  console.error(`[api] Réponse ${response.status} pour ${url}`);

  return { ok: false, reason: "unavailable" };
}
