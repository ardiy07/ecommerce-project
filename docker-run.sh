#!/bin/bash
ENV=${1:-development}

if [ "$ENV" = "production" ]; then
    ENV_FILE=".env.production"
    COMPOSE_FILE="docker-compose.yml:docker-compose.production.yml"
else
    ENV_FILE=".env.development"
    COMPOSE_FILE="docker-compose.yml:docker-compose.override.yml"
fi

echo "Running environment: $ENV"

# # Menghentikan dan menghapus kontainer yang sedang berjalan
echo "Stopping and removing existing containers..."
export ENV_FILE=$ENV_FILE
ENV_FILE=$ENV_FILE  docker compose -f ${COMPOSE_FILE//:/ -f} --env-file $ENV_FILE down

# Menjalankan Docker Compose dengan konfigurasi yang sesuai
echo "Starting the containers with environment: $ENV"
export ENV_FILE=$ENV_FILE
ENV_FILE=$ENV_FILE docker compose -f ${COMPOSE_FILE//:/ -f} --env-file $ENV_FILE up --build -d
