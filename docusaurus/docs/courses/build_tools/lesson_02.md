# Lesson 02 — ES Modules, Bundling & Tree-Shaking

> **Course:** Build Tools & Toolchain · **Time:** 45 minutes
> **📖 Wiki:** [JavaScript Core](../../domains/web_dev/javascript_core.md)
> **🔗 Official Docs:** [MDN: JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

## 🎯 Learning Objectives

- [ ] Write and import ES Modules using `import`/`export`
- [ ] Distinguish between named exports and default exports
- [ ] Explain why a bundler is needed for production
- [ ] Describe what tree-shaking is and why it reduces bundle size

---

## 📖 Concepts

### ES Modules

Before ES Modules (ES2015), JavaScript had no official module system. Developers used `<script>` tags in order or CommonJS (`require()`/`module.exports`). ES Modules are the native standard.

```javascript
// math.js — exporting
// Named exports — can have many per file
export function add(a, b)      { return a + b; }
export function subtract(a, b) { return a - b; }
export const PI = 3.14159;

// Default export — one per file, usually the main thing the module provides
export default function multiply(a, b) { return a * b; }
```

```javascript
// main.js — importing
import multiply from './math.js';              // Default import (name is up to you)
import { add, subtract } from './math.js';     // Named imports (must match export name)
import { add as sum } from './math.js';        // Rename on import
import * as math from './math.js';             // Import everything as a namespace

console.log(multiply(3, 4));   // 12
console.log(add(1, 2));        // 3
console.log(math.PI);          // 3.14159
```

### Re-exports — Barrel Files

A barrel file (`index.js`) re-exports from many modules, giving consumers a single import point.

```javascript
// components/index.js — barrel file
export { Button } from './Button.js';
export { Input }  from './Input.js';
export { Modal }  from './Modal.js';

// Consumer — one import instead of three
import { Button, Input, Modal } from './components/index.js';
```

### Dynamic Imports (Code Splitting)

```javascript
// Static import — loaded immediately with the page
import { Chart } from './chart.js';

// Dynamic import — loaded on demand (returns a Promise)
// Bundlers split dynamically-imported modules into separate files ("chunks")
async function showChart() {
    const { Chart } = await import('./chart.js');
    new Chart(document.querySelector('#canvas'));
}

// Load a module only when a specific route is visited (lazy loading)
document.querySelector('#chart-btn').addEventListener('click', showChart);
```

### Why You Need a Bundler

Browsers can load ES Modules natively, but for production:

| Problem | What a bundler does |
|---------|-------------------|
| 100+ import statements → 100 HTTP requests | **Combines** files into fewer, larger bundles |
| Development code (comments, whitespace) | **Minifies** — removes whitespace, renames variables to single letters |
| Modern JS not understood by older browsers | **Transpiles** via Babel/esbuild to compatible output |
| Large libraries → slow first load | **Tree-shakes** unused code away |
| CSS, images, fonts needed in JS | **Handles assets** — hashes filenames for long-term caching |

### Tree-Shaking

Tree-shaking statically analyses your imports and removes code that is never used.

```javascript
// lodash-es exports hundreds of functions
import { debounce } from 'lodash-es';
// Bundler detects ONLY debounce is imported
// OUTPUT: only debounce's code (< 1 KB), not all of lodash (25 KB)
```

**Tree-shaking only works with ES Modules** — the `import`/`export` syntax is statically analysable. CommonJS `require()` is not.

```javascript
// ❌ Tree-shaking cannot analyse these — the whole library gets included
const _ = require('lodash');
const { debounce } = require('lodash');

// ✅ Tree-shakable
import { debounce } from 'lodash-es';
```

---

## 🏗️ Assignments

### Assignment 1 — Modules Practice

1. Create `src/utils/format.js` with named exports: `formatDate(date)`, `formatCurrency(amount, currency)`, `capitalize(str)`.
2. Create `src/utils/index.js` that re-exports all three.
3. Create `src/main.js` that imports and uses all three from the barrel file.
4. Add `"type": "module"` to `package.json` so Node can run it.
5. Test with `node src/main.js`.

### Assignment 2 — Dynamic Import

Create a simple HTML page with a "Load Feature" button. When clicked, dynamically import a module that contains a function that renders a chart placeholder to the DOM.

---

## ✅ Milestone Checklist

- [ ] I can write named and default exports and import them correctly
- [ ] I understand why barrel files exist
- [ ] I can explain what a bundler does and why it's needed
- [ ] I can explain tree-shaking and why `import { debounce } from 'lodash-es'` is better than `import _ from 'lodash'`

## ➡️ Next Unit

[Lesson 03 — Vite in Depth](./lesson_03.md)
