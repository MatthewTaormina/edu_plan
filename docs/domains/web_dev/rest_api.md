# REST APIs

> **Tool:** REST (Representational State Transfer) · **Introduced:** 2000 (Roy Fielding dissertation) · **Status:** 🟢 Foundation — ubiquitous in every web application

This page is the **conceptual reference** for REST API design. It is relevant from the frontend learner's perspective: understanding APIs makes you a better consumer of them and enables you to work effectively with backend teams.

> **See also:** [GraphQL](./graphql.md) · [JavaScript Core — fetch](./javascript_core.md)

---

## What is a REST API?

REST is an architectural style for distributed systems. A REST API exposes **resources** (things) as URLs, and clients interact with those resources using standard **HTTP verbs** (actions).

| HTTP Verb | Action | Example |
|-----------|--------|---------|
| `GET` | Read / fetch a resource | `GET /posts/42` — fetch post 42 |
| `POST` | Create a new resource | `POST /posts` body: `{ title: "...", body: "..." }` |
| `PUT` | Replace a resource entirely | `PUT /posts/42` body: entire post |
| `PATCH` | Update specific fields | `PATCH /posts/42` body: `{ title: "New title" }` |
| `DELETE` | Remove a resource | `DELETE /posts/42` |

---

## HTTP Status Codes

```
2xx — Success
  200 OK             — standard success  
  201 Created        — resource created (after POST)
  204 No Content     — success, nothing to return (after DELETE)

3xx — Redirection
  301 Moved Permanently — use the new URL forever
  304 Not Modified      — cached version is still valid

4xx — Client Error (you made a mistake)
  400 Bad Request        — malformed request, invalid JSON, missing fields
  401 Unauthorized       — not authenticated (no/invalid token)
  403 Forbidden          — authenticated but you're not allowed
  404 Not Found          — resource doesn't exist
  409 Conflict           — state conflict (e.g. duplicate email on sign-up)
  422 Unprocessable      — request understood but validation failed
  429 Too Many Requests  — rate limited

5xx — Server Error (the server made a mistake)  
  500 Internal Server Error — generic server crash
  502 Bad Gateway           — upstream service failed
  503 Service Unavailable   — server is overloaded or down for maintenance
```

---

## Request and Response Anatomy

```
HTTP Request:
  POST /api/v1/posts HTTP/1.1
  Host: api.example.com
  Content-Type: application/json        ← tells server what we're sending
  Authorization: Bearer eyJhbGci...     ← auth token
  Accept: application/json              ← tells server what we can receive

  {
    "title": "My First Post",
    "body": "Hello world!",
    "userId": 42
  }

HTTP Response:
  HTTP/1.1 201 Created
  Content-Type: application/json
  Location: /api/v1/posts/99            ← URL of the newly created resource

  {
    "id": 99,
    "title": "My First Post",
    "body": "Hello world!",
    "userId": 42,
    "createdAt": "2026-04-12T00:00:00Z"
  }
```

---

## Consuming a REST API from JavaScript

```javascript
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// --- GET — fetch a resource ---
async function getPost(id) {
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

// --- POST — create a resource ---
async function createPost(data) {
    const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

// --- PATCH — partial update ---
async function updatePost(id, changes) {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

// --- DELETE ---
async function deletePost(id) {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    // 204 No Content — nothing to parse
}
```

---

## Authentication

### Bearer Token (JWT)

JSON Web Tokens are the most common auth mechanism for REST APIs called from browsers.

```javascript
// 1. Login — server returns a JWT
const { token } = await login({ email, password });
localStorage.setItem('token', token);

// 2. Include token in every subsequent request
async function authFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}
```

### CORS (Cross-Origin Resource Sharing)

When your frontend at `https://myapp.com` calls an API at `https://api.different.com`, the browser enforces CORS — the server must explicitly allow the request.

```
Browser sends:  OPTIONS /api/posts  (preflight)
                Origin: https://myapp.com

Server returns: 200 OK
                Access-Control-Allow-Origin: https://myapp.com
                Access-Control-Allow-Methods: GET, POST, PATCH, DELETE

Browser then sends the actual request.
```

If you see `CORS error` in DevTools, the backend needs to be configured — this is not something you can fix from the frontend (other than using a proxy in development).

---

## 📚 Resources

=== "Primary"
    - [MDN: HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
    - [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

=== "Supplemental"
    - [REST API Design Best Practices — freeCodeCamp](https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/)
    - [HTTP Status Codes Reference](https://httpstatuses.io/)
