# Lesson 01 — What is Node.js: Runtime, Event Loop & Non-Blocking I/O

> **Course:** Node.js Fundamentals · **Time:** 60 minutes
> **📖 Wiki:** [Node.js Reference](../../domains/web_dev/nodejs.md)
> **🔗 Official Docs:** [About Node.js](https://nodejs.org/en/about) · [Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)

---

## 🎯 Learning Objectives

- [ ] Explain how Node.js runs JavaScript outside the browser
- [ ] Trace a request through the event loop phases
- [ ] Distinguish blocking vs non-blocking code
- [ ] Understand why Node.js is ideal for I/O-bound (not CPU-bound) work

---

## 📖 Concepts

### What Node.js Is

Node.js is a **JavaScript runtime** — not a language, not a framework. It takes the V8 JavaScript engine (the same engine in Chrome) and adds:
- Access to the file system, network, and OS
- The event loop scheduler
- Built-in modules (`fs`, `http`, `crypto`, `path`, etc.)
- The `npm` package ecosystem

```text
Browser environment          Node.js environment
──────────────────           ───────────────────
V8 engine                    V8 engine
Web APIs (DOM, fetch)        Node.js APIs (fs, http, os)
Window object                Global object (global/globalThis)
ES modules                   CommonJS + ES modules
```

### Blocking vs Non-Blocking

```js
// BLOCKING — holds up every other request until this finishes
import { readFileSync } from 'node:fs';
const data = readFileSync('/huge-log-file.txt', 'utf-8');  // Blocks for 2 seconds
console.log('Done');

// NON-BLOCKING — returns immediately; callback runs later
import { readFile } from 'node:fs';
readFile('/huge-log-file.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log('Done');
});
console.log('Not blocked — runs immediately');
```

**Why this matters:** A Node.js server runs on a single thread. If one request blocks, all other concurrent requests must wait. Non-blocking I/O lets the single thread serve thousands of connections simultaneously.

### The Event Loop

The event loop is the heart of Node.js. It continuously checks for work to do:

```
         ┌──────────────────────────┐
    ┌───►│         timers           │  setTimeout / setInterval
    │    └──────────┬───────────────┘
    │               │
    │    ┌──────────▼───────────────┐
    │    │     pending I/O          │  I/O callbacks from previous cycle
    │    └──────────┬───────────────┘
    │               │
    │    ┌──────────▼───────────────┐
    │    │         poll             │  New I/O events (blocks here if empty)
    │    └──────────┬───────────────┘
    │               │
    │    ┌──────────▼───────────────┐
    │    │         check            │  setImmediate callbacks
    │    └──────────┬───────────────┘
    │               │
    └───────────────┘
         (next tick queue + microtasks run between each phase)
```

```js
// Observe event loop ordering
console.log('1: synchronous');

setTimeout(() => console.log('2: timer'), 0);

Promise.resolve().then(() => console.log('3: microtask'));

setImmediate(() => console.log('4: check phase'));

console.log('5: synchronous');

// Output order:
// 1: synchronous
// 5: synchronous
// 3: microtask  ← microtask queue runs before next event loop phase
// 2: timer
// 4: check phase
```

### CPU-Bound Work Blocks the Event Loop

```js
// DON'T DO THIS in a server handler:
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// This blocks the event loop for ~10 seconds
// Every other request queues up and waits
app.get('/calculate', (req, res) => {
    const result = fibonacci(45);  // ← Blocks!
    res.json({ result });
});

// DO: Use worker threads for CPU-bound work
import { Worker } from 'node:worker_threads';
```

### Getting Started

```bash
# Verify Node.js installation (use v20 LTS or v22 LTS)
node --version   # v22.x.x
npm --version    # 10.x.x

# Run a JavaScript file
node app.js

# Interactive REPL (experiment here)
node

# Node.js 18+ built-in watch mode (no nodemon needed)
node --watch app.js
```

```js
// hello.js
console.log('Hello from Node.js!');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);   // 'win32' or 'linux'
console.log('CPU cores:', require('os').cpus().length);
```

---

## 🏗️ Assignments

### Assignment 1 — Event Loop Observer

Write a program that demonstrates the four ordering levels of async code:
1. Synchronous
2. `process.nextTick`
3. Resolved Promise (`.then`)
4. `setTimeout`

Predict the output order before running, then verify.

### Assignment 2 — Blocking vs Non-Blocking

Write two versions of a function that reads a 1 MB file and returns its character count:
1. Synchronous (`readFileSync`)
2. Async (`readFile` with callback or `readFile` from `fs/promises`)

Log "reading file..." and "done" in both cases and explain the output order difference.

---

## ✅ Milestone Checklist

- [ ] I can explain the event loop in my own words
- [ ] I understand why blocking the event loop is dangerous in a server
- [ ] I ran `node --watch` and understand hot-reloading
- [ ] I observed the difference in execution order between sync, microtask, and timer callbacks

## ➡️ Next Unit

[Lesson 02 — Modules: CommonJS, ESM, and npm](./lesson_02.md)
