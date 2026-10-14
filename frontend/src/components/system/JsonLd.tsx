/**
 * Données structurées schema.org. Le chevron ouvrant est échappé pour qu'une
 * valeur issue de l'administration ne puisse pas fermer la balise <script>.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
