# Lesson 07 — Middleware & Auth Patterns

> **Course:** Next.js · **Time:** 45 minutes
> **🔗 Official Docs:** [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## 🎯 Learning Objectives

- [ ] Write Next.js Middleware to run before requests
- [ ] Redirect unauthenticated users in Middleware
- [ ] Read and set cookies for session management
- [ ] Understand the session options: cookies vs JWT vs Auth.js

---

## 📖 Concepts

### What Middleware Does

Middleware runs before *every* matching request — on the Edge (fast, global, before the main server). Use it for:
- Auth protection — redirect unauthenticated users before they see anything
- Geo-routing — redirect based on country
- A/B testing — attach a variant cookie
- Header injection — add security headers

```typescript
// middleware.ts — at the project root (not inside app/)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Example: Redirect /old-blog/:slug to /blog/:slug
    if (pathname.startsWith('/old-blog/')) {
        return NextResponse.redirect(
            new URL(pathname.replace('/old-blog/', '/blog/'), request.url)
        );
    }

    return NextResponse.next();  // Continue to the requested route
}

// Configure which paths trigger the middleware
export const config = {
    matcher: [
        // Match everything except static files and API routes
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
};
```

### Auth Protection with Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected paths — unauthorised users are redirected to /login
const PROTECTED_PATHS = ['/dashboard', '/settings', '/profile'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

    if (isProtected) {
        // Read the session cookie (set on login)
        const sessionToken = request.cookies.get('session-token')?.value;

        if (!sessionToken) {
            // Redirect to login, pass the original URL to redirect back after login
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // In production, verify the token here (e.g. verify a JWT)
        // For complex auth, use Auth.js / Clerk / WorkOS instead
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|public|favicon.ico).*)'],
};
```

### Sessions with Cookies

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    // Validate credentials (use bcrypt in production)
    const user = await validateCredentials(email, password);

    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create a session token (use a proper JWT library in production)
    const token = Buffer.from(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 })).toString('base64');

    const response = NextResponse.json({ user: { id: user.id, name: user.name } });

    // Set HttpOnly cookie — not accessible from JavaScript (XSS protection)
    response.cookies.set({
        name:     'session-token',
        value:    token,
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge:   86400,  // 24 hours
        path:     '/'
    });

    return response;
}
```

```typescript
// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete('session-token');
    return response;
}
```

### Next Auth Options Overview

| Option | Best for |
|--------|---------|
| Manual cookies | Learning, simple apps |
| [Auth.js (NextAuth)](https://authjs.dev/) | Most apps — OAuth providers (Google, GitHub) + credentials |
| [Clerk](https://clerk.com/) | Fastest DX, drop-in UI component |
| [WorkOS](https://workos.com/) | Enterprise SSO (SAML, SCIM) |

---

## ✅ Milestone Checklist

- [ ] I have a `middleware.ts` file that protects `/dashboard/*` routes
- [ ] My login Route Handler sets an `httpOnly` session cookie
- [ ] My logout Route Handler deletes the cookie
- [ ] I understand that Middleware runs on the EDGE — no Node.js APIs are available

## ➡️ Next Unit

[Lesson 08 — Capstone: Blog with CMS](./lesson_08.md)
