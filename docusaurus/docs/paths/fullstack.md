# Full Stack Developer Path

> **Who this is for:** You want to build and ship complete products — frontend, backend, database, and deployment — independently.
> **Goal:** Design, build, and deploy full-stack applications.
> **Time estimate:** 12–18 months (part-time) · **Entry level:** Complete Beginner Path first

This path **composes** the Frontend Developer and Backend Developer paths. It does not repeat their content — it sequences them, then adds what neither covers alone: databases, architecture, security, and deployment.

---

## 🗺️ Path Overview

```
Stage 1 — Frontend Foundation
  → Complete Frontend Developer Path (Phase 1–4)

Stage 2 — Backend Foundation
  → Complete Backend Developer Path (Stages 1–3)

Stage 3 — Databases

Stage 4 — Auth & Security

Stage 5 — Architecture Thinking

Stage 6 — DevOps Essentials

Stage 7 — Full Stack Capstone
```

---

## Stage 1 — Frontend Foundation

Complete the first four phases of the Frontend Developer path:

📍 [Frontend Developer Path](./frontend_developer.md) — Phases 1–4

**You need:** HTML, CSS, JavaScript, TypeScript, React (or Angular).
You do **not** need Next.js or the portfolio phase before continuing.

#### ✅ Stage 1 Exit Checkpoint
- [ ] Multi-page React (or Angular) app deployed to Vercel/Netlify
- [ ] Can fetch data from an API and handle loading/error states

---

## Stage 2 — Backend Foundation

Complete Stages 1–3 of the Backend Developer path:

📍 [Backend Developer Path](./backend_developer.md) — Stages 1–3

**You need:** Node.js, Express + TypeScript, Zod validation, JWT auth.
You do **not** need the PHP/Laravel optional track unless you specifically want it.

#### ✅ Stage 2 Exit Checkpoint
- [ ] REST API with CRUD, JWT auth, Zod validation, and integration tests
- [ ] API deployed to Railway or Render (free tier)

---

## Stage 3 — Databases 🗄️

*~4 weeks*

| Topic | Wiki |
|-------|------|
| SQL fundamentals | [SQL Fundamentals](../domains/databases/sql_fundamentals.md) |
| Database design | [Database Design](../domains/databases/design.md) |
| NoSQL (overview) | [NoSQL](../domains/databases/nosql.md) |
| Performance | [Performance](../domains/databases/performance.md) |

**Practical:** Connect your Express API (Stage 2) to PostgreSQL using an ORM or query builder.

#### ✅ Stage 3 Exit Checkpoint
- [ ] Express API persists data in PostgreSQL
- [ ] Schema has at least 2 related tables with a foreign key
- [ ] Can write a JOIN query from memory

---

## Stage 4 — Auth & Security 🔐

*~2 weeks*

| Topic | Wiki |
|-------|------|
| Application security | [App Security](../domains/security/appsec.md) |

**Concepts to understand:**
- OWASP Top 10 vulnerabilities
- OAuth2 and OpenID Connect (social login)
- Session vs JWT trade-offs (revisited with depth)
- Password hashing: bcrypt vs Argon2
- HTTPS, CORS, CSP, rate limiting

#### ✅ Stage 4 Exit Checkpoint
- [ ] Can explain each OWASP Top 10 category in one sentence
- [ ] Added role-based access control to your API
- [ ] Set security headers (Helmet.js) and CORS policy

---

## Stage 5 — Architecture Thinking 🏛️

*~2 weeks*

| Topic | Wiki |
|-------|------|
| Architecture patterns | [Architecture Patterns](../domains/cloud/architecture_patterns.md) |

**Questions to be able to answer:**
- When should you NOT use microservices?
- What is the BFF (Backend for Frontend) pattern?
- REST vs GraphQL — when does GraphQL win?
- What does "eventual consistency" mean in practice?
- What is the strangler fig pattern?

---

## Stage 6 — DevOps Essentials 🚀

*~3 weeks* — Pull from the DevOps path:

| Topic | Resource |
|-------|---------|
| Linux CLI basics | [Linux CLI Wiki](../domains/devops/linux_cli.md) |
| Docker + Compose | [Docker Wiki](../domains/devops/docker.md) |
| GitHub Actions CI/CD | [CI/CD Wiki](../domains/devops/ci_cd.md) |

#### ✅ Stage 6 Exit Checkpoint
- [ ] App runs in a Docker container locally
- [ ] GitHub Actions runs tests on every push
- [ ] Deployed to a VPS or managed platform with HTTPS

---

## Stage 7 — Full Stack Capstone 🎯

*~4 weeks* · See [Project P03 — Full Stack App](../projects/p03_fullstack_app.md)

**Deliverables:**
- [ ] React (or Angular) frontend
- [ ] Node.js/Express backend API with PostgreSQL
- [ ] JWT authentication (login, register, protected routes)
- [ ] Dockerized and deployed with HTTPS
- [ ] GitHub Actions CI/CD pipeline
- [ ] Error monitoring (Sentry free tier)
- [ ] README with setup instructions

**🏆 You can build and ship real products. This is portfolio gold.**

---

## ➡️ After This Path

- [DevOps Engineer Path](./devops.md) — infrastructure, Kubernetes, cloud
- [AI Engineer Path](./ai_engineer.md) — integrate LLMs and ML into your apps
