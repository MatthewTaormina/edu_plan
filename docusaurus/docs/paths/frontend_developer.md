# Frontend Developer Path

> **Who this is for:** You want to specialise in the browser — UI, interactivity, and user experience.
> **Goal:** Build production-ready, accessible, performant frontend applications.
> **Time estimate:** 6–8 months (10–15 hrs/week) · **Entry level:** No prior experience needed

---

## 🗺️ Path Overview

```
Phase 1 — Web Foundations        (6–8 weeks)
  HTML Fundamentals
  CSS Fundamentals
  Vanilla JavaScript Fundamentals
      ↓
Phase 2 — Modern Tooling         (3–4 weeks)
  Build Tools & Toolchain
  TypeScript Fundamentals
      ↓
Phase 3 — Styling at Scale       (2–3 weeks)
  Tailwind CSS
      ↓
Phase 4 — Framework (choose one)
  ┌─ React Track   (6–8 weeks) — React Fundamentals → React Advanced
  └─ Angular Track (6–8 weeks) — Angular Fundamentals
      ↓
Phase 5 — SSR                    (3–4 weeks, React track only)
  Next.js
      ↓
Phase 6 — Portfolio Projects
```

---

## Phase 1 — Web Foundations

**Goal:** Understand how browsers parse and render documents. No frameworks yet.

### 📘 [HTML Fundamentals](../courses/html_fundamentals/index.md)
Semantic elements, links, images, tables, forms, accessibility basics.

### 📘 [CSS Fundamentals](../courses/css_fundamentals/index.md)
The cascade, box model, Flexbox, Grid, responsive design, animations.

### 📘 [Vanilla JavaScript Fundamentals](../courses/javascript_fundamentals/index.md)
DOM manipulation, events, fetch, async/await, ES6+ modules.

#### ✅ Phase 1 Checkpoint
- [ ] Built a responsive personal page from scratch (no framework, no Tailwind)
- [ ] Added interactivity with vanilla JS (form validation, dynamic list, local API call)
- [ ] Committed it to GitHub

---

## Phase 2 — Modern Tooling

**Goal:** Set up and understand the modern JavaScript build pipeline.

### 📘 [Build Tools & Toolchain](../courses/build_tools/index.md)
npm, Vite, ESM, tree-shaking, ESLint, Vitest.

### 📘 [TypeScript Fundamentals](../courses/typescript_fundamentals/index.md)
Types, interfaces, generics, utility types, `tsconfig`, TypeScript with the DOM.

#### ✅ Phase 2 Checkpoint
- [ ] Migrated your Phase 1 project to Vite + TypeScript
- [ ] ESLint passes with no errors
- [ ] Written at least one passing Vitest unit test

---

## Phase 3 — Styling at Scale

### 📘 [Tailwind CSS](../courses/tailwind_css/index.md)
Utility-first workflow, responsive variants, dark mode, custom theme, integrating with Vite.

---

## Phase 4A — React Track *(recommended for most roles)*

### 📘 [React Fundamentals](../courses/react_fundamentals/index.md)
Components, props, state, effects, context, custom hooks. Capstone: Reading List Tracker.

### 📘 [React Advanced](../courses/react_advanced/index.md)
Performance, `useReducer`, React Router v6, TanStack Query, Error Boundaries, testing. Capstone: Dashboard.

#### ✅ Phase 4A Checkpoint
- [ ] Multi-page React app with routing, server-state (TanStack Query), and auth context
- [ ] 10+ passing tests with Vitest + Testing Library
- [ ] Deployed to Vercel

---

## Phase 4B — Angular Track *(enterprise / government roles)*

### 📘 [Angular Fundamentals](../courses/angular_fundamentals/index.md)
Standalone components, Signals, services, Router, HttpClient, reactive forms. Capstone: Project Manager.

#### ✅ Phase 4B Checkpoint
- [ ] Multi-page Angular app with router guards, reactive form validation, HTTP integration
- [ ] Deployed to Netlify or Vercel

---

## Phase 5 — SSR with Next.js *(React track only)*

### 📘 [Next.js](../courses/nextjs/index.md)
App Router, server components, data fetching strategies (SSG/ISR/dynamic), Route Handlers, middleware. Capstone: CMS Blog.

---

## Phase 6 — Portfolio Projects

| Project | Skills demonstrated |
|---------|-------------------|
| Personal portfolio | Next.js, SSG, Tailwind, accessibility |
| [P03 — Full Stack App](../projects/p03_fullstack_app.md) | React + API integration |
| Admin dashboard | React Advanced, TanStack Query, auth |

---

## 📚 Wiki References

| Topic | Wiki page |
|-------|-----------|
| HTML & CSS fundamentals | [HTML & CSS](../domains/web_dev/html_css.mdx) |
| JavaScript concepts | [JavaScript Core](../domains/web_dev/javascript_core.md) |
| TypeScript | [TypeScript](../domains/web_dev/typescript.md) |
| React / Angular | [Frontend Frameworks](../domains/web_dev/frontend_frameworks.md) |
| SSR vs CSR | [SSR vs CSR](../domains/web_dev/ssr_csr.md) |
| REST APIs | [REST APIs](../domains/web_dev/rest_api.md) |

---

## 🏁 You're Ready When You Can…

- [ ] Build a fully responsive, accessible webpage from scratch
- [ ] Set up a Vite + TypeScript + React (or Angular) project from the CLI
- [ ] Fetch data from a public API with loading/error states
- [ ] Add client-side routing across multiple pages
- [ ] Manage global state (auth, theme) with Context or Services
- [ ] Write 10+ passing tests
- [ ] Deploy a production build to Vercel, Netlify, or GitHub Pages

---

## ➡️ After This Path

- [Full Stack Developer Path](./fullstack.md) — add a backend, database, and deployment
- [Backend Developer Path](./backend_developer.md) — learn the server side in depth
- [DevOps Engineer Path](./devops.md) — automate, test, and ship reliably
