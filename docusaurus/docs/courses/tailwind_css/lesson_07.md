# Lesson 07 — Integrating Tailwind with Vite

> **Course:** Tailwind CSS · **Time:** 30 minutes
> **🔗 Official Docs:** [Vite Integration](https://tailwindcss.com/docs/installation/using-vite) · [PostCSS](https://tailwindcss.com/docs/installation/using-postcss)

---

## 🎯 Learning Objectives

- [ ] Integrate Tailwind into a Vite project (v4 plugin or v3 PostCSS)
- [ ] Understand the `content` config and why missing it breaks production builds
- [ ] Inspect the generated CSS in DevTools
- [ ] Purge unused classes in production and verify bundle size

---

## 📖 Concepts

### Tailwind v4 + Vite (Current Recommended)

```bash
npm create vite@latest my-app -- --template vanilla-ts
cd my-app
npm install
npm install --save-dev tailwindcss @tailwindcss/vite
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss()],
});
```

```css
/* src/style.css — single import */
@import "tailwindcss";
```

```typescript
// src/main.ts
import './style.css';
```

That is the entire setup. Tailwind v4 with Vite is configuration-minimal.

### Tailwind v3 + Vite (Common in Existing Projects)

```bash
npm install --save-dev tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```javascript
// tailwind.config.js — CRITICAL: content must list every file using Tailwind classes
export default {
    content: [
        './index.html',
        './src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'
    ],
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

:::info
If `content` is misconfigured, Tailwind will include ALL 200,000+ utility classes in production (3MB+) instead of just the ones you use (typically 5–20KB). Always double-check it covers every file containing class names.
:::

### Verifying the Production Bundle

```bash
npm run build
# Check dist/assets/*.css — should be kilobytes, not megabytes
```

```powershell
# Windows — check the CSS file size after build
Get-Item dist\assets\*.css | Select-Object Name, Length
```

```bash
# Linux
du -sh dist/assets/*.css
```

If the CSS file is > 50KB, your content configuration is likely too broad (e.g. `**/*`) and Tailwind is not purging correctly.

### With React/TypeScript

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install --save-dev tailwindcss @tailwindcss/vite
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
});
```

```tsx
// src/App.tsx — use classes directly in JSX
export function App() {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-900">Hello Tailwind + React</h1>
        </main>
    );
}
```

Note: React uses `className` not `class` for HTML attributes.

---

## ✅ Milestone Checklist

- [ ] Tailwind is working in my Vite project (classes apply on save)
- [ ] I understand what `content` does and why misconfiguring it breaks production
- [ ] My production build CSS is less than 30 KB
- [ ] I have the Tailwind IntelliSense extension providing autocomplete

## ➡️ Next Unit

[Lesson 08 — Capstone: Admin Dashboard UI](./lesson_08.md)
