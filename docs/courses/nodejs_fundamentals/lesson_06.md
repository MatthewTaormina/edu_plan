# Lesson 06 — Async Patterns: Callbacks → Promises → async/await

> **Course:** Node.js Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) · [async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)

---

## 🎯 Learning Objectives

- [ ] Explain callback hell and why it's a problem
- [ ] Convert callback-based code to Promises with `promisify`
- [ ] Write clean async/await code with proper error handling
- [ ] Run async operations in parallel with `Promise.all` and `Promise.allSettled`

---

## 📖 Concepts

### Generation 1: Callbacks

Node.js's original async API uses a **error-first callback** convention:

```js
// Convention: callback(error, result)
import { readFile } from 'node:fs';

readFile('./config.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Read failed:', err.message);
        return;
    }
    const config = JSON.parse(data);

    // Nested callback — the "callback hell" begins
    readFile(config.logFile, 'utf-8', (err2, logContent) => {
        if (err2) return console.error(err2);

        // Another nested callback...
        readFile(config.dataFile, 'utf-8', (err3, dataContent) => {
            // Pyramid of doom — hard to read, hard to handle errors
        });
    });
});
```

### Generation 2: Promises

Promises represent a future value and allow chaining:

```js
import { readFile } from 'node:fs/promises';  // Promise-based version

readFile('./config.json', 'utf-8')
    .then(data => {
        const config = JSON.parse(data);
        return readFile(config.logFile, 'utf-8');
    })
    .then(logContent => {
        console.log('Log:', logContent);
    })
    .catch(err => {
        // ONE error handler for any step in the chain
        console.error('Failed:', err.message);
    })
    .finally(() => {
        console.log('Done (success or error)');
    });
```

### Generation 3: async/await (Current Best Practice)

`async/await` is syntactic sugar over Promises — same mechanism, cleaner syntax:

```js
import { readFile } from 'node:fs/promises';

async function loadConfig() {
    // try/catch for error handling (like synchronous code)
    try {
        const data   = await readFile('./config.json', 'utf-8');
        const config = JSON.parse(data);
        const log    = await readFile(config.logFile, 'utf-8');

        return { config, log };
    } catch (err) {
        // Any await rejection ends up here
        throw new Error(`Config load failed: ${err.message}`);
    }
}

// Top-level await (ESM only)
const { config, log } = await loadConfig();
console.log('Loaded:', config.appName);
```

### Converting Callback APIs to Promises

Use `util.promisify` to wrap old callback-style functions:

```js
import { promisify } from 'node:util';
import { exec }      from 'node:child_process';

const execAsync = promisify(exec);

const { stdout, stderr } = await execAsync('git log --oneline -5');
console.log(stdout);
```

### Parallel Execution — `Promise.all`

Sequential `await` waits for each operation before starting the next. Use `Promise.all` when operations are independent:

```js
import { readFile } from 'node:fs/promises';

// SEQUENTIAL — takes 3× as long
const config  = await readFile('./config.json',  'utf-8');
const schema  = await readFile('./schema.sql',   'utf-8');
const template = await readFile('./template.html', 'utf-8');

// PARALLEL — all three start simultaneously
const [config, schema, template] = await Promise.all([
    readFile('./config.json',   'utf-8'),
    readFile('./schema.sql',    'utf-8'),
    readFile('./template.html', 'utf-8'),
]);
// Duration = max of the three, not sum

// CAUTION: Promise.all rejects if ANY promise rejects
// Use Promise.allSettled to get results regardless:
const results = await Promise.allSettled([
    fetch('/api/users'),
    fetch('/api/posts'),
    fetch('/api/broken'),   // This fails
]);

for (const result of results) {
    if (result.status === 'fulfilled') {
        console.log('OK:', result.value);
    } else {
        console.error('Failed:', result.reason);
    }
}
```

### Practical Async Error Handling

```js
// Wrap an async function to prevent unhandled rejections
async function fetchUserSafe(id) {
    try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        // Log and return null instead of crashing
        console.error(`fetchUser(${id}) failed:`, err.message);
        return null;
    }
}

// Rate-limited parallel processing with Promise.all batching
async function processItems(items, batchSize = 5) {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(processItem));
        results.push(...batchResults);
    }
    return results;
}
```

### AsyncIterators — Streaming Async Data

```js
// Process a file line by line without loading it all into memory
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLines(filePath) {
    const rl = createInterface({
        input: createReadStream(filePath),
        crlfDelay: Infinity   // Handle \r\n on Windows
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        // Process each line without storing them all
        if (line.includes('ERROR')) {
            console.log(`Line ${lineNum}: ${line}`);
        }
    }
    console.log(`Processed ${lineNum} lines`);
}

await processLines('./access.log');
```

---

## ✅ Milestone Checklist

- [ ] I can convert a callback-based function to a Promise using `promisify`
- [ ] I use `async/await` with `try/catch` for all async code
- [ ] I use `Promise.all` when operations are independent (not sequential `await`)
- [ ] I understand why sequential `await` can be a performance problem

## ➡️ Next Unit

[Lesson 07 — Capstone: CLI File Processor](./lesson_07.md)
