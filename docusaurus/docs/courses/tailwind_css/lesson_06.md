# Lesson 06 — Reusable Components with @apply & Plugins

> **Course:** Tailwind CSS · **Time:** 45 minutes
> **🔗 Official Docs:** [@apply](https://tailwindcss.com/docs/reusing-styles) · [Plugins](https://tailwindcss.com/docs/plugins)

---

## 🎯 Learning Objectives

- [ ] Extract repeated utility sets into component classes using `@apply`
- [ ] Know when `@apply` is appropriate vs when it's overused
- [ ] Install and configure first-party Tailwind plugins
- [ ] Use `@tailwindcss/typography` to style rich text content

---

## 📖 Concepts

### The Problem: Repeated Utility Groups

When the same combination of utilities appears on 15 buttons, a change means updating 15 places:

```html
<!-- Without @apply — utilities repeated everywhere -->
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Save</button>
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Update</button>
```

### `@apply` — Extract Component Classes

```css
/* src/style.css */
@import "tailwindcss";

@layer components {
    .btn {
        @apply inline-flex items-center justify-center gap-2 px-4 py-2
               text-sm font-medium rounded-lg transition-colors
               focus:outline-none focus:ring-2 focus:ring-offset-2;
    }

    .btn-primary {
        @apply bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500;
    }

    .btn-secondary {
        @apply bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-400;
    }

    .btn-danger {
        @apply bg-red-600 hover:bg-red-700 text-white focus:ring-red-500;
    }

    /* Form inputs */
    .input {
        @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
               bg-white text-gray-900 placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
               disabled:opacity-50 disabled:cursor-not-allowed
               dark:bg-slate-800 dark:border-slate-600 dark:text-white;
    }

    /* Card container */
    .card {
        @apply bg-white dark:bg-slate-800 rounded-2xl border border-gray-100
               dark:border-slate-700 shadow-sm p-6;
    }
}
```

```html
<!-- Clean HTML with component classes -->
<button class="btn btn-primary">Save</button>
<button class="btn btn-secondary">Cancel</button>
<button class="btn btn-danger">Delete</button>

<input class="input" type="email" placeholder="you@example.com">

<div class="card">...</div>
```

### When NOT to use `@apply`

:::warning
`@apply` is a tool for your own component abstractions. Do not use it to recreate
a utility class ("`.my-flex { @apply flex; }"`). That defeats the purpose and creates 
maintenance overhead.
:::

**Use `@apply` when:**
- The same combination appears in 3+ places in raw HTML
- You're theming a third-party component library
- You want to provide component classes for a design system

**Prefer component templates** (in React, Angular, etc.) over `@apply` when using framework components — keep styling in the component file, not a CSS file.

### First-Party Plugins

Install additional utilities via official Tailwind plugins:

```bash
# Typography — beautiful article/blog content styling
npm install @tailwindcss/typography

# Forms — consistent cross-browser form element styles
npm install @tailwindcss/forms

# Aspect ratio (built-in v3.2+, still useful in v2)
npm install @tailwindcss/aspect-ratio
```

```javascript
// tailwind.config.js (v3)
export default {
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ]
};
```

### `@tailwindcss/typography` — `prose` Classes

The typography plugin adds a `prose` class that styles children for readable articles:

```html
<!-- Apply prose to a container — all child elements get styled automatically -->
<article class="prose prose-lg dark:prose-invert max-w-none">
    <h1>Article Title</h1>
    <p>Opening paragraph with <strong>bold</strong> and <em>italic</em>.</p>
    <ul>
        <li>Bullet point one</li>
        <li>Bullet point two</li>
    </ul>
    <pre><code>function hello() { return "world"; }</code></pre>
    <blockquote>A notable quote here.</blockquote>
</article>
```

`prose-lg` — larger text for articles  
`dark:prose-invert` — automatically inverts all prose colors for dark mode  
`prose-blue` — tints links and highlights blue  

---

## 🏗️ Assignment

Build a blog post page using:
1. A navbar built from `@apply` btn/card component classes
2. Article content area using `prose prose-lg dark:prose-invert`
3. A sidebar with related posts using card component class
4. Working dark mode toggle from Lesson 05

---

## ✅ Milestone Checklist

- [ ] I extracted a reusable `btn` and `card` class using `@apply`
- [ ] I installed and configured `@tailwindcss/typography`
- [ ] I used `prose` to style generated or markdown-sourced content
- [ ] I understand WHEN to use `@apply` and when it's an anti-pattern

## ➡️ Next Unit

[Lesson 07 — Integrating with Vite](./lesson_07.md)
