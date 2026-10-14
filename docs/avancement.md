# Avancement

État au 13 octobre 2026, à l'issue de la première étape.

## Réalisé

### Socle

- Monorepo `frontend/` (Next.js 16) et `backend/` (Laravel 13), strictement séparés.
- PostgreSQL 17 en conteneur, géré par les migrations Laravel : 16 tables métier et les tables techniques (sessions, cache, files d'attente, notifications, jetons, journal d'activité).
- Fichiers d'environnement distincts, avec leurs `.env.example`.
- Communication frontend → API typée et validée ; cache des pages rafraîchi par Laravel à chaque modification de contenu.

### Backend

- Modèles Eloquent, relations, statuts et contraintes d'intégrité pour l'ensemble du schéma.
- API publique en lecture : paramètres du site, formations, articles, événements, galeries, témoignages, offres, partenaires.
- Réponses JSON normalisées, erreurs en français, limitation de débit, en-têtes de cache.
- Messages de validation traduits en français pour toutes les règles du framework.
- Médiathèque : import d'images (redressement, réduction, réencodage, couleur d'attente).
- Commande de création du premier administrateur ; route d'administration protégée par Sanctum.
- Seeders de données de référence, et contenu d'illustration optionnel pour le développement.

### Frontend

- Design system : palette issue du logo, typographie, composants, animations.
- Logo officiel vectorisé, variantes claire et sombre, favicon.
- En-tête (bandeau de coordonnées, navigation, sous-menu des formations, menu mobile) et pied de page.
- **Page d'accueil complète**, en douze sections, entièrement alimentée par l'API.
- Routes de toutes les pages publiques ; fiche de formation et article en version initiale.
- SEO : métadonnées, Open Graph, lien canonique, `sitemap.xml`, `robots.txt`, données structurées, redirection des anciennes adresses.
- Pages 404 et d'erreur ; état « indisponible » si l'API ne répond pas.

## Vérifications effectuées

| Vérification | Résultat |
| --- | --- |
| Tests Laravel (`php artisan test`, sur PostgreSQL) | 83 tests, 624 assertions, tous réussis |
| Style PHP (`pint --test`) | conforme |
| Types TypeScript (`npm run typecheck`) | aucune erreur |
| ESLint (`npm run lint`) | aucune erreur ni avertissement |
| Tests frontend (`npm test`) | 29 tests, tous réussis |
| Build de production (`npm run build`) | réussi, 29 pages pré-rendues |
| Démarrage des deux applications | API sur le port 8010, site sur le port 3000 |

Vérifié en conditions réelles, dans un navigateur piloté automatiquement :

- rendu de l'accueil à 1440, 1280, 768 et 390 px, sans débordement horizontal ;
- menu mobile (ouverture, focus, Échap, fermeture à la navigation), visionneuse (clavier, compteur, retour du focus), onglets des infrastructures au clavier, sous-menu, en-tête collant ;
- aucune erreur dans la console du navigateur ;
- chaîne de rafraîchissement : une modification en base apparaît sur le site après traitement de la file d'attente, sans redéploiement ;
- build et affichage avec l'API arrêtée : le site reste en ligne et signale l'indisponibilité ;
- statut 404 réel pour une formation ou un article inconnus.

### Non couvert par des tests

- Aucun test de bout en bout automatisé n'est encore versionné : les contrôles dans le navigateur ci-dessus ont été faits à la main avec des scripts ponctuels.
- Pas d'audit d'accessibilité outillé ni de mesure Lighthouse.
- Pas de test sur de vrais appareils ni sur Safari et Firefox.
- La section « Témoignages » n'a été vérifiée que par son test de composant, la base n'en contenant aucun.

## Reste à faire

| Phase | Contenu |
| --- | --- |
| Pages publiques | L'École, catalogue des formations (recherche et filtres), fiche complète d'une formation, Infrastructures, Vie à l'EPHT, Stages & Carrières, Actualités (liste, recherche, pagination, articles similaires), Contact (carte, WhatsApp), mentions légales, confidentialité |
| Formulaires | Candidature en quatre étapes avec dépôt de documents, référence unique, protection contre la double soumission ; formulaire de contact ; notifications par e-mail en file d'attente ; protection anti-spam |
| Administration | Connexion Sanctum, tableau de bord, candidatures (statuts, notes, historique, export CSV), formations, actualités (éditeur et nettoyage du HTML), galeries, événements, messages, offres, médiathèque, contenu du site, paramètres ; Policies par rôle ; journal des actions |
| Finalisation | Accessibilité, performances, tests de bout en bout, déploiement |

Les informations attendues de l'école sont listées dans [`contenus-a-confirmer.md`](contenus-a-confirmer.md).
