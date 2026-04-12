# Lesson 04 — Data Fetching in Server Components

> **Course:** Next.js · **Time:** 60 minutes
> **📖 Wiki:** [REST APIs](../../domains/web_dev/rest_api.md) · [SSR vs CSR](../../domains/web_dev/ssr_csr.md)
> **🔗 Official Docs:** [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

## 🎯 Learning Objectives

- [ ] Fetch data directly in Server Components using `async/await`
- [ ] Use Next.js extended `fetch` caching options
- [ ] Parallel-fetch for performance with `Promise.all`
- [ ] Access databases and sensitive data safely (server-only)
- [ ] Implement the `server-only` guard

---

## 📖 Concepts

### Direct `async/await` in Components

```tsx
// app/products/page.tsx
interface Product { id: number; name: string; price: number; }

// Data is fetched server-side — zero client JS for the fetch
export default async function ProductsPage() {
    const products: Product[] = await fetch('https://api.example.com/products')
        .then(r => r.json());

    return (
        <ul className="grid grid-cols-3 gap-6">
            {products.map(p => (
                <li key={p.id} className="p-6 bg-white rounded-xl border">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-gray-500">${p.price}</p>
                </li>
            ))}
        </ul>
    );
}
```

### Next.js Extended `fetch` — Caching

Next.js extends the native `fetch` with cache configuration:

```tsx
// Force cache (default) — cache indefinitely, like SSG
const data = await fetch('/api/data', {
    cache: 'force-cache'
});

// No cache — fetch fresh on every request, like SSR
const data = await fetch('/api/data', {
    cache: 'no-store'
});

// ISR — revalidate after N seconds
const data = await fetch('/api/data', {
    next: { revalidate: 3600 }  // Re-fetch after 1 hour
});

// Tag-based revalidation — revalidate on demand
const data = await fetch('/api/posts', {
    next: { tags: ['posts'] }   // Can be purged via revalidateTag('posts')
});
```

### Parallel Data Fetching — `Promise.all`

Sequential fetching is slow. Fetch in parallel when data is independent:

```tsx
// app/dashboard/page.tsx
async function getDashboardData() {
    // These three fetch calls run simultaneously
    const [users, orders, revenue] = await Promise.all([
        fetch('/api/users',   { next: { revalidate: 300 } }).then(r => r.json()),
        fetch('/api/orders',  { next: { revalidate: 60  } }).then(r => r.json()),
        fetch('/api/revenue', { next: { revalidate: 60  } }).then(r => r.json()),
    ]);
    return { users, orders, revenue };
}

export default async function DashboardPage() {
    const { users, orders, revenue } = await getDashboardData();
    return (
        <div className="grid grid-cols-3 gap-6">
            <StatCard label="Users"   value={users.total} />
            <StatCard label="Orders"  value={orders.total} />
            <StatCard label="Revenue" value={revenue.total} />
        </div>
    );
}
```

### Separating Data Access — Typed Fetch Functions

```tsx
// lib/api.ts — data-fetching functions (server-only)
import 'server-only';  // Prevents accidental import on the client

interface Post {
    id:          number;
    title:       string;
    slug:        string;
    content:     string;
    publishedAt: string;
}

const BASE_URL = process.env.API_URL;  // Server-side env var — safe

export async function getPosts(): Promise<Post[]> {
    const res = await fetch(`${BASE_URL}/posts`, {
        next: { revalidate: 3600, tags: ['posts'] }
    });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
    return res.json();
}

export async function getPost(slug: string): Promise<Post | null> {
    const res = await fetch(`${BASE_URL}/posts/${slug}`, {
        next: { revalidate: 600, tags: [`post-${slug}`] }
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
    return res.json();
}
```

```tsx
// app/blog/page.tsx — clean component
import { getPosts } from '../../lib/api';

export default async function BlogPage() {
    const posts = await getPosts();
    return <PostList posts={posts} />;
}
```

### Streaming with `Suspense`

Stream slow or independent sections instead of waiting for all data:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { RevenueChart } from './RevenueChart';
import { RecentOrders } from './RecentOrders';

// Both components fetch their own data
export default function DashboardPage() {
    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Each section streams independently */}
            <Suspense fallback={<ChartSkeleton />}>
                <RevenueChart />  {/* Slow — loads last */}
            </Suspense>
            <Suspense fallback={<OrdersSkeleton />}>
                <RecentOrders />  {/* Fast — loads first */}
            </Suspense>
        </div>
    );
}

// app/dashboard/RevenueChart.tsx (Server Component)
async function getRevenue() { /* slow DB query */ }

export async function RevenueChart() {
    const revenue = await getRevenue();
    return <Chart data={revenue} />;
}
```

---

## ✅ Milestone Checklist

- [ ] I fetch data directly in Server Component bodies using `async/await`
- [ ] I parallel-fetch independent data with `Promise.all`
- [ ] I use `next: { revalidate }` to configure caching
- [ ] API URLs and secrets live in `.env.local` — not `NEXT_PUBLIC_` prefixed

## ➡️ Next Unit

[Lesson 05 — SSG and ISR](./lesson_05.md)
