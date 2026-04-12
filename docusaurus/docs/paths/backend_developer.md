# Backend Developer Learning Path

> **Role Goal:** Build server-side APIs, handle authentication, manage files, and deploy services that power web and mobile applications.
> **Estimated time:** 8–12 months (part-time, 10–15 hrs/week) · **Difficulty:** Intermediate

---

## 🗺️ Path Overview

```
Stage 1: Core JavaScript (prerequisite)
    ↓
Stage 2: Node.js Runtime
    ↓
Stage 3: REST APIs with Express
    ↓
Stage 4: PHP & Server-Side Rendering (optional track)
    ↓
Stage 5: Professional PHP with Laravel (optional track)
    ↓
Stage 6: Tooling & Deployment
```

---

## Stage 1 — JavaScript Prerequisite

> If you're coming from another language and know programming fundamentals, you can skim this faster. If JavaScript is new to you, don't rush it.

| Course | Time | Why it matters |
|--------|------|----------------|
| [Vanilla JavaScript Fundamentals](../courses/javascript_fundamentals/index.md) | 10–12 hrs | Node.js IS JavaScript — you need the language before the runtime |
| [Build Tools & Toolchain](../courses/build_tools/index.md) | 5–6 hrs | npm, TypeScript, module systems used throughout backend work |

---

## Stage 2 — Node.js Runtime

Understanding the runtime before the framework prevents framework dependency and makes debugging much easier.

| Course | Time | Key Skills |
|--------|------|-----------|
| [Node.js Fundamentals](../courses/nodejs_fundamentals/index.md) | 8–10 hrs | Event loop, fs/streams, HTTP module, async/await |

### ✅ Stage 2 Checkpoint

You should be able to:
- [ ] Explain the event loop without looking it up
- [ ] Write a file processor using streams (no `readFileSync`)
- [ ] Build a raw HTTP server that handles multiple routes
- [ ] Parse CLI args with `parseArgs` and add graceful shutdown

---

## Stage 3 — REST APIs with Express

| Course | Time | Key Skills |
|--------|------|-----------|
| [Express API](../courses/express_api/index.md) | 10–12 hrs | TypeScript setup, middleware, auth, Zod validation, file uploads, testing |

### ✅ Stage 3 Checkpoint

You can call yourself a junior backend developer when you can:
- [ ] Build a REST API with full CRUD and JWT auth
- [ ] Validate every input with Zod
- [ ] Handle errors consistently (no unhandled promise rejections)
- [ ] Write integration tests with ≥ 70% coverage

---

## Stage 4 — PHP Track (Optional)

> **When to take this track:**
> - Job postings you're targeting require PHP or WordPress
> - You're building on a shared hosting environment (cPanel/Hostinger/etc.)
> - You're joining a team that uses Laravel

PHP powers ~77% of websites. Even Node.js-focused developers benefit from reading PHP code.

| Course | Time | Key Skills |
|--------|------|-----------|
| [PHP & Server-Side Rendering](../courses/php_ssr/index.md) | 8–10 hrs | Templates, sessions, forms, CSRF, file uploads |
| [Laravel Fundamentals](../courses/laravel_fundamentals/index.md) | 10–12 hrs | MVC, routing, Blade, Eloquent, Breeze auth |

### ✅ Stage 4 Checkpoint

- [ ] I can build a PHP site without a framework (flat-file blog)
- [ ] I understand the MVC pattern from the ground up
- [ ] I use `$fillable` and `with()` eager loading in Eloquent
- [ ] Auth-protected routes return 403 if user doesn't own the resource

---

## Stage 5 — Tooling & Deployment

> These aren't courses yet — they're reference skills to develop alongside your projects.

| Topic | Resource |
|-------|---------|
| Git & version control | [Git Fundamentals](../domains/devops/git_workflow.md) |
| Linux server basics | [Linux CLI](../domains/devops/index.md) |
| Docker containers | [Docker Fundamentals](../domains/devops/docker.mdx) |
| Environment & secrets | Lesson 05 of Node.js Fundamentals |
| CI/CD basics | Coming soon |

---

## 📚 Backend Reference (Wiki)

These wiki pages are cross-linked from lessons. Bookmark them:

| Topic | Page |
|-------|------|
| Node.js runtime & event loop | [domains/web_dev/nodejs.md](../domains/web_dev/nodejs.md) |
| HTTP servers & middleware | [domains/web_dev/http_server.md](../domains/web_dev/http_server.md) |
| REST API design | [domains/web_dev/rest_api.md](../domains/web_dev/rest_api.md) |

---

## 🏆 Path Complete When...

A backend developer on this path can:
- [ ] Build and deploy a production REST API with JWT auth, Zod validation, and file uploads
- [ ] Write tests that cover critical paths and edge cases
- [ ] Gracefully handle startup failures and OS signals
- [ ] Explain trade-offs: Express vs Fastify, JWT vs sessions, REST vs GraphQL

## ➡️ Continue

- [Full Stack Path](./fullstack.md) — Connect your API to a React or Next.js frontend
- [Frontend Engineer Path](./frontend_developer.md) — Deep dive into the browser side
