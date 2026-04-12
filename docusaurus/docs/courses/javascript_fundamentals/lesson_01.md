# Lesson 01 — Execution Context

> **Course:** Vanilla JavaScript Fundamentals · **Time:** 45 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Link a JavaScript file to an HTML document using `<script>`
- [ ] Understand why script placement matters (`defer` vs `async`)
- [ ] Use `console.log()`, `console.warn()`, and `console.error()` to inspect values
- [ ] Open and use the browser DevTools console
- [ ] Understand the difference between `'use strict'` and sloppy mode

---

## 📖 Concepts

### Adding JavaScript to HTML

There are three ways to link JavaScript to an HTML document:

```html
<!-- Method 1: External file (preferred — same reasons as external CSS) -->
<!-- Place in <head> with defer to avoid blocking HTML parsing -->
<head>
    <script src="main.js" defer></script>
</head>

<!-- Method 2: Inline <script> block (acceptable for small demos) -->
<body>
    <!-- ... content ... -->
    <script>
        console.log('Hello from inline script!');
    </script>
</body>

<!-- Method 3: Inline event attribute (never do this in real projects) -->
<button onclick="doSomething()">Click me</button>
```

### `defer` vs `async`

When the browser encounters a `<script>` tag in `<head>` without attributes, it **stops parsing HTML**, fetches the script, executes it, then resumes. This blocks rendering.

| Attribute | Fetch | Execute | Use when... |
|-----------|-------|---------|-------------|
| *(none)* | Blocks HTML | Immediately | Rarely: only for truly critical, tiny scripts |
| `async` | Parallel | As soon as fetched (may interrupt HTML) | Analytics, ads — scripts that don't need the DOM |
| `defer` | Parallel | After HTML is fully parsed | **Almost always — your default choice** |

```html
<!-- ✅ Correct: script loads in parallel, runs after HTML is ready -->
<script src="main.js" defer></script>

<!-- ⚠️  async — unpredictable order if multiple scripts depend on each other -->
<script src="analytics.js" async></script>
```

### The DevTools Console

Open DevTools in any browser:
- **Chrome / Edge**: `F12` or `Ctrl+Shift+J`
- **Firefox**: `F12` or `Ctrl+Shift+K`
- **Safari**: Enable "Show Develop menu" in settings, then `Cmd+Option+J`

```javascript
// main.js — start every lesson by opening DevTools and checking for errors!

// Basic output
console.log('Script loaded successfully');

// Inspect variable values
const userName = 'Alex';
const age = 28;
console.log('User:', userName, '| Age:', age);

// Object logging (inspectable in the console)
const user = { name: 'Alex', role: 'developer' };
console.log(user);          // Logs expandable object
console.table([user]);      // Logs as a formatted table

// Warnings and errors (different colors in the console)
console.warn('This is a warning — check your inputs');
console.error('This is an error — something went wrong');

// Grouping related logs
console.group('Initialization');
    console.log('Step 1: DOM loaded');
    console.log('Step 2: Data fetched');
console.groupEnd();

// Timing code execution
console.time('render');
// ... some code ...
console.timeEnd('render');  // Logs: "render: 3.47ms"
```

### `'use strict'`

Strict mode catches common mistakes that would silently fail in "sloppy" mode.

```javascript
'use strict'; // Place at the very top of your script file

// Without strict mode, assigning to an undeclared variable creates a global (silent bug)
// typoVariable = 42;  // ❌ This fails silently in sloppy mode

// With strict mode:
// typoVariable = 42;  // ✅ Throws: "ReferenceError: typoVariable is not defined"
```

> [!TIP]
> Modern JavaScript modules (`type="module"`) are strict mode by default. When using modules, you don't need the `'use strict'` directive.

### Variable Declarations — `let`, `const`, `var`

For a full treatment, see [Programming Basics](../../domains/foundations/programming_basics.md). In the browser context:

```javascript
// const — cannot be reassigned (use by default)
const API_URL = 'https://api.example.com';

// let — can be reassigned (use when the value changes)
let score = 0;
score += 10;  // OK

// var — function-scoped, hoisted, no block scope. AVOID in modern code.
// var stillUsed = 'legacy projects only';
```

---

## 🏗️ Assignments

### Assignment 1 — Hello, DevTools

Create `index.html` with a linked `main.js` (using `defer`). In `main.js`:
1. Log a greeting message.
2. Declare three variables (your name, age, favorite color) and log them together.
3. Log an object with at least five properties.
4. Use `console.table()` on an array of three objects.

Open the page in the browser and verify the output in DevTools.

### Assignment 2 — Find the Bug

Add a deliberate typo to a variable assignment (e.g., `usrnam = 'Alex'` instead of `userName`). Add `'use strict'` and confirm the error appears in the console. Then fix it.

---

## ✅ Milestone Checklist

- [ ] I linked an external `main.js` using `<script defer>`
- [ ] I can open the DevTools console in my browser
- [ ] I used `console.log`, `console.warn`, and `console.error`
- [ ] I understand why `defer` is better than placing `<script>` at the bottom of `<body>`

## 🏆 Milestone Complete!

JavaScript is running in your page.

## ➡️ Next Unit

[Lesson 02 — Querying the DOM](./lesson_02.md)
