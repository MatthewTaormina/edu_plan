# Lesson 08 — Capstone: Blog with CMS

> **Course:** Next.js · **Time:** 3–4 hours
> **📖 Wiki:** [SSR vs CSR](../../domains/web_dev/ssr_csr.md) · [REST APIs](../../domains/web_dev/rest_api.md)

---

## 🎯 Project Overview

Build a **performant, fully-featured blog** using Next.js App Router:
- Content sourced from **MDX files** (local) or a headless CMS API
- Blog index is **ISR** (regenerates hourly)
- Post pages are **SSG** with `generateStaticParams`
- On-demand revalidation via `/api/revalidate`
- Partial SSR for dynamic content (view count)
- Dark mode with no flash
- Auth-protected `/admin` route
- OG image metadata per post

---

## Project Structure

```
app/
├── layout.tsx                ← Root layout with dark mode
├── page.tsx                  ← Home (SSG)
├── blog/
│   ├── layout.tsx            ← Blog sidebar layout
│   ├── page.tsx              ← Blog index (ISR, 1 hour)
│   ├── loading.tsx           ← Skeleton
│   ├── error.tsx             ← Error boundary
│   └── [slug]/
│       ├── page.tsx          ← Post page (SSG)
│       └── loading.tsx
├── admin/
│   └── page.tsx              ← Protected admin panel
└── api/
    ├── revalidate/route.ts   ← On-demand revalidation
    └── auth/
        ├── login/route.ts
        └── logout/route.ts
lib/
├── posts.ts                  ← Data access layer
└── mdx.ts                    ← MDX parsing
content/
└── posts/                    ← MDX source files
    ├── getting-started.mdx
    └── ...
middleware.ts                 ← Protects /admin
```

---

## Core Data Layer

```typescript
// lib/posts.ts
import 'server-only';
import fs   from 'fs/promises';
import path from 'path';
import matter from 'gray-matter'; // npm install gray-matter

export interface PostFrontmatter {
    title:       string;
    excerpt:     string;
    publishedAt: string;
    author:      string;
    tags:        string[];
    coverImage?: string;
}

export interface Post extends PostFrontmatter {
    slug:    string;
    content: string;
}

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export async function getAllPosts(): Promise<Omit<Post, 'content'>[]> {
    const files = await fs.readdir(POSTS_DIR);

    const posts = await Promise.all(
        files
            .filter(f => f.endsWith('.mdx'))
            .map(async filename => {
                const slug = filename.replace(/\.mdx$/, '');
                const file = await fs.readFile(path.join(POSTS_DIR, filename), 'utf-8');
                const { data } = matter(file);
                return { slug, ...(data as PostFrontmatter) };
            })
    );

    return posts.sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export async function getPost(slug: string): Promise<Post | null> {
    try {
        const file = await fs.readFile(path.join(POSTS_DIR, `${slug}.mdx`), 'utf-8');
        const { data, content } = matter(file);
        return { slug, ...(data as PostFrontmatter), content };
    } catch {
        return null;
    }
}
```

## Blog Index Page (ISR)

```tsx
// app/blog/page.tsx
import { Metadata } from 'next';
import Link         from 'next/link';
import { getAllPosts } from '../../lib/posts';

export const revalidate = 3600;  // ISR — regenerate every hour

export const metadata: Metadata = {
    title:       'Blog',
    description: 'Articles on web development, TypeScript, and React.'
};

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <section>
            <h1 className="text-4xl font-bold mb-2">Blog</h1>
            <p className="text-gray-500 mb-10">Thoughts on web development.</p>

            <ul className="space-y-8">
                {posts.map(post => (
                    <li key={post.slug}>
                        <article>
                            <time className="text-xs font-semibold tracking-widest uppercase text-blue-500">
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'long', day: 'numeric', year: 'numeric'
                                })}
                            </time>
                            <h2 className="mt-1 text-2xl font-bold">
                                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="mt-2 text-gray-500 leading-relaxed">{post.excerpt}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </article>
                    </li>
                ))}
            </ul>
        </section>
    );
}
```

## Post Page (SSG)

```tsx
// app/blog/[slug]/page.tsx
import { notFound }          from 'next/navigation';
import type { Metadata }     from 'next';
import { getAllPosts, getPost } from '../../../lib/posts';

// Pre-build all known slugs at build time
export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map(p => ({ slug: p.slug }));
}

// Dynamic metadata per post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await getPost(params.slug);
    if (!post) return { title: 'Not Found' };
    return {
        title:       post.title,
        description: post.excerpt,
        openGraph: {
            title:       post.title,
            description: post.excerpt,
            type:        'article',
            publishedTime: post.publishedAt,
            authors:     [post.author],
        }
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);
    if (!post) notFound();

    return (
        <article className="max-w-3xl mx-auto">
            <header className="mb-10">
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-4xl font-bold tracking-tight leading-tight">{post.title}</h1>
                <p className="mt-2 text-xl text-gray-500">{post.excerpt}</p>
                <div className="mt-6 flex items-center gap-3 text-sm text-gray-400">
                    <span>{post.author}</span>
                    <span>·</span>
                    <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'long', day: 'numeric', year: 'numeric'
                        })}
                    </time>
                </div>
            </header>

            {/* Render MDX content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
                {post.content}
            </div>
        </article>
    );
}
```

---

## ✅ Milestone Checklist

- [ ] Blog index uses ISR (`revalidate = 3600`)
- [ ] Blog posts are SSG with `generateStaticParams`
- [ ] `generateMetadata` provides per-post OG data
- [ ] `/admin` is protected by Middleware
- [ ] `loading.tsx` shows a skeleton while data loads
- [ ] `error.tsx` catches and displays errors gracefully
- [ ] All TypeScript is strict

## 🏆 Next.js Complete!

## ➡️ Next Course

[Angular Fundamentals](../angular_fundamentals/index.md) — the enterprise React alternative
