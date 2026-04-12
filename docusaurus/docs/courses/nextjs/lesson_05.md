# Lesson 05 — SSG and ISR

> **Course:** Next.js · **Time:** 45 minutes
> **📖 Wiki:** [SSR vs CSR — SSG and ISR](../../domains/web_dev/ssr_csr.md#static-site-generation)
> **🔗 Official Docs:** [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) · [Revalidating](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

---

## 🎯 Learning Objectives

- [ ] Explain SSG (Static Site Generation) and when to use it
- [ ] Pre-build dynamic routes with `generateStaticParams`
- [ ] Implement ISR (Incremental Static Regeneration) with `revalidate`
- [ ] Use on-demand revalidation via Route Handlers

---

## 📖 Concepts

### SSG — Build-Time Pages

Static pages are generated once at `npm run build`. They serve as HTML instantly from a CDN — the fastest possible delivery.

**Use SSG for:** Blog posts, marketing pages, documentation, product listings that rarely change.

```tsx
// app/blog/[slug]/page.tsx

// generateStaticParams — called at BUILD TIME
// Returns all slugs to pre-render
export async function generateStaticParams() {
    const posts = await fetch('https://api.example.com/posts')
        .then(r => r.json()) as Array<{ slug: string }>;

    return posts.map(post => ({ slug: post.slug }));
    // Each { slug } maps to a pre-built /blog/[slug] page
}

// The page component uses force-cache (default) — served from CDN
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await fetch(`https://api.example.com/posts/${params.slug}`)
        .then(r => r.json());
    return <article>...</article>;
}
```

At build time:
- Next.js calls `generateStaticParams` → gets all slugs
- Pre-renders each slug as a static HTML file
- Serves them from CDN — no server required for these pages

### ISR — Stale-While-Revalidate

ISR extends SSG: pages are statically generated but automatically re-generated after a timeout. Old visitors get the cached page instantly; a background job regenerates it.

```tsx
// Option 1: Export revalidate constant from the page/layout
export const revalidate = 3600;  // Re-generate at most once per hour

export default async function BlogPage() {
    const posts = await getPosts();
    return <PostList posts={posts} />;
}

// Option 2: Per-fetch revalidation (more granular)
const posts = await fetch('/api/posts', { next: { revalidate: 3600 } }).then(r => r.json());

// Option 3: Never cache (SSR — new data every request)
export const revalidate = 0;
// or
const data = await fetch('/api/data', { cache: 'no-store' });

// Option 4: Cache indefinitely (pure SSG)
export const revalidate = false;
// or
const data = await fetch('/api/data', { cache: 'force-cache' });
```

### On-Demand Revalidation

Trigger a page rebuild from a webhook (e.g. a CMS posts a webhook when content changes):

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // Verify the request is from your CMS
    const secret = request.headers.get('x-webhook-secret');
    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, tag } = await request.json();

    if (slug) {
        // Revalidate a specific path
        revalidatePath(`/blog/${slug}`);
    }

    if (tag) {
        // Revalidate all pages tagged with this value
        revalidateTag(tag);  // e.g. revalidateTag('posts')
    }

    return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
```

### The Rendering Decision Tree

```
Is the page dynamic (personalised per user)?
  └── Yes → no-store (SSR, fresh per request)

Is the data updated frequently (< 1 min)?
  └── Yes → no-store or low revalidate (10-60 seconds)

Is the data updated occasionally (hourly)?
  └── Yes → ISR with revalidate = 3600

Is the data static or changes rarely?
  └── Yes → SSG with generateStaticParams + force-cache

Is there a CMS that can send webhooks?
  └── Yes → SSG + on-demand revalidation
```

---

## ✅ Milestone Checklist

- [ ] I used `generateStaticParams` to pre-build blog post pages at build time
- [ ] I set `revalidate = 3600` on a page that changes occasionally
- [ ] I created a `/api/revalidate` Route Handler for on-demand revalidation
- [ ] I understand the difference between ISR (timed) and on-demand revalidation

## ➡️ Next Unit

[Lesson 06 — Route Handlers (API Routes)](./lesson_06.md)
