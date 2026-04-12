# Lesson 03 — File-Based Routing — Layouts, Loading, Error

> **Course:** Next.js · **Time:** 45 minutes
> **🔗 Official Docs:** [Routing](https://nextjs.org/docs/app/building-your-application/routing) · [Layouts](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates)

---

## 🎯 Learning Objectives

- [ ] Create dynamic routes with `[param]` and catch-all `[...slug]` segments
- [ ] Nest layouts for section-specific chrome
- [ ] Add `loading.tsx` for automatic Suspense fallbacks
- [ ] Add `error.tsx` as an automatic Error Boundary
- [ ] Use `notFound()` to render 404 pages

---

## 📖 Concepts

### Dynamic Segments

```text
app/
├── blog/
│   ├── page.tsx                     → /blog
│   ├── [slug]/
│   │   └── page.tsx                 → /blog/my-post
│   └── [slug]/comments/[id]/
│       └── page.tsx                 → /blog/my-post/comments/42
├── shop/
│   └── [...categories]/
│       └── page.tsx                 → /shop/any/nested/path
└── docs/
    └── [[...slug]]/
        └── page.tsx                 → /docs OR /docs/any/path (optional catch-all)
```

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';

interface Props {
    params: { slug: string };
}

async function getPost(slug: string) {
    const res = await fetch(`https://api.example.com/posts/${slug}`, {
        next: { revalidate: 600 }
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function BlogPostPage({ params }: Props) {
    const post = await getPost(params.slug);

    if (!post) notFound();  // Renders not-found.tsx

    return (
        <article>
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
    );
}
```

### Nested Layouts

```tsx
// app/blog/layout.tsx — only wraps /blog/* routes
import Link from 'next/link';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-8 max-w-6xl mx-auto">
            {/* Sidebar persists across all blog routes */}
            <aside className="w-64 shrink-0">
                <nav className="sticky top-24 space-y-1">
                    <Link href="/blog" className="block py-2 text-sm font-medium hover:text-blue-600">
                        All Posts
                    </Link>
                    <Link href="/blog?tag=react" className="block py-2 text-sm hover:text-blue-600">
                        React
                    </Link>
                    <Link href="/blog?tag=typescript" className="block py-2 text-sm hover:text-blue-600">
                        TypeScript
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    );
}
```

### `loading.tsx` — Automatic Suspense Fallback

When a Server Component `page.tsx` is async, Next.js wraps it in Suspense. Place a `loading.tsx` file in the same directory to provide the fallback UI.

```tsx
// app/blog/loading.tsx
export default function BlogLoading() {
    return (
        <div className="animate-pulse space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-6 bg-white rounded-xl border space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
            ))}
        </div>
    );
}
```

### `error.tsx` — Automatic Error Boundary

```tsx
// app/blog/error.tsx — MUST be a Client Component
'use client';

import { useEffect } from 'react';

export default function BlogError({
    error,
    reset
}: {
    error:  Error & { digest?: string };  // digest = server error ID for logs
    reset:  () => void;
}) {
    useEffect(() => {
        // Log to an error monitoring service (Sentry, etc.)
        console.error('Blog error:', error);
    }, [error]);

    return (
        <div className="py-16 text-center">
            <div className="text-5xl mb-4">💥</div>
            <h2 className="text-xl font-semibold">Failed to load blog posts</h2>
            <p className="text-gray-500 mt-2 text-sm">{error.message}</p>
            <button onClick={reset} className="btn btn-primary mt-6">
                Try again
            </button>
        </div>
    );
}
```

### `not-found.tsx`

```tsx
// app/not-found.tsx — global 404 page
import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
            <div className="text-8xl font-black text-gray-200">404</div>
            <h1 className="text-2xl font-bold mt-4">Page not found</h1>
            <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
            <Link href="/" className="btn btn-primary mt-8">← Back home</Link>
        </div>
    );
}
```

### `Link` Component

```tsx
import Link from 'next/link';

// Client-side navigation — no full page reload
<Link href="/blog">Blog</Link>
<Link href={`/blog/${post.slug}`} prefetch={false}>Read post</Link>

// Programmatic navigation in Client Components
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/dashboard');
router.replace('/login');
router.back();
```

---

## ✅ Milestone Checklist

- [ ] I created a `[slug]` dynamic route and read `params.slug`
- [ ] I use `notFound()` when a resource is missing
- [ ] I have a `loading.tsx` showing a skeleton while async data loads
- [ ] I have an `error.tsx` providing a user-friendly message and reset button

## ➡️ Next Unit

[Lesson 04 — Data Fetching in Server Components](./lesson_04.md)
