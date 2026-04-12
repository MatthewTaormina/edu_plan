# HTTP Servers & Middleware

> **Scope:** Server-side HTTP concepts — how web servers receive and respond to requests, middleware patterns, and routing. Language-agnostic; examples use Node.js and PHP.

---

## The Request / Response Lifecycle

Every HTTP interaction follows the same pattern:

```
Browser / Client
    │
    │  HTTP Request
    │  ──────────────────────────────────────────────────────────►
    │  Method: POST
    │  Path:   /api/tasks
    │  Headers: Content-Type: application/json
    │            Authorization: Bearer <token>
    │  Body:   {"title": "Buy milk"}
    │
    │                                                    Server
    │                                                       │
    │                                    Route matching     │
    │                                    Middleware chain   │
    │                                    Handler executes   │
    │
    │  HTTP Response
    │  ◄──────────────────────────────────────────────────────────
    │  Status: 201 Created
    │  Headers: Content-Type: application/json
    │  Body:   {"id": 42, "title": "Buy milk", "done": false}
```

---

## HTTP Methods (Verbs)

| Method | Meaning | Body? | Idempotent? |
|--------|---------|-------|-------------|
| `GET` | Read a resource | No | ✅ |
| `POST` | Create a resource | Yes | ❌ |
| `PUT` | Replace a resource | Yes | ✅ |
| `PATCH` | Partially update | Yes | ❌ |
| `DELETE` | Remove a resource | No | ✅ |
| `HEAD` | Like GET, headers only | No | ✅ |
| `OPTIONS` | Supported methods? (CORS preflight) | No | ✅ |

**Idempotent:** Calling the same request N times has the same result as calling it once.

---

## Status Codes

| Range | Meaning | Common Codes |
|-------|---------|-------------|
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirect | 301 Permanent, 302 Temporary, 304 Not Modified |
| 4xx | Client Error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable |
| 5xx | Server Error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

> [!TIP]
> **401 vs 403:** 401 = "Who are you? Please authenticate." 403 = "I know who you are, you're just not allowed."

---

## Middleware Pattern

Middleware is a **chain of functions** that each receive the request and response, do something, then pass control to the next function.

```
Request → [Logger] → [Auth Check] → [JSON Parser] → [Rate Limiter] → Handler → Response
               │            │               │                │
           log IP      verify JWT      parse body       check limits
```

Each middleware can:
- **Pass through** — call `next()` to continue the chain
- **Respond early** — send a response and stop the chain (e.g. 401)
- **Modify req/res** — attach data for downstream handlers (e.g. `req.user = decoded.user`)

```js
// Express middleware signature
function myMiddleware(req, res, next) {
    // Do something
    next();  // Pass to next middleware / route handler
    // OR:
    res.status(401).json({ error: 'Unauthorised' });  // Stop chain
}
```

---

## Routing

Routing maps an **HTTP method + URL pattern** to a handler function:

```
GET  /users          → listUsers handler
GET  /users/:id      → getUser handler
POST /users          → createUser handler
PUT  /users/:id      → updateUser handler
DELETE /users/:id    → deleteUser handler
```

### URL Anatomy

```
https://api.example.com/users/42?include=posts&format=json
│       │               │       │
│       │               │       └── Query string (optional extra data)
│       │               └────────── Path (identifies the resource)
│       └────────────────────────── Host
└────────────────────────────────── Protocol
```

### Path Parameters vs Query Strings

| | Path Params | Query Strings |
|-|------------|---------------|
| Example | `/users/42` | `/users?id=42` |
| Use for | **Identity** of a resource | **Filters, sorts, pagination** |
| Required | Usually yes | Usually optional |

---

## Request Body Formats

| Format | MIME Type | Typical Use |
|--------|-----------|-------------|
| JSON | `application/json` | APIs |
| URL-encoded | `application/x-www-form-urlencoded` | HTML forms |
| Multipart | `multipart/form-data` | File uploads |
| Plain text | `text/plain` | Webhooks, raw data |

---

## Headers

### Request Headers

```
Authorization: Bearer eyJhbGc...   ← Auth token
Content-Type: application/json     ← Body format
Accept: application/json           ← Expected response format
User-Agent: Mozilla/5.0 ...        ← Client identifier
Origin: https://app.example.com    ← CORS origin
```

### Response Headers

```
Content-Type: application/json; charset=utf-8
Cache-Control: max-age=3600
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
X-Request-Id: b1b6...               ← Trace ID for debugging
Access-Control-Allow-Origin: *      ← CORS permission
```

---

## CORS — Cross-Origin Resource Sharing

Browsers block JavaScript from making requests to a **different origin** (protocol + host + port) by default. The server must explicitly allow it.

```
Frontend: https://app.example.com
Backend:  https://api.example.com   ← Different subdomain = cross-origin!
```

```
Browser sends OPTIONS preflight:
  Origin: https://app.example.com
  Access-Control-Request-Method: POST

Server responds:
  Access-Control-Allow-Origin: https://app.example.com
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Content-Type, Authorization
```

In Express:
```js
import cors from 'cors';  // npm install cors

app.use(cors({
    origin:      'https://app.example.com',  // Or '*' for public APIs
    credentials: true                         // Required if sending cookies
}));
```

---

## Authentication Patterns

### Session Cookies

```
1. POST /login → server validates credentials
2. Server creates a session in memory/Redis, returns Set-Cookie: session=<id>
3. Browser sends cookie automatically on every subsequent request
4. Server looks up session by ID to identify the user
```

**Pros:** Easy to revoke (delete session). **Cons:** Requires session store (doesn't scale horizontally without Redis).

### JSON Web Tokens (JWT)

```
1. POST /login → server validates, returns { token: "eyJ..." }
2. Client stores token (memory, localStorage, httpOnly cookie)
3. Client sends: Authorization: Bearer eyJ...
4. Server verifies token signature — no session store needed
```

**Pros:** Stateless, scales horizontally. **Cons:** Hard to revoke (must use short expiry + refresh tokens).

---

## 📚 See Also

- [Course: Express API](../../courses/express_api/index.md)
- [Course: Node.js Fundamentals](../../courses/nodejs_fundamentals/index.md)
- [Course: PHP & SSR](../../courses/php_ssr/index.md)
- [Wiki: REST APIs](./rest_api.md)
- [Wiki: Node.js](./nodejs.md)
