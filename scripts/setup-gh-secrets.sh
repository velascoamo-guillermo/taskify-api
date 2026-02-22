#!/bin/bash

# Setup GitHub Actions secrets for staging environment
# Usage: ./scripts/setup-gh-secrets.sh

set -e

echo "🔐 Configurando secrets de GitHub Actions para staging..."
echo ""

# GCP
read -p "GCP_PROJECT_ID: " GCP_PROJECT_ID
read -p "GCP_SERVICE_ACCOUNT (email): " GCP_SERVICE_ACCOUNT
read -p "GCP_WORKLOAD_IDENTITY_PROVIDER: " GCP_WORKLOAD_IDENTITY_PROVIDER
read -p "GKE_CLUSTER (nombre del cluster): " GKE_CLUSTER
read -p "GKE_ZONE (ej: us-central1-a): " GKE_ZONE

# App
read -p "DATABASE_URL: " DATABASE_URL
read -p "JWT_SECRET: " JWT_SECRET
read -p "JWT_REFRESH_SECRET: " JWT_REFRESH_SECRET
read -p "CLOUDINARY_API_KEY: " CLOUDINARY_API_KEY
read -p "CLOUDINARY_API_SECRET: " CLOUDINARY_API_SECRET

echo ""
echo "Creando secrets en GitHub..."

gh secret set GCP_PROJECT_ID --body "$GCP_PROJECT_ID"
gh secret set GCP_SERVICE_ACCOUNT --body "$GCP_SERVICE_ACCOUNT"
gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER --body "$GCP_WORKLOAD_IDENTITY_PROVIDER"
gh secret set GKE_CLUSTER --body "$GKE_CLUSTER"
gh secret set GKE_ZONE --body "$GKE_ZONE"
gh secret set DATABASE_URL --body "$DATABASE_URL"
gh secret set JWT_SECRET --body "$JWT_SECRET"
gh secret set JWT_REFRESH_SECRET --body "$JWT_REFRESH_SECRET"
gh secret set CLOUDINARY_API_KEY --body "$CLOUDINARY_API_KEY"
gh secret set CLOUDINARY_API_SECRET --body "$CLOUDINARY_API_SECRET"

echo ""
echo "✅ Todos los secrets configurados correctamente."
echo ""
echo "Verificando:"
gh secret list
