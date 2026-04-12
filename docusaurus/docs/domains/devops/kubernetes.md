import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Kubernetes

**Domain:** DevOps · **Time Estimate:** 3–4 weeks

> **Tool:** Kubernetes (k8s) · **Introduced:** 2014 (Google internal: Borg) · **Open-sourced:** June 2014 · **Latest:** 1.30 (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — the de facto standard for container orchestration  
> **Tool:** kubectl · **Introduced:** 2014 · **Latest:** matches cluster version · **Deprecated:** N/A · **Status:** 🟢 Modern  
> **Tool:** Helm · **Introduced:** 2016 · **Latest:** 3.15 (2024) · **Deprecated:** Helm 2 (deprecated 2020) · **Status:** 🟢 Modern (v3 only)

> **Prerequisites:** [Docker](docker.md) — you must understand images, containers, and Compose first.  
> **Who needs this:** Anyone running containerised workloads at scale. Kubernetes is the production deployment platform for most cloud-native applications.

!!! note "🔵 Foundation Concept"
    Kubernetes solves the problem of running Docker across many machines. If Docker answers "how do I package and run one container?", Kubernetes answers "how do I run 100 containers reliably across 50 machines with zero downtime?"

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain what a Kubernetes cluster is and name its core components
- [ ] Write `Deployment`, `Service`, and `ConfigMap` manifests in YAML
- [ ] Use `kubectl` to deploy, inspect, update, and roll back an application
- [ ] Configure resource requests and limits for containers
- [ ] Expose applications internally and externally with Services and Ingress
- [ ] Store configuration and secrets using ConfigMaps and Secrets
- [ ] Explain how Kubernetes handles rolling updates and self-healing
- [ ] Use `kubectl exec`, `logs`, and `describe` to debug running pods

---

## 📖 Concepts

### 1. The Problem Kubernetes Solves

```
Without Kubernetes (manual Docker on servers):
  - Which server has capacity for this container?
  - What if that server crashes? Who restarts it?
  - How do you update all instances with zero downtime?
  - How do you scale from 2 to 20 instances during peak traffic?
  - How do services find each other across machines?
  → You solve all of this manually, differently every time.

With Kubernetes:
  - Declare desired state: "I want 5 copies of this container"
  - Kubernetes schedules them across available nodes
  - If a node dies, Kubernetes moves containers to healthy nodes
  - Rolling updates are built in — no downtime
  - DNS-based service discovery is automatic
  → You declare what you want. Kubernetes makes it happen and keeps it that way.
```

---

### 2. Architecture — The Cluster

```
Kubernetes Cluster
├── Control Plane (manages the cluster)
│   ├── API Server        ← All kubectl commands hit here
│   ├── etcd              ← Distributed key-value store (cluster state)
│   ├── Scheduler         ← Decides which node gets each pod
│   └── Controller Manager ← Reconciliation loops (desired vs actual state)
│
└── Worker Nodes (run your workloads)
    ├── Node 1
    │   ├── kubelet       ← Agent on each node, talks to API server
    │   ├── kube-proxy    ← Network rules for services
    │   └── Container runtime (containerd — replaced Docker shim 2022)
    ├── Node 2
    └── Node 3
```

**The control plane is the brain.** In managed Kubernetes (EKS, GKE, AKS), the cloud provider runs the control plane — you only manage worker nodes.

---

### 3. Core Objects

Everything in Kubernetes is an **object** — a resource with a desired state that Kubernetes continuously reconciles against the actual state.

```
Pod           The smallest deployable unit. One or more containers
              that share a network namespace and storage.
              Pods are ephemeral — they die; a Deployment recreates them.

Deployment    Manages a set of identical Pods (ReplicaSet).
              Handles rolling updates and rollbacks.

Service       A stable network endpoint in front of Pods.
              Pods come and go; the Service IP/DNS stays constant.

ConfigMap     Non-sensitive configuration data (env vars, config files).

Secret        Sensitive data (passwords, API keys).
              Stored base64-encoded in etcd (encrypt-at-rest separately).

Namespace     Virtual cluster — isolates resources by name.

Ingress       HTTP/HTTPS routing into the cluster from outside.
              Requires an Ingress Controller (NGINX, Traefik, etc.).

PersistentVolumeClaim (PVC)  Request for storage by a Pod.
PersistentVolume (PV)        The actual storage, fulfilled by the cluster.
```

---

### 4. Writing Manifests

Every Kubernetes object is defined as YAML. The structure is always:

```yaml
apiVersion: <api-group/version>   # Which API this resource belongs to
kind: <ResourceType>              # What kind of object
metadata:                         # Identity: name, namespace, labels
  name: <name>
  labels:
    <key>: <value>
spec:                             # Desired state — differs per resource type
  ...
```

#### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  labels:
    app: api
spec:
  replicas: 3

  selector:
    matchLabels:
      app: api

  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0

  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: ghcr.io/myorg/api:a1b2c3d   # Always use specific tag, never :latest
          ports:
            - containerPort: 8000

          resources:
            requests:
              cpu: "100m"         # 100 millicores = 0.1 CPU core
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"

          env:
            - name: LOG_LEVEL
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: log_level
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: api-secrets
                  key: database_url

          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 15

          readinessProbe:
            httpGet:
              path: /ready
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 5
```

#### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: ClusterIP                 # Internal-only (default)
```

**Service types:**

| Type | Access | Use when |
|------|--------|---------|
| `ClusterIP` | Within cluster only | Internal microservice communication |
| `LoadBalancer` | Internet via cloud LB | Simple external access |
| `NodePort` | Via any node's IP + port | Testing, bare-metal |
| `ExternalName` | DNS alias to external service | Routing to external DB by DNS name |

#### ConfigMap and Secret

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
data:
  log_level: "info"
  max_connections: "100"

---
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
type: Opaque
data:
  # Values are base64-encoded: echo -n "mypassword" | base64
  database_url: cG9zdGdyZXNxbDovL...
```

!!! danger "Secrets are not encrypted by default"
    Kubernetes Secrets are base64-encoded, not encrypted. Enable **etcd encryption at rest** and consider **External Secrets Operator** (introduced 2021) with Vault or cloud secret managers in production.

#### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.example.com
      secretName: api-tls
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 80
```

---

### 5. kubectl — Essential Commands

```bash
# Apply and delete
kubectl apply -f deployment.yaml
kubectl apply -f .                        # All YAML in directory
kubectl delete -f deployment.yaml

# Inspect
kubectl get pods
kubectl get pods -n kube-system          # Specific namespace
kubectl get pods -A                       # All namespaces
kubectl get pods -o wide                  # More columns (node, IP)
kubectl get pods -w                       # Watch for changes
kubectl get all                           # All common resources

kubectl describe pod <name>               # Events, conditions, details
kubectl describe deployment api

# Logs
kubectl logs <pod-name>
kubectl logs -f <pod-name>              # Follow
kubectl logs --tail=100 <pod-name>
kubectl logs -l app=api                  # All pods with label

# Execute in pods
kubectl exec -it <pod-name> -- bash
kubectl exec <pod-name> -- ls /app

# Deployments
kubectl rollout status deployment/api
kubectl rollout history deployment/api
kubectl rollout undo deployment/api
kubectl scale deployment api --replicas=5

# Resource usage (requires metrics-server)
kubectl top pods
kubectl top nodes
```

---

### 6. Rolling Updates and Self-Healing

```
Scenario: Update api:v1 to api:v2 (maxSurge:1, maxUnavailable:0)

t=0s  [v1] [v1] [v1]           ← 3 old pods
t=5s  [v1] [v1] [v1] [v2]     ← spin up 1 new (surge)
t=10s [v1] [v1]      [v2]     ← v2 ready; kill 1 old
t=15s [v1] [v1] [v2] [v2]     ← spin up another new
t=20s [v1]      [v2] [v2]     ← kill 1 old
t=25s [v1] [v2] [v2] [v2]     ← spin up last new
t=30s      [v2] [v2] [v2]     ← done. Zero downtime.
```

**Self-healing behaviours:**

| Event | Kubernetes response |
|-------|-------------------|
| Pod crashes | Controller creates replacement |
| Node fails | Pods rescheduled to healthy nodes |
| OOMKilled | Container restarted; liveness probe checked |
| Liveness probe fails | Container killed and restarted |
| Readiness probe fails | Traffic removed; pod stays alive |

---

### 7. Local Clusters — kind and minikube

> **Tool:** kind · **Introduced:** 2018 · **Latest:** 0.23 (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — recommended for local dev and CI  
> **Tool:** minikube · **Introduced:** 2016 · **Latest:** 1.33 (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern

```bash
# kind — nodes are Docker containers
kind create cluster --name dev
kind load docker-image myapp:dev --name dev   # Load local image (skip registry)
kind delete cluster --name dev

# minikube — single-node cluster
minikube start --cpus=4 --memory=8g
minikube image load myapp:dev
minikube dashboard                # Open web UI
minikube stop
```

---

### 8. Helm — Package Manager

> **Tool:** Helm v3 · **Introduced:** 2019 · **Latest:** 3.15 (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern

!!! warning "🔴 Helm 2 is deprecated"
    **Helm 2** (Introduced 2016 · **Deprecated:** November 2020) used a server-side component called **Tiller** with serious security issues (cluster-admin required). If any guide mentions Tiller, it is outdated.

```bash
# Add chart repositories
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Explore and install
helm search repo nginx
helm show values ingress-nginx/ingress-nginx
helm install my-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace

# Upgrade and manage
helm upgrade my-nginx ingress-nginx/ingress-nginx --values values.yaml
helm list -A
helm rollback my-nginx 1
helm uninstall my-nginx

# Author your own chart
helm create mychart
helm template mychart/ --values values.yaml   # Render without a cluster
helm lint mychart/
```

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary">

- 📖 **[Kubernetes Docs (FREE)](https://kubernetes.io/docs/)** — Start with Concepts then Tasks; best reference available
- 📺 **[TechWorld with Nana — Kubernetes Crash Course (YouTube, FREE)](https://www.youtube.com/watch?v=s_o8dwzRlu4)** — Best structured walkthrough, 4 hours


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📖 **[Kubernetes: Up and Running — O'Reilly, 3rd ed. 2022 (PAID)](https://www.oreilly.com/library/view/kubernetes-up-and/9781098110192/)** — Definitive book
- 🌐 **[kubectl Quick Reference (FREE)](https://kubernetes.io/docs/reference/kubectl/quick-reference/)**


</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[Killercoda — Kubernetes Scenarios (FREE tier)](https://killercoda.com/kubernetes)** — Browser-based interactive labs, no install needed
- 🎮 **[KodeKloud — CKA Practice (PAID)](https://kodekloud.com/)** — Best prep for Certified Kubernetes Administrator


</TabItem>
</Tabs>

---

## 🏗️ Assignments

### Assignment 1 — Deploy a Real Application
Using `kind` locally:

- [ ] Create a 3-node `kind` cluster
- [ ] Write a `Deployment` (3 replicas), `ConfigMap`, and `Service`
- [ ] Verify pods are running and exec into one
- [ ] Scale to 5, then back to 2 — watch with `kubectl get pods -w`

### Assignment 2 — Rolling Update and Rollback

- [ ] Deploy `myapp:v1`, then update to `myapp:v2` — watch `rollout status`
- [ ] Roll back to `v1`
- [ ] Deploy a broken `myapp:v3` (wrong port) — observe probe failure and recovery

### Assignment 3 — Full Stack on Kubernetes

- [ ] Namespace: `myapp`
- [ ] API Deployment (3 replicas) + Service + ConfigMap + Secret
- [ ] PostgreSQL StatefulSet with PVC
- [ ] Redis Deployment + Service
- [ ] Ingress routing `/api/` to the API
- [ ] Resource requests/limits on all containers
- [ ] Readiness + liveness probes on the API

---

## ✅ Milestone Checklist

- [ ] Can explain Pod, Deployment, and Service without notes
- [ ] Can write a Deployment manifest from scratch with resources and health probes
- [ ] Can debug any issue with `describe`, `logs`, and `exec`
- [ ] Can perform a rolling update and rollback
- [ ] Can expose an application via Ingress
- [ ] Can install software with Helm v3
- [ ] All 3 assignments committed to GitHub

---

## 🏆 Milestone Complete!

> **You operate production-grade infrastructure.**
>
> Kubernetes is the platform that runs the majority of the world's cloud-native software.
> You can now deploy, scale, update, and debug containerised applications with confidence.

**Log this in your kanban:** Move `devops/kubernetes` to ✅ Done.

## ➡️ Next Unit

→ [Infrastructure as Code](iac.md)
