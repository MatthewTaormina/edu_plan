# Node.js

> **Status:** 🟢 Modern | **Introduced:** 2009 · **Latest:** v22 LTS (2024) · **Deprecated:** N/A

Node.js is a **server-side JavaScript runtime** built on V8 (Chrome's JS engine). It executes JavaScript outside the browser, enabling the same language on both frontend and backend.

---

## What Makes Node.js Different

### Non-Blocking, Event-Driven I/O

Traditional servers (Apache, Python's `socket`) create a new **thread per request**. Threads have overhead (~1–8 MB RAM each), and blocking I/O (waiting for a file or database) wastes CPU.

Node.js uses a **single thread** with an **event loop**. I/O operations are handed off to the OS; the event loop continues processing other work. When the OS completes the I/O, a callback is queued.

```
Request arrives
  ↓
Event loop picks it up
  ↓
Start I/O (read file, query DB) → hands off to OS
  ↓                                   ↓
Handle other requests          OS completes I/O
                                       ↓
                              Callback queued on event loop
                                       ↓
                              Event loop processes callback
```

**Result:** A single Node.js process can handle thousands of concurrent connections with minimal memory compared to a thread-per-request model.

> [!NOTE]
> Node.js is excellent for **I/O-intensive** workloads (APIs, real-time apps, file processing).
> It is **not** ideal for **CPU-intensive** workloads (video encoding, image processing, ML inference) — those block the event loop. Use worker threads or a separate service for CPU work.

### The Event Loop Phases

```
timers      → setTimeout, setInterval callbacks
I/O         → completed I/O event callbacks
idle        → internal use only
poll        → retrieve new I/O events (blocks here if queue empty)
check       → setImmediate callbacks
close       → cleanup callbacks (socket.on('close', ...))
```

`process.nextTick()` and `Promise.then()` callbacks run **between** phases (microtask queue).

---

## Module System

### CommonJS (CJS) — Legacy, still common

```js
// math.js
function add(a, b) { return a + b; }
module.exports = { add };

// main.js
const { add } = require('./math');
```

### ES Modules (ESM) — Modern standard

```js
// math.mjs  (or package.json: "type": "module")
export function add(a, b) { return a + b; }

// main.mjs
import { add } from './math.mjs';
```

**Key differences:**

| | CJS | ESM |
|-|----|-----|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous |
| Static analysis | ❌ (dynamic) | ✅ (enables tree-shaking) |
| `__dirname` | ✅ Available | ❌ Use `import.meta.url` |
| Top-level await | ❌ | ✅ |

---

## Built-in Modules

### `fs` — File System

```js
import { readFile, writeFile, readdir } from 'node:fs/promises';

// Read a file
const content = await readFile('./data.txt', 'utf-8');

// Write a file
await writeFile('./output.txt', 'Hello, Node!');

// List directory
const files = await readdir('./src');

// Stream a large file (efficient — doesn't load entire file into memory)
import { createReadStream } from 'node:fs';
createReadStream('./large.csv').pipe(process.stdout);
```

### `path` — Cross-Platform Path Handling

```js
import path from 'node:path';

path.join('/src', 'utils', 'helper.js')   // /src/utils/helper.js
path.resolve('../config.json')            // Absolute path
path.extname('report.pdf')               // '.pdf'
path.basename('/src/index.js')           // 'index.js'
path.dirname('/src/utils/helper.js')     // '/src/utils'

// ESM equivalent of __dirname
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

### `http` — Raw HTTP Server

```js
import { createServer } from 'node:http';

const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello' }));
});

server.listen(3000, () => console.log('Listening on :3000'));
```

### `crypto` — Hashing & Random

```js
import { randomUUID, createHash } from 'node:crypto';

const id   = randomUUID();                             // 'b1b6...'
const hash = createHash('sha256').update('password').digest('hex');
```

### `os` — Operating System Info

```js
import os from 'node:os';

os.platform()   // 'win32' | 'linux' | 'darwin'
os.cpus().length // Number of CPU cores
os.freemem()    // Free memory in bytes
os.homedir()    // '/home/user' or 'C:\Users\user'
```

### `events` — EventEmitter Pattern

```js
import { EventEmitter } from 'node:events';

class Downloader extends EventEmitter {
    download(url) {
        this.emit('start', url);
        // ... download logic
        this.emit('progress', 50);
        this.emit('done',  { url, size: 1024 });
    }
}

const dl = new Downloader();
dl.on('start',    url  => console.log(`Starting: ${url}`));
dl.on('progress', pct  => console.log(`${pct}%`));
dl.on('done',     data => console.log(`Done! ${data.size} bytes`));
```

---

## npm — Package Management

```bash
npm init -y                      # Create package.json
npm install express              # Add runtime dependency
npm install -D typescript vitest # Dev-only dependency
npm install -g nodemon           # Global CLI tool

npm run <script>                 # Run a script from package.json
npm update                       # Update all dependencies
npm audit                        # Check for security vulnerabilities
```

### `package.json` Essentials

```json
{
    "name": "my-api",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "start":   "node src/index.js",
        "dev":     "node --watch src/index.js",
        "test":    "vitest"
    },
    "dependencies": {
        "express": "^4.19.2"
    },
    "devDependencies": {
        "vitest": "^1.6.0"
    }
}
```

> [!TIP]
> Node.js 18+ ships `node --watch` (built-in auto-restart). You no longer need `nodemon` for basic development.

---

## Environment Variables

```js
// .env file (never commit this)
// PORT=3000
// API_KEY=abc123

// Load with dotenv (npm install dotenv)
import 'dotenv/config';

const port   = process.env.PORT   ?? 3000;
const apiKey = process.env.API_KEY ?? '';

// Or in Node.js 20.6+, use the native --env-file flag:
// node --env-file=.env src/index.js
```

---

## Streams

Streams allow processing data piece-by-piece, avoiding loading the whole payload into memory:

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline }                             from 'node:stream/promises';
import { createGzip }                           from 'node:zlib';

// Compress a large file without reading it all into RAM
await pipeline(
    createReadStream('large.csv'),
    createGzip(),
    createWriteStream('large.csv.gz')
);
```

---

## 📚 See Also

- [Course: Node.js Fundamentals](../../courses/nodejs_fundamentals/index.md)
- [Course: Express API](../../courses/express_api/index.md)
- [Reference: REST APIs](./rest_api.md)
- [Official Docs: nodejs.org](https://nodejs.org/en/docs)
- [Node.js Best Practices (GitHub)](https://github.com/goldbergyoni/nodebestpractices)
