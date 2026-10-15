import type { NextConfig } from "next";

const apiUrl = new URL(process.env.API_URL ?? "http://localhost:8010");
const mediaUrl = process.env.MEDIA_URL ? new URL(process.env.MEDIA_URL) : apiUrl;

// En développement, l'API tourne sur la machine locale : l'optimiseur d'images
// doit alors être autorisé à y lire les médias. Jamais le cas en production.
const mediaIsLocal = ["localhost", "127.0.0.1", "[::1]"].includes(mediaUrl.hostname);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  cacheLife: {
    // Contenu éditorial servi par l'API Laravel. Laravel invalide le cache à
    // chaque modification ; ce délai n'est qu'un filet de sécurité.
    content: {
      stale: 300,
      revalidate: 300,
      expire: 60 * 60 * 24 * 7,
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    remotePatterns: [new URL("/storage/**", mediaUrl), new URL("/media/**", mediaUrl)],
    dangerouslyAllowLocalIP: mediaIsLocal,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Adresses de l'ancien site epht.ma et anciennes adresses de fiches.
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/page12.html", destination: "/formations", permanent: true },
      { source: "/page8.html", destination: "/admissions", permanent: true },
      { source: "/page4.html", destination: "/", permanent: true },
      // Fiches renommées selon les intitulés officiels (annexe 1 de la convention).
      { source: "/formations/cuisine", destination: "/formations/technicien-en-cuisine", permanent: true },
      { source: "/formations/patisserie", destination: "/formations/technicien-en-patisserie", permanent: true },
    ];
  },
};

export default nextConfig;
