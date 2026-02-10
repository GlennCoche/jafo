#!/usr/bin/env bash
# Build et push de l'image Docker pour l'App Store Umbrel.
# À exécuter une fois (ou à chaque nouvelle version) depuis ce répertoire.
# Prérequis : docker buildx, compte Docker Hub (docker login).

set -e
IMAGE="glenncoche/nerdoctaxe-dashboard"
TAG="${1:-1.0.0}"

echo "Build multi-arch (arm64 + amd64) et push ${IMAGE}:${TAG}"
docker buildx build \
  --platform linux/arm64,linux/amd64 \
  --tag "${IMAGE}:${TAG}" \
  --push \
  .

echo "OK. Pensez à mettre à jour le tag dans docker-compose.yml si vous avez changé la version."
