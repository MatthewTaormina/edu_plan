# Lesson 05 — Authentication: JWT & Cookie Sessions

> **Course:** Express API · **Time:** 60 minutes
> **📖 Wiki:** [HTTP Servers & Middleware — Auth Patterns](../../domains/web_dev/http_server.md#authentication-patterns)
> **🔗 Official Docs:** [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) · [cookie-session](https://github.com/expressjs/cookie-session)

---

## 🎯 Learning Objectives

- [ ] Implement JWT-based auth with access + refresh tokens
- [ ] Implement session-based auth with `express-session`
- [ ] Write a reusable `authMiddleware` that protects routes
- [ ] Store passwords securely with bcrypt

---

## 📖 Concepts

### Password Hashing with bcrypt

Never store plain-text passwords:

```typescript
// npm install bcrypt && npm install -D @types/bcrypt
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;  // Higher = more secure, slower. 12 is a good default.

// Hash on registration
const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
// Store `hash` in the database

// Compare on login
const isValid = await bcrypt.compare(plainPassword, storedHash);
if (!isValid) throw new UnauthorisedError('Invalid credentials');
```

### JWT Authentication

**Access token:** Short-lived (15 min). Stateless. Sent in `Authorization: Bearer` header.
**Refresh token:** Long-lived (7 days). Stored in HttpOnly cookie. Used to issue new access tokens.

```bash
npm install jsonwebtoken zod
npm install -D @types/jsonwebtoken
```

```typescript
// src/auth/jwt.ts
import jwt from 'jsonwebtoken';

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  ?? 'dev-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret';

export interface JwtPayload {
    sub:   number;    // User ID
    email: string;
    role:  'user' | 'admin';
}

export function signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: Pick<JwtPayload, 'sub'>): string {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): { sub: number } {
    return jwt.verify(token, REFRESH_SECRET) as { sub: number };
}
```

### Auth Routes

```typescript
// src/routes/auth.ts
import { Router } from 'express';
import bcrypt      from 'bcrypt';
import { z }       from 'zod';
import { validate }        from '../middleware/validate.js';
import { asyncHandler }    from '../utils/asyncHandler.js';
import { UnauthorisedError } from '../errors.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../auth/jwt.js';

const router = Router();

const LoginSchema = z.object({
    email:    z.string().email(),
    password: z.string().min(1),
});

// POST /auth/login
router.post('/login',
    validate(LoginSchema),
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        // (Replace with real DB lookup)
        const user = await userService.findByEmail(email);
        if (!user) throw new UnauthorisedError('Invalid credentials');

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new UnauthorisedError('Invalid credentials');

        const accessToken  = signAccessToken({ sub: user.id, email: user.email, role: user.role });
        const refreshToken = signRefreshToken({ sub: user.id });

        // Refresh token in HttpOnly cookie (not accessible to JS — XSS protection)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge:   7 * 24 * 60 * 60 * 1000,  // 7 days in ms
        });

        res.json({ accessToken, user: { id: user.id, email: user.email, role: user.role } });
    })
);

// POST /auth/refresh — issue new access token using refresh cookie
router.post('/refresh', asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) throw new UnauthorisedError('No refresh token');

    const payload    = verifyRefreshToken(token);  // Throws if invalid/expired
    const user       = await userService.findById(payload.sub);
    if (!user) throw new UnauthorisedError('User not found');

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    res.json({ accessToken });
}));

// POST /auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.status(204).end();
});

export default router;
```

### Auth Middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload }   from '../auth/jwt.js';
import { UnauthorisedError }               from '../errors.js';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const header = req.get('Authorization');
    if (!header?.startsWith('Bearer ')) {
        throw new UnauthorisedError('Authorization header required');
    }

    const token = header.slice(7);
    try {
        req.user = verifyAccessToken(token);
        next();
    } catch {
        throw new UnauthorisedError('Invalid or expired token');
    }
}

// Role-based access control
export function requireRole(...roles: JwtPayload['role'][]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new UnauthorisedError('Insufficient permissions');
        }
        next();
    };
}
```

```typescript
// Usage — protect routes
import { authenticate, requireRole } from '../middleware/auth.js';

// Protected — any authenticated user
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
    res.json({ user: req.user });
}));

// Admin only
router.delete('/users/:id',
    authenticate,
    requireRole('admin'),
    asyncHandler(async (req, res) => { /* ... */ })
);
```

### Session-Based Auth (Alternative)

```bash
npm install express-session connect-pg-simple
npm install -D @types/express-session
```

```typescript
import session from 'express-session';

app.use(session({
    secret:            process.env.SESSION_SECRET!,
    resave:            false,
    saveUninitialized: false,
    cookie: {
        secure:   process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge:   24 * 60 * 60 * 1000,   // 24 hours
    },
    // store: new PgStore({ pool })  // For production: persist in DB
}));

// Login: store userId in session
req.session.userId = user.id;

// Check auth
if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
}

// Logout
req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(204).end();
});
```

---

## ✅ Milestone Checklist

- [ ] Passwords are hashed with bcrypt — never stored plain-text
- [ ] Access tokens expire in 15 minutes; refresh tokens in 7 days
- [ ] Refresh token is set as `HttpOnly; Secure; SameSite=Lax` cookie
- [ ] `authenticate` middleware extracts and verifies the Bearer token
- [ ] `requireRole('admin')` guards admin-only routes

## ➡️ Next Unit

[Lesson 06 — File Uploads with Multer](./lesson_06.md)
