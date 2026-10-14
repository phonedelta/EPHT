# Image de production de l'API Laravel (Railway, ou tout hébergeur de conteneurs).
# FrankenPHP sert l'application et les fichiers de public/ sur le port $PORT.
FROM dunglas/frankenphp:1-php8.4-bookworm

RUN install-php-extensions pdo_pgsql gd exif pcntl intl zip opcache @composer \
    && cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

# Dépendances d'abord, pour profiter du cache des couches.
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction --no-progress

COPY . .
RUN composer dump-autoload --optimize --no-dev --no-interaction \
    && chmod +x docker/start.sh

EXPOSE 8080

CMD ["docker/start.sh"]
