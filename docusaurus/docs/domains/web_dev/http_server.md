---
title: HTTP Servers & Middleware
description: Server-side HTTP concepts — request lifecycle, middleware patterns, routing, CORS, and authentication.
sidebar_label: HTTP Servers & Middleware
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> **Scope:** Server-side HTTP concepts — how web servers receive and respond to requests, middleware patterns, and routing. Language-agnostic; examples use Node.js and PHP.

---

## The Request / Response Lifecycle

Every HTTP interaction follows the same pattern:

```mermaid
sequenceDiagram
    participant C as Browser / Client
    participant S as Server

    C->>S: POST /api/tasks<br/>Content-Type: application/json<br/>Authorization: Bearer TOKEN<br/>Body: {"title": "Buy milk"}
    Note over S: Route matching<br/>Middleware chain<br/>Handler executes
    S-->>C: 201 Created<br/>Body: {"id": 42, "title": "Buy milk", "done": false}
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
| 4xx | Client Error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found |
| 5xx | Server Error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

:::tip
**401 vs 403:** 401 = "Who are you? Please authenticate." 403 = "I know who you are, you're just not allowed."
:::

---

## Middleware Pattern

Middleware is a **chain of functions** that each receive the request and response, do something, then pass control to the next function.

```mermaid
flowchart LR
    req([Request]) --> logger[Logger\nlog IP]
    logger --> auth[Auth Check\nverify JWT]
    auth --> parser[JSON Parser\nparse body]
    parser --> rate[Rate Limiter\ncheck limits]
    rate --> handler([Handler → Response])

    auth -- "401 Unauthorized" --> stop([Stop Chain])
```

Each middleware can:
- **Pass through** — call `next()` to continue the chain
- **Respond early** — send a response and stop the chain (e.g. 401)
- **Modify req/res** — attach data for downstream handlers (e.g. `req.user = decoded.user`)

<Tabs>
  <TabItem value="express" label="Express (TypeScript)">
  ```ts
  // Express middleware signature
  function myMiddleware(req: Request, res: Response, next: NextFunction) {
      // Do something
      next();  // Pass to next middleware / route handler
      // OR:
      res.status(401).json({ error: 'Unauthorised' });  // Stop chain
  }
  ```
  </TabItem>
  <TabItem value="php" label="PHP (Laravel)">
  ```php
  // Laravel middleware
  public function handle(Request $request, Closure $next): Response
  {
      // Do something before
      $response = $next($request);
      // Do something after
      return $response;
  }
  ```
  </TabItem>
</Tabs>

---

## Routing

Routing maps an **HTTP method + URL pattern** to a handler function:

```mermaid
flowchart TD
    req([Incoming Request]) --> match{Match route?}
    match -- "GET  /users" --> lu[listUsers handler]
    match -- "GET  /users/:id" --> gu[getUser handler]
    match -- "POST /users" --> cu[createUser handler]
    match -- "PUT  /users/:id" --> uu[updateUser handler]
    match -- "DELETE /users/:id" --> du[deleteUser handler]
    match -- "No match" --> e404[404 Not Found]
```

### URL Anatomy

```mermaid
flowchart LR
    url["https://api.example.com/users/42?include=posts&format=json"]
    url --> proto["https:\nProtocol"]
    url --> host["api.example.com\nHost"]
    url --> path["/users/42\nPath — identifies the resource"]
    url --> qs["?include=posts&format=json\nQuery string — optional filters"]
```

---

## CORS — Cross-Origin Resource Sharing

Browsers block JavaScript from making requests to a **different origin** (protocol + host + port) by default.

```mermaid
sequenceDiagram
    participant B as Browser
    participant F as Frontend (app.example.com)
    participant S as API (api.example.com)

    B->>S: OPTIONS /api/tasks<br/>Origin: https://app.example.com<br/>Access-Control-Request-Method: POST
    S-->>B: Access-Control-Allow-Origin: https://app.example.com<br/>Access-Control-Allow-Methods: GET, POST, PUT, DELETE
    B->>S: POST /api/tasks (actual request)
    S-->>B: 201 Created
```

<Tabs>
  <TabItem value="express" label="Express">
  ```ts
  import cors from 'cors';  // npm install cors

  app.use(cors({
      origin:      'https://app.example.com',  // Or '*' for public APIs
      credentials: true                         // Required if sending cookies
  }));
  ```
  </TabItem>
  <TabItem value="laravel" label="Laravel">
  ```php
  // config/cors.php
  'allowed_origins' => ['https://app.example.com'],
  'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
  'allowed_headers' => ['Content-Type', 'Authorization'],
  'supports_credentials' => true,
  ```
  </TabItem>
</Tabs>

---

## Authentication Patterns

```mermaid
flowchart TD
    subgraph sessions["Session Cookies"]
        s1[POST /login] --> s2[Server creates session in Redis]
        s2 --> s3[Set-Cookie: session=id]
        s3 --> s4[Browser sends cookie automatically]
        s4 --> s5[Server looks up session by ID]
    end

    subgraph jwt["JSON Web Tokens"]
        j1[POST /login] --> j2[Server validates → returns JWT]
        j2 --> j3[Client stores + sends: Authorization: Bearer eyJ...]
        j3 --> j4[Server verifies signature — no session store needed]
    end
```

| | Session Cookies | JWT |
|-|----------------|-----|
| Revocation | Easy — delete session | Hard — must use short expiry + refresh tokens |
| Scaling | Requires Redis for horizontal scale | Stateless — scales naturally |
| Storage | Server-side | Client-side |

---

## 📚 See Also

- [Course: Express API](../courses/express_api/index)
- [Course: Node.js Fundamentals](../courses/nodejs_fundamentals/index)
- [Course: PHP & SSR](../courses/php_ssr/index)
- [Wiki: REST APIs](./rest_api)
- [Wiki: Node.js](./nodejs)
