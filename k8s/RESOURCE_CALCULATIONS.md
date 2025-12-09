# Kubernetes Resource Calculations

## Pod Resource Requirements

### Per Pod Resources
- **CPU Request**: 100m (0.1 CPU cores)
- **CPU Limit**: 200m (0.2 CPU cores)
- **Memory Request**: 128Mi
- **Memory Limit**: 256Mi

### Calculation Explanation

**CPU (Millicores):**
- 1000m = 1 CPU core
- 100m = 0.1 CPU core (10% of one core)
- Our app is lightweight, needs minimal CPU

**Memory:**
- Request: 128Mi (minimum needed to run)
- Limit: 256Mi (maximum allowed)
- Node.js typically uses ~100-150Mi for small apps

## Total Cluster Resources (3 Replicas)

### Minimum Required (Requests):
- CPU: 100m × 3 = 300m (0.3 cores)
- Memory: 128Mi × 3 = 384Mi

### Maximum Possible (Limits):
- CPU: 200m × 3 = 600m (0.6 cores)
- Memory: 256Mi × 3 = 768Mi

## Docker Image Size
- **Actual Size**: 130MB
- **Target**: < 150MB ✅
- **Optimization**: Multi-stage build with Alpine base

## Node Requirements

### Single Node Deployment:
- Minimum: 1 CPU core, 1Gi RAM
- Recommended: 2 CPU cores, 2Gi RAM (for overhead)

### Current Minikube Setup:
- Resources allocated successfully
- 3 pods running smoothly