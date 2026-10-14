# Déploiement

Les trois composants se déploient séparément : le frontend Next.js, l'API Laravel et PostgreSQL. Cette page décrit ce qu'il faut prévoir ; le choix de l'hébergeur reste ouvert.

## Domaines

Pour que la session de l'administration fonctionne (cookie partagé), le site et l'API doivent partager le même domaine parent, en HTTPS :

| Application | Exemple |
| --- | --- |
| Site | `https://www.epht.ma` |
| API | `https://api.epht.ma` |

## API Laravel

### Variables d'environnement (`backend/.env`)

| Variable | Production |
| --- | --- |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` — indispensable : aucune trace technique ne doit sortir de l'API |
| `APP_KEY` | Générée une fois (`php artisan key:generate`), conservée secrète |
| `APP_URL` | `https://api.epht.ma` |
| `FRONTEND_URL` | `https://www.epht.ma` |
| `CORS_ALLOWED_ORIGINS` | `https://www.epht.ma` |
| `FRONTEND_REVALIDATE_SECRET` | Chaîne aléatoire longue, identique à `REVALIDATE_SECRET` du frontend |
| `DB_*` | Accès PostgreSQL |
| `SESSION_DOMAIN` | `.epht.ma` |
| `SESSION_SECURE_COOKIE` | `true` |
| `SANCTUM_STATEFUL_DOMAINS` | `www.epht.ma` |
| `MEDIA_DISK` | `s3` (ou tout stockage persistant) |
| `SEED_ILLUSTRATIVE_CONTENT` | `false` |
| `MAIL_*` | Service SMTP ; `ADMIN_NOTIFICATION_EMAIL` pour les notifications internes |
| `LOG_LEVEL` | `warning` |

### Mise en production

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan db:seed --force          # données de référence, sans effet sur l'existant
php artisan storage:link             # si le disque des médias est local
php artisan optimize
php artisan epht:create-admin        # une seule fois
```

Les seeders n'écrasent jamais une valeur déjà modifiée dans l'administration : ils peuvent être relancés à chaque déploiement.

### Worker

Les tâches en arrière-plan (rafraîchissement du cache du site, e-mails) passent par la file `database`. Un worker doit tourner en permanence, sous un superviseur qui le relance :

```bash
php artisan queue:work --tries=3 --max-time=3600
```

Relancer les workers après chaque déploiement : `php artisan queue:restart`.

### Fichiers

- **Médias publics** : sur un stockage persistant (S3 ou compatible, ou volume monté). Ne pas compter sur le disque éphémère d'un conteneur.
- **Documents des candidats** : toujours sur un disque privé, jamais servis par une URL publique.

### Serveur

- Racine web sur `backend/public` ; HTTPS obligatoire.
- Derrière un répartiteur de charge ou un proxy, déclarer les proxys de confiance (`trustProxies` dans `bootstrap/app.php`) pour que l'adresse du visiteur — utilisée par la limitation de débit — soit correcte.

## Frontend Next.js

### Variables d'environnement

| Variable | Production |
| --- | --- |
| `API_URL` | URL de l'API vue depuis le serveur Next.js (peut être une adresse interne) |
| `NEXT_PUBLIC_API_URL` | `https://api.epht.ma` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.epht.ma` |
| `MEDIA_URL` | Origine des médias si elle diffère de l'API (CDN, S3) |
| `REVALIDATE_SECRET` | Identique à `FRONTEND_REVALIDATE_SECRET` |

Seules les variables `NEXT_PUBLIC_*` atteignent le navigateur : ne jamais y placer de secret.

### Build et démarrage

```bash
npm ci
npm run build      # l'API doit être joignable : les pages sont pré-rendues avec ses données
npm run start
```

Si l'API est injoignable pendant le build, celui-ci aboutit quand même : les pages affichent un état « indisponible » et se régénèrent seules dans la minute qui suit le retour de l'API.

Le cache des pages est conservé sur le disque du serveur Next.js. Avec plusieurs instances, prévoir un cache partagé (voir la documentation de Next.js sur l'auto-hébergement).

L'optimiseur d'images de Next.js n'accepte que les médias de l'origine déclarée (`API_URL` ou `MEDIA_URL`).

## PostgreSQL

- Version 17 (celle utilisée en développement).
- Sauvegardes automatiques quotidiennes, conservées hors du serveur, et test de restauration régulier. Les candidatures contiennent des données personnelles : chiffrer les sauvegardes et en limiter l'accès.

## Données personnelles

Le site collectera des données personnelles (candidatures, messages de contact). Avant la mise en ligne, l'école doit vérifier ses obligations au titre de la loi marocaine 09-08 (déclaration auprès de la CNDP, information des personnes, durée de conservation) et fournir le texte de la politique de confidentialité. Ce point relève de l'établissement et de son conseil.

## Anciennes adresses

Les adresses du site historique sont redirigées de façon permanente (`frontend/next.config.ts`) :

| Ancienne adresse | Nouvelle |
| --- | --- |
| `/index.html`, `/page4.html` | `/` |
| `/page12.html` | `/formations` |
| `/page8.html` | `/admissions` |
