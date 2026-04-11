# 🌐 Web Development Domain Index

> Everything needed to build modern web applications — frontend, backend, and APIs.

---

## Units in This Domain

| Unit | Topic | Estimated Time | Status |
|------|-------|---------------|--------|
| [`html_css.md`](html_css.md) | Structure, styles, layout, responsive | 2 weeks | 📋 Planned |
| [`javascript_core.md`](javascript_core.md) | JS language, DOM, async, ES6+ | 4 weeks | 📋 Planned |
| [`typescript.md`](typescript.md) | Type system, interfaces, generics | 2 weeks | 📋 Planned |
| [`frontend_frameworks.md`](frontend_frameworks.md) | React (primary), Vue/Svelte (reference) | 4 weeks | 📋 Planned |
| [`rest_api.md`](rest_api.md) | HTTP verbs, REST design, Node/Express | 4 weeks | 📋 Planned |
| [`graphql.md`](graphql.md) | Schema, queries, mutations, subscriptions | 2 weeks | 📋 Planned |
| [`ssr_csr.md`](ssr_csr.md) | Rendering strategies, Next.js, edge | 2 weeks | 📋 Planned |
| [`auth.md`](auth.md) | Sessions, JWT, OAuth2, OIDC | 2 weeks | 📋 Planned |
| [`testing_web.md`](testing_web.md) | Unit, integration, E2E testing | 2 weeks | 📋 Planned |

---

## Dependency Order

```
html_css
    ↓
javascript_core
    ↓
typescript ──────────────────────────────────┐
    ↓                                         ↓
frontend_frameworks                       rest_api
    ↓                                         ↓
ssr_csr (Next.js)                          graphql
    ↓                                         ↓
auth ←─────────────────────────────────────/
    ↓
testing_web
```

---

## Language Choices

This domain primarily uses **JavaScript/TypeScript**. Notes on alternatives:

| Alternative | Notes |
|-------------|-------|
| Python (FastAPI) | Great for APIs, link to languages domain |
| Rust (Axum) | See systems path for backend Rust |
| PHP (Laravel) | See resources for PHP-specific path |
| Java/Kotlin (Spring) | Enterprise path — similar REST concepts apply |
| C# (.NET) | Similar to Java path — REST architecture is transferable |

The core concepts (REST design, HTTP, auth) are **language-agnostic**. Learn them in JS/TS, then apply in any language.
