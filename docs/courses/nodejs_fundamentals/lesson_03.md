# Lesson 03 — File System & Streams

> **Course:** Node.js Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [fs module](https://nodejs.org/api/fs.html) · [Streams](https://nodejs.org/api/stream.html)

---

## 🎯 Learning Objectives

- [ ] Read and write files with `fs/promises`
- [ ] List and traverse directories
- [ ] Understand streams and why they matter for large data
- [ ] Pipe streams together for efficient file processing

---

## 📖 Concepts

### `fs/promises` — The Modern File System API

```js
// Always use the promises API — avoid the callback version
import { readFile, writeFile, appendFile, unlink, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';  // Sync is OK for startup-time checks
import path from 'node:path';

// Read a file
const content = await readFile('./data.txt', 'utf-8');
console.log(content);

// Write (creates or overwrites)
await writeFile('./output.txt', 'Hello, World!\n');

// Append to a file
await appendFile('./log.txt', `${new Date().toISOString()} — Started\n`);

// Delete a file
await unlink('./temp.txt');

// File metadata
const info = await stat('./data.txt');
console.log(info.size);             // Bytes
console.log(info.isDirectory());    // false
console.log(info.mtime);           // Last modified time

// Safe existence check
if (existsSync('./config.json')) {
    const config = JSON.parse(await readFile('./config.json', 'utf-8'));
}
```

### Working with Directories

```js
import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

// Create a directory (recursive = create parent dirs too)
await mkdir('./output/reports', { recursive: true });

// List directory contents
const entries = await readdir('./src', { withFileTypes: true });
for (const entry of entries) {
    if (entry.isDirectory()) {
        console.log(`DIR:  ${entry.name}`);
    } else {
        console.log(`FILE: ${entry.name}`);
    }
}

// Remove directory and all contents
await rm('./temp', { recursive: true, force: true });

// Walk a directory tree recursively
async function* walkDir(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            yield* walkDir(full);  // Recurse
        } else {
            yield full;
        }
    }
}

// Usage: collect all .md files
const mdFiles = [];
for await (const file of walkDir('./docs')) {
    if (file.endsWith('.md')) mdFiles.push(file);
}
console.log(`Found ${mdFiles.length} markdown files`);
```

### Streams — Processing Large Data Efficiently

Without streams, reading a 1 GB log file loads everything into RAM:

```js
// BAD — loads 1 GB into RAM
const data = await readFile('./huge.log', 'utf-8');
```

With streams, data flows through in chunks:

```
File on Disk ──[Readable Stream]──► [Transform] ──► [Writable Stream]──► Output
                  (chunk 1)           (process)          (write)
                  (chunk 2)
                  (chunk 3)
                  ...
```

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

// Count lines in a huge file without loading it all into memory
let lineCount = 0;
let partial   = '';

const lineCounter = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
        const text  = partial + chunk.toString();
        const lines = text.split('\n');
        partial     = lines.pop() ?? '';      // Last (might be incomplete)
        lineCount  += lines.length;
        callback(null, chunk);               // Pass chunk through unchanged
    },
    flush(callback) {
        if (partial) lineCount++;            // Count the last line
        callback();
    }
});

await pipeline(
    createReadStream('./access.log'),
    lineCounter,
    createWriteStream('/dev/null')          // Discard output
);

console.log(`Total lines: ${lineCount}`);
```

### Practical Stream Example — Compress a File

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip }  from 'node:zlib';
import { pipeline }    from 'node:stream/promises';

// Compress access.log → access.log.gz
// Large file? Only a few KB of RAM used at any moment
await pipeline(
    createReadStream('./access.log'),
    createGzip(),
    createWriteStream('./access.log.gz')
);

console.log('Compressed!');
```

### `path` — Cross-Platform Paths

Always use `path` to join and resolve paths — never string concatenation:

```js
import path from 'node:path';

// Join segments (handles / vs \ automatically)
const config = path.join(__dirname, 'config', 'default.json');

// Resolve to absolute path
const abs = path.resolve('../reports/q1.csv');

// Useful extractors
path.basename('/src/utils/helper.js')      // 'helper.js'
path.extname ('report.2024.pdf')           // '.pdf'
path.dirname ('/src/utils/helper.js')      // '/src/utils'
path.parse   ('/src/index.js')             // { root, dir, base, ext, name }
```

---

## 🏗️ Assignments

### Assignment 1 — Directory Report

Write a script that accepts a directory path as a CLI argument and prints:
- Total number of files
- Total size in KB
- Top 5 largest files
- Breakdown by file extension (`.js: 12`, `.ts: 8`, etc.)

### Assignment 2 — Log Processor

Given a server access log (`access.log`) where each line is:
```
2026-04-12T10:30:00Z GET /api/users 200 45ms
```
Write a stream-based processor (no `readFileSync`) that outputs:
- Total requests
- Count per HTTP method
- Count per status code family (2xx, 4xx, 5xx)
- Average response time

---

## ✅ Milestone Checklist

- [ ] I use `fs/promises` (not the callback version) for all async file ops
- [ ] I use `path.join()` instead of string concatenation for file paths
- [ ] I used `pipeline()` to chain streams — not manual `.pipe()`
- [ ] I understand why streams use far less memory than loading whole files

## ➡️ Next Unit

[Lesson 04 — The HTTP Module: Raw Servers](./lesson_04.md)
