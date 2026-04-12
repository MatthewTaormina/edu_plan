# Lesson 07 — Testing Express APIs with Vitest + Supertest

> **Course:** Express API · **Time:** 60 minutes
> **🔗 Official Docs:** [Vitest](https://vitest.dev/) · [Supertest](https://github.com/ladjs/supertest) · [Wiki: Testing](../../domains/devops/testing.md)

---

## 🎯 Learning Objectives

- [ ] Set up Vitest for a Node.js/Express project
- [ ] Write integration tests with Supertest (no running server needed)
- [ ] Test CRUD endpoints, error responses, and auth
- [ ] Use mocks to isolate the HTTP layer from services

---

## 📖 Concepts

### Setup

```bash
npm install -D vitest supertest @types/supertest
```

```json
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals:     true,        // Skips importing describe, it, expect
        coverage: {
            provider:   'v8',
            reporter:   ['text', 'json', 'html'],
            include:    ['src/**/*.ts'],
            thresholds: { lines: 80, branches: 70 },
        }
    }
});
```

```json
// package.json scripts
"test":          "vitest run",
"test:watch":    "vitest",
"test:coverage": "vitest run --coverage"
```

### Export the App Separately

To test without starting a server, split `app` from `listen`:

```typescript
// src/app.ts — export the app
import express from 'express';
import tasksRouter from './routes/tasks.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();
app.use(express.json());
app.use('/tasks', tasksRouter);
app.use(errorHandler);

// src/index.ts — only import and start
import { app } from './app.js';
app.listen(3000, () => console.log('Listening on :3000'));
```

### Integration Tests with Supertest

```typescript
// src/routes/tasks.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app }  from '../app.js';

// Mocking the service layer (isolates HTTP from storage)
vi.mock('../services/taskService.js', () => ({
    taskService: {
        list:   vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
    },
}));

import { taskService } from '../services/taskService.js';

const mockTask = { id: 1, title: 'Buy milk', done: false, priority: 'medium' };

describe('GET /tasks', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns a paginated list of tasks', async () => {
        vi.mocked(taskService.list).mockResolvedValue({ data: [mockTask], total: 1 });

        const res = await request(app).get('/tasks');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0]).toMatchObject({ id: 1, title: 'Buy milk' });
        expect(taskService.list).toHaveBeenCalledOnce();
    });

    it('passes page and limit from query string', async () => {
        vi.mocked(taskService.list).mockResolvedValue({ data: [], total: 0 });

        await request(app).get('/tasks?page=2&limit=5');

        expect(taskService.list).toHaveBeenCalledWith(
            expect.objectContaining({ page: 2, limit: 5 })
        );
    });
});

describe('GET /tasks/:id', () => {
    it('returns a single task', async () => {
        vi.mocked(taskService.findById).mockResolvedValue(mockTask);

        const res = await request(app).get('/tasks/1');

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(mockTask);
    });

    it('returns 404 when task does not exist', async () => {
        vi.mocked(taskService.findById).mockResolvedValue(null);

        const res = await request(app).get('/tasks/999');

        expect(res.status).toBe(404);
        expect(res.body.code).toBe('NOT_FOUND');
    });
});

describe('POST /tasks', () => {
    it('creates a task and returns 201', async () => {
        vi.mocked(taskService.create).mockResolvedValue({ id: 2, ...mockTask });

        const res = await request(app)
            .post('/tasks')
            .send({ title: 'Buy milk', priority: 'high' })
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Buy milk');
        expect(taskService.create).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Buy milk', priority: 'high' })
        );
    });

    it('returns 422 when title is missing', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ priority: 'high' });

        expect(res.status).toBe(422);
        expect(res.body.code).toBe('VALIDATION_ERROR');
        expect(res.body.details[0].field).toBe('title');
    });

    it('returns 422 when priority is invalid', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ title: 'Test', priority: 'urgent' });  // 'urgent' not in enum

        expect(res.status).toBe(422);
    });
});
```

### Testing Authenticated Routes

```typescript
import { signAccessToken } from '../auth/jwt.js';

describe('DELETE /tasks/:id (requires auth)', () => {
    const validToken = signAccessToken({
        sub:   1,
        email: 'test@example.com',
        role:  'user',
    });

    it('rejects unauthenticated requests', async () => {
        const res = await request(app).delete('/tasks/1');
        expect(res.status).toBe(401);
    });

    it('allows authenticated users to delete their own tasks', async () => {
        vi.mocked(taskService.remove).mockResolvedValue(true);

        const res = await request(app)
            .delete('/tasks/1')
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.status).toBe(204);
    });
});
```

### What to Test

| Layer | Test type | Tool |
|-------|-----------|------|
| HTTP routing + middleware | Integration | Supertest |
| Validation logic | Unit | Vitest |
| Service functions | Unit (mocked deps) | Vitest |
| Auth middleware | Integration | Supertest |
| Error responses | Integration | Supertest |

---

## ✅ Milestone Checklist

- [ ] `npm test` passes all tests without a running server
- [ ] I mock the service layer so tests don't touch any database
- [ ] I test both happy-path and error responses (4xx)
- [ ] I test at least one protected route — both with and without a token

## ➡️ Next Unit

[Lesson 08 — Capstone: Task Manager REST API](./lesson_08.md)
