# Lesson 02 — Typography, Color & Spacing

> **Course:** Tailwind CSS · **Time:** 45 minutes
> **📖 Wiki:** [HTML & CSS](../../domains/web_dev/html_css.mdx)
> **🔗 Official Docs:** [Typography](https://tailwindcss.com/docs/font-size) · [Colors](https://tailwindcss.com/docs/background-color) · [Spacing](https://tailwindcss.com/docs/padding)

---

## 🎯 Learning Objectives

- [ ] Apply Tailwind's typographic scale (font-size, weight, line-height, tracking)
- [ ] Use the color system with semantic opacity variants
- [ ] Apply padding, margin, gap, and space utilities precisely
- [ ] Read the Tailwind docs to find any utility by category

---

## 📖 Concepts

### The Spacing Scale

Tailwind uses a consistent spacing scale where 1 unit = 0.25 rem (4px at the browser default of 16px).

| Class | Value |
|-------|-------|
| `p-0` | 0 |
| `p-1` | 0.25 rem (4px) |
| `p-2` | 0.5 rem (8px) |
| `p-4` | 1 rem (16px) |
| `p-6` | 1.5 rem (24px) |
| `p-8` | 2 rem (32px) |
| `p-12` | 3 rem (48px) |
| `p-16` | 4 rem (64px) |

All spacing utilities use this same scale: `p` (padding all sides), `px`/`py` (horizontal/vertical), `pt`/`pr`/`pb`/`pl` (individual sides), `m` (margin), `gap`, `space-x`, `space-y`.

```html
<!-- Padding and margin -->
<div class="p-6">              <!-- padding: 1.5rem all sides    -->
<div class="px-4 py-2">       <!-- padding: 0 1rem / 0.5rem 0   -->
<div class="mt-8 mb-4">       <!-- margin-top: 2rem, bottom: 1rem -->
<div class="mx-auto">         <!-- margin: 0 auto — horizontal centering -->

<!-- Gap (flex/grid children) -->
<div class="flex gap-4">      <!-- gap: 1rem between children    -->
<div class="grid gap-x-6 gap-y-4">

<!-- Space between — adds margin to all children except the first -->
<ul class="space-y-2">        <!-- each li gets margin-top: 0.5rem -->
```

### Typography Utilities

```html
<!-- Font size — uses the major third typographic scale -->
<p class="text-xs">12px</p>
<p class="text-sm">14px</p>
<p class="text-base">16px</p>   <!-- browser default -->
<p class="text-lg">18px</p>
<p class="text-xl">20px</p>
<p class="text-2xl">24px</p>
<p class="text-3xl">30px</p>
<p class="text-4xl">36px</p>
<h1 class="text-5xl font-bold">48px bold heading</h1>

<!-- Font weight -->
<p class="font-thin">100</p>
<p class="font-light">300</p>
<p class="font-normal">400</p>
<p class="font-medium">500</p>
<p class="font-semibold">600</p>
<p class="font-bold">700</p>
<p class="font-extrabold">800</p>

<!-- Line height -->
<p class="leading-none">1</p>       <!-- tight — headings -->
<p class="leading-tight">1.25</p>
<p class="leading-snug">1.375</p>
<p class="leading-normal">1.5</p>   <!-- body copy -->
<p class="leading-relaxed">1.625</p>
<p class="leading-loose">2</p>

<!-- Letter spacing -->
<p class="tracking-tighter">-0.05em</p>
<p class="tracking-tight">-0.025em</p>
<p class="tracking-normal">0</p>
<p class="tracking-wide">0.025em</p>
<p class="tracking-wider">0.05em</p>
<p class="tracking-widest">0.1em</p> <!-- great for uppercase labels -->

<!-- Alignment, transform, decoration -->
<p class="text-center italic uppercase underline line-through truncate">
```

### The Color System

Tailwind ships with a palette of named color scales, each with shades from 50 to 950. Apply to `text-`, `bg-`, `border-`, `ring-`, `shadow-`, `fill-`.

```html
<!-- Background colors -->
<div class="bg-slate-900">Dark background</div>
<div class="bg-white">White background</div>
<div class="bg-blue-500">Brand blue</div>
<div class="bg-red-400">Error red</div>
<div class="bg-emerald-500">Success green</div>
<div class="bg-amber-400">Warning amber</div>

<!-- Text colors -->
<p class="text-gray-900">Primary text</p>
<p class="text-gray-500">Muted text</p>
<p class="text-blue-600">Link text</p>
<p class="text-red-600">Error text</p>

<!-- Opacity variants (Tailwind v3 and v4) -->
<div class="bg-blue-500/50">50% opacity blue background</div>
<div class="text-gray-900/75">75% opacity dark text</div>
<div class="border border-white/20">Subtle white border</div>
```

### Practical Typography Card

```html
<article class="max-w-prose mx-auto p-8">
    <time class="text-xs font-semibold tracking-widest uppercase text-blue-500">
        April 2026
    </time>
    <h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 leading-tight">
        Understanding the Box Model
    </h1>
    <p class="mt-1 text-lg text-gray-500">
        A visual guide to how browsers calculate element dimensions.
    </p>
    <div class="mt-6 flex items-center gap-3">
        <img src="/avatar.jpg" alt="Author" class="w-10 h-10 rounded-full">
        <div>
            <p class="text-sm font-medium text-gray-900">Alex Kim</p>
            <p class="text-sm text-gray-500">5 min read</p>
        </div>
    </div>
    <p class="mt-8 text-gray-700 leading-relaxed text-base">
        The box model is the foundation of CSS layout...
    </p>
</article>
```

---

## 🏗️ Assignments

### Assignment 1 — Article Card

Build a blog article card with: category label (uppercase, small), title (large, bold), excerpt (muted, relaxed line height), and author row (avatar + name + read time). Use only Tailwind classes.

### Assignment 2 — Color Palette Exploration

Go to [tailwindcss.com/docs/background-color](https://tailwindcss.com/docs/background-color) and explore the full color palette. Build a small "color swatch" grid showing all shades (50–950) of three colors you'd use for an app: a primary, a neutral grey, and a semantic error color.

---

## ✅ Milestone Checklist

- [ ] I understand Tailwind's spacing scale (1 unit = 0.25rem)
- [ ] I can apply the full typographic utility set (size, weight, leading, tracking)
- [ ] I used color utilities with opacity variants (`bg-blue-500/50`)
- [ ] I built a complete article card using only Tailwind classes

## ➡️ Next Unit

[Lesson 03 — Flexbox & Grid with Tailwind](./lesson_03.md)
