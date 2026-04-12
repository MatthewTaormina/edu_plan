# Lesson 02 — Modules: CommonJS, ESM & npm

> **Course:** Node.js Fundamentals · **Time:** 45 minutes
> **🔗 Official Docs:** [Node.js Modules](https://nodejs.org/api/esm.html) · [npm Docs](https://docs.npmjs.com/)

---

## 🎯 Learning Objectives

- [ ] Import and export with both CommonJS and ES Modules
- [ ] Know which format to use and when
- [ ] Manage project dependencies with npm
- [ ] Understand `package.json` scripts and semver

---

## 📖 Concepts

### CommonJS (CJS)

CommonJS is Node.js's original module system, still dominant in older codebases and many npm packages:

```js
// utils/math.js
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }

// Export multiple things
module.exports = { add, subtract };
// OR export a single default:
// module.exports = add;
```

```js
// index.js
const { add, subtract } = require('./utils/math');
// Dynamic require — works anywhere in the code
const lodash = require('lodash');

console.log(add(2, 3));  // 5
```

**CJS characteristics:**
- `require()` is synchronous — blocks until module loads
- `__dirname` and `__filename` are available globally
- Can `require()` conditionally or inside functions (dynamic)

### ES Modules (ESM)

ESM is the modern standard, used in browsers and modern Node.js:

```js
// utils/math.mjs  (OR set "type": "module" in package.json → use .js)
export function add(a, b)      { return a + b; }
export function subtract(a, b) { return a - b; }
export const PI = 3.14159;

// Default export (one per module)
export default function multiply(a, b) { return a * b; }
```

```js
// index.mjs
import { add, subtract, PI } from './utils/math.mjs';
import multiply               from './utils/math.mjs';  // Default

// Dynamic import — lazy-load only when needed
const { heavyFn } = await import('./utils/heavy.mjs');
```

**ESM characteristics:**
- Loaded asynchronously — enables top-level `await`
- Static `import` statements must be at top-level
- `__dirname` not available — use `import.meta.url` instead:

```js
import { fileURLToPath } from 'node:url';
import path              from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
```

### Choosing CJS vs ESM

```
New project starting today?  → ESM ("type": "module" in package.json)
Existing project with .js?   → CJS (don't switch mid-project without reason)
Publishing a library?        → Dual package (both CJS + ESM) or ESM-only
Working with older deps?     → CJS (many older packages don't support ESM)
```

### npm — Package Management

```bash
# Initialise a new project
npm init -y

# Install a runtime dependency
npm install express

# Install a dev-only dependency (not shipped to production)
npm install -D typescript vitest @types/node

# Install globally (CLI tools)
npm install -g nodemon

# Install from package.json (after cloning a repo)
npm install

# Update all dependencies to latest compatible versions
npm update

# Check for security vulnerabilities
npm audit
npm audit fix   # Auto-fix where possible

# Remove a package
npm uninstall lodash
```

### `package.json` — The Project Manifest

```json
{
    "name": "my-api",
    "version": "1.0.0",
    "description": "A learning project",
    "type": "module",
    "main": "src/index.js",
    "scripts": {
        "start":   "node src/index.js",
        "dev":     "node --watch src/index.js",
        "build":   "tsc",
        "test":    "vitest run",
        "test:watch": "vitest"
    },
    "dependencies": {
        "express": "^4.19.2",
        "zod":     "^3.23.0"
    },
    "devDependencies": {
        "typescript":  "^5.4.5",
        "vitest":      "^1.6.0",
        "@types/node": "^20.12.0",
        "@types/express": "^4.17.21"
    },
    "engines": {
        "node": ">=20.0.0"
    }
}
```

### Semantic Versioning (SemVer)

Package versions follow `MAJOR.MINOR.PATCH`:

```
^4.19.2  → >=4.19.2 <5.0.0   (compatible — patch + minor updates OK)
~4.19.2  → >=4.19.2 <4.20.0  (safe — patch updates only)
4.19.2   → exactly 4.19.2    (locked)

MAJOR: breaking changes       → upgrade carefully, check changelog
MINOR: new features, backward compatible
PATCH: bug fixes
```

### `node_modules` and `.gitignore`

```bash
# ALWAYS add to .gitignore — never commit node_modules
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
```

`package-lock.json` (CJS projects) or `package.json` with `--save-exact` pins exact versions. **Always commit `package-lock.json`** — it ensures reproducible installs across machines.

---

## ✅ Milestone Checklist

- [ ] I can export and import using both CJS and ESM syntax
- [ ] I know when to use `"type": "module"` in `package.json`
- [ ] I used `npm install` and understand the difference between dependencies and devDependencies
- [ ] I understand that `^4.x.x` allows minor updates but not major

## ➡️ Next Unit

[Lesson 03 — File System & Streams](./lesson_03.md)
