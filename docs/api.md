# API Laravel — v1

Toutes les routes sont préfixées par `/api/v1`. En local : `http://localhost:8010/api/v1`.

## Conventions

### Enveloppe des réponses

```jsonc
// Succès — ressource ou liste
{ "success": true, "data": { … }, "meta": { … } }

// Erreur
{ "success": false, "message": "Ressource introuvable." }

// Erreur de validation (422)
{ "success": false, "message": "Les données envoyées ne sont pas valides.", "errors": { "per_page": ["…"] } }
```

Les listes paginées ajoutent `links` et les champs habituels de `meta` (`current_page`, `last_page`, `total`…).

### Codes HTTP

| Code | Cas |
| --- | --- |
| 200 | Succès |
| 201 | Ressource créée |
| 304 | Réponse inchangée (requête avec `If-None-Match`) |
| 401 | Authentification requise |
| 403 | Accès interdit |
| 404 | Ressource introuvable, non publiée ou route inconnue |
| 405 | Méthode HTTP non autorisée |
| 422 | Validation échouée |
| 429 | Trop de requêtes (en-tête `Retry-After`) |
| 500 | Erreur interne — message générique, détail dans les journaux |

### Cache, langue, débit

- L'API publique répond avec `Cache-Control: public, max-age=60` et un `ETag`. Elle ne pose aucun cookie.
- `Content-Language: fr` ; la langue suit `Accept-Language` parmi les langues publiées.
- 300 requêtes par minute et par adresse (`X-RateLimit-Limit`, `X-RateLimit-Remaining`).

## API publique — disponible

Lecture seule. Seuls les contenus publiés sont renvoyés.

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/site-settings` | Paramètres publics : identité, coordonnées, réseaux, SEO, textes de l'accueil |
| GET | `/formations` | Catalogue. Filtres : `search`, `category` (slug), `level`, `diploma`, `duration` (mois). `meta.filters` liste les valeurs réellement présentes. |
| GET | `/formations/{slug}` | Fiche d'une formation, avec sa galerie |
| GET | `/articles` | Articles, du plus récent au plus ancien. `search`, `category`, `page`, `per_page` (24 max). `meta.categories`. |
| GET | `/articles/{slug}` | Article complet ; `meta.related` : jusqu'à trois articles de la même catégorie |
| GET | `/events` | Événements. `period=upcoming` (défaut) ou `past` |
| GET | `/galleries` | Galeries et leurs médias. `section` (`infrastructure`, `student_life`, `formation`, `event`), `category` |
| GET | `/galleries/{slug}` | Une galerie |
| GET | `/testimonials` | Témoignages validés — liste vide tant qu'aucun n'est publié |
| GET | `/job-offers` | Offres publiées et non expirées. `type` (`stage`, `emploi`) |
| GET | `/partners` | Partenaires publiés |

### Champs à noter

- **Formation** — `level`, `diploma` et `duration` valent `null` tant que l'école ne les a pas confirmés ; le site n'affiche alors rien.
- **Média** — `url`, `alt`, `width`, `height`, `dominant_color`, `focal_point` (`x`, `y` en %), `credit`, `is_illustrative`.

## API d'administration

Protégée par une session Sanctum (cookie HTTP-only + CSRF), réservée aux domaines de `SANCTUM_STATEFUL_DOMAINS`.

| Méthode | Route | État |
| --- | --- | --- |
| GET | `/admin/me` | Disponible — utilisateur de la session en cours |

## À réaliser

| Phase | Points d'entrée |
| --- | --- |
| Formulaires | `POST /applications`, `POST /contact` |
| Authentification | `GET /sanctum/csrf-cookie`, `POST /login`, `POST /logout`, réinitialisation du mot de passe |
| Administration | `GET /admin/dashboard` ; candidatures (`GET`, `PATCH`, export CSV) ; formations, articles, galeries, événements, offres (`GET`, `POST`, `PATCH`, `DELETE`) ; `GET /admin/messages` ; médiathèque ; `GET`/`PATCH /admin/settings` |

Le schéma de base de données de ces fonctionnalités existe déjà (voir `backend/database/migrations`).
