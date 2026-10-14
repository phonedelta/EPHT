import type { z } from "zod";

import { API_URL } from "@/lib/env";

/**
 * Résultat d'un appel à l'API : jamais d'exception. Un échec réseau, une
 * erreur HTTP ou une réponse inattendue produisent un résultat `ok: false`
 * que la page traite comme un contenu indisponible.
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

type QueryValue = string | number | boolean | null | undefined;

const TIMEOUT_MS = 8000;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`/api/v1/${path.replace(/^\/+/, "")}`, API_URL);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

function failure(status: number, message: string, detail?: unknown): ApiResult<never> {
  console.error(`[api] ${message}`, detail ?? "");

  return { ok: false, status, message };
}

/**
 * Lit une ressource de l'API Laravel et valide le contenu de `data`.
 * Réservé au serveur : l'adresse de l'API n'est jamais exposée au navigateur.
 */
export async function apiGet<Schema extends z.ZodType>(
  path: string,
  schema: Schema,
  query?: Record<string, QueryValue>,
): Promise<ApiResult<z.infer<Schema>>> {
  const url = buildUrl(path, query);

  let response: Response;

  try {
    response = await fetch(url, {
      headers: { Accept: "application/json", "Accept-Language": "fr" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    return failure(503, `API injoignable : ${url}`, error instanceof Error ? error.message : error);
  }

  if (!response.ok) {
    return failure(response.status, `Réponse ${response.status} pour ${url}`);
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    return failure(502, `Réponse illisible pour ${url}`);
  }

  const data = (payload as { data?: unknown } | null)?.data;
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return failure(502, `Réponse inattendue pour ${url}`, parsed.error.issues.slice(0, 5));
  }

  return { ok: true, data: parsed.data };
}
