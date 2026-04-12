# Lesson 03 — Vite in Depth

> **Course:** Build Tools & Toolchain · **Time:** 45 minutes
> **🔗 Official Docs:** [Vite Guide](https://vitejs.dev/guide/) · [Vite Config Reference](https://vitejs.dev/config/)

---

## 🎯 Learning Objectives

- [ ] Create a Vite project for vanilla JS, React, or TypeScript
- [ ] Use the dev server and understand why it's fast
- [ ] Build for production and inspect the output
- [ ] Configure `vite.config.js` (aliases, proxy, plugins)
- [ ] Use environment variables in Vite

---

## 📖 Concepts

### What is Vite?

> **Tool:** Vite · **Introduced:** 2020 · **Latest:** 5.x (2024) · **Status:** 🟢 Modern
> **Why not Webpack?** Webpack was the dominant bundler for a decade. Vite replaces it for new projects — it's 10–100x faster in development due to native ES Module import and esbuild-based transformation.

Vite has two modes:
1. **Dev mode** — serves files natively via ES Modules to the browser. No bundling. HMR (Hot Module Replacement) updates only the changed module in milliseconds.
2. **Build mode** — uses Rollup to bundle, tree-shake, and minify for production.

### Creating a Project

```bash
# Interactive scaffolding (choose vanilla / vue / react / preact / lit / svelte / angular)
npm create vite@latest my-app

# Non-interactive (specify template)
npm create vite@latest my-app -- --template react-ts   # React + TypeScript
npm create vite@latest my-app -- --template vanilla-ts # Vanilla TS
npm create vite@latest my-app -- --template react

cd my-app
npm install
npm run dev
```

### Project Structure

```
my-app/
├── index.html          ← Entry point (Vite reads this, not a config file)
├── vite.config.js      ← Vite configuration
├── package.json
├── tsconfig.json       ← TypeScript config (if using TS)
├── public/             ← Static assets — copied as-is to dist/
│   └── favicon.ico
└── src/
    ├── main.ts         ← Your JavaScript/TypeScript entry point
    ├── style.css
    └── components/
```

### `vite.config.js` — Key Options

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    // Plugins: extend Vite (React, Vue, etc.)
    plugins: [react()],

    // Resolve aliases — use '@/components/Button' instead of '../../components/Button'
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },

    // Dev server config
    server: {
        port: 3000,
        open: true,    // Auto-open browser on dev server start

        // Proxy API requests to avoid CORS issues during development
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            }
        }
    },

    // Build config
    build: {
        outDir: 'dist',
        sourcemap: true,    // Include source maps for debugging prod builds
        // Code splitting — Vue/React route-based chunks are automatic
    }
});
```

### Environment Variables

Vite loads `.env` files and exposes variables prefixed with `VITE_` to client code.

```bash
# .env (committed — public, non-secret defaults)
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

# .env.local (NOT committed — local overrides, add to .gitignore)
VITE_API_URL=http://localhost:8080
```

```typescript
// In your code — always VITE_ prefix for client-accessible vars
const apiUrl = import.meta.env.VITE_API_URL;
const isDev  = import.meta.env.DEV;   // true in dev, false in prod
const isProd = import.meta.env.PROD;

// All Vite env vars are strings — parse numbers explicitly
const maxRetries = Number(import.meta.env.VITE_MAX_RETRIES) || 3;
```

:::info
Never put secrets (API keys, tokens) in `VITE_` variables. They are bundled into the JavaScript file and visible to anyone who opens DevTools. Secrets belong on the server.
:::

### The Development Server (Why It's Fast)

Traditional bundlers (Webpack) bundle ALL your source files before the dev server starts. A 1000-module app could take 10–30 seconds.

Vite's approach:
1. **No pre-bundling of your code** — serves your files as native ES Modules
2. Browser requests `main.ts` → Vite transforms it on demand and sends it
3. Browser requests imports → Vite transforms each on demand
4. Only `node_modules` are pre-bundled once with esbuild (fast Go-based transpiler)

Result: dev server starts in < 500ms regardless of app size.

### Building for Production

```bash
npm run build
# Output: dist/
# dist/
#   index.html        (references hashed JS/CSS filenames)
#   assets/
#     main-Bq7d2Kxp.js   (hashed filename for cache busting)
#     style-A1b2C3d4.css
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🏗️ Assignments

### Assignment 1 — Vite Project

1. Create a new Vite project with the `vanilla-ts` template.
2. Add a path alias `@` pointing to `src/`.
3. Add an environment variable `VITE_GREETING` and log it to the console.
4. Run `npm run build` and examine the `dist/` folder — note the hashed filenames.

### Assignment 2 — API Proxy

Set up a Vite dev server proxy so that `fetch('/api/posts')` is proxied to `https://jsonplaceholder.typicode.com/posts` during development. Test that it works without CORS errors.

---

## ✅ Milestone Checklist

- [ ] I can scaffold a Vite project and understand the file structure
- [ ] I configured a path alias and an API proxy in `vite.config.js`
- [ ] I used `import.meta.env.VITE_*` to access environment variables
- [ ] I ran `npm run build` and understand what's in the `dist/` folder

## ➡️ Next Unit

[Lesson 04 — Linting & Formatting](./lesson_04.md)
