# 🔴 Full Stack Path

> **Who this is for:** You want to build complete products end-to-end.
> **Goal:** Design, build, and ship full-stack applications independently.
> **Time estimate:** 10–16 months | **Dependencies:** Beginner Path + choice of language

This path **combines** the Web Developer and DevOps paths with an emphasis on architecture and product thinking.

---

## Dependency Map

```
Beginner Path
      ↓
Web Developer Path (Milestones 1–5)
      ↓
Databases (SQL + NoSQL)             DevOps (Docker + CI/CD)
      ↓                                      ↓
Architecture Patterns ←──────────────────────┘
      ↓
Auth & Security
      ↓
Full Stack Projects (p03, p04, p05)
      ↓
Cloud Deployment
      ↓
Monitoring + Reliability
```

---

## What's Different From Web Developer Path

The Web Developer path teaches you the **skills**. The Full Stack path teaches you to **combine them into products** with:

- Architecture decision making (REST vs GraphQL, SSR vs CSR)
- Multiple database types (SQL + NoSQL)
- Real auth systems (OAuth2, sessions, JWT)
- Containerized deployment
- Observability (logs, metrics, errors)

---

## 🏁 Milestones

### Phase 1 — Complete Web Developer Path Milestones 1–5
→ [`paths/web_developer.md`](web_developer.md) Milestones 1–5

### Phase 2 — Architecture Thinking 🏛️
*~2 weeks*

- [ ] [`domains/cloud/architecture_patterns.md`](../domains/cloud/architecture_patterns.md)
  - Monolith vs microservices (and when to use each)
  - Event-driven architecture
  - Serverless trade-offs
  - CAP theorem basics
  - API gateway pattern
  - BFF (Backend for Frontend) pattern

#### Research Questions 🔍
- When should you NOT use microservices?
- What is the strangler fig pattern and when is it used?
- What does "eventual consistency" mean in practice?

### Phase 3 — Databases (SQL + NoSQL) 🗄️
*~4 weeks*

- [ ] [`domains/databases/sql_fundamentals.md`](../domains/databases/sql_fundamentals.md)
- [ ] [`domains/databases/nosql.md`](../domains/databases/nosql.md)
- [ ] [`domains/databases/design.md`](../domains/databases/design.md)
- [ ] [`domains/databases/performance.md`](../domains/databases/performance.md)

### Phase 4 — Auth & Security 🔐
*~2 weeks*

- [ ] [`domains/security/appsec.md`](../domains/security/appsec.md)
  - OWASP Top 10
  - Session management vs JWT
  - OAuth2 and OpenID Connect
  - Password hashing (bcrypt, argon2)
  - HTTPS, CORS, CSP

### Phase 5 — DevOps Mini Path 🚀
Complete DevOps Milestones 1, 3, 6:
- Linux CLI basics
- Docker + Compose
- GitHub Actions CI/CD

### Phase 6 — Full Stack Capstone 🎯
See [`projects/p03_fullstack_app.md`](../projects/p03_fullstack_app.md)

Deliverables:
- [ ] Frontend (React/Next.js)
- [ ] Backend API (Node/Express or similar)
- [ ] Database (PostgreSQL + Redis for caching)
- [ ] Authentication
- [ ] Dockerized and deployed
- [ ] CI/CD pipeline
- [ ] Error monitoring (Sentry free tier)

**🏆 Reward: 🎉 You can build and ship real products. This is portfolio gold.**
