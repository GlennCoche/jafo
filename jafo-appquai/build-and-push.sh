#!/usr/bin/env bash
# Build multi-arch (arm64 + amd64) et push des images AppQUAI pour Umbrel (store Jafo).
# Usage: ./build-and-push.sh [TAG]
# Exemple: ./build-and-push.sh 1.0.0
# Prérequis: docker buildx, docker login (compte glenncoche)
# Sans multi-arch, l'installation peut rester bloquée à 1% sur Raspberry Pi ou x86 selon la machine de build.

set -e
TAG="${1:-1.0.0}"
REPO="glenncoche"
PLATFORMS="linux/arm64,linux/amd64"

echo "Build multi-arch ($PLATFORMS) AppQUAI tag=$TAG..."

echo "  → appquai-init"
docker buildx build --platform "$PLATFORMS" -t "$REPO/appquai-init:$TAG" -t "$REPO/appquai-init:latest" --push ./init

echo "  → appquai-server"
docker buildx build --platform "$PLATFORMS" -t "$REPO/appquai-server:$TAG" -t "$REPO/appquai-server:latest" --push ./app

echo "  → appquai-go-quai (long: clone + compile go-quai)"
docker buildx build --platform "$PLATFORMS" -t "$REPO/appquai-go-quai:$TAG" -t "$REPO/appquai-go-quai:latest" --push ./go-quai

echo "OK. Images poussées : $REPO/appquai-*:$TAG (multi-arch)."
echo "Mettre à jour umbrel-app.yml version si besoin, puis commit + push GitHub."
