# CI/CD

**Domain:** DevOps · **Time Estimate:** 2 weeks

> **Tool:** GitHub Actions · **Introduced:** 2019 · **Latest:** N/A (SaaS, continuously updated) · **Deprecated:** N/A · **Status:** 🟢 Modern — primary recommendation for GitHub-hosted projects  
> **Tool:** GitLab CI/CD · **Introduced:** 2015 · **Latest:** 17.x (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — primary recommendation for GitLab-hosted or self-hosted  
> **Tool:** Jenkins · **Introduced:** 2011 · **Latest:** 2.x (actively maintained) · **Deprecated:** N/A · **Status:** 🟡 Legacy — widely deployed in enterprises; new projects should prefer GitHub Actions/GitLab CI

> **Prerequisites:** [Git Workflow](git_workflow.md), [Docker](docker.md)  
> **Who needs this:** Anyone shipping software. CI/CD is how professional teams move fast without breaking things — automated builds, tests, and deployments on every commit.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain what CI and CD mean and why they matter
- [ ] Write a GitHub Actions workflow that builds, tests, and lints on every push
- [ ] Set up a CD pipeline that deploys on merge to `main`
- [ ] Store secrets safely in a CI environment
- [ ] Cache dependencies to speed up pipeline runs
- [ ] Read and interpret a failing pipeline to find the cause
- [ ] Understand build matrices (test against multiple versions/platforms)
- [ ] Write a basic GitLab CI equivalent for comparison

---

## 📖 Concepts

### 1. What CI/CD Means

**Continuous Integration (CI):** Every code change is automatically built and tested. If it breaks, the team is notified immediately instead of days later.

**Continuous Delivery (CD):** Every passing build is automatically deployable (a button push away from production).

**Continuous Deployment (CD):** Every passing build is automatically deployed to production with no human step.

```
Code push
    │
    ▼
┌──────────────────────────────────────────────────────┐
│  CI Pipeline                                         │
│  ① Checkout code                                    │
│  ② Install dependencies          (cached)           │
│  ③ Lint / type-check                                │
│  ④ Run unit tests                                   │
│  ⑤ Run integration tests                           │
│  ⑥ Build artifact / image                          │
│  ⑦ Security scan                                    │
└──────────────┬───────────────────────────────────────┘
               │  All steps pass? ✅
               ▼
┌──────────────────────────────────────────────────────┐
│  CD Pipeline                                         │
│  ⑧ Push image to registry                          │
│  ⑨ Deploy to staging            (auto)             │
│  ⑩ Run smoke tests on staging                      │
│  ⑪ Deploy to production         (auto or approval) │
└──────────────────────────────────────────────────────┘
```

**Why this matters:** Without CI/CD, integration bugs compound over time. With it, broken code is caught in minutes, not weeks.

---

### 2. GitHub Actions — Core Concepts

> **Tool:** GitHub Actions · **Introduced:** 2019 · **Deprecated:** N/A · **Status:** 🟢 Modern

**Vocabulary:**

```
Workflow   A YAML file in .github/workflows/ that defines automation.
           Triggered by events (push, PR, schedule, manual).

Event      What triggers the workflow.
           Examples: push, pull_request, schedule, workflow_dispatch

Job        A unit of work that runs on a runner (a virtual machine).
           Jobs run in parallel by default. Can depend on each other.

Step       A single task within a job: run a command or use an action.

Action     A reusable package of steps. From the GitHub Marketplace
           or your own repo. e.g., actions/checkout, docker/build-push-action

Runner     The VM that executes the job.
           GitHub-hosted: ubuntu-latest, windows-latest, macos-latest
           Self-hosted: your own server
```

---

### 3. A Real CI Workflow

Start with this and build from here — it covers 90% of real-world needs.

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]       # Run on push to these branches
  pull_request:
    branches: [main]                # Run on PRs targeting main

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest          # GitHub-hosted Ubuntu runner

    strategy:
      matrix:
        python-version: ["3.11", "3.12"]   # Run job for each version

    steps:
      # ── Checkout ───────────────────────────────────────────
      - name: Checkout code
        uses: actions/checkout@v4           # v4 introduced 2023
        # ↑ Always pin actions to a major version minimum

      # ── Setup runtime ──────────────────────────────────────
      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}

      # ── Cache dependencies ─────────────────────────────────
      - name: Cache pip packages
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('requirements*.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-

      # ── Install ────────────────────────────────────────────
      - name: Install dependencies
        run: |
          pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      # ── Lint & type-check ──────────────────────────────────
      - name: Lint with ruff
        run: ruff check .                  # ruff: introduced 2022, modern Python linter

      - name: Type-check with mypy
        run: mypy src/

      # ── Test ───────────────────────────────────────────────
      - name: Run tests
        run: pytest --cov=src --cov-report=xml -v

      - name: Upload coverage report
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage.xml
```

---

### 4. A CD Workflow — Build and Push Docker Image

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]               # Only deploy on merge to main

# Prevent concurrent deployments
concurrency:
  group: deploy-production
  cancel-in-progress: false        # Don't cancel a running deploy

jobs:
  # ── Build & push image ─────────────────────────────────────
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write              # Needed to push to GHCR

    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}

    steps:
      - uses: actions/checkout@v4

      # Docker layer caching (BuildKit)
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3    # BuildKit — introduced 2019, default 2023

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}  # Auto-provided — no setup needed

      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha,prefix=,format=short       # git-sha tag (e.g. a1b2c3d)
            type=raw,value=latest               # also tag as latest

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha                  # GitHub Actions cache for layers
          cache-to: type=gha,mode=max

  # ── Deploy ─────────────────────────────────────────────────
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build                               # Wait for build job
    environment: production                    # Requires approval if configured

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull ghcr.io/${{ github.repository }}:latest
            docker compose pull
            docker compose up -d --no-deps api
            docker image prune -f
```

---

### 5. Secrets and Environment Variables

!!! danger "Never Hardcode Secrets"
    API keys, passwords, and tokens hardcoded in workflow files are **public** — GitHub scans for them and will warn you, but the exposure already happened.

```yaml
# Using secrets (set in: repo → Settings → Secrets and variables → Actions)
- name: Deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}    # From repo secrets
    API_KEY: ${{ secrets.API_KEY }}
    NODE_ENV: production                         # Non-secret: inline fine

# Built-in secrets (always available, no setup):
${{ secrets.GITHUB_TOKEN }}     # Auth token for the repo — auto-expires per run
${{ github.sha }}               # Full commit hash
${{ github.ref_name }}          # Branch or tag name
${{ github.actor }}             # User who triggered the run
${{ github.repository }}        # "owner/repo"
```

**Environments — add approval gates:**
```yaml
# In the job definition:
environment:
  name: production
  url: https://myapp.com

# Then in GitHub: Settings → Environments → production → Required reviewers
# Now the job pauses and waits for a human approval before running
```

---

### 6. Workflow Triggers (Events)

```yaml
on:
  # Push to specific branches
  push:
    branches: [main, "release/*"]
    paths:                         # Only trigger if these files changed
      - "src/**"
      - "requirements*.txt"
    paths-ignore:
      - "docs/**"                  # Skip if only docs changed

  # Pull request events
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main]

  # On a schedule (cron syntax)
  schedule:
    - cron: "0 2 * * 1"           # Every Monday at 2:00 AM UTC

  # Manual trigger from GitHub UI
  workflow_dispatch:
    inputs:
      environment:
        description: "Which environment to deploy to"
        required: true
        default: staging
        type: choice
        options: [staging, production]

  # When another workflow completes
  workflow_run:
    workflows: ["CI"]
    types: [completed]
    branches: [main]
```

---

### 7. Caching — Keeping Pipelines Fast

Without caching, installing 50 npm packages takes 60 seconds every run. With caching, it takes 3.

```yaml
# Node.js / npm cache
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm                     # Built-in cache shortcut for npm/yarn/pnpm

# Manual cache for anything else
- uses: actions/cache@v4
  with:
    path: |
      ~/.cargo/registry
      ~/.cargo/git
      target/
    key: ${{ runner.os }}-cargo-${{ hashFiles('Cargo.lock') }}
    restore-keys: |
      ${{ runner.os }}-cargo-

# Docker layer cache
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha           # Read layers from GHA cache
    cache-to: type=gha,mode=max    # Write layers to GHA cache
```

**Cache invalidation:** The `key` includes a hash of the lockfile (`Cargo.lock`, `package-lock.json`, `requirements.txt`). If the file changes, cache misses → fresh install → new cache saved.

---

### 8. Build Matrix — Test Across Versions and Platforms

```yaml
jobs:
  test:
    strategy:
      fail-fast: false             # Don't cancel other matrix jobs if one fails
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
        # Creates 9 jobs: 3 OS × 3 Node versions

    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test

    # Override specific combinations
    include:
      - os: ubuntu-latest
        node: 22
        coverage: true             # Extra variable for this combo

    # Skip specific combinations
    exclude:
      - os: macos-latest
        node: 18
```

---

### 9. GitLab CI/CD — Equivalent for Comparison

!!! note "🔵 Foundation Concept"
    GitHub Actions and GitLab CI use different YAML structures but the same mental model: events → jobs → steps. Learning one makes the other trivial to pick up.

> **Tool:** GitLab CI/CD · **Introduced:** 2015 · **Latest:** 17.x (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern

```yaml
# .gitlab-ci.yml

# Stages run in order; jobs within a stage run in parallel
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

# Reusable template (GitLab's equivalent of "uses" / composite actions)
.python-setup: &python-setup
  image: python:3.12-slim
  before_script:
    - pip install -r requirements.txt -r requirements-dev.txt
  cache:
    key: "$CI_COMMIT_REF_SLUG"
    paths:
      - .pip-cache/

# ── Test stage ────────────────────────────────────────────
lint:
  stage: test
  <<: *python-setup
  script:
    - ruff check .
    - mypy src/

test:
  stage: test
  <<: *python-setup
  script:
    - pytest --cov=src --cov-report=xml
  coverage: '/TOTAL.*\s(\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

# ── Build stage ───────────────────────────────────────────
build-image:
  stage: build
  image: docker:26
  services:
    - docker:26-dind               # Docker-in-Docker
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $DOCKER_IMAGE .
    - docker push $DOCKER_IMAGE
  only:
    - main

# ── Deploy stage ──────────────────────────────────────────
deploy-production:
  stage: deploy
  image: alpine
  environment:
    name: production
    url: https://myapp.com
  when: manual                     # Requires human click to proceed
  script:
    - apk add openssh-client
    - ssh deploy@$SERVER_HOST "docker pull $DOCKER_IMAGE && docker compose up -d"
  only:
    - main
```

---

### 10. Legacy CI — Jenkins

!!! warning "🟡 Legacy Tool"
    **Jenkins** · **Introduced:** 2011 (as Hudson 2005) · **Latest:** 2.x (actively maintained, 2024) · **Deprecated:** N/A (maintained, but declining adoption for new projects)  
    Include here because: you will encounter Jenkins in enterprise environments and older devops setups.  
    Consider Jenkins if: self-hosted with a complex plugin ecosystem; on-prem requirements; no GitHub/GitLab.  
    **Modern alternative:** GitHub Actions (cloud-hosted) or GitLab CI (self-hosted). Both support Linux and Windows runners natively.

```groovy
// Jenkinsfile (Declarative Pipeline — introduced 2016, preferred over Scripted)
pipeline {
    agent any                      // Run on any available agent

    environment {
        IMAGE_NAME = "myapp"
        REGISTRY = credentials('docker-registry')  // Jenkins credential store
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Test') {
            steps {
                sh 'pip install -r requirements.txt'
                sh 'pytest --junitxml=test-results.xml'
            }
            post {
                always {
                    junit 'test-results.xml'   // Publish test report
                }
            }
        }

        stage('Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${GIT_COMMIT} ."
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sh "docker push ${IMAGE_NAME}:${GIT_COMMIT}"
            }
        }
    }

    post {
        failure {
            mail to: 'team@example.com',
                 subject: "Build Failed: ${env.JOB_NAME}",
                 body: "See ${env.BUILD_URL}"
        }
    }
}
```

---

## 📚 Resources

=== "Primary"
    - 📖 **[GitHub Actions Docs (FREE)](https://docs.github.com/en/actions)** — Official, comprehensive, searchable — the first place to look
    - 📺 **[TechWorld with Nana — GitHub Actions (YouTube, FREE)](https://www.youtube.com/watch?v=R8_veQiYBjI)** — Best practical walkthrough, covers real deployment patterns

=== "Supplemental"
    - 📖 **[GitLab CI/CD Docs (FREE)](https://docs.gitlab.com/ee/ci/)** — Equivalent reference for GitLab
    - 🌐 **[GitHub Marketplace — Actions (FREE)](https://github.com/marketplace?type=actions)** — Browse community actions before writing your own

=== "Practice"
    - 🎮 **Start simple:** Fork any project and add a `.github/workflows/ci.yml` that runs its test suite — this is the most effective practice
    - 📺 **[Fireship — GitHub Actions in 100 Seconds (YouTube, FREE)](https://www.youtube.com/watch?v=eB0nUzAI7M8)**

---

## 🏗️ Assignments

### Assignment 1 — Full CI Pipeline
For one of your projects from previous units:

- [ ] Create `.github/workflows/ci.yml`
- [ ] Trigger on push to `main` and pull requests
- [ ] Steps: checkout → cache → install → lint → type-check → test
- [ ] Add a build matrix: at least 2 runtime versions
- [ ] Upload test results or coverage as an artifact
- [ ] Verify: push a commit that breaks a test — confirm the pipeline goes red
- [ ] Fix it — confirm it goes green

---

### Assignment 2 — Build and Deploy Pipeline
Extend Assignment 1 with a CD step:

- [ ] Add a `deploy` job that runs after `test` passes, only on `main`
- [ ] Build a Docker image and push to GHCR (or Docker Hub)
- [ ] Tag the image with the git SHA
- [ ] Add a production environment with a manual approval gate
- [ ] Use at least 2 repository secrets
- [ ] Add Docker layer caching with `type=gha`
- [ ] Measure: time without caching vs. with caching

---

### Assignment 3 — Write a Reusable Workflow
Create a shared workflow your other repos could call:

- [ ] Create `.github/workflows/reusable-python-ci.yml`
- [ ] Accept inputs: `python-version`, `test-command`, `lint-command`
- [ ] Use `workflow_call` trigger so other workflows can call it
- [ ] Call it from a second workflow file in the same repo
- [ ] Document inputs and usage in a comment block at the top of the file

---

## ✅ Milestone Checklist

- [ ] Can write a CI workflow from scratch without referencing docs
- [ ] Can explain what triggers a workflow and how jobs relate to each other
- [ ] Can debug a failing pipeline: read logs, identify failing step, reproduce locally
- [ ] Have deployed at least one project via a CD pipeline (image push or SSH deploy)
- [ ] Know how to store and use secrets safely in GitHub Actions
- [ ] Can set up dependency caching and explain why the cache key includes a lockfile hash
- [ ] All 3 assignments committed to GitHub

---

## 🏆 Milestone Complete!

> **Your code ships itself now.**
>
> CI/CD is what separates "it works on my machine" from "it works in production."
> Every commit you push is now automatically tested, built, and deployable.

**Log this in your kanban:** Move `devops/ci_cd` to ✅ Done.

## ➡️ Next Unit

→ [Kubernetes](kubernetes.md)
