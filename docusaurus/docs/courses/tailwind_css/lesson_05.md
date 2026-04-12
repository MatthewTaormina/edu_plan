# Lesson 05 — Dark Mode & Custom Themes

> **Course:** Tailwind CSS · **Time:** 45 minutes
> **📖 Wiki:** [HTML & CSS — Custom Properties](../../domains/web_dev/html_css.mdx)
> **🔗 Official Docs:** [Dark Mode](https://tailwindcss.com/docs/dark-mode) · [Theme Configuration](https://tailwindcss.com/docs/configuration)

---

## 🎯 Learning Objectives

- [ ] Apply the `dark:` variant for dark mode styles
- [ ] Configure dark mode to follow system preference or a CSS class
- [ ] Define custom colors, fonts, and spacing in `tailwind.config.js`
- [ ] Toggle dark mode manually with JavaScript + `localStorage`

---

## 📖 Concepts

### Dark Mode Variants

Tailwind's `dark:` prefix applies styles only in dark mode.

```html
<!-- Background: white in light, slate-900 in dark -->
<div class="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">

<!-- Card -->
<div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
    <h2 class="text-gray-900 dark:text-white font-semibold">Card Title</h2>
    <p class="text-gray-500 dark:text-slate-400 mt-2">Card body text</p>
</div>

<!-- Button -->
<button class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white px-4 py-2 rounded-lg">
    Action
</button>
```

### Dark Mode Strategy

**Tailwind v4** — dark mode follows `prefers-color-scheme` by default. To also support manual toggle:
```css
/* style.css */
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));  /* Tailwind v4: class-based dark mode */
```

**Tailwind v3** — configure in `tailwind.config.js`:
```javascript
// tailwind.config.js
export default {
    darkMode: 'class',   // 'media' for system preference only | 'class' for manual toggle
    // ...
};
```

### Manual Dark Mode Toggle

```javascript
// Read saved preference or system default
function getInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme — adds/removes 'dark' class on <html>
function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
}

// Initialise on load (before page paint to avoid flash)
applyTheme(getInitialTheme());

// Toggle button
document.querySelector('#theme-toggle').addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
});
```

### Custom Theme Configuration

The `theme.extend` section adds to the defaults without replacing them.

```javascript
// tailwind.config.js (v3)
export default {
    content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            // Custom color palette — use alongside built-in colors
            colors: {
                brand: {
                    50:  '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    900: '#1e3a8a',
                },
                surface: {
                    DEFAULT: '#ffffff',
                    dark:    '#0f172a',
                }
            },
            // Custom font family
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Courier New', 'monospace'],
            },
            // Custom spacing values
            spacing: {
                18:  '4.5rem',   // p-18 = 72px
                72:  '18rem',
                128: '32rem',
            },
            // Custom border radius
            borderRadius: {
                '4xl': '2rem',
            },
            // Custom box shadow
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
            }
        }
    },
};
```

```html
<!-- Using custom theme values -->
<div class="font-sans bg-brand-500 text-white shadow-soft rounded-4xl p-18">
    Custom theme applied
</div>
```

### Tailwind v4 Custom Tokens

In Tailwind v4, theme configuration moves to CSS:
```css
@import "tailwindcss";

@theme {
    --color-brand-500: #3b82f6;
    --color-brand-600: #2563eb;
    --font-sans: 'Inter', system-ui, sans-serif;
    --spacing-18: 4.5rem;
}
```

---

## 🏗️ Assignment

Build a complete dark-mode–enabled landing page section (hero + CTA). Requirements:
1. Background: pure white in light, deep dark (`slate-950`) in dark
2. Heading and body text correctly themed for both modes
3. A theme toggle button in the top-right corner
4. Preference persisted to `localStorage`
5. No flash of wrong theme on page load (apply class in `<head>`)

---

## ✅ Milestone Checklist

- [ ] I applied `dark:` variants to background, text, and border colours
- [ ] My theme toggle writes to localStorage and applies correctly on revisit
- [ ] I defined at least one custom colour in `tailwind.config.js` (or `@theme` in v4)
- [ ] My page has zero flash of wrong theme on load

## ➡️ Next Unit

[Lesson 06 — Reusable Components with @apply & Plugins](./lesson_06.md)
