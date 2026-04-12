# Lesson 02 — Middleware: Built-in, Third-Party & Custom

> **Course:** Express API · **Time:** 60 minutes
> **📖 Wiki:** [HTTP Servers & Middleware](../../domains/web_dev/http_server.md)
> **🔗 Official Docs:** [Express middleware](https://expressjs.com/en/guide/using-middleware.html)

---

## 🎯 Learning Objectives

- [ ] Explain the middleware chain and request/response flow
- [ ] Use built-in middleware (`express.json`, `express.static`)
- [ ] Install and configure third-party middleware (CORS, Morgan, Helmet)
- [ ] Write custom middleware for logging, authentication, and request ID

---

## 📖 Concepts

### What Middleware Is

Every Express middleware is a function with the signature `(req, res, next)`:

```typescript
import { Request, Response, NextFunction } from 'express';

function myMiddleware(req: Request, res: Response, next: NextFunction): void {
    // 1. Do something (inspect, modify req/res)
    console.log(`${req.method} ${req.path}`);

    // 2a. Pass control to the next middleware / route handler
    next();

    // 2b. OR respond and stop the chain
    // res.status(401).json({ error: 'Unauthorised' });
}
```

The chain runs in registration order:

```
app.use(cors())      → app.use(helmet()) → app.use(morgan()) → router.get('/tasks', ...) → send response
```

### Built-in Middleware

```typescript
import express from 'express';

const app = express();

// Parse JSON bodies (Content-Type: application/json)
app.use(express.json({ limit: '1mb' }));

// Parse URL-encoded bodies (HTML form POST)
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public
app.use('/static', express.static('public'));
// GET /static/logo.png → serves public/logo.png
```

### Third-Party Middleware

```bash
npm install cors helmet morgan
npm install -D @types/cors @types/morgan
```

```typescript
import cors    from 'cors';
import helmet  from 'helmet';
import morgan  from 'morgan';

// Security headers (X-Frame-Options, CSP, etc.)
app.use(helmet());

// CORS — allow frontend origin
app.use(cors({
    origin:      process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,   // Allow cookies
    methods:     ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

// HTTP request logging
// 'dev' format: "GET /tasks 200 5ms"
// 'combined' format: Apache Combined Log (use in production)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
```

### Custom Middleware — Request ID

Attach a unique ID to every request for tracing:

```typescript
// src/middleware/requestId.ts
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

// Extend Request type to add our property
declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

export function requestId(req: Request, res: Response, next: NextFunction): void {
    req.id = randomUUID();
    res.set('X-Request-Id', req.id);
    next();
}
```

### Custom Middleware — Request Logger

```typescript
// src/middleware/logger.ts
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    // Intercept res.end to capture status after handler runs
    const originalEnd = res.end.bind(res);
    res.end = function (...args) {
        const duration = Date.now() - start;
        console.log(`[${req.id ?? '-'}] ${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
        return originalEnd(...args);
    };

    next();
}
```

### Middleware Scope — Global vs Route-Specific

```typescript
// Global — applies to ALL routes
app.use(helmet());
app.use(cors());

// Route-specific — applies to ONE route
import { authMiddleware } from './middleware/auth.js';

app.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

// Router-level — applies to all routes within this router
const adminRouter = express.Router();
adminRouter.use(authMiddleware);      // Protects all /admin/* routes
adminRouter.get('/users', listUsers);

app.use('/admin', adminRouter);
```

### Middleware Order Matters

```typescript
app.use(requestId());        // ← Must come first (others log req.id)
app.use(requestLogger());    // ← Runs after requestId sets req.id
app.use(helmet());           // ← Security headers (before any route)
app.use(cors());             // ← CORS headers (before route handlers)
app.use(express.json());     // ← Body parsing (before routes that read body)
app.use(morgan('dev'));      // ← Logging

// Routes
app.use('/tasks', tasksRouter);

// Error middleware — always LAST, 4-arg signature
app.use(errorHandler);
```

### Error-Handling Middleware

Express identifies error middleware by its **4-argument signature**:

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction     // Must be declared even if unused
): void {
    console.error(`[${req.id}] Error:`, err.stack);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    // Unexpected error — don't leak details in production
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
}
```

```typescript
// Routes throw; Express catches and routes to errorHandler
router.get('/:id', async (req, res, next) => {
    try {
        const task = await findTask(Number(req.params.id));
        if (!task) throw new AppError(404, 'Task not found');
        res.json(task);
    } catch (err) {
        next(err);  // Pass to error handler
    }
});
```

---

## ✅ Milestone Checklist

- [ ] `helmet()` and `cors()` are registered before any routes
- [ ] I wrote a custom middleware that attaches `req.id` to every request
- [ ] My error handler has 4 parameters and is the **last** middleware registered
- [ ] I understand why middleware order matters (CORS before routes, error handler last)

## ➡️ Next Unit

[Lesson 03 — Request & Response: Params, Body & Headers](./lesson_03.md)
