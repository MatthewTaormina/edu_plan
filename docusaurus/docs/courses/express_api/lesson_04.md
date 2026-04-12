# Lesson 04 — Error Handling & Input Validation with Zod

> **Course:** Express API · **Time:** 60 minutes
> **🔗 Official Docs:** [Zod](https://zod.dev/) · [Express error handling](https://expressjs.com/en/guide/error-handling.html)

---

## 🎯 Learning Objectives

- [ ] Implement a consistent error-handling strategy across the API
- [ ] Create typed `AppError` classes for domain errors
- [ ] Validate request bodies, params, and query strings with Zod
- [ ] Write a reusable `validate` middleware

---

## 📖 Concepts

### The Problem with Naive Error Handling

```typescript
// Without a strategy — each route handles errors differently
router.post('/', async (req, res) => {
    if (!req.body.title) {
        res.status(400).json({ error: 'title is required' });
        return;
    }
    try {
        const task = await db.create(req.body);
        res.json(task);
    } catch (err) {
        // What error shape does this send?
        res.status(500).json({ error: err.message });  // Leaks internals!
    }
});
```

Consistent APIs need consistent error responses. A contract:

```json
{
    "error":   "Validation failed",
    "code":    "VALIDATION_ERROR",
    "details": [
        { "field": "title", "message": "Required" },
        { "field": "priority", "message": "Must be low | medium | high" }
    ]
}
```

### Typed Error Classes

```typescript
// src/errors.ts
export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly code: string       = 'APP_ERROR',
        public readonly details?: unknown
    ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, id: number | string) {
        super(404, `${resource} '${id}' not found`, 'NOT_FOUND');
    }
}

export class ValidationError extends AppError {
    constructor(details: { field: string; message: string }[]) {
        super(422, 'Validation failed', 'VALIDATION_ERROR', details);
    }
}

export class UnauthorisedError extends AppError {
    constructor(message = 'Authentication required') {
        super(401, message, 'UNAUTHORISED');
    }
}
```

### Central Error Handler

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors.js';
import { ZodError } from 'zod';

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Zod validation errors
    if (err instanceof ZodError) {
        res.status(422).json({
            error:   'Validation failed',
            code:    'VALIDATION_ERROR',
            details: err.errors.map(e => ({
                field:   e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }

    // Our typed errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error:   err.message,
            code:    err.code,
            details: err.details,
        });
        return;
    }

    // Unexpected errors
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : (err instanceof Error ? err.message : 'Unknown error'),
        code: 'INTERNAL_ERROR',
    });
}
```

### Async Route Wrapper

Avoid writing `try/catch` in every route — wrap them:

```typescript
// src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

// Note: returns a plain (req, res, next) function that Express understands
export function asyncHandler(fn: AsyncFn): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);  // next(err) → error handler
    };
}
```

```typescript
// Clean route — no try/catch needed
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../errors.js';

router.get('/:id', asyncHandler(async (req, res) => {
    const task = await taskService.findById(Number(req.params.id));
    if (!task) throw new NotFoundError('Task', req.params.id);  // ← Caught by asyncHandler
    res.json(task);
}));
```

### Input Validation with Zod

```bash
npm install zod
```

```typescript
// src/schemas/task.schema.ts
import { z } from 'zod';

export const CreateTaskSchema = z.object({
    title:    z.string().min(1, 'Title is required').max(200),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    dueDate:  z.string().datetime({ offset: true }).optional(),
    tags:     z.array(z.string().max(50)).max(10).default([]),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();  // All fields optional

export const TaskParamsSchema = z.object({
    id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const TaskQuerySchema = z.object({
    status: z.enum(['todo', 'in-progress', 'done']).optional(),
    page:   z.coerce.number().int().min(1).default(1),
    limit:  z.coerce.number().int().min(1).max(100).default(20),
});

// Infer TypeScript types from schemas
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
```

### Reusable `validate` Middleware

```typescript
// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type Target = 'body' | 'params' | 'query';

export function validate(schema: ZodSchema, target: Target = 'body') {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            next(result.error);  // ZodError → caught by errorHandler
            return;
        }
        // Replace raw data with parsed/transformed data
        req[target] = result.data;
        next();
    };
}
```

```typescript
// Usage — clean, declarative routes
import { validate } from '../middleware/validate.js';
import { CreateTaskSchema, TaskParamsSchema, TaskQuerySchema } from '../schemas/task.schema.js';

router.get('/',
    validate(TaskQuerySchema, 'query'),
    asyncHandler(async (req, res) => {
        const { status, page, limit } = req.query as z.infer<typeof TaskQuerySchema>;
        const tasks = await taskService.list({ status, page, limit });
        res.json(tasks);
    })
);

router.post('/',
    validate(CreateTaskSchema, 'body'),
    asyncHandler(async (req, res) => {
        const task = await taskService.create(req.body as CreateTaskInput);
        res.status(201).json(task);
    })
);

router.put('/:id',
    validate(TaskParamsSchema, 'params'),
    validate(UpdateTaskSchema, 'body'),
    asyncHandler(async (req, res) => {
        const id   = (req.params as { id: number }).id;
        const task = await taskService.update(id, req.body);
        if (!task) throw new NotFoundError('Task', id);
        res.json(task);
    })
);
```

---

## ✅ Milestone Checklist

- [ ] All routes use `asyncHandler` — no bare `try/catch`
- [ ] Input is validated with Zod and errors follow the standard shape
- [ ] My error handler distinguishes `ZodError`, `AppError`, and unexpected errors
- [ ] TypeScript types are inferred from Zod schemas with `z.infer<>`

## ➡️ Next Unit

[Lesson 05 — Authentication: JWT & Cookie Sessions](./lesson_05.md)
