import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Monitoring & Observability

**Domain:** DevOps · **Time Estimate:** 2 weeks

> **Tool:** Prometheus · **Introduced:** 2012 (SoundCloud) · **Open-sourced:** 2015 · **Latest:** 2.51 (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — CNCF graduated project, industry standard for metrics  
> **Tool:** Grafana · **Introduced:** 2014 · **Latest:** 10.x (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — dominant dashboarding platform  
> **Tool:** OpenTelemetry · **Introduced:** 2019 (merger of OpenCensus + OpenTracing) · **Latest:** 1.x (stable 2021+) · **Deprecated:** N/A · **Status:** 🟢 Modern — the unified standard for telemetry  
> **Tool:** Loki · **Introduced:** 2018 · **Latest:** 3.x (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — log aggregation designed to pair with Prometheus/Grafana

!!! warning "🟡 Legacy Tools — acknowledged"
    **Nagios** · Introduced 1999 · Status: 🟡 Legacy — check-based monitoring; replaced by Prometheus in most new projects  
    **Zabbix** · Introduced 2001 · Still maintained · Status: 🟡 Legacy — agent-based, common in enterprise on-prem  
    **Splunk** · Introduced 2003 · Status: 🟡 Legacy for new builds (expensive; open-source stack now dominant); still common in large enterprises

> **Prerequisites:** [Docker](docker.md), [Kubernetes](kubernetes.md) (for cluster monitoring)  
> **Who needs this:** Anyone running production software. "You can't manage what you can't measure." If your service goes down at 3 AM, observability is what tells you why.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain the three pillars of observability: metrics, logs, and traces
- [ ] Set up Prometheus to scrape metrics from an application
- [ ] Build a Grafana dashboard with meaningful panels and alerts
- [ ] Instrument an application with OpenTelemetry
- [ ] Use structured logging and query logs with Loki or similar
- [ ] Define and alert on SLIs/SLOs
- [ ] Distinguish between a symptom (high latency) and a cause (DB connection pool exhausted)
- [ ] Investigate a production incident using dashboards and traces

---

## 📖 Concepts

### 1. The Three Pillars of Observability

!!! note "🔵 Foundation Concept"
    **Monitoring** tells you *something is wrong*. **Observability** tells you *why*.
    The difference matters at 3 AM when an alert fires.

```
Metrics   → What is happening (numbers over time)
            "Error rate is 5%. Latency p99 is 2.3s. CPU is 80%."
            Good for: alerting, dashboards, capacity planning

Logs      → What happened (events in sequence)
            "2024-04-11T02:13:41Z ERROR: DB connection timeout after 5000ms"
            Good for: debugging specific events, audit trails

Traces    → Why it happened (request flow across services)
            "Request abc123: api (12ms) → auth-service (3ms) → db (2280ms) ← HERE"
            Good for: finding bottlenecks in distributed systems
```

**All three are needed.** Metrics fire the alert. Logs show what was happening. Traces show which service caused it.

---

### 2. Metrics with Prometheus

Prometheus **scrapes** (pulls) metrics from HTTP endpoints exposed by your services, then stores them in a time-series database.

```
Application exposes → /metrics endpoint
                       (plain text, Prometheus format)

Prometheus          → scrapes /metrics every 15s
                    → stores time-series data

PromQL              → query language to ask questions
                       "What was average latency over the last hour?"

Alertmanager        → routes firing alerts to Slack, PagerDuty, email
```

**Metric types:**

| Type | Use for | Example |
|------|---------|---------|
| `Counter` | Things that only go up (requests, errors) | `http_requests_total` |
| `Gauge` | Things that go up and down (memory, connections) | `active_connections` |
| `Histogram` | Distribution of values (latency, request size) | `http_request_duration_seconds` |
| `Summary` | Pre-computed quantiles (older pattern, prefer Histogram) | `rpc_duration_summary` |

<Tabs>
<TabItem value="python-with-prometheus-client" label="Python (with prometheus-client)">

```python
# pip install prometheus-client
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time, random

# Define metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code']   # Labels
)
REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['endpoint'],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]
)
ACTIVE_CONNECTIONS = Gauge(
    'active_connections',
    'Currently open connections'
)

# Use in your application
def handle_request(method: str, endpoint: str):
    ACTIVE_CONNECTIONS.inc()
    start = time.time()
    try:
        # ... process request ...
        status = "200"
    except Exception:
        status = "500"
    finally:
        duration = time.time() - start
        REQUEST_COUNT.labels(method=method, endpoint=endpoint, status_code=status).inc()
        REQUEST_LATENCY.labels(endpoint=endpoint).observe(duration)
        ACTIVE_CONNECTIONS.dec()

# Expose /metrics endpoint on port 8001
start_http_server(8001)
```


</TabItem>
<TabItem value="typescript-with-prom-client" label="TypeScript (with prom-client)">

```typescript
// npm install prom-client
import { Counter, Histogram, Gauge, Registry, collectDefaultMetrics } from 'prom-client';

const register = new Registry();

// Collect default Node.js metrics (heap, GC, event loop lag)
collectDefaultMetrics({ register });

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const httpLatency = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['route'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5],
  registers: [register],
});

// Express middleware
app.use((req, res, next) => {
  const end = httpLatency.startTimer({ route: req.path });
  res.on('finish', () => {
    httpRequestsTotal.inc({ method: req.method, route: req.path, status_code: res.statusCode });
    end();
  });
  next();
});

// /metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```


</TabItem>
</Tabs>

**Prometheus config (`prometheus.yml`):**

```yaml
global:
  scrape_interval: 15s        # Default: scrape every 15 seconds
  evaluation_interval: 15s    # Evaluate rules every 15 seconds

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

rule_files:
  - "alerts.yml"

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "myapp"
    static_configs:
      - targets: ["api:8001", "worker:8001"]
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance

  # Kubernetes pod auto-discovery
  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: "true"
```

---

### 3. PromQL — Querying Metrics

```promql
# Instant queries
http_requests_total                              # All time series for this metric
http_requests_total{status_code="500"}           # Filter by label
http_requests_total{job="myapp", method="POST"}  # Multiple labels

# Range queries (last 5 minutes)
http_requests_total[5m]

# rate(): per-second rate of increase (use for counters)
rate(http_requests_total[5m])                    # Requests per second over 5m window

# irate(): instant rate (last two samples — spiky, good for short windows)
irate(http_requests_total[1m])

# Aggregation
sum(rate(http_requests_total[5m]))               # Total req/s across all instances
sum by (status_code)(rate(http_requests_total[5m]))  # Per status code
avg by (instance)(http_request_duration_seconds_bucket)

# Histogram quantiles
histogram_quantile(0.95,                         # 95th percentile latency
  sum by (le)(rate(http_request_duration_seconds_bucket[5m]))
)
histogram_quantile(0.99, ...)                    # p99 latency

# Error rate (errors as a fraction of total)
sum(rate(http_requests_total{status_code=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))

# Useful built-ins
up                                               # 1 if target is up, 0 if down
process_resident_memory_bytes / 1024 / 1024     # Memory in MB
```

---

### 4. Alerting

```yaml
# alerts.yml
groups:
  - name: api_alerts
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status_code=~"5.."}[5m]))
          /
          sum(rate(http_requests_total[5m])) > 0.05
        for: 2m                    # Must be true for 2 minutes before firing
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.job }}"
          description: "Error rate is {{ $value | humanizePercentage }} (threshold: 5%)"

      - alert: HighP99Latency
        expr: |
          histogram_quantile(0.99,
            sum by (le)(rate(http_request_duration_seconds_bucket[5m]))
          ) > 1.0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "P99 latency above 1 second"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "{{ $labels.instance }} is down"
```

---

### 5. Structured Logging

Structured logs are machine-parseable (JSON) instead of free-form text. This lets you query them efficiently.

<Tabs>
<TabItem value="python-structlog-modern" label="Python (structlog — Modern)">

```python
# pip install structlog
# structlog: Introduced 2013, still actively maintained — 🟢 current
import structlog

log = structlog.get_logger()

# Bind context that appears in all subsequent log lines
log = log.bind(service="api", version="1.2.0")

log.info("request_started",
         method="GET",
         path="/users",
         request_id="abc-123")

log.error("db_query_failed",
          query="SELECT * FROM users",
          duration_ms=5043,
          error="connection timeout")

# Output (JSON):
# {"event": "request_started", "method": "GET", "path": "/users",
#  "request_id": "abc-123", "service": "api", "timestamp": "..."}
```


</TabItem>
<TabItem value="typescript-pino-modern" label="TypeScript (pino — Modern)">

```typescript
// npm install pino
// pino: Introduced 2016, Latest 9.x (2024) — 🟢 Modern
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }    // Human-readable in dev
    : undefined,                    // JSON in production
});

const childLogger = logger.child({ service: 'api', version: '1.2.0' });

childLogger.info({ method: 'GET', path: '/users', requestId: 'abc-123' }, 'request_started');
childLogger.error({ query: 'SELECT *...', durationMs: 5043 }, 'db_query_failed');
```


</TabItem>
</Tabs>

**Avoid plain string logs in production:**
```python
# 🔴 Bad — can't query this
logging.error(f"DB query failed after {duration}ms: {error}")

# ✅ Good — every field is queryable
log.error("db_query_failed", duration_ms=duration, error=str(error))
```

---

### 6. Distributed Tracing with OpenTelemetry

> **Tool:** OpenTelemetry · **Introduced:** 2019 · **Status:** 🟢 Modern — CNCF incubating project, the vendor-neutral standard  
> **Predecessor:** OpenTracing (2016, deprecated 2021) + OpenCensus (2018, deprecated 2019)

!!! warning "🔴 OpenTracing and OpenCensus are deprecated"
    Both are discontinued in favour of OpenTelemetry. If you see guides using `opentracing` or `opencensus` libraries directly, they are outdated.

A **trace** follows a single request through multiple services. Each step is a **span**.

```
Trace: abc-123 (total: 287ms)
├── span: api-gateway         0ms → 5ms    (5ms)
├── span: auth-service        5ms → 23ms   (18ms)
├── span: user-service        23ms → 35ms  (12ms)
└── span: database            35ms → 287ms (252ms) ← SLOW
```

<Tabs>
<TabItem value="python" label="Python">

```python
# pip install opentelemetry-api opentelemetry-sdk opentelemetry-exporter-otlp
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

# Configure tracer
provider = TracerProvider()
provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter(endpoint="http://otel-collector:4317"))
)
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("myapp")

# Create spans
def get_user(user_id: int) -> dict:
    with tracer.start_as_current_span("get_user") as span:
        span.set_attribute("user.id", user_id)
        span.set_attribute("db.system", "postgresql")

        with tracer.start_as_current_span("db.query"):
            result = db.execute("SELECT * FROM users WHERE id = ?", user_id)

        return result
```


</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/exporter-trace-otlp-grpc
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('myapp');

async function getUser(userId: number) {
  return tracer.startActiveSpan('get_user', async (span) => {
    span.setAttribute('user.id', userId);
    try {
      const result = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
      return result;
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
      throw error;
    } finally {
      span.end();
    }
  });
}
```


</TabItem>
</Tabs>

---

### 7. SLIs, SLOs, and Error Budgets

> Terminology from Google's **Site Reliability Engineering** (SRE) book (2016, FREE online)

```
SLI (Service Level Indicator)
    A metric that measures service quality.
    Examples: request success rate, latency p99, availability

SLO (Service Level Objective)
    A target for an SLI.
    Examples: "99.9% of requests succeed", "p99 latency < 500ms"

SLA (Service Level Agreement)
    A contractual commitment (with penalties for violations).
    Your SLO should be stricter than your SLA.

Error Budget
    How much failure you're allowed in a period.
    99.9% availability SLO → 0.1% failure allowed
    In a 30-day month: 0.1% × 43,200 minutes = 43.2 minutes of downtime allowed
```

**Why this matters:** Without an error budget, every incident is treated as catastrophic. With one, you know exactly how much risk you can take. Error budget nearly exhausted? Slow down deployments. Budget healthy? Ship fast.

---

### 8. The Grafana + Prometheus + Loki Stack

The modern open-source observability stack (often called **PLG** or **Grafana Stack**):

```yaml
# docker-compose.yml — local observability stack
services:
  prometheus:
    image: prom/prometheus:v2.51.0
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports: ["9090:9090"]
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.retention.time=30d

  grafana:
    image: grafana/grafana:10.4.0
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning  # Auto-provision dashboards
    ports: ["3000:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin

  loki:
    image: grafana/loki:3.0.0
    ports: ["3100:3100"]
    command: -config.file=/etc/loki/loki-config.yml

  promtail:
    image: grafana/promtail:3.0.0      # Log shipper → Loki
    volumes:
      - /var/log:/var/log:ro
      - ./promtail-config.yml:/etc/promtail/config.yml

volumes:
  prometheus-data:
  grafana-data:
```

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary">

- 📖 **[Prometheus Docs (FREE)](https://prometheus.io/docs/)** — Start with "Getting Started"; excellent tutorials
- 📖 **[Google SRE Book — Ch. 4: Service Level Objectives (FREE)](https://sre.google/sre-book/service-level-objectives/)** — Essential reading on SLIs/SLOs/error budgets
- 📺 **[TechWorld with Nana — Prometheus + Grafana (YouTube, FREE)](https://www.youtube.com/watch?v=QoDqxm7ybLc)** — Best hands-on walkthrough of the full stack


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📖 **[OpenTelemetry Docs (FREE)](https://opentelemetry.io/docs/)** — Instrumentation guides for every major language
- 📖 **[Loki Docs (FREE)](https://grafana.com/docs/loki/latest/)** — Log aggregation guide


</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[Grafana Play (FREE, no login)](https://play.grafana.org/)** — Live Grafana instance with real dashboards to explore
- 📖 **[Prometheus Cheat Sheet (FREE)](https://promlabs.com/promql-cheat-sheet/)** — PromQL quick reference


</TabItem>
</Tabs>

---

## 🏗️ Assignments

### Assignment 1 — Instrument an Application
Take any web app from a previous unit:

- [ ] Add a `/metrics` endpoint using `prometheus-client` (Python) or `prom-client` (TS)
- [ ] Instrument: request count, request latency (histogram), active connections (gauge)
- [ ] Run Prometheus locally (Docker) pointed at your app
- [ ] Verify metrics appear at `localhost:9090` → Graph
- [ ] Write a PromQL query for: p95 latency, error rate, requests per second

### Assignment 2 — Grafana Dashboard
Build a meaningful dashboard:

- [ ] Connect Grafana to your Prometheus instance
- [ ] Create a dashboard with panels: requests/sec, error rate %, p50/p95/p99 latency, active connections
- [ ] Add an alert rule: fire if error rate > 1% for 2 minutes
- [ ] Export the dashboard as JSON and commit it to your repo
- [ ] Bonus: use `docker compose` to start the whole stack with one command

### Assignment 3 — Root Cause Analysis Exercise
Simulate a production incident:

- [ ] Create a test endpoint that randomly returns 500 errors at a configurable rate
- [ ] Create another that simulates a slow external call (random 0–5s delay)
- [ ] Write a runbook: what do you check first when the alert fires? In what order?
- [ ] Generate load (use `hey` or `k6`), watch the dashboards, identify which endpoint is causing the alert
- [ ] Document: metrics saw the symptom → logs showed the pattern → (optionally) traces showed the cause

---

## ✅ Milestone Checklist

- [ ] Can explain metrics, logs, and traces and when each is most useful
- [ ] Can add a `/metrics` endpoint to any application
- [ ] Can write PromQL to query request rate, error rate, and latency percentiles
- [ ] Can build a Grafana dashboard from scratch
- [ ] Can set up an alert with the right `for` duration to avoid flapping
- [ ] Can explain what an SLO and error budget are without notes
- [ ] All 3 assignments committed to GitHub

---

## 🏆 Milestone Complete!

> **Your systems are now observable.**
>
> When something breaks at 3 AM, you'll know it before your users do,
> you'll know which service caused it, and you'll have the data to explain why.

**Log this in your kanban:** Move `devops/monitoring` to ✅ Done.

## ➡️ Next Unit

→ [Testing](testing.md)
