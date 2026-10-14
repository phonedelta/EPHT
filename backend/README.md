# EPHT — API Laravel

API REST de la plateforme EPHT : logique métier, validation, autorisations, accès à PostgreSQL, fichiers et files d'attente. Elle ne sert aucune page ; l'interface est l'application Next.js du dossier [`../frontend`](../frontend).

Installation, démarrage et vérifications : voir le [README du projet](../README.md).

## Repères

| Besoin | Où regarder |
| --- | --- |
| Routes de l'API | `routes/api.php` — `php artisan route:list --path=api` |
| Forme des réponses | `app/Http/Resources` |
| Validation des entrées | `app/Http/Requests` |
| Schéma de la base | `database/migrations` |
| Données initiales | `database/seeders` |
| Réglages propres au projet | `config/epht.php` |

## Commandes utiles

```bash
php artisan serve --port=8010     # API en local
php artisan queue:work            # tâches en arrière-plan
php artisan migrate:fresh --seed  # repartir d'une base neuve (développement uniquement)
php artisan epht:create-admin     # créer un compte administrateur
php artisan test                  # tests, sur la base epht_test
vendor/bin/pint                   # mise en forme du code
```

## Documentation

- [Architecture](../docs/architecture.md)
- [API](../docs/api.md)
- [Déploiement](../docs/deploiement.md)

> Les fichiers `AGENTS.md` et `CLAUDE.md` de ce dossier proviennent du squelette Laravel. Ils proposent d'installer Laravel Boost, un outil d'assistance au développement : ce n'est pas une dépendance du projet et il n'a pas été installé.
