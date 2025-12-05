# BudgetWise Helm Chart

This Helm chart deploys the BudgetWise personal budget management application to Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- Docker image built and available in your registry

## Installation

### Add Repository (for sharing)

```bash
helm repo add budgetwise https://yourusername.github.io/helm-charts
helm repo update
```

### Build and Push Docker Image

```bash
# Build the image
docker build -f Dockerfile -t budgetwise:1.0.0 .

# Tag for your registry (example with local registry)
docker tag budgetwise:1.0.0 localhost:5000/budgetwise:1.0.0

# Push to registry
docker push localhost:5000/budgetwise:1.0.0
```

### 3. Install the Chart

```bash
# Install with default values
helm install budgetwise ./helm/budgetwise

# Install with custom values
helm install budgetwise ./helm/budgetwise -f custom-values.yaml

# Install with inline value overrides
helm install budgetwise ./helm/budgetwise \
  --set image.repository=localhost:5000/budgetwise \
  --set image.tag=1.0.0 \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=budgetwise.local
```

### 4. Upgrade the Chart

```bash
helm upgrade budgetwise ./helm/budgetwise
```

### 5. Uninstall the Chart

```bash
helm uninstall budgetwise
```

## Configuration

The following table lists the configurable parameters and their default values:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `1` |
| `image.repository` | Image repository | `budgetwise` |
| `image.tag` | Image tag | `1.0.0` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Service type | `ClusterIP` |
| `service.port` | Service port | `3000` |
| `ingress.enabled` | Enable ingress | `false` |
| `ingress.hosts[0].host` | Hostname | `budgetwise.local` |
| `mongodb.enabled` | Enable MongoDB | `true` |
| `mongodb.auth.rootUser` | MongoDB root username | `budgetwise` |
| `mongodb.auth.rootPassword` | MongoDB root password | `budgetwise_password` |
| `seed.enabled` | Enable database seeding | `true` |
| `resources.limits.cpu` | CPU limit | `500m` |
| `resources.limits.memory` | Memory limit | `512Mi` |

## Custom Values Example

Create a `custom-values.yaml` file:

```yaml
image:
  repository: localhost:5000/budgetwise
  tag: "1.0.0"

ingress:
  enabled: true
  hosts:
    - host: budgetwise.local
      paths:
        - path: /
          pathType: Prefix

mongodb:
  auth:
    rootPassword: "your-secure-password"
  persistence:
    size: 20Gi

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi
```

## Accessing the Application

### Port Forward (for local development)

```bash
kubectl port-forward svc/budgetwise 3000:3000
```

Then access at http://localhost:3000

### Ingress (for production)

Enable ingress and configure your DNS to point to the ingress controller.

## Database Seeding

The chart includes automatic database seeding with default categories and budgets:

- **Expense Categories**: Housing, Transportation, Food, Groceries, Health, Entertainment, Education, Personal, Other
- **Income Categories**: Salary, Freelance, Investment, Gift, Other Income
- **Default Budgets**: $500 for each expense category

To disable seeding:

```bash
helm install budgetwise ./helm/budgetwise --set seed.enabled=false
```

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods -l app.kubernetes.io/name=budgetwise
```

### View Pod Logs

```bash
kubectl logs -l app.kubernetes.io/name=budgetwise
```

### Check MongoDB Connection

```bash
kubectl exec -it deployment/budgetwise -- /bin/sh
# Inside the container
curl http://localhost:3000/api/categories
```

### View Seed Job Logs

```bash
kubectl logs job/budgetwise-mongodb-seed
```

## Development

### Local Development with Helm

1. Start a local Kubernetes cluster (minikube, kind, etc.)
2. Build and load your image into the cluster
3. Install the chart with development values

```bash
# For minikube
minikube start
docker build -t budgetwise:dev .
minikube image load budgetwise:dev

helm install budgetwise-dev ./helm/budgetwise \
  --set image.repository=budgetwise \
  --set image.tag=dev \
  --set image.pullPolicy=Never
```