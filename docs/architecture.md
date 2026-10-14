# Architecture

## Vue d'ensemble

```
Navigateur ──▶ Next.js (frontend/) ──▶ API Laravel (backend/) ──▶ PostgreSQL
                    ▲                        │
                    └── POST /api/revalidate ┘   (après chaque modification de contenu)
```

- **Next.js** construit l'interface. Il ne contient aucune logique métier et n'accède jamais à la base.
- **Laravel** porte tout le reste : validation, autorisations, accès aux données, fichiers, e-mails, files d'attente.
- **PostgreSQL** est géré exclusivement par les migrations Laravel.

## Backend (`backend/`)

| Emplacement | Contenu |
| --- | --- |
| `app/Enums` | Statuts et types (publication, candidature, média…). Ils alimentent aussi les contraintes `CHECK` des migrations. |
| `app/Models` | Modèles Eloquent et leurs relations. `Concerns/` regroupe les comportements partagés : cycle de publication, slug unique, signalement au frontend. |
| `app/Http/Controllers/Api/V1` | Contrôleurs de l'API publique ; `Admin/` pour l'API d'administration. |
| `app/Http/Requests` | Form Requests : toute entrée, y compris les filtres d'une liste, est validée ici. |
| `app/Http/Resources` | API Resources : forme des réponses JSON. |
| `app/Http/Middleware` | Langue de la réponse, enveloppe JSON commune. |
| `app/Exceptions/ApiExceptionRenderer.php` | Erreurs JSON normalisées, sans détail technique hors débogage. |
| `app/Services` | Paramètres du site, import d'images, invalidation du cache du frontend. |
| `app/Jobs` | Tâches en file d'attente. |
| `database/migrations` | Schéma complet : les 16 tables métier du cahier des charges, leurs tables d'association et d'historique, et les tables techniques de Laravel. |
| `database/seeders` | Données de référence, et contenu d'illustration optionnel. |
| `lang/fr` | Messages de validation et d'authentification en français. |

### Publication des contenus

Formations, articles, galeries, événements et offres partagent le même cycle (`status` + `published_at`) : un contenu n'est visible que s'il est **publié** et que sa date de publication est atteinte, ce qui permet de programmer une mise en ligne. Les offres de stage et d'emploi disparaissent d'elles-mêmes après `expires_at`, sans tâche planifiée : l'expiration est évaluée à chaque lecture.

### Paramètres du site

La table `site_settings` contient l'identité, les coordonnées, les réseaux sociaux, le SEO et les textes de l'accueil. Chaque ligne a une clé pointée (`contact.email`, `home.hero.title`), un type et une valeur JSON. L'API les renvoie sous forme d'arborescence ; un paramètre de type `media` est remplacé par la description du média. Seuls les paramètres `is_public` sont exposés.

Les coordonnées ne sont écrites dans aucun composant : en-tête, pied de page et données structurées lisent tous ces paramètres.

### Médias

`media` référence chaque fichier (disque, chemin, dimensions, texte alternatif, crédit, point d'intérêt pour les recadrages). Deux indicateurs comptent :

- `visibility` — un média `private` n'a jamais d'URL publique ;
- `is_illustrative` — photographie d'illustration : le site l'étiquette comme telle (voir le [design system](design-system.md#photographies)).

Les documents des candidats auront leur propre table (`application_documents`) et un disque privé.

## Frontend (`frontend/`)

| Emplacement | Contenu |
| --- | --- |
| `src/app` | Routes (App Router). `(site)/` regroupe les pages publiques sous un même habillage. |
| `src/components` | `layout/` (en-tête, pied de page), `home/` (sections de l'accueil), `ui/`, `motion/`, `gallery/`, `brand/`. |
| `src/lib/api` | Client de l'API, schémas de validation des réponses, lectures mises en cache. |
| `src/i18n` | Langues et textes d'interface. |
| `src/lib` | SEO, routes, formatage. |

### Lecture de l'API

`src/lib/api/client.ts` appelle l'API depuis le serveur Next.js uniquement, puis valide chaque réponse avec un schéma Zod (`schemas.ts`). Il ne lève jamais d'exception : un échec devient un résultat `ok: false`, et la page affiche un état « indisponible » au lieu de planter.

### Cache et rafraîchissement

Le projet utilise les **Cache Components** de Next.js 16. Chaque lecture (`src/lib/api/queries.ts`) est une fonction `'use cache'` étiquetée :

- un résultat valide suit le profil `content` (revalidation toutes les 5 minutes, défini dans `next.config.ts`) ;
- un échec n'est gardé qu'une minute, pour que le site se rétablisse seul dès que l'API répond.

Quand un contenu change, le modèle Laravel concerné (`InvalidatesFrontendCache`) met en file une tâche qui appelle `POST /api/revalidate` avec les étiquettes à rafraîchir et un secret partagé. Une modification apparaît donc sur le site **sans redéploiement** ; le délai de 5 minutes n'est qu'un filet de sécurité si le worker est arrêté.

Les étiquettes sont déclarées des deux côtés et doivent rester identiques :

| Étiquette | Modèles Laravel |
| --- | --- |
| `content` | Média (rafraîchit tout le site) |
| `settings` | Paramètres du site |
| `formations` | Formations et catégories |
| `articles` | Articles et catégories |
| `galleries` | Galeries |
| `testimonials`, `events`, `job-offers`, `partners` | Modèles correspondants |

`/api/revalidate` est la seule Route Handler du frontend. Elle ne fait qu'invalider le cache : aucune donnée métier n'y transite.

### Langues

Le site est en français. Pour ajouter une langue :

1. **Frontend** — déclarer le code dans `src/i18n/config.ts`, créer le dictionnaire dans `src/i18n/dictionaries/` et l'enregistrer dans `src/i18n/index.ts`. Aucun texte d'interface n'est écrit en dur dans les composants.
2. **Backend** — ajouter le code à `config/epht.php` (`locales`) et les fichiers `lang/<code>/`. Le middleware `SetLocale` choisit déjà la langue d'après l'en-tête `Accept-Language`.
3. **Contenus** — les tables sont aujourd'hui monolingues. La traduction des contenus (colonnes JSON par langue ou tables de traduction) reste à concevoir au moment où une seconde langue sera décidée.

## Sécurité

En place :

- validation côté serveur de toutes les entrées (Form Requests) ;
- API d'administration derrière `auth:sanctum`, sessions par cookie HTTP-only acceptées uniquement depuis les domaines déclarés ; API publique sans cookie ni session ;
- CORS restreint aux origines de `CORS_ALLOWED_ORIGINS` ;
- limitation de débit sur toute l'API, plus stricte pour les formulaires ;
- erreurs normalisées, sans trace ni message interne quand `APP_DEBUG=false` ;
- import d'images : type vérifié sur le contenu du fichier, réencodage systématique (les métadonnées EXIF ne sont pas conservées) ;
- en-têtes de sécurité sur le frontend, secret de revalidation comparé en temps constant ;
- aucun identifiant dans le code : le premier administrateur est créé par `php artisan epht:create-admin`.

À réaliser avec les phases suivantes : connexion et réinitialisation du mot de passe, Policies par rôle, stockage privé et téléchargement autorisé des documents de candidature, nettoyage du HTML des articles, journal des actions d'administration, protection anti-spam des formulaires.
