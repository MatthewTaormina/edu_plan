# Docker

**Domain:** DevOps · **Time Estimate:** 2 weeks

> **Tool:** Docker Engine · **Created:** 2013 · **Latest:** 25.x (2024) · **Status:** 🟢 Modern · **Maintained by:** Docker Inc. + CNCF ecosystem  
> **Tool:** Docker Compose · **Created:** 2014 (v1 as `docker-compose`), **v2 (2021)** as `docker compose` (no hyphen) · **Status:** 🟢 Modern (v2 only — v1 deprecated 2023)

> **Prerequisites:** [Linux CLI](linux_cli.md) — must know basic terminal navigation. [OS Concepts](../foundations/os_concepts.md) — containers use Linux kernel features.
>
> **Who needs this:** Everyone deploying software. Docker is the universal packaging format for applications. If you ship code that runs on a server, you will work with containers.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain what a container is and how it differs from a VM
- [ ] Write a `Dockerfile` that builds a minimal, production-ready image
- [ ] Use multi-stage builds to produce small final images
- [ ] Run, inspect, stop, and remove containers and images
- [ ] Write a `docker-compose.yml` that defines a multi-container application
- [ ] Push and pull images from a registry (Docker Hub, GHCR)
- [ ] Understand build caching and how to optimize it
- [ ] Apply security best practices: non-root user, minimal base image, no secrets in layers

---

## 📖 Concepts

### 1. Containers vs. Virtual Machines

!!! note "🔵 Foundation Concept"
    Understanding *what problem containers solve* is more important than syntax. Docker is a tool — the concept of process isolation is permanent.

**Virtual Machine:** Emulates an entire computer including the hardware and OS kernel.

**Container:** Shares the host OS kernel. Isolates processes using Linux kernel features (`namespaces` for isolation, `cgroups` for resource limits).

```
Virtual Machine:                    Container:
┌─────────────────────────┐        ┌─────────────────────────┐
│  App A     │  App B     │        │  Container A │ Container B│
│  Libs      │  Libs      │        │  Libs        │ Libs       │
│  Guest OS  │  Guest OS  │        ├──────────────────────────┤
│  ──────────┤──────────  │        │     Docker Engine        │
│        Hypervisor        │        │       Host OS Kernel     │
│        Host OS           │        │         Hardware         │
│        Hardware          │        └─────────────────────────┘
└─────────────────────────┘

VM overhead: 500MB–2GB+ per VM, seconds to start
Container overhead: MBs, milliseconds to start
```

| | Container | Virtual Machine |
|-|-----------|----------------|
| Startup | Milliseconds | Seconds–minutes |
| Size | MBs | GBs |
| Isolation | Process-level | Full OS |
| Guest OS | No (shares host kernel) | Yes |
| Security boundary | Lower (shared kernel) | Stronger |
| Use when | Packaging apps, microservices | Full OS isolation needed |

---

### 2. Key Concepts

```
Image       The blueprint — a read-only filesystem snapshot with metadata.
            Built from a Dockerfile. Stored in a registry.

Container   A running instance of an image. Like a process spawned from an executable.
            Each container has its own isolated filesystem, network, and PID namespace.

Dockerfile  Instructions to build an image, layer by layer.

Registry    A storage and distribution system for images.
            Docker Hub (public), GHCR (GitHub), ECR (AWS), GCR (Google).

Volume      Persistent storage that outlives a container's lifetime.

Network     Virtual network that allows containers to communicate.

Layer       Each Dockerfile instruction creates a new filesystem layer.
            Layers are content-addressed and cached — unchanged layers are reused.
```

---

### 3. Writing a Dockerfile

> **Tool:** BuildKit (2019, **default since Docker 23.0 / 2023**) · **Status:** 🟢 Modern  
> All `docker build` commands now use BuildKit automatically. Old syntax (e.g., `--no-buildkit`) is 🟡 Legacy.

=== "Modern (Recommended)"
    ```dockerfile
    # syntax=docker/dockerfile:1
    # ↑ Enables the latest BuildKit frontend features

    FROM python:3.12-slim

    # Set working directory
    WORKDIR /app

    # Install dependencies BEFORE copying source code
    # (Leverage layer caching — deps change less often than code)
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt

    # Copy application source
    COPY src/ ./src/

    # Create non-root user (security best practice)
    RUN useradd --create-home appuser
    USER appuser

    # Document which ports the container will listen on
    EXPOSE 8000

    # Default command
    CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
    ```

=== "Foundation (Understanding Layers)"
    ```dockerfile
    # Every instruction creates a new layer in the image
    # Layers are cached — if nothing changed, Docker reuses the cached layer
    # Order matters: put things that change LEAST at the top

    FROM ubuntu:22.04           # Layer 1: base OS
    RUN apt-get update          # Layer 2: package list (changes rarely)
    RUN apt-get install -y python3  # Layer 3: system packages
    COPY app.py .               # Layer 4: your code (changes often)

    # BAD ordering — breaks cache on every code change:
    COPY app.py .               # Layer 2: code (changes often)
    RUN apt-get update          # Layer 3: must re-run even if unchanged
    RUN apt-get install -y python3  # Layer 4: must re-run even if unchanged
    ```

**Core Dockerfile instructions:**

| Instruction | Purpose | Example |
|-------------|---------|---------|
| `FROM` | Base image | `FROM node:20-alpine` |
| `WORKDIR` | Set working directory | `WORKDIR /app` |
| `COPY` | Copy files from host | `COPY package*.json ./` |
| `RUN` | Execute command during build | `RUN npm ci` |
| `ENV` | Set environment variable | `ENV NODE_ENV=production` |
| `ARG` | Build-time variable (not in final image) | `ARG APP_VERSION=1.0` |
| `EXPOSE` | Document a port (informational only) | `EXPOSE 3000` |
| `USER` | Switch to non-root user | `USER node` |
| `CMD` | Default command (overridable) | `CMD ["node", "server.js"]` |
| `ENTRYPOINT` | Fixed command (CMD becomes args) | `ENTRYPOINT ["npm"]` |
| `HEALTHCHECK` | Container health probe | `HEALTHCHECK CMD curl -f http://localhost/health` |

---

### 4. Multi-Stage Builds

!!! success "✅ Modern Best Practice"
    Multi-stage builds (Docker 17.05+, 2017, widely adopted 2020+) are the standard way to produce small production images. Always use them when your build step requires tools not needed at runtime.

The problem: compilers, test runners, and build tools are large. They shouldn't be in your production image.

```dockerfile
# syntax=docker/dockerfile:1

# ── Stage 1: Build ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /build

# Install ALL dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build          # Produces /build/dist/


# ── Stage 2: Production image ──────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Only copy production dependencies
COPY package*.json ./
RUN npm ci --omit=dev      # Skip devDependencies

# Copy built output from builder stage
COPY --from=builder /build/dist ./dist

# Security: run as non-root
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser
USER appuser

EXPOSE 3000
CMD ["node", "dist/server.js"]

# Result: builder might be 800MB, production image is 120MB
```

**Type-specific multi-stage examples:**

=== "Go"
    ```dockerfile
    FROM golang:1.22-alpine AS builder
    WORKDIR /build
    COPY go.mod go.sum ./
    RUN go mod download
    COPY . .
    RUN CGO_ENABLED=0 go build -o server ./cmd/server

    FROM scratch AS production   # ← "scratch" = empty image!
    COPY --from=builder /build/server /server
    COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
    USER 65534:65534             # nobody user (by UID since scratch has no useradd)
    EXPOSE 8080
    ENTRYPOINT ["/server"]
    # Final image: ~10MB total — just the binary + TLS certs
    ```

=== "Rust"
    ```dockerfile
    FROM rust:1.77-alpine AS builder
    WORKDIR /build
    RUN apk add --no-cache musl-dev
    COPY Cargo.toml Cargo.lock ./
    # Cache dependencies separately
    RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release
    COPY src ./src
    RUN touch src/main.rs && cargo build --release

    FROM alpine:3.19 AS production
    RUN apk add --no-cache ca-certificates
    COPY --from=builder /build/target/release/myapp /usr/local/bin/myapp
    RUN adduser -D -u 1001 appuser
    USER appuser
    ENTRYPOINT ["myapp"]
    ```

=== "Python"
    ```dockerfile
    FROM python:3.12-slim AS builder
    WORKDIR /build
    RUN pip install uv               # uv: modern Python package manager (2024)
    COPY pyproject.toml uv.lock ./
    RUN uv sync --frozen --no-dev    # Install only production deps

    FROM python:3.12-slim AS production
    WORKDIR /app
    COPY --from=builder /build/.venv /app/.venv
    COPY src ./src
    RUN useradd -m -u 1001 appuser
    USER appuser
    ENV PATH="/app/.venv/bin:$PATH"
    CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
    ```

---

### 5. Essential Docker Commands

```bash
# ── Images ─────────────────────────────────────────────────
docker build -t myapp:1.0 .              # Build image from Dockerfile in current dir
docker build -t myapp:1.0 -f prod.Dockerfile .  # Specify Dockerfile name
docker images                            # List local images
docker pull python:3.12-slim             # Pull from Docker Hub
docker push myuser/myapp:1.0            # Push to registry
docker rmi myapp:1.0                     # Remove image
docker image prune                       # Remove dangling (untagged) images
docker image prune -a                    # Remove all unused images ⚠️

# ── Containers ──────────────────────────────────────────────
docker run myapp:1.0                     # Run container (foreground)
docker run -d myapp:1.0                 # Detached (background)
docker run -it ubuntu:22.04 bash        # Interactive terminal
docker run --name mycontainer myapp:1.0 # Give it a name
docker run -p 8080:8000 myapp:1.0      # Map host:8080 → container:8000
docker run -e DATABASE_URL=... myapp    # Set environment variable
docker run -v /host/data:/app/data myapp  # Mount host directory
docker run --rm myapp:1.0              # Auto-remove on exit (for one-off tasks)

docker ps                               # Running containers
docker ps -a                            # All containers (including stopped)
docker stop mycontainer                 # Graceful stop (SIGTERM)
docker kill mycontainer                 # Force stop (SIGKILL)
docker start mycontainer                # Start a stopped container
docker restart mycontainer
docker rm mycontainer                   # Remove stopped container
docker container prune                  # Remove all stopped containers

# ── Inspect and Debug ───────────────────────────────────────
docker logs mycontainer                 # Container stdout/stderr
docker logs -f mycontainer             # Follow (stream) logs
docker logs --tail 100 mycontainer     # Last 100 lines
docker exec -it mycontainer bash       # Open shell in running container
docker exec mycontainer ls /app        # Run command in running container
docker inspect mycontainer             # Full JSON metadata
docker stats                            # Live resource usage (CPU, mem, net)
docker top mycontainer                 # Processes inside container

# ── Build optimization ──────────────────────────────────────
docker build --no-cache -t myapp .     # Force rebuild (skip cache)
docker build --target builder -t myapp-dev .  # Build specific stage only
docker buildx build --platform linux/amd64,linux/arm64 -t myapp .  # Multi-arch
```

---

### 6. Docker Compose (v2)

!!! warning "🟡 Legacy — docker-compose v1"
    `docker-compose` (with hyphen) is the Python-based v1 tool. It was deprecated in 2023.  
    **Created:** 2014 · **Deprecated:** July 2023  
    Modern replacement: `docker compose` (no hyphen) — part of Docker CLI since Docker 20.10+.

!!! success "✅ Modern — docker compose v2"
    Use `docker compose` (built into Docker CLI). All examples below use v2 syntax.

Docker Compose defines multi-container applications in a single `docker-compose.yml` file.

```yaml
# docker-compose.yml
# Compose file format 3.x — no explicit "version:" needed in Compose v2

services:
  # ── Web application ───────────────────────────────────────
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production           # Use the production stage from multi-stage build
    image: myapp/api:latest
    restart: unless-stopped        # Auto-restart if container crashes
    ports:
      - "8000:8000"                # host:container
    environment:
      - DATABASE_URL=postgresql://postgres:secret@db:5432/appdb
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy # Wait for DB health check before starting
      cache:
        condition: service_started
    volumes:
      - ./uploads:/app/uploads     # Persist user uploads
    networks:
      - app-network

  # ── PostgreSQL database ───────────────────────────────────
  db:
    image: postgres:16-alpine      # 🟢 PostgreSQL 16 (2023)
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret    # ⚠️ Use secrets in production (see below)
      POSTGRES_DB: appdb
    volumes:
      - postgres-data:/var/lib/postgresql/data  # Named volume = persistent
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # Run on first start
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # ── Redis cache ───────────────────────────────────────────
  cache:
    image: redis:7-alpine          # 🟢 Redis 7 (2021)
    restart: unless-stopped
    command: redis-server --save 60 1 --loglevel warning
    volumes:
      - redis-data:/data
    networks:
      - app-network

volumes:
  postgres-data:    # Named volume — managed by Docker, persists container restarts
  redis-data:

networks:
  app-network:
    driver: bridge
```

**Essential compose commands:**

```bash
# Start / stop
docker compose up                   # Start all services (foreground)
docker compose up -d                # Start detached (background)
docker compose down                 # Stop and remove containers
docker compose down -v              # Also remove volumes ⚠️

# Specific services
docker compose up api               # Start only the api service
docker compose restart api
docker compose stop db

# Logs
docker compose logs -f              # Follow all services
docker compose logs -f api db       # Follow specific services

# Build
docker compose build                # Rebuild all service images
docker compose build api            # Rebuild specific service

# Run one-off commands
docker compose exec api bash        # Shell in running api container
docker compose run --rm api pytest  # Run tests in a fresh container then remove

# Status
docker compose ps                   # Status of all services
```

---

### 7. Volumes and Persistence

Containers are ephemeral — when a container is removed, its filesystem is gone. Volumes provide persistence.

```bash
# Named volumes — managed by Docker, best for databases
docker volume create mydata
docker run -v mydata:/var/lib/data myimage

# Bind mounts — map a host directory into the container
# Fast for development (edit on host, instant effect in container)
docker run -v $(pwd)/src:/app/src myimage

# Anonymous volumes — temporary, removed with container
docker run -v /app/node_modules myimage   # Don't overwrite from host

# Volume management
docker volume ls                    # List volumes
docker volume inspect mydata        # Details
docker volume rm mydata             # Remove volume ⚠️
docker volume prune                 # Remove all unused volumes ⚠️
```

**Development vs. Production mounts:**

```yaml
# Development: bind mount for live code reload
services:
  api:
    volumes:
      - .:/app                     # Entire project → instant reload

# Production: no bind mount — code is baked into image
services:
  api:
    volumes:
      - uploads:/app/uploads       # Only persistent data
```

---

### 8. Security Best Practices

!!! danger "Never Do This in Production"
    - Run containers as root (default if you don't set `USER`)
    - Store secrets in environment variables in compose files committed to git
    - Use `:latest` tags in production (no reproducibility)
    - Build images with `--privileged` unless absolutely necessary

```dockerfile
# ── Non-root user ─────────────────────────────────────────
RUN groupadd -r -g 1001 appgroup && \
    useradd -r -u 1001 -g appgroup appuser
USER appuser

# ── Minimal base image ────────────────────────────────────
# Full images ≈ 1GB attack surface. Smaller = fewer vulnerabilities.
FROM ubuntu:22.04          # 🟡 Large, has unnecessary tools
FROM ubuntu:22.04-slim     # Better
FROM debian:bookworm-slim  # Smaller still
FROM alpine:3.19           # 5MB — good for static binaries
FROM scratch               # Empty — for fully static binaries (Go, Rust)
FROM distroless/python3    # Google's minimal Python (no shell, no package manager)

# ── No secrets in layers ──────────────────────────────────
# WRONG — secret baked into image forever (even if deleted in later layer)
RUN export API_KEY=abc123 && ./setup.sh

# RIGHT — pass at runtime via environment
# docker run -e API_KEY=abc123 myapp
# Or use Docker secrets (Swarm) / Kubernetes Secrets

# ── Scan for vulnerabilities ──────────────────────────────
# After building:
docker scout cves myapp:1.0         # Docker's built-in vulnerability scanner
# Or: trivy image myapp:1.0         # Third-party, often more thorough
```

---

### 9. Image Registries

```bash
# Docker Hub (hub.docker.com) — public registry
docker login                               # Login with Docker Hub account
docker tag myapp:1.0 myusername/myapp:1.0  # Tag for push
docker push myusername/myapp:1.0
docker pull myusername/myapp:1.0

# GitHub Container Registry (ghcr.io) — free for public repos
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker tag myapp:1.0 ghcr.io/username/myapp:1.0
docker push ghcr.io/username/myapp:1.0

# Semantic versioning tags (best practice)
docker tag myapp:1.0 myuser/myapp:1.0.0
docker tag myapp:1.0 myuser/myapp:1.0      # Also tag major.minor
docker tag myapp:1.0 myuser/myapp:latest   # Also tag latest
docker push myuser/myapp --all-tags        # Push all tags at once
```

---

## 📚 Resources

=== "Primary"
    - 📖 **[Docker Official Docs (FREE)](https://docs.docker.com/)** — Comprehensive, well-organized, always current
    - 📺 **[TechWorld with Nana — Docker Tutorial (YouTube, FREE)](https://www.youtube.com/watch?v=3c-iBn73dDE)** — Best full walkthrough, 3 hours, very practical

=== "Supplemental"
    - 📺 **[Fireship — Docker in 100 Seconds (YouTube, FREE)](https://www.youtube.com/watch?v=Gjnup-PuquQ)** — Great for building the mental model in 2 minutes
    - 📖 **[Docker Best Practices — Official Guide (FREE)](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)** — Read this after your first working image

=== "Practice"
    - 🎮 **[Play with Docker (FREE)](https://labs.play-with-docker.com/)** — Browser-based Docker environment, no install needed to start
    - 📖 **[Dive — inspect image layers (FREE tool)](https://github.com/wagoodman/dive)** — Visualize and optimize image layer sizes

---

## 🏗️ Assignments

### Assignment 1 — Containerize Your Own App
Take any application from a previous assignment:

- [ ] Write a `Dockerfile` using an appropriate base image
- [ ] Implement multi-stage build (build stage + production stage)
- [ ] Add a non-root user
- [ ] Add a `HEALTHCHECK` instruction
- [ ] Build and run it — verify it works
- [ ] Check the image size: `docker images`. Then try a smaller base image and measure the difference
- [ ] Push to GitHub Container Registry (ghcr.io)

---

### Assignment 2 — Full Stack Compose Environment
Set up a complete local dev environment with Compose:

- [ ] API service (your choice of language/framework)
- [ ] PostgreSQL database with persistent named volume
- [ ] Redis for caching
- [ ] A `healthcheck` on the database, with `depends_on: condition: service_healthy` for the API
- [ ] An `nginx` reverse proxy service that routes `/api/` to the API and serves a static file at `/`
- [ ] Environment: dev uses bind-mount for live reload; prod uses built image

Run both:
```
docker compose -f docker-compose.yml -f docker-compose.dev.yml up   # Dev
docker compose up                                                     # Prod
```

---

### Assignment 3 — Optimize an Image
Start with a deliberately unoptimized Dockerfile:

```dockerfile
FROM python:3.12
COPY . .
RUN pip install flask requests
CMD ["python", "app.py"]
```

- [ ] Measure initial image size
- [ ] Optimize layer caching order
- [ ] Switch to slim base image
- [ ] Add `.dockerignore` to exclude `__pycache__`, `.git`, tests
- [ ] Add non-root user
- [ ] Use multi-stage if there's a build step
- [ ] Compare: record before/after size and list every change you made

Target: reduce image by at least 60%.

---

## ✅ Milestone Checklist

- [ ] Can explain what a container is vs a VM in one minute without notes
- [ ] Can write a `Dockerfile` from scratch for any language runtime
- [ ] Can implement a multi-stage build that produces a production image
- [ ] Can write a `docker-compose.yml` with 3+ services, volumes, and health checks
- [ ] Can debug a failing container with `docker logs` and `docker exec`
- [ ] Know why running as root inside a container is a security risk
- [ ] Have pushed an image to a container registry
- [ ] All 3 assignments committed to GitHub

---

## 🏆 Milestone Complete!

> **You now package software like a professional.**
>
> Containers are the universal shipping format of modern software. Every cloud platform,
> CI system, and Kubernetes cluster runs containers. You're on the right side of that line.

**Log this in your kanban:** Move `devops/docker` to ✅ Done.

## ➡️ Next Unit

→ [Kubernetes](kubernetes.md)
