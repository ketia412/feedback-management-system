# Monitoring & Logging Documentation - Phase 7

## Overview
Implemented monitoring using Prometheus and Grafana for the Feedback Management System.

## Metrics Exposed

### Application Metrics (Port 3000/metrics)
1. **http_requests_total** (Counter)
   - Total number of HTTP requests received
   - Increments on every API call

2. **feedbacks_total** (Counter)
   - Total number of feedback submissions
   - Increments when POST /api/feedback succeeds

3. **app_uptime_seconds** (Gauge)
   - Application uptime in seconds
   - Shows how long the app has been running

## Architecture

### Components Deployed
- **Prometheus**: Metrics collection and storage
  - Namespace: monitoring
  - Service Port: 9090
  - Scrape Interval: 15s

- **Grafana**: Metrics visualization
  - Namespace: monitoring
  - Service Port: 3000 (exposed as 3001)
  - Default credentials: admin/admin123

- **Feedback App**: Application with metrics endpoint
  - Namespace: feedback-system
  - Metrics endpoint: /metrics
  - Prometheus annotations enabled

## Prometheus Configuration

### Scrape Configs
```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      
  - job_name: 'feedback-app'
    static_configs:
      - targets: ['feedback-service.feedback-system.svc.cluster.local:80']
```

### Deployment Annotations
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "3000"
  prometheus.io/path: "/metrics"
```

## Testing Results

### Metrics Endpoint Test
```bash
curl http://localhost:8080/metrics
```

**Response:**
```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total 6

# HELP feedbacks_total Total feedbacks
# TYPE feedbacks_total counter
feedbacks_total 0

# HELP app_uptime_seconds App uptime
# TYPE app_uptime_seconds gauge
app_uptime_seconds 16
```
✅ **Status**: Working

### Prometheus Targets
- **Endpoint**: http://localhost:9090/targets
- **Expected**: feedback-app target showing as UP
- ✅ **Status**: Configured

### Grafana Dashboard
- **URL**: http://localhost:3001
- **Data Source**: Prometheus (http://prometheus:9090)
- ✅ **Status**: Configured

## Access Information

### Local Development (Port Forwarding)
```bash
# Application
kubectl port-forward -n feedback-system deployment/feedback-app 8080:3000

# Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Grafana
kubectl port-forward -n monitoring svc/grafana 3001:3000
```

### URLs
- **Application**: http://localhost:8080
- **Metrics**: http://localhost:8080/metrics
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001

## Sample Prometheus Queries

### Request Rate
```promql
rate(http_requests_total[5m])
```

### Total Feedbacks
```promql
feedbacks_total
```

### Application Uptime
```promql
app_uptime_seconds
```

### Request Count (Last Hour)
```promql
increase(http_requests_total[1h])
```

## Alerting Rules (Future Enhancement)

### High Error Rate Alert
```yaml
alert: HighErrorRate
expr: rate(http_requests_total{status="500"}[5m]) > 0.05
for: 5m
labels:
  severity: critical
annotations:
  summary: High error rate detected
```

### Service Down Alert
```yaml
alert: ServiceDown
expr: up{job="feedback-app"} == 0
for: 1m
labels:
  severity: critical
annotations:
  summary: Feedback service is down
```

## Resource Usage

### Prometheus Pod
- CPU Request: 100m
- CPU Limit: 200m
- Memory Request: 256Mi
- Memory Limit: 512Mi

### Grafana Pod
- CPU Request: 50m
- CPU Limit: 100m
- Memory Request: 128Mi
- Memory Limit: 256Mi

## Troubleshooting

### Issue: Metrics endpoint returns 404
**Solution**: Ensure metrics.js is imported and /metrics route is defined in app.js

### Issue: Prometheus can't scrape targets
**Solution**: Verify deployment has correct annotations:
```yaml
prometheus.io/scrape: "true"
prometheus.io/port: "3000"
prometheus.io/path: "/metrics"
```

### Issue: Grafana can't connect to Prometheus
**Solution**: Use service name: `http://prometheus:9090` (not localhost)

## Phase 7 Completion Checklist

- ✅ Metrics endpoint implemented (/metrics)
- ✅ Prometheus deployed and configured
- ✅ Grafana deployed and configured
- ✅ Application instrumented with counters and gauges
- ✅ Prometheus scraping application metrics
- ✅ Documentation completed
- ✅ Port-forwarding configured for local access

## Next Steps (Phase 8: Monitor & Scale)
- Implement Horizontal Pod Autoscaler (HPA)
- Set up alerting rules
- Create Grafana dashboards
- Configure log aggregation
- Implement feedback loop automation