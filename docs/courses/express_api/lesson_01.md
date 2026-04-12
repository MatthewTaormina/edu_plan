# Lesson 01 — Express Setup, Routing & TypeScript

> **Course:** Express API · **Time:** 60 minutes
> **📖 Wiki:** [HTTP Servers & Middleware](../../domains/web_dev/http_server.md) · [REST APIs](../../domains/web_dev/rest_api.md)
> **🔗 Official Docs:** [Express.js](https://expressjs.com/en/4x/api.html)

---

## 🎯 Learning Objectives

- [ ] Scaffold a TypeScript + Express project
- [ ] Define routes with `express.Router`
- [ ] Understand why Express exists (vs raw `http` module)
- [ ] Know Express's limitations and the Fastify alternative

---

## 📖 Concepts

### Why Express?

In [Node.js Lesson 04](../nodejs_fundamentals/lesson_04.md) you built a raw HTTP server. It required manual:
- Body parsing (collecting stream chunks)
- URL parsing (`new URL(req.url, ...)`)
- Route matching (regex or string comparisons)

Express provides all of this plus a composable middleware system.

> **Fastify (Modern Alternative):** [Fastify](https://fastify.dev/) is faster (2× throughput on benchmarks), has built-in TypeScript support, and is now more commonly recommended for new projects. Express is covered here because it has a larger existing codebase, more Stack Overflow coverage, and lower friction for beginners.
> Once you understand Express, switching to Fastify takes ~2 hours.

### Project Setup

```bash
mkdir task-api && cd task-api
npm init -y

npm install express
npm install -D typescript ts-node-dev @types/node @types/express

npx tsc --init
```

**`tsconfig.json`** — update these settings:
```json
{
    "compilerOptions": {
        "target":       "ES2022",
        "module":       "NodeNext",
        "moduleResolution": "NodeNext",
        "outDir":       "./dist",
        "rootDir":      "./src",
        "strict":       true,
        "esModuleInterop": true
    }
}
```

**`package.json`** scripts:
```json
{
    "scripts": {
        "dev":   "ts-node-dev --respawn --transpile-only src/index.ts",
        "build": "tsc",
        "start": "node dist/index.js"
    }
}
```

### Minimal Express Server

```typescript
// src/index.ts
import express from 'express';

const app  = express();
const PORT = Number(process.env.PORT) || 3000;

// Built-in middleware — parse JSON request bodies
app.use(express.json());

// A simple route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

```bash
npm run dev
curl http://localhost:3000     # {"message":"Hello from Express!"}
```

### Modular Routing with `express.Router`

Don't put all routes in `index.ts`. Group by resource:

```typescript
// src/routes/tasks.ts
import { Router } from 'express';

const router = Router();

// In-memory store (replaced by DB later)
interface Task { id: number; title: string; done: boolean; }
let tasks: Task[] = [
    { id: 1, title: 'Buy milk',   done: false },
    { id: 2, title: 'Write code', done: true  },
];
let nextId = 3;

// GET /tasks
router.get('/', (req, res) => {
    res.json(tasks);
});

// GET /tasks/:id
router.get('/:id', (req, res) => {
    const task = tasks.find(t => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
});

// POST /tasks
router.post('/', (req, res) => {
    const { title } = req.body as { title?: string };
    if (!title) return res.status(400).json({ error: 'title is required' });
    const task: Task = { id: nextId++, title, done: false };
    tasks.push(task);
    res.status(201).json(task);
});

// PUT /tasks/:id
router.put('/:id', (req, res) => {
    const idx = tasks.findIndex(t => t.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    tasks[idx] = { ...tasks[idx], ...req.body };
    res.json(tasks[idx]);
});

// DELETE /tasks/:id
router.delete('/:id', (req, res) => {
    const idx = tasks.findIndex(t => t.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    tasks.splice(idx, 1);
    res.status(204).end();
});

export default router;
```

```typescript
// src/index.ts — mount the router
import express from 'express';
import tasksRouter from './routes/tasks.js';

const app = express();
app.use(express.json());

app.use('/tasks', tasksRouter);  // All /tasks/* routes

app.listen(3000, () => console.log('Listening on :3000'));
```

### Express Request/Response Cheatsheet

```typescript
// Request
req.params.id           // Route param:  /tasks/:id → '42'
req.query.page          // Query string: /tasks?page=2 → '2'
req.body                // Parsed JSON body (requires express.json() middleware)
req.headers             // All headers as lowercase object
req.headers.authorization  // 'Bearer eyJ...'
req.method              // 'GET', 'POST', etc.
req.path                // '/tasks/42'
req.get('Content-Type') // Read a specific header

// Response
res.status(201)                 // Set status code (chainable)
res.json({ id: 1, title: '...' })  // Send JSON + Content-Type header
res.send('Plain text')              // Send string
res.sendFile(path)                  // Send a file
res.redirect('/tasks')              // 302 redirect
res.set('X-Custom', 'value')        // Set response header
res.status(204).end()               // No content
```

---

## ✅ Milestone Checklist

- [ ] My Express server starts with `npm run dev` and hot-reloads on changes
- [ ] CRUD routes are in a separate `Router`, not all in `index.ts`
- [ ] I can `curl` all five CRUD endpoints and get correct responses
- [ ] I understand the difference between `req.params`, `req.query`, and `req.body`

## ➡️ Next Unit

[Lesson 02 — Middleware: Built-in, Third-Party & Custom](./lesson_02.md)
