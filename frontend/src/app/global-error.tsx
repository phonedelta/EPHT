"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Dernier recours, quand le layout racine lui-même échoue. Aucune dépendance
 * au reste de l'application : styles et textes sont écrits ici.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#f6fafb",
          color: "#18252b",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <main style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: "2.25rem", lineHeight: 1.1, margin: 0 }}>
            Une erreur est survenue.
          </h1>
          <p style={{ marginTop: "1rem", lineHeight: 1.6, color: "#3b4a52" }}>
            Le site n’a pas pu s’afficher. Vous pouvez réessayer dans un instant.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.75rem",
              height: "3.25rem",
              padding: "0 1.75rem",
              border: 0,
              borderRadius: 2,
              background: "#7cc8da",
              color: "#18252b",
              font: "inherit",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
