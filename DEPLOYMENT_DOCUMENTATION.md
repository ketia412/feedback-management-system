# Deployment Documentation - Phase 6

## Deployment Strategy: Rolling Update

### Configuration
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1  # Max 1 pod down during update
    maxSurge: 1        # Max 1 extra pod during update
```

### How It Works
1. Creates 1 new pod with updated version
2. Waits for new pod to be ready (health checks pass)
3. Terminates 1 old pod
4. Repeats until all 3 pods updated
5. Zero downtime achieved!

## Deployment Process

### Initial Deployment
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml -n feedback-system
kubectl apply -f k8s/service.yaml -n feedback-system
```

### Verification
```bash
kubectl get all -n feedback-system
kubectl get pods -n feedback-system
```

**Result**: 3 pods running successfully ✅

## Health Checks Implemented

### Liveness Probe
- **Purpose**: Checks if container is alive
- **Action**: Restarts container if check fails
- **Endpoint**: `/health`
- **Initial Delay**: 10 seconds
- **Check Period**: Every 10 seconds

### Readiness Probe
- **Purpose**: Checks if container is ready for traffic
- **Action**: Removes from service if check fails
- **Endpoint**: `/health`
- **Initial Delay**: 5 seconds
- **Check Period**: Every 5 seconds

## Service Configuration

### Type: NodePort
- **Internal Port**: 80
- **Container Port**: 3000
- **NodePort**: 30080
- **Access**: Via Minikube IP + NodePort

### Testing Results
```json
Health Check Response:
{
  "status": "healthy",
  "timestamp": "2025-12-09T19:57:34.370Z",
  "uptime": 391.267165875
}

Feedback Submission: ✅ Working
API Endpoints: ✅ All functional
```

## Resource Allocation

### Per Pod:
- CPU Request: 100m
- CPU Limit: 200m
- Memory Request: 128Mi
- Memory Limit: 256Mi

### Total (3 replicas):
- CPU: 300m request, 600m limit
- Memory: 384Mi request, 768Mi limit

## Troubleshooting Done

### Issue: ImagePullBackOff
**Solution**: Built image directly in Minikube Docker environment
```bash
eval $(minikube docker-env)
docker build -t ketia412/feedback-app:1.0.0 .
kubectl patch deployment feedback-app -n feedback-system -p '{"spec":{"template":{"spec":{"containers":[{"name":"feedback-app","imagePullPolicy":"Never"}]}}}}'
```

**Result**: All 3 pods running successfully ✅

## Deployment Success Metrics

- ✅ 3 replicas deployed
- ✅ All pods in Running status
- ✅ Health checks passing
- ✅ Service accessible
- ✅ API endpoints functional
- ✅ Zero downtime deployment strategy configured
- ✅ Resource limits properly set