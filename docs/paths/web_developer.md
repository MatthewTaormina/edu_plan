# 🔵 Web Developer Path

> **Who this is for:** You can write basic code and want to build web apps.
> **Goal:** Build full-featured web applications (frontend + backend).
> **Time estimate:** 6–12 months at 1 hr/day | **Dependencies:** Milestone 2 of Beginner Path (or equivalent JS knowledge)

---

## Dependency Map

```
Beginner Foundations
       ↓
  HTML & CSS  →→→  JavaScript Core  →→→  TypeScript
                          ↓                   ↓
                    Frontend Framework    REST API Design
                          ↓                   ↓
                    Full-Stack App (Project)
                          ↓
                    Databases + Auth
                          ↓
                    Deployment (→ DevOps Path)
```

---

## 🏁 Milestones

### Milestone 1 — HTML & CSS 🏗️
*~2 weeks*

- [ ] [`domains/web_dev/html_css.md`](../domains/web_dev/html_css.md)
  - HTML semantics and document structure
  - CSS box model, flexbox, grid
  - Responsive design basics (mobile-first)
  - Forms

#### Course
- 📺 [The Odin Project — Foundations (FREE)](https://www.theodinproject.com/paths/foundations) — Covers HTML + CSS well

#### Assignment
- Build a personal portfolio page (no JS yet)
- Must be responsive (works on mobile)
- [ ] Commit to GitHub

**🏆 Reward:** You can build any static webpage you see.

---

### Milestone 2 — JavaScript Core ⚡
*~4 weeks*

- [ ] [`domains/web_dev/javascript_core.md`](../domains/web_dev/javascript_core.md)
  - Variables, functions, scope, closures
  - DOM manipulation
  - Events and event listeners
  - Fetch API / Promises / async-await
  - ES6+ features (arrow functions, destructuring, spread)
  - Modules

#### Course
- 📺 [javascript.info (FREE)](https://javascript.info/) — The best free JS reference, read chapters 1–11

#### Assignment
- Add interactivity to your portfolio page
- Build a weather app using a public API (OpenWeatherMap has a free tier)
- [ ] Commit to GitHub

**🏆 Reward:** You can make websites dynamic and talk to APIs.

---

### Milestone 3 — TypeScript 🔷
*~2 weeks*

- [ ] [`domains/web_dev/typescript.md`](../domains/web_dev/typescript.md)
  - Types, interfaces, enums
  - Generics basics
  - TypeScript with DOM
  - tsconfig essentials

#### Resource
- 📺 [TypeScript Handbook (FREE)](https://www.typescriptlang.org/docs/handbook/) — Official, excellent
- 📺 [Matt Pocock's Total TypeScript Tutorials (FREE)](https://www.totaltypescript.com/tutorials) — Practical

**🏆 Reward:** Your JavaScript is now safe and maintainable.

---

### Milestone 4 — Frontend Framework (React) ⚛️
*~4 weeks*

- [ ] [`domains/web_dev/frontend_frameworks.md`](../domains/web_dev/frontend_frameworks.md)
  - Component model
  - Props and state
  - Hooks (useState, useEffect, useContext)
  - Routing (React Router)
  - Basic state management

#### Course
- 📺 [React Official Tutorial (FREE)](https://react.dev/learn) — Start here
- 📺 [Scrimba React Course (FREE tier)](https://scrimba.com/learn/learnreact) — Interactive

#### Assignment
- Build a multi-page React app: a "Reading List" tracker
  - Add/remove books
  - Mark as read/unread
  - Filter and sort
  - Persist with localStorage
- [ ] Commit to GitHub

**🏆 Reward:** You can build real interactive apps people use.

---

### Milestone 5 — Backend & REST APIs 🛠️
*~4 weeks*

- [ ] [`domains/web_dev/rest_api.md`](../domains/web_dev/rest_api.md)
  - HTTP verbs, status codes, headers
  - REST design principles
  - Node.js + Express (or Fastify)
  - Middleware, routing, error handling
  - Input validation
  - Authentication (JWT basics)

#### Course
- 📺 [The Odin Project — NodeJS Path (FREE)](https://www.theodinproject.com/paths/full-stack-javascript) — Excellent, practical

#### Assignment (Project P02)
See [`projects/p02_rest_api.md`](../projects/p02_rest_api.md)
- Build a task management REST API
- [ ] CRUD endpoints for tasks
- [ ] JWT authentication
- [ ] Input validation
- [ ] Hosted on Railway or Render (free tier)

**🏆 Reward:** You can build APIs that real apps can use.

---

### Milestone 6 — Databases 🗄️
*~3 weeks*

- [ ] [`domains/databases/sql_fundamentals.md`](../domains/databases/sql_fundamentals.md)

#### Course
- 📺 [SQLBolt (FREE, interactive)](https://sqlbolt.com/) — 20 lessons, hands-on

Connect your API to a real database (PostgreSQL).

**🏆 Reward:** Your apps can store and retrieve data persistently.

---

### Milestone 7 — Full Stack Integration 🌐
*~4 weeks*

See [`projects/p03_fullstack_app.md`](../projects/p03_fullstack_app.md)

Build a complete full-stack application:
- React frontend
- Node.js/Express backend
- PostgreSQL database
- JWT authentication
- Deployed (frontend on Vercel, backend on Railway)

**🏆 Reward:** 🎉 You are a full-stack developer. You have a deployed app. Put it on your resume.

---

## Optional Extensions

| Topic | Where |
|-------|-------|
| GraphQL | [`domains/web_dev/graphql.md`](../domains/web_dev/graphql.md) |
| Server-side rendering | [`domains/web_dev/ssr_csr.md`](../domains/web_dev/ssr_csr.md) |
| Testing | [`domains/devops/testing.md`](../domains/devops/testing.md) |
| Docker + Deployment | 🟠 [DevOps Path](devops.md) |
