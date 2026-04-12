# Lesson 05 — Environment, Process & CLI Args

> **Course:** Node.js Fundamentals · **Time:** 45 minutes
> **🔗 Official Docs:** [process object](https://nodejs.org/api/process.html) · [--env-file](https://nodejs.org/api/cli.html)

---

## 🎯 Learning Objectives

- [ ] Read environment variables safely with defaults
- [ ] Parse command-line arguments with `process.argv` and `parseArgs`
- [ ] Handle `SIGINT`/`SIGTERM` for graceful shutdown
- [ ] Use `process.exit()` codes correctly

---

## 📖 Concepts

### Environment Variables

Environment variables configure behaviour without changing code:

```bash
# Set on a single command (Linux / PowerShell)
NODE_ENV=production node server.js          # Linux / macOS
$env:NODE_ENV="production"; node server.js  # PowerShell

# .env file (development only — NEVER commit)
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://localhost/myapp
JWT_SECRET=supersecret123
```

```js
// Load .env file — Node.js 20.6+ (no dotenv package needed)
// node --env-file=.env src/index.js

// OR use dotenv package for older Node
import 'dotenv/config';

// Read with safe defaults
const PORT     = Number(process.env.PORT)     || 3000;
const NODE_ENV = process.env.NODE_ENV         || 'development';
const JWT_SEC  = process.env.JWT_SECRET;

// Validate required variables at startup (fail fast)
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
        console.error(`Missing required env var: ${key}`);
        process.exit(1);  // Exit code 1 = error
    }
}
```

### Centralise Config

```js
// src/config.ts
export const config = {
    port:     Number(process.env.PORT)     || 3000,
    nodeEnv:  process.env.NODE_ENV         || 'development',
    jwtSecret: process.env.JWT_SECRET      || (() => { throw new Error('JWT_SECRET required'); })(),
    isDev:    process.env.NODE_ENV !== 'production',
} as const;

// Usage: import { config } from './config.js'
```

### CLI Arguments

```bash
node cli.js report --format csv --output ./results.csv
```

```js
// process.argv = ['node', 'cli.js', 'report', '--format', 'csv', '--output', './results.csv']
const args = process.argv.slice(2);  // Remove 'node' and script name
```

#### Modern approach — `parseArgs` (Node.js 18.3+)

```js
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({
    args:    process.argv.slice(2),
    options: {
        format:  { type: 'string',  short: 'f', default: 'json' },
        output:  { type: 'string',  short: 'o' },
        verbose: { type: 'boolean', short: 'v', default: false },
    },
    allowPositionals: true,
});

// node cli.js report --format csv -o ./out.csv --verbose
// positionals = ['report']
// values.format = 'csv'
// values.output = './out.csv'
// values.verbose = true

console.log('Command:', positionals[0]);
console.log('Format:', values.format);
```

### Graceful Shutdown

When a server is stopped (Ctrl+C, `kill`, Docker `SIGTERM`), you want to:
1. Stop accepting new connections
2. Finish in-progress requests
3. Close database connections
4. Exit cleanly

```js
import { createServer } from 'node:http';

const server = createServer(app);
server.listen(PORT, () => console.log(`Listening on :${PORT}`));

// Handle shutdown signals
async function shutdown(signal) {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);

    // Stop accepting new connections
    server.close(async () => {
        console.log('HTTP server closed');

        // Close DB connections, flush buffers, etc.
        // await db.end();
        // await redis.quit();

        console.log('All connections closed. Exiting.');
        process.exit(0);  // 0 = success
    });

    // Force exit if shutdown takes too long
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));  // Docker stop, Kubernetes
process.on('SIGINT',  () => shutdown('SIGINT'));   // Ctrl+C
```

### `process` Quick Reference

```js
process.env           // Environment variables object
process.argv          // Command line arguments array
process.cwd()         // Current working directory
process.version       // Node.js version: 'v22.0.0'
process.platform      // 'win32', 'linux', 'darwin'
process.exit(0)       // Exit with success code
process.exit(1)       // Exit with error code
process.stdout.write  // Write to stdout (like console.log but no newline)
process.stderr.write  // Write to stderr
process.uptime()      // Seconds since Node.js started
process.memoryUsage() // Heap and RSS memory info
```

---

## ✅ Milestone Checklist

- [ ] All config is read from environment variables — no hardcoded values
- [ ] My app fails fast at startup if required env vars are missing
- [ ] I used `parseArgs` to create a CLI with named flags
- [ ] I added `SIGTERM` and `SIGINT` handlers for graceful shutdown

## ➡️ Next Unit

[Lesson 06 — Async Patterns: Callbacks → Promises → async/await](./lesson_06.md)
