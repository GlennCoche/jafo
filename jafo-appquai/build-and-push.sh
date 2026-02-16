#!/bin/bash
# Build et push des images Docker Hub pour AppQUAI (store Jafo).
# Usage: ./build-and-push.sh [TAG]
# Exemple: ./build-and-push.sh 1.0.0
# Prérequis: docker login (compte glenncoche)

set -e
TAG="${1:-1.0.0}"
REPO="glenncoche"

echo "Build des images AppQUAI (tag=$TAG)..."
docker compose -f docker-compose.build.yml build

echo "Tag des images..."
docker tag jafo-appquai-init:latest "$REPO/appquai-init:$TAG"
docker tag jafo-appquai-go-quai:latest "$REPO/appquai-go-quai:$TAG"
docker tag jafo-appquai-server:latest "$REPO/appquai-server:$TAG"

echo "Push vers Docker Hub..."
docker push "$REPO/appquai-init:$TAG"
docker push "$REPO/appquai-go-quai:$TAG"
docker push "$REPO/appquai-server:$TAG"

echo "Mettre à jour docker-compose.yml avec image: $REPO/appquai-*:$TAG et umbrel-app.yml version: \"$TAG\", puis commit + push GitHub."
