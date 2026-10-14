import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { isCacheTag } from "@/lib/api/tags";
import { REVALIDATE_SECRET } from "@/lib/env";

/*
 * Invalidation du cache à la demande.
 *
 * Laravel appelle ce point d'entrée après chaque modification de contenu, avec
 * le secret partagé et les étiquettes concernées. Aucune logique métier ici :
 * la route ne fait que marquer des lectures de l'API comme périmées.
 */

function isAuthorized(provided: string | null): boolean {
  if (!REVALIDATE_SECRET || !provided) {
    return false;
  }

  const expected = Buffer.from(REVALIDATE_SECRET);
  const received = Buffer.from(provided);

  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  if (!isAuthorized(request.headers.get("x-revalidate-secret"))) {
    return NextResponse.json({ success: false, message: "Accès interdit." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags) ? [...new Set(body.tags.filter(isCacheTag))] : [];

  if (tags.length === 0) {
    return NextResponse.json({ success: false, message: "Aucune étiquette valide." }, { status: 422 });
  }

  for (const tag of tags) {
    // « max » : la version en cache reste servie pendant que la nouvelle se génère.
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ success: true, revalidated: tags });
}
