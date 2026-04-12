# Lesson 08 — Capstone: Task Manager REST API

> **Course:** Express API · **Time:** 2+ hours
> **Prerequisites:** All previous lessons

---

## 🎯 Project Overview

Build a **production-quality Task Manager REST API** that integrates everything:
- Full CRUD for users, tasks, and projects
- JWT authentication (access + refresh tokens)
- Zod validation on every endpoint
- File upload for user avatars
- Consistent error responses
- Integration tests with ≥ 80% coverage

---

## API Contract

```
Authentication
  POST   /auth/register         → Create account
  POST   /auth/login            → Get tokens
  POST   /auth/refresh          → Refresh access token
  POST   /auth/logout           → Clear refresh cookie

Users (authenticated)
  GET    /users/me              → Current user profile
  PUT    /users/me              → Update profile
  POST   /users/me/avatar       → Upload avatar
  DELETE /users/me              → Delete account

Projects (authenticated)
  GET    /projects              → List user's projects
  POST   /projects              → Create project
  GET    /projects/:id          → Get project + tasks
  PUT    /projects/:id          → Update project
  DELETE /projects/:id          → Delete project + all tasks

Tasks (authenticated)
  GET    /projects/:id/tasks    → List tasks in project
  POST   /projects/:id/tasks    → Create task in project
  GET    /tasks/:id             → Get single task
  PUT    /tasks/:id             → Update task
  PATCH  /tasks/:id/status      → Update status only
  DELETE /tasks/:id             → Delete task
```

---

## Project Structure

```
task-api/
├── src/
│   ├── app.ts                    ← Express app (no listen)
│   ├── index.ts                  ← Server entry point
│   ├── config.ts                 ← Typed env config
│   ├── errors.ts                 ← AppError hierarchy
│   ├── auth/
│   │   └── jwt.ts
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   ├── errorHandler.ts
│   │   ├── validate.ts
│   │   └── requestId.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── projects.ts
│   │   └── tasks.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── project.schema.ts
│   │   └── task.schema.ts
│   ├── services/
│   │   ├── authService.ts        ← (calls userRepository)
│   │   ├── projectService.ts
│   │   └── taskService.ts
│   └── utils/
│       ├── asyncHandler.ts
│       └── upload.ts             ← Multer config
├── uploads/                      ← Gitignored file store
├── src/__tests__/
│   ├── auth.test.ts
│   ├── tasks.test.ts
│   └── projects.test.ts
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Key Implementation: `app.ts`

```typescript
// src/app.ts
import express          from 'express';
import cors             from 'cors';
import helmet           from 'helmet';
import morgan           from 'morgan';
import cookieParser     from 'cookie-parser';
import path             from 'node:path';

import { requestId }    from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRouter       from './routes/auth.js';
import usersRouter      from './routes/users.js';
import projectsRouter   from './routes/projects.js';
import tasksRouter      from './routes/tasks.js';
import { config }       from './config.js';

export const app = express();

// Security + utilities
app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(requestId());
app.use(morgan(config.isDev ? 'dev' : 'combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check (no auth)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use('/auth',     authRouter);
app.use('/users',    usersRouter);
app.use('/projects', projectsRouter);
app.use('/tasks',    tasksRouter);

// Must be last
app.use(errorHandler);
```

---

## ✅ Milestone Checklist

- [ ] `POST /auth/register` → `POST /auth/login` → authenticated `GET /users/me` works end to end
- [ ] Invalid tokens return `401`; missing fields return `422` with field-level errors
- [ ] Creating a task in a project that doesn't belong to me returns `403`
- [ ] Avatar upload rejects non-images; file stored with UUID filename
- [ ] `npm test` exits 0 with ≥ 80% line coverage
- [ ] `.env.example` lists all required variables with placeholder values
- [ ] `process.exit(1)` on startup if any required env var is missing

## 🏆 Express API Complete!

## ➡️ Continue Learning

- [Backend Developer Path](../../paths/backend_developer.md) — see the full roadmap
- [PHP & SSR](../php_ssr/index.md) — server-side rendering with PHP
- [Full Stack Path](../../paths/fullstack.md) — connect this API to a frontend
