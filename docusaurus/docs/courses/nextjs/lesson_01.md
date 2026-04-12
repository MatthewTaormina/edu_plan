# Lesson 01 — App Router Setup & Project Structure

> **Course:** Next.js · **Time:** 60 minutes
> **📖 Wiki:** [SSR vs CSR](../../domains/web_dev/ssr_csr.md)
> **🔗 Official Docs:** [Next.js Installation](https://nextjs.org/docs/getting-started/installation) · [Project Structure](https://nextjs.org/docs/getting-started/project-structure)

---

## 🎯 Learning Objectives

- [ ] Create a Next.js 14+ App Router project
- [ ] Understand the `app/` directory structure and file conventions
- [ ] Run the development server and understand hot reloading
- [ ] Navigate the relationship between files and routes

---

## 📖 Concepts

### What Next.js Adds to React

Next.js is a **React meta-framework** — it adds:

| Feature | React alone | Next.js |
|---------|------------|---------|
| Routing | React Router (manual) | File-based (automatic) |
| Data fetching | `useEffect` (client only) | Server Components (server-side) |
| Rendering | CSR only | CSR, SSR, SSG, ISR |
| Image optimisation | `<img>` | `<Image>` (lazy, sized, WebP) |
| Fonts | Manual | `next/font` (no FOUT, self-hosted) |
| API routes | Separate server needed | Route Handlers in `/app` |
| SEO | Manual | `generateMetadata()` API |

### Project Setup

```bash
npx create-next-app@latest my-app

# Interactive prompts — recommended answers:
# ✓ TypeScript?              Yes
# ✓ ESLint?                  Yes
# ✓ Tailwind CSS?            Yes
# ✓ src/ directory?          No  (or Yes — personal preference)
# ✓ App Router?              Yes  (NOT Pages Router)
# ✓ Import alias (@/*)?      Yes

cd my-app
npm run dev
```

```
PowerShell / Command Prompt:
  npm run dev   → http://localhost:3000
```

### The App Directory

```
my-app/
├── app/                        ← Everything here is a route
│   ├── layout.tsx              ← Root layout — wraps ALL pages
│   ├── page.tsx                ← Route: /
│   ├── globals.css
│   ├── favicon.ico
│   ├── about/
│   │   └── page.tsx            ← Route: /about
│   ├── blog/
│   │   ├── page.tsx            ← Route: /blog
│   │   ├── [slug]/
│   │   │   └── page.tsx        ← Route: /blog/:slug (dynamic)
│   │   └── layout.tsx          ← Layout for all /blog/* routes
│   └── api/
│       └── users/
│           └── route.ts        ← API: GET/POST /api/users
├── public/                     ← Served at / statically
│   └── images/
├── next.config.ts
└── tailwind.config.ts
```

### File Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | UI for a route (makes URL accessible) |
| `layout.tsx` | Wraps all children — persists across navigation |
| `loading.tsx` | Suspense fallback for the route |
| `error.tsx` | Error boundary for the route |
| `not-found.tsx` | 404 page |
| `route.ts` | API endpoint (no UI) |
| `template.tsx` | Like layout but re-mounts on navigation |

### Root Layout

```tsx
// app/layout.tsx — required, wraps everything
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Static metadata export — used to generate <head> tags
export const metadata: Metadata = {
    title:       'My App',
    description: 'A Next.js App Router application',
    openGraph:   { title: 'My App', type: 'website' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
            <body className="bg-gray-50 text-gray-900 antialiased">
                <header className="bg-white border-b px-6 py-4">
                    <nav className="max-w-6xl mx-auto flex items-center gap-6">
                        {/* Next Link for client-side navigation */}
                        <a href="/" className="font-bold">My App</a>
                    </nav>
                </header>
                <main className="max-w-6xl mx-auto px-6 py-10">
                    {children}
                </main>
            </body>
        </html>
    );
}
```

### Home Page

```tsx
// app/page.tsx — Server Component by default
export default function HomePage() {
    return (
        <section>
            <h1 className="text-4xl font-bold">Welcome</h1>
            <p className="text-gray-500 mt-2">This is a Next.js App Router application.</p>
        </section>
    );
}
```

### Dynamic Metadata

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

// Dynamic metadata — called per request or at build time
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await fetchPost(params.slug);
    return {
        title:       post.title,
        description: post.excerpt,
        openGraph: {
            title:  post.title,
            images: [post.coverImage]
        }
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await fetchPost(params.slug);
    return <article><h1>{post.title}</h1></article>;
}
```

---

## ✅ Milestone Checklist

- [ ] My Next.js project runs at localhost:3000
- [ ] I understand how the `app/` directory maps to URLs
- [ ] I know the difference between `page.tsx`, `layout.tsx`, and `route.ts`
- [ ] I set page metadata with the `metadata` export

## ➡️ Next Unit

[Lesson 02 — Server vs Client Components](./lesson_02.md)
