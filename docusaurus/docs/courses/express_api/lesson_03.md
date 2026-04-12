# Lesson 03 — Request & Response: Params, Body & Headers

> **Course:** Express API · **Time:** 45 minutes
> **📖 Wiki:** [HTTP Servers & Middleware](../../domains/web_dev/http_server.md)

---

## 🎯 Learning Objectives

- [ ] Read all parts of a request: params, query, body, and headers
- [ ] Send JSON, files, and redirect responses
- [ ] Set response headers and status codes correctly
- [ ] Type request bodies with TypeScript interfaces

---

## 📖 Concepts

### Route Parameters

```typescript
// Route: /users/:userId/tasks/:taskId
router.get('/:userId/tasks/:taskId', (req, res) => {
    const { userId, taskId } = req.params;  // Both are strings
    const uid = Number(userId);
    const tid = Number(taskId);

    if (isNaN(uid) || isNaN(tid)) {
        return res.status(400).json({ error: 'IDs must be numbers' });
    }

    res.json({ userId: uid, taskId: tid });
});

// Optional params with regex constraint
router.get('/users/:id(\\d+)', handler);   // Only matches numeric IDs
```

### Query Strings

```typescript
// GET /tasks?status=todo&page=2&limit=10&tags=work,home
router.get('/', (req, res) => {
    // All query params are strings — always validate/parse
    const status = req.query.status as string | undefined;
    const page   = Number(req.query.page)  || 1;
    const limit  = Number(req.query.limit) || 20;
    const tags   = req.query.tags
        ? String(req.query.tags).split(',')
        : [];

    res.json({ status, page, limit, tags });
});
```

### Typed Request Bodies

Use TypeScript interfaces to type `req.body`:

```typescript
// Extend Request type to narrow the body
import { Request } from 'express';

interface CreateTaskBody {
    title:    string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;      // ISO 8601
}

interface UpdateTaskBody {
    title?:    string;
    done?:     boolean;
    priority?: 'low' | 'medium' | 'high';
}

// Typed route handler
router.post(
    '/',
    (req: Request<{}, {}, CreateTaskBody>, res) => {
        const { title, priority, dueDate } = req.body;
        // Now TypeScript knows the types
        res.status(201).json({ id: 1, title, priority, dueDate, done: false });
    }
);
```

:::note
Typing `req.body` only narrowing the TypeScript view — it doesn't validate at runtime. Use Zod validation (Lesson 04) to ensure the data actually matches the type.
:::

### Headers

```typescript
// Reading request headers
router.post('/upload', (req, res) => {
    const contentType = req.get('Content-Type');   // Or: req.headers['content-type']
    const authHeader  = req.get('Authorization');  // 'Bearer eyJ...'
    const userAgent   = req.get('User-Agent');

    // Custom headers (lowercase in Node)
    const apiKey      = req.get('X-API-Key');

    if (!apiKey) return res.status(401).json({ error: 'API key required' });

    res.json({ received: true });
});

// Setting response headers
router.get('/data', (req, res) => {
    res
        .set('Cache-Control', 'public, max-age=3600')
        .set('X-Data-Version', '2')
        .json({ data: [1, 2, 3] });
});
```

### Sending Different Response Types

```typescript
// JSON (most common for APIs)
res.status(200).json({ id: 1, title: 'Buy milk' });
res.status(201).json({ id: 2, title: 'New task' });
res.status(204).end();             // No Content — DELETE success

// Redirect
res.redirect(301, '/new-location');    // Permanent
res.redirect(302, '/temp-location');   // Temporary

// Download a file
res.download('./exports/report.csv', 'report.csv');

// Send a file for display (images, PDFs)
res.sendFile(path.resolve('./uploads/photo.jpg'));

// Stream response (for large files)
import { createReadStream } from 'node:fs';
res.setHeader('Content-Type', 'application/octet-stream');
createReadStream('./big-file.zip').pipe(res);
```

### Pagination Pattern

```typescript
// Standard pagination response envelope
router.get('/', async (req, res) => {
    const page    = Math.max(1, Number(req.query.page)  || 1);
    const limit   = Math.min(100, Number(req.query.limit) || 20);
    const offset  = (page - 1) * limit;

    // (Simulate DB query — in real code: await db.query(...))
    const allTasks = await getTasks();
    const total    = allTasks.length;
    const items    = allTasks.slice(offset, offset + limit);

    res.json({
        data: items,
        meta: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        }
    });
});
```

---

## ✅ Milestone Checklist

- [ ] I parse numeric route params and return 400 if they're not numbers
- [ ] I type `req.body` with an interface (even though validation comes in Lesson 04)
- [ ] I include pagination metadata in list responses
- [ ] I use `res.status(...).json(...)` chaining — never send two responses

## ➡️ Next Unit

[Lesson 04 — Error Handling & Input Validation with Zod](./lesson_04.md)
