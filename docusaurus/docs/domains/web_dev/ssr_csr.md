# SSR vs CSR — Rendering Strategies

> **Status:** 🟢 Modern — SSR/SSG are standard in production frontend architecture.

This page explains the four major frontend rendering strategies: CSR, SSR, SSG, and ISR — when to use each, how they affect performance and SEO, and which meta-frameworks implement them.

> **Prerequisite:** [Frontend Frameworks](./frontend_frameworks.md)
> **Course:** [Next.js](../../courses/nextjs/index.md) — covers SSR and SSG in practice.

---

## The Four Strategies

### CSR — Client-Side Rendering

The server sends a near-empty HTML shell. JavaScript downloads, runs, fetches data, and builds the DOM entirely in the browser.

```
Browser          Server
──────           ──────
GET /page   ──►  HTML: <html><body><div id="root"></div>
                       <script src="app.js"></script></body>
◄──────────     ]
Load app.js ───► (download)
Run JS      →    (builds DOM in browser)
fetch /api  ──►  { "data": [...] }
◄───────────
Render content
```

**Characteristics:**
- First paint is slow (blank page until JS runs)
- Subsequent navigation is instant (no server round-trip)
- Content not visible to search engine crawlers without JS execution
- Simple to deploy (any static file host)

**Use when:** Dashboards, admin panels, authenticated apps — where SEO doesn't matter.

---

### SSR — Server-Side Rendering

The server runs the framework's rendering logic for every request, producing a full HTML page. The browser receives real HTML that is immediately visible, then JavaScript "hydrates" it (attaches event listeners).

```
Browser          Server (Node.js)
──────           ────────────────
GET /page   ──►  1. Fetch data from DB/API
                 2. Run React/Angular in Node
                 3. Produce full HTML
◄───────────     HTML: <html>...(full page)...</html>
Paint page  ←    (instant — real HTML)
Load JS     →    (downloads in background)
Hydrate     →    (event listeners attached)
```

**Characteristics:**
- Fast First Contentful Paint (FCP) — user sees real content immediately
- Content crawlable without JavaScript
- Server must handle every request (infrastructure cost)
- State must be carefully managed between server and client

**Use when:** Content-heavy public pages, e-commerce, news sites — where SEO is critical.

---

### SSG — Static Site Generation

HTML is generated at **build time** for every page. The result is a folder of static files served directly from a CDN.

```
Build time (CI/CD):
  1. Fetch all data
  2. Render ALL pages to HTML files
  3. Deploy static files to CDN

Request time:
  Browser → CDN edge → instant HTML response (no server processing)
```

**Characteristics:**
- Fastest possible delivery (CDN edge, no server processing)
- Cheapest to host
- Pages are stale between builds
- Impractical for millions of unique pages or user-specific content

**Use when:** Blogs, documentation, marketing pages — content changes infrequently.

---

### ISR — Incremental Static Regeneration

A hybrid between SSG and SSR. Pages are statically generated, but each page has a **revalidation window**. After that window expires, the next request triggers a background regeneration.

```
Request 1   → Serve cached static HTML instantly
Request 2   → (after TTL) Serve cached HTML, trigger background regen
Request 3   → Serve freshly regenerated HTML
```

**Characteristics:**
- Near-instant delivery from cache
- Content stays fresh without rebuilding the entire site
- Currently only in Next.js (`revalidate` option)

**Use when:** Next.js apps where content changes every few minutes to hours (product pages, news articles).

---

## Performance Metrics Impact

| Metric | CSR | SSR | SSG | ISR |
|--------|-----|-----|-----|-----|
| **FCP** (First Contentful Paint) | ❌ Slow | ✅ Fast | ✅ Fast | ✅ Fast |
| **TTI** (Time to Interactive) | ❌ Slow | ⚠️ Moderate | ✅ Fast | ✅ Fast |
| **SEO** | ❌ Requires JS | ✅ Excellent | ✅ Excellent | ✅ Excellent |
| **Personalisation** | ✅ Easy | ✅ Easy | ❌ Build-time only | ⚠️ Limited |
| **Infrastructure cost** | ✅ Low | ❌ High | ✅ Very low | ✅ Low |
| **Content freshness** | ✅ Always fresh | ✅ Always fresh | ❌ Build-time only | ✅ Per-interval |

---

## Hydration

Hydration is the process of attaching JavaScript event listeners to server-rendered HTML so it becomes interactive.

```
Server sends:   <button id="btn">Click me</button>

Browser hydrates:
  document.querySelector('#btn').addEventListener('click', handler)
  // Now the button is interactive
```

**Hydration problems:**
- **Hydration mismatch**: The server-rendered HTML differs from what the client-side JS would generate. React/Next.js will log a warning and re-render from scratch.
- **Full-page hydration cost**: Large SSR apps ship all their JS, which must parse and execute before any interaction works — defeating some SSR performance gains.

**Partial Hydration / Islands Architecture:**
Modern approaches like Astro's Island Architecture only hydrate interactive components, leaving static areas as plain HTML.

---

## Framework Support Matrix

| Rendering Strategy | Next.js | Angular | Nuxt.js | SvelteKit | Remix |
|-------------------|---------|---------|---------|-----------|-------|
| CSR | ✅ | ✅ | ✅ | ✅ | ✅ |
| SSR | ✅ | ✅ (Universal) | ✅ | ✅ | ✅ |
| SSG | ✅ | ✅ | ✅ | ✅ | ⚠️ Limited |
| ISR | ✅ | ❌ | ✅ | ❌ | ❌ |
| Streaming SSR | ✅ (React Suspense) | ✅ (v17+) | ✅ | ✅ | ✅ |

---

## Choosing a Strategy

```
Is this page the same for all users?
│
├── YES → Is the content updated often?
│         ├── RARELY (blog, docs)   → SSG
│         ├── HOURLY (news, prices) → ISR
│         └── REAL-TIME (live data) → SSR
│
└── NO → Does SEO matter?
          ├── YES (product page, marketing) → SSR with personalisation tokens
          └── NO (dashboard, admin, logged-in) → CSR
```

---

## 📚 Resources

=== "Primary"
    - [Next.js Docs: Rendering](https://nextjs.org/docs/app/building-your-application/rendering) — SSR vs SSG vs ISR in practice
    - [web.dev: Rendering on the Web](https://web.dev/articles/rendering-on-the-web) — comprehensive guide from Google

=== "Supplemental"
    - [Patterns.dev: Rendering Patterns](https://www.patterns.dev/vanilla/rendering-patterns/) — visual deep-dive
