# Lesson 04 — Responsive Design

> **Course:** Tailwind CSS · **Time:** 45 minutes
> **📖 Wiki:** [HTML & CSS — Responsive Design](../../domains/web_dev/html_css.md)
> **🔗 Official Docs:** [Tailwind — Responsive Design](https://tailwindcss.com/docs/responsive-design)

---

## 🎯 Learning Objectives

- [ ] Explain Tailwind's mobile-first breakpoint system
- [ ] Apply breakpoint prefixes to change layout at different screen sizes
- [ ] Show/hide elements at specific viewports
- [ ] Build a layout that transitions from mobile single-column to desktop multi-column

---

## 📖 Concepts

### Mobile-First Breakpoints

Tailwind is **mobile-first**: an unprefixed utility applies at ALL screen sizes. A prefixed utility applies from that breakpoint **upward**.

| Prefix | Min-width | Typical use |
|--------|-----------|-------------|
| *(none)* | 0px | Mobile — base styles |
| `sm:` | 640px | Large phone / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Wide desktop |

```html
<!-- Mobile: full width stack. md+: side by side. lg+: 1/3 + 2/3 -->
<div class="flex flex-col md:flex-row gap-6">
    <aside class="w-full md:w-64 lg:w-80 shrink-0">Sidebar</aside>
    <main  class="flex-1">Content</main>
</div>
```

### Showing and Hiding Elements

```html
<!-- Mobile nav toggle (hamburger menu) — only visible on mobile -->
<button class="md:hidden" aria-label="Open menu">☰</button>

<!-- Desktop nav — only visible md and above -->
<nav class="hidden md:flex gap-6">...</nav>

<!-- Stack on mobile, grid on desktop -->
<div class="flex flex-col lg:grid lg:grid-cols-2 gap-8">

<!-- Column count changes at different sizes -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- 1 col on mobile, 2 on sm, 4 on lg -->
```

### Responsive Typography

```html
<h1 class="text-2xl sm:text-3xl lg:text-5xl font-bold">
    Scale with the viewport
</h1>

<p class="text-sm md:text-base lg:text-lg leading-relaxed">
```

### Responsive Spacing

```html
<!-- Tight on mobile, generous on desktop -->
<section class="py-10 px-4 md:py-20 md:px-8 lg:px-16">
<div class="max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-5xl mx-auto">
```

### Full Responsive Page Layout

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Layout</title>
    <link href="/style.css" rel="stylesheet">
</head>
<body class="bg-gray-50 text-gray-900">

    <!-- Header: stacked on mobile, inline on md+ -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" class="text-xl font-bold">Brand</a>

            <!-- Mobile menu button -->
            <button id="menu-btn" class="md:hidden p-2" aria-label="Toggle navigation">
                <span class="block w-5 h-0.5 bg-gray-700 mb-1"></span>
                <span class="block w-5 h-0.5 bg-gray-700 mb-1"></span>
                <span class="block w-5 h-0.5 bg-gray-700"></span>
            </button>

            <!-- Desktop navigation -->
            <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
                <a href="#" class="hover:text-blue-600 transition-colors">Features</a>
                <a href="#" class="hover:text-blue-600 transition-colors">Pricing</a>
                <a href="#" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get started
                </a>
            </nav>
        </div>

        <!-- Mobile menu (toggled by JS) -->
        <div id="mobile-menu" class="hidden md:hidden border-t border-gray-200 px-4 py-4 flex flex-col gap-4">
            <a href="#" class="text-sm font-medium">Features</a>
            <a href="#" class="text-sm font-medium">Pricing</a>
            <a href="#" class="bg-blue-600 text-white text-sm font-medium text-center px-4 py-2 rounded-lg">
                Get started
            </a>
        </div>
    </header>

    <!-- Hero: centered on mobile, left-aligned on lg with image -->
    <section class="py-16 px-4 md:py-24 lg:py-32">
        <div class="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div class="text-center lg:text-left flex-1">
                <h1 class="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight">
                    Build faster.<br>Ship more.
                </h1>
                <p class="mt-4 text-gray-500 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
                    The modern tools you need to go from idea to production.
                </p>
                <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a href="#" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center">
                        Start for free
                    </a>
                    <a href="#" class="border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-center">
                        View demo
                    </a>
                </div>
            </div>
            <div class="lg:flex-1 w-full max-w-lg">
                <div class="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl"></div>
            </div>
        </div>
    </section>

    <!-- Features grid: 1 col → 2 col → 3 col -->
    <section class="py-16 px-4 bg-white">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">Why choose us</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Feature card (repeat 3 times) -->
                <div class="p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-4">⚡</div>
                    <h3 class="font-semibold text-lg mb-2">Lightning Fast</h3>
                    <p class="text-gray-500 leading-relaxed">Built for performance from the ground up.</p>
                </div>
                <div class="p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl mb-4">🔒</div>
                    <h3 class="font-semibold text-lg mb-2">Secure by Default</h3>
                    <p class="text-gray-500 leading-relaxed">Security best practices baked in, not bolted on.</p>
                </div>
                <div class="p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-2xl mb-4">🤝</div>
                    <h3 class="font-semibold text-lg mb-2">Team-Friendly</h3>
                    <p class="text-gray-500 leading-relaxed">Collaboration tools that scale with your organisation.</p>
                </div>
            </div>
        </div>
    </section>

</body>
</html>
```

---

## ✅ Milestone Checklist

- [ ] I understand Tailwind's mobile-first breakpoint system
- [ ] I built a navigation that collapses on mobile using `hidden md:flex`
- [ ] I built a hero section that stacks on mobile and goes side-by-side on `lg:`
- [ ] I used a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)

## ➡️ Next Unit

[Lesson 05 — Dark Mode & Custom Themes](./lesson_05.md)
