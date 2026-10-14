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

type Failure = Extract<ApiResult<never>, { ok: false }>;

/** Enveloppe JSON renvoyée par Laravel. */
type Envelope = { data?: unknown; meta?: unknown } | null;

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

function failure(status: number, message: string, detail?: unknown): Failure {
  console.error(`[api] ${message}`, detail ?? "");

  return { ok: false, status, message };
}

/**
 * Appelle l'API et renvoie l'enveloppe JSON brute, ou un échec.
 * Réservé au serveur : l'adresse de l'API n'est jamais exposée au navigateur.
 */
async function request(
  path: string,
  query?: Record<string, QueryValue>,
): Promise<{ ok: true; url: string; payload: Envelope } | Failure> {
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

  try {
    return { ok: true, url, payload: (await response.json()) as Envelope };
  } catch {
    return failure(502, `Réponse illisible pour ${url}`);
  }
}

/** Lit une ressource de l'API Laravel et valide le contenu de `data`. */
export async function apiGet<Schema extends z.ZodType>(
  path: string,
  schema: Schema,
  query?: Record<string, QueryValue>,
): Promise<ApiResult<z.infer<Schema>>> {
  const response = await request(path, query);

  if (!response.ok) {
    return response;
  }

  const parsed = schema.safeParse(response.payload?.data);

  if (!parsed.success) {
    return failure(502, `Réponse inattendue pour ${response.url}`, parsed.error.issues.slice(0, 5));
  }

  return { ok: true, data: parsed.data };
}

/**
 * Comme `apiGet`, en validant aussi `meta` : pagination, filtres disponibles,
 * articles liés.
 */
export async function apiGetWithMeta<Schema extends z.ZodType, MetaSchema extends z.ZodType>(
  path: string,
  schema: Schema,
  metaSchema: MetaSchema,
  query?: Record<string, QueryValue>,
): Promise<ApiResult<{ data: z.infer<Schema>; meta: z.infer<MetaSchema> }>> {
  const response = await request(path, query);

  if (!response.ok) {
    return response;
  }

  const data = schema.safeParse(response.payload?.data);
  const meta = metaSchema.safeParse(response.payload?.meta);

  if (!data.success || !meta.success) {
    const issues = [...(data.error?.issues ?? []), ...(meta.error?.issues ?? [])];

    return failure(502, `Réponse inattendue pour ${response.url}`, issues.slice(0, 5));
  }

  return { ok: true, data: { data: data.data, meta: meta.data } };
}
