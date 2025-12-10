# Monitoring and Alerting

## Metrics
- Prometheus scrapes the app at `/metrics` (see annotations in `k8s/deployment.yaml`).
- Grafana dashboards read from Prometheus (see `k8s/grafana-deployment.yaml`).

## Alerts
- Prometheus alert rules in `k8s/alert-rules.yaml`:
  - `HighErrorRate`: error rate > 0.1% over 5m
  - `HighLatencyP95`: p95 latency > 200ms over 5m
  - `InstanceDown`: target not scraping for 2m
- Hook Alertmanager to Slack/email using these rules to enforce the SLO/error budget.

## Logging
- App logs to stdout/stderr (Kubernetes logging pipeline).
- For ELK/Loki, deploy a log collector (e.g., Fluent Bit/Fluentd) to ship pod logs; not included here by default.

