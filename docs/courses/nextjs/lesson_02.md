# Lesson 02 — Server vs Client Components

> **Course:** Next.js · **Time:** 60 minutes
> **📖 Wiki:** [SSR vs CSR — React Server Components](../../domains/web_dev/ssr_csr.md#react-server-components)
> **🔗 Official Docs:** [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) · [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

---

## 🎯 Learning Objectives

- [ ] Explain the conceptual difference between Server and Client Components
- [ ] Know which APIs are available in each environment
- [ ] Add `'use client'` correctly and understand its boundary effect
- [ ] Compose Server and Client Components effectively

---

## 📖 Concepts

### The Core Rule

In Next.js App Router, **all components are Server Components by default**. Add `'use client'` at the top to become a Client Component.

```
Server Component:
  - Runs on the server only
  - Can use database, file system, secrets
  - Cannot use hooks (useState, useEffect)
  - Cannot use browser APIs (window, localStorage)
  - HTML is sent to the client

Client Component:
  - Has 'use client' at the top
  - Runs on the server (for SSR) AND the client
  - Can use hooks and browser APIs
  - JavaScript is sent to the client
```

### Comparison Table

| Capability | Server Component | Client Component |
|-----------|-----------------|-----------------|
| `async/await` in component | ✅ Yes | ❌ No |
| Database / file access | ✅ Yes | ❌ No |
| API secrets (env vars) | ✅ Yes | ❌ (use `NEXT_PUBLIC_` prefix) |
| `useState` / `useEffect` | ❌ No | ✅ Yes |
| Event handlers (`onClick`) | ❌ No | ✅ Yes |
| Browser APIs (window, localStorage) | ❌ No | ✅ Yes |
| Streaming / Suspense | ✅ Yes | ✅ Yes |

### Server Component — Async Data Fetching

```tsx
// app/blog/page.tsx — Server Component (default, no 'use client')
// This runs ONLY on the server — secrets are safe!

interface Post {
    id:    number;
    title: string;
    body:  string;
}

// Component can be async — await directly in the component body
export default async function BlogPage() {
    // Fetched on the server — faster (no client round-trip), no waterfall
    const posts = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10', {
        // Next.js extends fetch with caching options
        next: { revalidate: 3600 }  // Cache for 1 hour (ISR)
    }).then(r => r.json()) as Post[];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Blog</h1>
            <ul className="space-y-4">
                {posts.map(post => (
                    <li key={post.id} className="p-6 bg-white rounded-xl border">
                        <h2 className="font-semibold">{post.title}</h2>
                        <p className="text-gray-500 mt-2 line-clamp-2">{post.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

### Client Component — Interactivity

```tsx
// components/ThemeToggle.tsx
'use client';  // This directive makes it a Client Component

import { useState, useEffect } from 'react';

export function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        setDark(saved === 'dark');
    }, []);

    function toggle() {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
    }

    return (
        <button onClick={toggle} className="btn btn-secondary">
            {dark ? '☀️' : '🌙'}
        </button>
    );
}
```

### Composing Them Together

A critical insight: **Client Components can render Server Components as children (via `children` prop), but Server Components cannot import Client Components that have side effects**. In practice:

```tsx
// app/layout.tsx — Server Component (the layout itself)
import { ThemeToggle } from '../components/ThemeToggle';  // Client Component

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <header className="flex items-center justify-between p-4">
                    <h1>My App</h1>
                    {/* ✅ A Server Component can import and use Client Components */}
                    <ThemeToggle />
                </header>
                {/* ✅ children here is server-rendered page content */}
                <main>{children}</main>
            </body>
        </html>
    );
}
```

### Passing Server Data to Client Components

```tsx
// app/dashboard/page.tsx — Server Component
import { StatsChart } from '../../components/StatsChart';  // Client Component (needs onClick)

async function getStats() {
    // Server-side database call — runs securely
    const data = await db.query('SELECT ...');
    return data;
}

export default async function DashboardPage() {
    const stats = await getStats();  // Server-fetched

    // Pass the data as props to the Client Component
    return <StatsChart stats={stats} />;
}
```

```tsx
// components/StatsChart.tsx
'use client';

interface Stats { /* ... */ }

export function StatsChart({ stats }: { stats: Stats }) {
    // This can use useState, event handlers, etc.
    const [view, setView] = useState<'daily' | 'weekly'>('daily');
    return <div>...</div>;
}
```

### When to Add `'use client'`

Add `'use client'` only when you need:
- Event handlers (`onClick`, `onChange`)
- Hooks (`useState`, `useEffect`, `useContext`)
- Browser-only APIs (`window`, `document`, `localStorage`)
- A third-party component that uses any of the above

**Push the boundary as deep as possible** — keep parents as Server Components.

---

## ✅ Milestone Checklist

- [ ] I can fetch data directly in a Server Component with `async/await`
- [ ] I added `'use client'` to interactive components (buttons, form inputs)
- [ ] I pass server-fetched data down to Client Components via props
- [ ] I keep `'use client'` boundaries as deep as possible in the tree

## ➡️ Next Unit

[Lesson 03 — File-Based Routing — Layouts, Loading, Error](./lesson_03.md)
