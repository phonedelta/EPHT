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
          background: "#f8fafa",
          color: "#17262c",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <main style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontWeight: 600, fontSize: "2rem", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}>
            Une erreur est survenue.
          </h1>
          <p style={{ marginTop: "1rem", lineHeight: 1.6, color: "#66757b" }}>
            Le site n’a pas pu s’afficher. Vous pouvez réessayer dans un instant.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.75rem",
              height: "2.75rem",
              padding: "0 1.25rem",
              border: 0,
              borderRadius: 8,
              background: "#4aafc5",
              color: "#17262c",
              font: "inherit",
              fontWeight: 500,
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
