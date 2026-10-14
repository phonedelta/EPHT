# EPHT — Plateforme web

Plateforme officielle de l'**EPHT — École Privée d'Hôtellerie et de Tourisme** (Salé, Maroc) : site public, catalogue des formations, demandes d'inscription en ligne et espace d'administration.

| Dossier | Rôle | Technologies |
| --- | --- | --- |
| [`frontend/`](frontend/) | Interface du site public et de l'administration | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion |
| [`backend/`](backend/) | API REST, logique métier, autorisations, fichiers | Laravel 13, PHP 8.3+, Eloquent, Sanctum, files d'attente |
| [`docs/`](docs/) | Documentation du projet | — |

Les deux applications sont strictement séparées : le frontend ne lit jamais la base de données, tout passe par l'API Laravel (`/api/v1`). Les données sont enregistrées dans **PostgreSQL**.

## État d'avancement

Première étape livrée : socle technique, identité visuelle, en-tête, pied de page et page d'accueil complète, alimentée par l'API. Les autres pages publiques ont leur route mais pas encore leur contenu ; les formulaires et l'administration restent à réaliser. Le détail est dans [`docs/avancement.md`](docs/avancement.md).

## Prérequis

- PHP 8.3 ou plus, avec les extensions `pdo_pgsql`, `gd`, `fileinfo`
- Composer 2
- Node.js 22 et npm
- Docker (pour PostgreSQL en local)

## Démarrage en local

Trois terminaux : la base, l'API, le site.

### 1. PostgreSQL

```bash
cp backend/.env.example backend/.env
# Renseigner DB_PASSWORD dans backend/.env (valeur libre en local), puis :
docker compose --env-file backend/.env up -d
```

Le conteneur `epht-postgres` écoute sur `127.0.0.1:54329` et crée deux bases : `epht` (développement) et `epht_test` (tests automatisés).

### 2. API Laravel — http://localhost:8010

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed      # schéma + données de référence
php artisan storage:link        # rend les médias publics accessibles
php artisan serve --port=8010
```

Dans un autre terminal, le worker qui traite les tâches en arrière-plan (rafraîchissement du cache du site, e-mails) :

```bash
cd backend && php artisan queue:work
```

Pour disposer des photographies d'illustration et des articles provisoires pendant le développement, mettre `SEED_ILLUSTRATIVE_CONTENT=true` dans `backend/.env` avant `migrate --seed`. Ne jamais l'activer en production.

Aucun compte n'est créé par les seeders. Le premier administrateur se crée ainsi (mot de passe saisi de façon masquée) :

```bash
php artisan epht:create-admin
```

### 3. Site Next.js — http://localhost:3000

```bash
cd frontend
cp .env.example .env.local
# Reporter dans REVALIDATE_SECRET la valeur de FRONTEND_REVALIDATE_SECRET (backend/.env)
npm install
npm run dev
```

## Vérifications

| Commande | Dossier | Ce qu'elle vérifie |
| --- | --- | --- |
| `php artisan test` | `backend/` | Tests de l'API, des services, des seeders et des commandes (sur la base `epht_test`) |
| `vendor/bin/pint --test` | `backend/` | Style du code PHP |
| `npm run typecheck` | `frontend/` | Types TypeScript |
| `npm run lint` | `frontend/` | ESLint |
| `npm test` | `frontend/` | Tests unitaires et de composants (Vitest) |
| `npm run build` | `frontend/` | Build de production (l'API doit tourner pour pré-rendre les contenus) |

## Documentation

- [Architecture](docs/architecture.md) — séparation frontend/backend, flux de données, cache et rafraîchissement
- [API](docs/api.md) — conventions et points d'entrée
- [Design system](docs/design-system.md) — logo, couleurs, typographie, animations
- [Déploiement](docs/deploiement.md) — variables d'environnement, production
- [Avancement](docs/avancement.md) — ce qui est fait, ce qui reste
- [Contenus à confirmer](docs/contenus-a-confirmer.md) — informations en attente de validation par l'école, photographies d'illustration et crédits
