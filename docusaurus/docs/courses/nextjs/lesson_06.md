# Lesson 06 — Route Handlers (API Routes)

> **Course:** Next.js · **Time:** 45 minutes
> **📖 Wiki:** [REST APIs](../../domains/web_dev/rest_api.md)
> **🔗 Official Docs:** [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 🎯 Learning Objectives

- [ ] Create REST API endpoints with Route Handlers
- [ ] Handle GET, POST, PUT, DELETE HTTP methods
- [ ] Read request body, headers, and query parameters
- [ ] Return typed JSON responses with appropriate status codes

---

## 📖 Concepts

### Route Handler Files

`route.ts` files create API endpoints. They live in the `app/` directory alongside page files.

```
app/
├── api/
│   ├── users/
│   │   ├── route.ts         → GET /api/users, POST /api/users
│   │   └── [id]/
│   │       └── route.ts     → GET /api/users/:id, PUT/DELETE /api/users/:id
│   └── auth/
│       ├── login/route.ts   → POST /api/auth/login
│       └── logout/route.ts  → POST /api/auth/logout
```

### GET and POST

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// In-memory store for demo (use a database in production)
let users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob',   email: 'bob@example.com' },
];

// GET /api/users — optionally with query params: /api/users?search=alice
export async function GET(request: NextRequest) {
    const search = request.nextUrl.searchParams.get('search')?.toLowerCase();

    const result = search
        ? users.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search))
        : users;

    return NextResponse.json(result);  // 200 OK by default
}

// POST /api/users — create a new user
export async function POST(request: NextRequest) {
    // Read and validate the request body
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { name, email } = body as { name?: string; email?: string };

    if (!name || !email) {
        return NextResponse.json(
            { error: 'name and email are required' },
            { status: 400 }
        );
    }

    if (users.some(u => u.email === email)) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });  // 201 Created
}
```

### Dynamic ID Routes — GET, PUT, DELETE

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Params) {
    const id  = Number(params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PUT(request: NextRequest, { params }: Params) {
    const id   = Number(params.id);
    const idx  = users.findIndex(u => u.id === id);

    if (idx === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updates = await request.json() as Partial<typeof users[0]>;
    users[idx] = { ...users[idx], ...updates, id };  // id is immutable

    return NextResponse.json(users[idx]);
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const id  = Number(params.id);
    const idx = users.findIndex(u => u.id === id);

    if (idx === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users.splice(idx, 1);
    return new NextResponse(null, { status: 204 });  // 204 No Content
}
```

### Headers and Authentication

```typescript
// app/api/protected/route.ts
export async function GET(request: NextRequest) {
    // Read auth header
    const auth = request.headers.get('Authorization');

    if (!auth?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = auth.slice(7);
    // Verify the token (use a proper JWT library in production)
    if (token !== process.env.API_SECRET) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ data: 'Protected data' });
}
```

### Calling Route Handlers from Client Components

```tsx
// components/CreateUserForm.tsx
'use client';

async function createUser(formData: { name: string; email: string }) {
    const res = await fetch('/api/users', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData)
    });
    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
    }
    return res.json();
}
```

> [!NOTE]
> **In Server Components**, you don't need Route Handlers to access data — call your database or API
> directly from the server function. Route Handlers are mainly for Client Component mutations and
> external webhook endpoints.

---

## ✅ Milestone Checklist

- [ ] I created GET and POST handlers for a resource
- [ ] I return appropriate HTTP status codes (200, 201, 400, 404, 409)
- [ ] I read query params via `request.nextUrl.searchParams`
- [ ] I understand when to use Route Handlers vs direct server-side access

## ➡️ Next Unit

[Lesson 07 — Middleware & Auth Patterns](./lesson_07.md)
