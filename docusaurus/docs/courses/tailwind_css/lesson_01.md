# Lesson 01 — Utility-First Philosophy

> **Course:** Tailwind CSS · **Time:** 45 minutes
> **📖 Wiki:** [HTML & CSS](../../domains/web_dev/html_css.md)
> **🔗 Official Docs:** [Tailwind CSS — Core Concepts](https://tailwindcss.com/docs/utility-first)

---

## 🎯 Learning Objectives

- [ ] Explain the utility-first approach and how it differs from traditional CSS
- [ ] Install and configure Tailwind CSS in a Vite project
- [ ] Apply Tailwind utilities to style a card component
- [ ] Identify the key advantages and criticisms of the approach

---

## 📖 Concepts

### The Problem With Traditional CSS

In traditional CSS, you write semantic class names, then write CSS for each:

```html
<!-- HTML -->
<div class="card">
    <h2 class="card__title">Hello</h2>
    <p class="card__body">World</p>
</div>
```

```css
/* CSS — you write all of this */
.card { background: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.card__title { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
.card__body { color: #6b7280; line-height: 1.6; }
```

This creates two parallel files to maintain. Every new component means context-switching between HTML and CSS, and CSS file size grows indefinitely.

### The Utility-First Approach

With Tailwind, you apply tiny, single-purpose classes directly in HTML. No custom CSS required.

```html
<!-- Tailwind — all styling directly in markup -->
<div class="bg-white rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold mb-2">Hello</h2>
    <p class="text-gray-500 leading-relaxed">World</p>
</div>
```

The result is visually identical. What changed:
- No CSS file to maintain alongside the HTML
- Changing styles means editing only the HTML
- Unused styles are automatically purged at build time

### Installation in a Vite Project

```bash
# In an existing Vite project
npm install --save-dev tailwindcss @tailwindcss/vite

# For Tailwind v4 (current) with Vite, use the Vite plugin approach
# For Tailwind v3 (still common in legacy projects):
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Tailwind v4 (recommended for new projects):**

```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss()],
});
```

```css
/* src/style.css — just one line needed */
@import "tailwindcss";
```

**Tailwind v3 (if you're on a legacy project):**

```javascript
// tailwind.config.js
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],  // Files to scan for class names
    theme: { extend: {} },
    plugins: [],
};
```

```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Reading Tailwind Class Names

Tailwind class names follow a consistent pattern: `{property}-{value}`.

```html
<!-- Spacing: p = padding, m = margin, t/r/b/l/x/y = sides -->
<div class="p-4">           <!-- padding: 1rem (4 * 0.25rem) -->
<div class="px-6 py-3">     <!-- padding: horizontal 1.5rem, vertical 0.75rem -->
<div class="mt-8">          <!-- margin-top: 2rem -->
<div class="gap-4">         <!-- gap: 1rem -->

<!-- Sizing -->
<div class="w-full">        <!-- width: 100% -->
<div class="max-w-xl">      <!-- max-width: 36rem -->
<div class="h-screen">      <!-- height: 100vh -->

<!-- Colors (bg = background, text = color, border = border-color) -->
<div class="bg-blue-500 text-white border border-blue-600">

<!-- Typography -->
<h1 class="text-3xl font-bold tracking-tight">
<p class="text-gray-600 text-sm leading-relaxed">

<!-- Display / Layout -->
<div class="flex items-center justify-between gap-4">
<div class="grid grid-cols-3 gap-6">
<div class="hidden md:block">   <!-- Hidden on mobile, visible on md+ -->
```

### The Purge/JIT Mechanism

Tailwind scans all files listed in `content` and generates CSS **only for classes that actually appear in those files**. If you never use `bg-emerald-900`, it never appears in your CSS bundle.

In development, Tailwind v4 uses a JIT (Just-In-Time) engine that generates styles on demand. Your production CSS typically ends up 5–20 KB (vs 300 KB unpurged).

### VS Code: Install Tailwind IntelliSense

Install the **Tailwind CSS IntelliSense** extension for autocomplete, previews, and docs on hover. This is essentially mandatory for productive Tailwind development.

---

## 🏗️ Assignments

### Assignment 1 — Setup & First Component

1. Create a new Vite project.
2. Install and configure Tailwind CSS.
3. Build a profile card with: avatar (circle-cropped image), name, job title, and a "Follow" button. Use ONLY Tailwind classes — no custom CSS.

### Assignment 2 — Side-by-Side Comparison

Take the card component you built in CSS Fundamentals Lesson 03. Rebuild it using Tailwind classes in a new HTML file. Compare the two approaches: which is easier to modify? Which is easier to read?

---

## ✅ Milestone Checklist

- [ ] Tailwind is installed and generating styles in my Vite project
- [ ] I installed the Tailwind CSS IntelliSense VS Code extension
- [ ] I can read Tailwind class names and predict what CSS property they set
- [ ] I built a complete card component using only utility classes

## ➡️ Next Unit

[Lesson 02 — Typography, Color & Spacing](./lesson_02.md)
