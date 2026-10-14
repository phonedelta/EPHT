# EPHT — Frontend Next.js

Interface du site public et de l'espace d'administration de la plateforme EPHT. Toutes les données viennent de l'API Laravel du dossier [`../backend`](../backend) : ce projet ne contient aucune logique métier et n'accède à aucune base de données.

Installation, démarrage et vérifications : voir le [README du projet](../README.md).

## Repères

| Besoin | Où regarder |
| --- | --- |
| Pages et routes | `src/app` |
| Sections de l'accueil | `src/components/home` |
| En-tête, pied de page | `src/components/layout` |
| Couleurs, typographie | `src/app/globals.css` |
| Appels à l'API et cache | `src/lib/api` |
| Textes d'interface | `src/i18n/dictionaries/fr.ts` |
| Adresses des pages | `src/lib/routes.ts` |

## Commandes

```bash
npm run dev         # développement, http://localhost:3000
npm run build       # build de production (l'API doit tourner)
npm run start       # sert le build de production
npm run typecheck   # types TypeScript
npm run lint        # ESLint
npm test            # tests unitaires et de composants
```

## À savoir

- Le projet utilise les **Cache Components** de Next.js 16 : une lecture de données est soit mise en cache (`'use cache'`), soit placée derrière un `<Suspense>`. Voir [l'architecture](../docs/architecture.md#cache-et-rafraîchissement).
- Cette version de Next.js diffère sensiblement des précédentes. Sa documentation est fournie avec le paquet, dans `node_modules/next/dist/docs/` : la consulter avant de modifier le routage ou le cache.
- Les classes Tailwind d'un composant ne se surchargent pas de façon fiable par `className` quand elles portent sur la même propriété : préférer une variante ou un conteneur.

## Documentation

- [Architecture](../docs/architecture.md)
- [Design system](../docs/design-system.md)
- [Déploiement](../docs/deploiement.md)
