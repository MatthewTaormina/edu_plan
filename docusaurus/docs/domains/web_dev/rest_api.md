---
title: REST APIs
description: The complete REST API reference — HTTP verbs, status codes, URL design, authentication, CORS, pagination, versioning, and error formats.
sidebar_label: REST APIs
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import YouTubeEmbed from '@site/src/components/YouTubeEmbed';
import QuizQuestion from '@site/src/components/QuizQuestion';
import MilestoneChecklist from '@site/src/components/MilestoneChecklist';

> **Domain:** Web Development · **Status:** 🔵 Foundation (REST, 2000 — Roy Fielding dissertation) + 🟢 Modern (JSON over HTTP is the default for new APIs in 2025)
>
> **Prerequisites:** [HTTP Servers & Middleware](./http_server) — understand the HTTP request/response cycle first.
>
> **Who needs this:** Frontend and fullstack developers. REST is how every web application communicates. Whether you're consuming APIs or building them, these concepts apply.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain REST constraints and why they matter
- [ ] Design resource URLs that follow REST conventions
- [ ] Use all HTTP verbs correctly and know which is idempotent
- [ ] Read and use HTTP status codes accurately
- [ ] Implement authentication with Bearer tokens (JWT)
- [ ] Handle CORS in both frontend and backend code
- [ ] Design paginated endpoints using cursor-based pagination
- [ ] Return structured error responses using RFC 9457 Problem Details

---

<YouTubeEmbed
  id="lsMQRaeKNDk"
  title="REST API Design Best Practices — Hussein Nasser"
  caption="Hussein Nasser on REST API design — opinionated, practical, covers real pitfalls."
/>

---

## 📖 Concepts

### 1. What REST Actually Is

REST (Representational State Transfer) is an **architectural style** defined by six constraints. Most APIs people call "REST" are actually just JSON over HTTP — they don't follow all six constraints. That's fine in practice, but knowing the constraints helps you understand *why* REST APIs work the way they do.

| Constraint | Meaning | Practical impact |
|-----------|---------|-----------------|
| **Client-Server** | UI and data storage are separated | Frontend can be rebuilt without changing the API |
| **Stateless** | Each request contains all information needed | No server-side session; auth token must be sent every time |
| **Cacheable** | Responses must declare if they're cacheable | `Cache-Control` headers; GET responses can be cached |
| **Uniform Interface** | Resources identified by URI; standard methods | `/users/42` + HTTP verb — consistent across all resources |
| **Layered System** | Client doesn't know if it's talking to origin or proxy | Load balancers, CDNs, API gateways are transparent |
| **Code on Demand** *(optional)* | Server can send executable code | Used for UI: `<script>` tags, web components |

**The key insight: statelessness**

```
❌ Stateful (session-based):
Client:  POST /login  → Session stored on server, cookie given to client
Client:  GET /profile → Server looks up session to know who you are

✅ Stateless (token-based):
Client:  POST /auth/token  → Server issues JWT (signed token)
Client:  GET /profile      Authorization: Bearer <jwt>
         → Server verifies token signature, no state stored server-side
```

---

### 2. Resources and URL Design

A REST resource is a *thing*, not an action. URLs identify things. HTTP verbs express what to do with them.

```
✅ Good — noun-based, hierarchical
GET    /users                   List all users
POST   /users                   Create a user
GET    /users/42                Get user 42
PUT    /users/42                Replace user 42 entirely
PATCH  /users/42                Update specific fields of user 42
DELETE /users/42                Delete user 42

GET    /users/42/orders         List user 42's orders
GET    /users/42/orders/7       Get order 7 belonging to user 42
POST   /users/42/orders         Create an order for user 42

❌ Bad — action-based (RPC style, not REST)
POST   /getUser
POST   /createUser
GET    /deleteUser?id=42        Deleting via GET — extremely wrong
POST   /user/update
POST   /doSomethingWithOrder
```

**URL conventions:**

| Rule | Example |
|------|---------|
| Lowercase, hyphen-separated words | `/shipping-addresses`, not `/shippingAddresses` |
| Plural nouns for collections | `/products`, not `/product` |
| Singular noun for a specific resource | `/products/42` |
| Nest for ownership, but max 2 levels | `/users/42/orders`, not `/users/42/orders/7/items/3/sku` |
| Never include the VERB in the URL | `/orders/42/cancel` via `POST` is acceptable; `POST /cancelOrder` is not |

---

### 3. HTTP Verbs — Full Reference

| Verb | Meaning | Idempotent? | Safe? | Has body? |
|------|---------|------------|-------|-----------|
| `GET` | Read/fetch | Yes | Yes | No |
| `POST` | Create / trigger action | No | No | Yes |
| `PUT` | Replace entirely | Yes | No | Yes |
| `PATCH` | Partial update | No* | No | Yes |
| `DELETE` | Remove | Yes | No | Rarely |
| `HEAD` | Like GET but no body | Yes | Yes | No |
| `OPTIONS` | Discover allowed methods | Yes | Yes | No |

**Idempotent** = calling it multiple times has the same effect as calling it once. `DELETE /users/42` twice gives the same end state (user is gone). `POST /users` twice creates two users.

:::warning
`PATCH` is not idempotent by definition — it depends on the implementation. `PATCH /posts/1 { "views": views + 1 }` is not idempotent. `PATCH /posts/1 { "title": "New Title" }` is. Be intentional.
:::

---

### 4. HTTP Status Codes — Complete Reference

```
1xx — Informational
  100 Continue       — Server received headers, client should send body

2xx — Success
  200 OK             — Standard success (GET, PUT, PATCH)
  201 Created        — Resource created (POST) — include Location header
  202 Accepted       — Async: request accepted, processing later
  204 No Content     — Success, no body to return (DELETE, some PATCHes)

3xx — Redirection
  301 Moved Permanently — URL has changed forever (update your links)
  302 Found          — Temporary redirect
  304 Not Modified   — Cached version is still valid (ETag/Last-Modified match)
  307 Temporary Redirect — Redirect but keep method (POST stays POST)
  308 Permanent Redirect — Like 301 but keep method

4xx — Client Error (the caller did something wrong)
  400 Bad Request        — Malformed JSON, missing required field, invalid value
  401 Unauthorized       — Not authenticated (missing or invalid token)
  403 Forbidden          — Authenticated but not authorized for this resource
  404 Not Found          — Resource doesn't exist (or you're hiding it exists)
  405 Method Not Allowed — Correct URL, wrong verb (e.g., DELETE on /users)
  409 Conflict           — State conflict (duplicate unique field, version mismatch)
  410 Gone               — Resource existed but was permanently deleted
  422 Unprocessable Entity — Valid JSON, but business logic validation failed
  429 Too Many Requests  — Rate limited; Retry-After header tells when to try again

5xx — Server Error (something broke on the server)
  500 Internal Server Error — Generic catch-all; log the actual error server-side
  502 Bad Gateway           — Upstream service returned invalid response
  503 Service Unavailable   — Overloaded or maintenance; include Retry-After
  504 Gateway Timeout       — Upstream took too long
```

:::important
**401 vs 403:** `401 Unauthorized` means "you haven't told me who you are." `403 Forbidden` means "I know who you are, but you can't do this." If a user is logged in as Alice and tries to delete Bob's account, return `403`.
:::

---

### 5. Request and Response Anatomy

```
HTTP Request:
  POST /api/v1/orders HTTP/2
  Host: api.example.com
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJSUzI1NiJ9...
  Accept: application/json
  Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000   ← Prevent duplicate POSTs

  {
    "user_id": 42,
    "items": [
      { "product_id": 7, "quantity": 2 }
    ],
    "shipping_address_id": 3
  }

HTTP Response:
  HTTP/2 201 Created
  Content-Type: application/json
  Location: /api/v1/orders/1001
  X-Request-Id: b4e2f1a0-...

  {
    "id": 1001,
    "status": "pending",
    "user_id": 42,
    "total": 49.98,
    "created_at": "2025-04-12T09:00:00Z"
  }
```

---

### 6. Authentication — JWT Bearer Tokens

<Tabs>
<TabItem value="concept" label="How JWT Works">

```
1. Client sends credentials:
   POST /auth/token
   { "email": "alice@example.com", "password": "hunter2" }

2. Server validates, creates JWT:
   Header:    { "alg": "RS256", "typ": "JWT" }
   Payload:   { "sub": "42", "email": "alice@...", "role": "admin", "exp": 1713000000 }
   Signature: RSASHA256(base64(header) + "." + base64(payload), privateKey)
   Token:     <base64header>.<base64payload>.<signature>

3. Client stores token (memory or httpOnly cookie)

4. Client includes token in every subsequent request:
   GET /api/me
   Authorization: Bearer <token>

5. Server verifies signature with public key — no DB lookup needed
```

</TabItem>
<TabItem value="js" label="JavaScript (fetch)">

```javascript
const BASE = 'https://api.example.com';

// 1. Login
async function login(email, password) {
    const res = await fetch(`${BASE}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.status}`);
    const { token } = await res.json();
    // Store in memory (most secure) or httpOnly cookie (server sets)
    sessionStorage.setItem('token', token);
    return token;
}

// 2. Authenticated fetch wrapper
async function apiFetch(path, options = {}) {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    if (res.status === 401) {
        sessionStorage.removeItem('token');
        window.location.href = '/login';
        return;
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(err.message ?? `HTTP ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
}

// Usage
const orders = await apiFetch('/api/v1/orders');
const newOrder = await apiFetch('/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify({ items: [...] }),
});
```

</TabItem>
<TabItem value="py" label="Python (httpx)">

```python
import httpx

BASE = "https://api.example.com"

class APIClient:
    def __init__(self):
        self._token: str | None = None
        self._client = httpx.Client(base_url=BASE, timeout=10)

    def login(self, email: str, password: str) -> None:
        res = self._client.post("/auth/token", json={"email": email, "password": password})
        res.raise_for_status()
        self._token = res.json()["token"]
        self._client.headers["Authorization"] = f"Bearer {self._token}"

    def get(self, path: str, **kwargs):
        res = self._client.get(path, **kwargs)
        res.raise_for_status()
        return res.json()

    def post(self, path: str, data: dict, **kwargs):
        res = self._client.post(path, json=data, **kwargs)
        res.raise_for_status()
        return res.json() if res.status_code != 204 else None

client = APIClient()
client.login("alice@example.com", "hunter2")
orders = client.get("/api/v1/orders")
```

</TabItem>
</Tabs>

:::warning
**Where to store tokens**: Memory (JS variable) is safest — cleared on refresh. `localStorage` is accessible to any JS on the page (XSS risk). `sessionStorage` is cleared on tab close. `httpOnly` cookies are the most secure — inaccessible to JavaScript at all, but require CORS and SameSite configuration.
:::

---

### 7. CORS — Cross-Origin Resource Sharing

When a browser makes a request from `https://myapp.com` to `https://api.different.com`, the **browser** enforces a same-origin policy. CORS headers from the server tell the browser whether to allow the cross-origin request.

```mermaid
sequenceDiagram
    participant Browser
    participant Server as api.different.com

    Note over Browser,Server: Preflight (for non-simple requests)
    Browser->>Server: OPTIONS /api/orders<br/>Origin: https://myapp.com
    Server-->>Browser: 200 OK<br/>Access-Control-Allow-Origin: https://myapp.com<br/>Access-Control-Allow-Methods: GET, POST<br/>Access-Control-Max-Age: 86400

    Note over Browser,Server: Actual request
    Browser->>Server: POST /api/orders<br/>Origin: https://myapp.com<br/>Authorization: Bearer ...
    Server-->>Browser: 201 Created<br/>Access-Control-Allow-Origin: https://myapp.com
```

:::important
**CORS errors are always a server configuration problem.** You cannot fix a CORS error from the frontend (except using a development proxy). The backend team must add the correct `Access-Control-Allow-Origin` headers.
:::

---

### 8. Pagination

Never return unbounded collections. Always paginate.

<Tabs>
<TabItem value="cursor" label="Cursor-Based (Modern)">

```
GET /api/v1/orders?limit=20
→ {
    "data": [...20 orders...],
    "next_cursor": "eyJpZCI6IDIwfQ==",   ← opaque, base64-encoded
    "has_more": true
  }

GET /api/v1/orders?limit=20&cursor=eyJpZCI6IDIwfQ==
→ {
    "data": [...next 20 orders...],
    "next_cursor": "eyJpZCI6IDQwfQ==",
    "has_more": true
  }
```

**Advantages over offset pagination:**
- Works correctly with concurrent inserts/deletes (offset-based can skip or repeat items)
- Consistent performance — no `OFFSET 10000` scanning past rows
- Scales to billions of rows

**Implementation (PostgreSQL):**

```sql
-- cursor = last seen id (or timestamp for time-based)
SELECT * FROM orders
WHERE id > $cursor
ORDER BY id ASC
LIMIT $limit + 1;  -- Fetch one extra to know if there's a next page
```

</TabItem>
<TabItem value="offset" label="Offset-Based (Common)">

```
GET /api/v1/orders?page=2&per_page=20
→ {
    "data": [...20 orders...],
    "page": 2,
    "per_page": 20,
    "total": 847,
    "total_pages": 43
  }
```

**When to use:**
- When users need to jump to page 7 of 43 (cursor-based can't do that)
- Admin panels with explicit page numbers
- Smaller datasets where performance is not a concern

**Problem:** `SELECT * FROM orders OFFSET 10000 LIMIT 20` must scan and discard 10,000 rows. Gets slower as offset grows.

</TabItem>
</Tabs>

---

### 9. Structured Error Responses (RFC 9457)

Ad-hoc error formats make client code messy. Use the [Problem Details](https://www.rfc-editor.org/rfc/rfc9457) standard:

```
Content-Type: application/problem+json

{
    "type": "https://api.example.com/errors/insufficient-funds",
    "title": "Insufficient Funds",
    "status": 422,
    "detail": "Account #42 balance ($10.00) is less than the transfer amount ($50.00).",
    "instance": "/api/v1/transfers/789",
    "account_id": 42,          ← Extension fields are allowed
    "available_balance": 10.00
}
```

| Field | Required | Meaning |
|-------|----------|---------|
| `type` | Recommended | URI identifying the error type (links to docs ideally) |
| `title` | Recommended | Human-readable summary |
| `status` | Recommended | HTTP status code (matches response status) |
| `detail` | Optional | Human-readable explanation for this specific occurrence |
| `instance` | Optional | URI of the specific request that caused the error |

---

### 10. API Versioning

| Strategy | How | Pros | Cons |
|----------|-----|------|------|
| **URL path** (most common) | `/api/v1/users` | Visible, easy to test in browser | URL changes; not "pure" REST |
| **Accept header** | `Accept: application/vnd.api+json;version=2` | Clean URLs | Harder to test, less discoverable |
| **Custom header** | `X-API-Version: 2` | Clean URLs | Easy to overlook |
| **Query param** | `/users?version=2` | Easy to test | Pollutes URLs, often cached wrong |

**URL versioning is the industry default** — it's visible, cacheable, and easy for developers to understand.

```
/api/v1/orders      ← Stable, supported for N years
/api/v2/orders      ← New version with breaking changes
```

---

## 🧠 Quick Check

<QuizQuestion
  id="rest-q1"
  question="A user is logged in and tries to edit another user's post. They don't have permission. Which HTTP status code should the API return?"
  options={[
    { label: "401 Unauthorized", correct: false, explanation: "401 means the client hasn't authenticated at all — they haven't proven who they are. This user IS authenticated (logged in), so 401 is wrong." },
    { label: "403 Forbidden", correct: true, explanation: "Correct! 403 means the server knows who you are but you're not allowed to do this. The user is authenticated but not authorized to edit someone else's post." },
    { label: "404 Not Found", correct: false, explanation: "The post exists — hiding its existence with 404 is sometimes done for security (to not reveal what resources exist), but 403 is more correct and informative when you want to communicate the access denial." },
    { label: "400 Bad Request", correct: false, explanation: "400 means the request itself is malformed — invalid JSON, missing required field, etc. The request is well-formed here; the user just lacks permission." },
  ]}
/>

<QuizQuestion
  id="rest-q2"
  question="You call DELETE /posts/42 twice. The first call deletes the post. What should the second call return?"
  options={[
    { label: "200 OK — the operation succeeded (the resource is still gone)", correct: false, explanation: "200 implies success with a body. There's nothing to return. 404 is more accurate for the second call." },
    { label: "404 Not Found — the resource no longer exists", correct: true, explanation: "Correct! The second DELETE is idempotent in effect (the end state is the same — post is gone) but the correct semantic response when the resource is already missing is 404. Some APIs return 204 for both calls, which is also acceptable." },
    { label: "409 Conflict — you can't delete something twice", correct: false, explanation: "409 is for state conflicts like trying to create a duplicate. Deleting a non-existent resource isn't a conflict — it's just not found." },
    { label: "500 Internal Server Error — the server should never be called twice like this", correct: false, explanation: "The client is allowed to retry DELETE requests (it's idempotent by design). This should not cause a server error." },
  ]}
/>

<QuizQuestion
  id="rest-q3"
  question="You're building a mobile app that fetches a user's posts. offset-based pagination works now, but you're worried about large datasets. What's the better approach?"
  options={[
    { label: "Cursor-based pagination — use the last seen ID as the cursor for the next page", correct: true, explanation: "Correct! Cursor-based pagination is O(1) per page regardless of how deep you are. It never needs to scan and discard thousands of rows. It also handles concurrent inserts correctly." },
    { label: "Just increase the page size to 1000 items — fetch fewer pages", correct: false, explanation: "Larger page sizes make the problem worse: more data per request, slower render, more memory. This is the opposite direction." },
    { label: "Cache all posts client-side on first load", correct: false, explanation: "For a user with 10,000 posts this would be a multi-MB payload and slow initial load. Pagination exists precisely to avoid this." },
    { label: "Use offset pagination but add a database index — that fixes the performance", correct: false, explanation: "An index helps, but OFFSET $n still forces the database to count and skip $n rows. It gets slower as $n grows, with or without an index." },
  ]}
/>

---

## 🏗️ Assignments

### Assignment 1 — Design a REST API
Design (on paper/markdown — no code yet) a REST API for a task management app:
- [ ] Define all resources (tasks, projects, users, labels)
- [ ] List all endpoints with correct verbs and URLs
- [ ] Define the request and response JSON shapes
- [ ] Specify which endpoints require authentication
- [ ] Identify which collections need pagination and choose cursor vs offset (with justification)

### Assignment 2 — Consume a Real API
Using the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) (free, no auth needed):
- [ ] `GET /posts` — paginate using `_limit` and `_start` query params, display 10 at a time
- [ ] Create a post with `POST /posts`
- [ ] Update a post title with `PATCH /posts/1`
- [ ] Delete a post and handle the 200 response correctly
- [ ] Build a `fetch` wrapper that adds `Content-Type`, handles errors, and parses JSON in one place

### Assignment 3 — Error Handling
Extend your fetch wrapper:
- [ ] Parse RFC 9457 Problem Details errors and display `detail` to the user
- [ ] Handle 401 by redirecting to login
- [ ] Handle 429 by reading `Retry-After` header and automatically retrying
- [ ] Handle network failures (no internet) separately from HTTP errors

---

## ✅ Milestone Checklist

<MilestoneChecklist
  lessonId="wiki-rest-api"
  items={[
    "Can design resource URLs that follow REST naming conventions",
    "Know all status codes from 200–504 and when to use each",
    "Can implement authenticated fetch with JWT Bearer tokens",
    "Understand why CORS errors happen and who needs to fix them",
    "Can choose between cursor and offset pagination appropriately",
    "Return RFC 9457 Problem Details from error responses",
    "All three assignments complete",
  ]}
/>

---

## ➡️ See Also

- [HTTP Servers & Middleware](./http_server) — building the API, not consuming it
- [GraphQL](./graphql) — when REST becomes unwieldy
- [Course: Express API](../../courses/express_api/index)
