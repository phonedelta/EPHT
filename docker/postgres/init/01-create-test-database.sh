#!/bin/sh
# Exécuté une seule fois, à la première initialisation du volume PostgreSQL.
# Crée la base réservée aux tests automatisés afin qu'ils ne touchent jamais
# aux données de développement.
set -e

TEST_DB="${EPHT_TEST_DATABASE:-epht_test}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE "$TEST_DB" OWNER "$POSTGRES_USER";
EOSQL
