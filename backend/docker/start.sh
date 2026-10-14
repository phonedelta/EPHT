#!/bin/sh
# Démarrage du conteneur de l'API : schéma, données de référence, caches,
# puis serveur web. Les seeders peuvent être relancés à chaque déploiement.
#
# Ces étapes tournent ici et non en « pre-deploy » : le volume des médias
# (storage/app/public) n'est monté que dans le conteneur qui sert l'API.
set -e

php artisan storage:link --force
php artisan migrate --force
php artisan db:seed --force
php artisan optimize

exec frankenphp php-server --root public/ --listen "0.0.0.0:${PORT:-8080}"
