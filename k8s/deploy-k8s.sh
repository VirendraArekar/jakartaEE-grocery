#!/usr/bin/env bash
# ==============================================================================
# FreshCart Grocery - Automated Kubernetes Deployment Script
# ==============================================================================
set -e

echo "🥦 [1/4] Building Backend Docker Image (freshcart-backend:1.0.0)..."
cd "$(dirname "$0")/.."
docker build -t freshcart-backend:1.0.0 ./backend

echo "🛒 [2/4] Building Frontend Docker Image (freshcart-frontend:1.0.0)..."
docker build -t freshcart-frontend:1.0.0 ./frontend

# If using Minikube or Kind, load images into cluster
if command -v minikube >/dev/null 2>&1 && minikube status >/dev/null 2>&1; then
    echo "📦 Loading images into Minikube cache..."
    minikube image load freshcart-backend:1.0.0
    minikube image load freshcart-frontend:1.0.0
elif command -v kind >/dev/null 2>&1; then
    echo "📦 Loading images into Kind cluster (if active)..."
    kind load docker-image freshcart-backend:1.0.0 || true
    kind load docker-image freshcart-frontend:1.0.0 || true
fi

echo "🚀 [3/4] Applying Kubernetes Manifests via Kustomize..."
kubectl apply -k ./k8s

echo "⏳ [4/4] Monitoring Deployment Rollout in namespace 'grocery-system'..."
kubectl rollout status deployment/mssql-deployment -n grocery-system --timeout=180s
kubectl rollout status deployment/redis-deployment -n grocery-system --timeout=120s
kubectl rollout status deployment/backend-deployment -n grocery-system --timeout=180s
kubectl rollout status deployment/frontend-deployment -n grocery-system --timeout=180s

echo ""
echo "=============================================================================="
echo "🎉 FreshCart Grocery System is successfully deployed on Kubernetes!"
echo "=============================================================================="
echo "To inspect cluster pods and services, run:"
echo "   kubectl get all -n grocery-system"
echo ""
echo "To port-forward frontend locally:"
echo "   kubectl port-forward svc/frontend-service 3000:80 -n grocery-system"
echo "Then visit http://localhost:3000"
echo "=============================================================================="

