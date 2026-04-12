# Lesson 04 — The HTTP Module: Raw Servers

> **Course:** Node.js Fundamentals · **Time:** 45 minutes
> **📖 Wiki:** [HTTP Servers & Middleware](../../domains/web_dev/http_server.md)
> **🔗 Official Docs:** [http module](https://nodejs.org/api/http.html)

---

## 🎯 Learning Objectives

- [ ] Create an HTTP server with the built-in `http` module
- [ ] Parse URL path and query string
- [ ] Route requests by method and path
- [ ] Understand why frameworks like Express exist

---

## 📖 Concepts

### The Simplest Possible Server

```js
// server.js
import { createServer } from 'node:http';

const server = createServer((req, res) => {
    // req = IncomingMessage — the request
    // res = ServerResponse  — what you write back

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:3000/');
});
```

```bash
node server.js
curl http://localhost:3000    # Hello, World!
```

### Reading the Request

```js
import { createServer } from 'node:http';
import { URL } from 'node:url';

const server = createServer((req, res) => {
    // URL — parse the path and query string
    const url    = new URL(req.url, `http://${req.headers.host}`);
    const path   = url.pathname;               // '/api/users'
    const search = url.searchParams.get('q');  // ?q=hello → 'hello'

    // Method
    const method = req.method;                 // 'GET', 'POST', etc.

    // Headers
    const auth  = req.headers['authorization'];
    const ctype = req.headers['content-type'];

    console.log(`${method} ${path}`);
    res.end('OK');
});
```

### Reading the Request Body

The HTTP body arrives as a stream. You must collect it manually:

```js
function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data',  chunk => { body += chunk.toString(); });
        req.on('end',   ()    => resolve(body));
        req.on('error', err   => reject(err));
    });
}

const server = createServer(async (req, res) => {
    if (req.method === 'POST') {
        const raw  = await readBody(req);
        const data = JSON.parse(raw);         // Assumes JSON body
        console.log(data);
    }
    res.end('OK');
});
```

### Building a Router (The Hard Way)

This is what Express does internally — seeing it raw makes the framework's value obvious:

```js
import { createServer } from 'node:http';
import { URL }          from 'node:url';

// Simple in-memory task store
const tasks = [
    { id: 1, title: 'Buy milk',   done: false },
    { id: 2, title: 'Write code', done: true  },
];

function json(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

async function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', c => chunks.push(c));
        req.on('end',  () => resolve(Buffer.concat(chunks).toString()));
        req.on('error', reject);
    });
}

const server = createServer(async (req, res) => {
    const url  = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    // GET /tasks
    if (req.method === 'GET' && path === '/tasks') {
        return json(res, 200, tasks);
    }

    // POST /tasks
    if (req.method === 'POST' && path === '/tasks') {
        const body  = await readBody(req);
        const { title } = JSON.parse(body);
        if (!title) return json(res, 400, { error: 'title required' });
        const task  = { id: tasks.length + 1, title, done: false };
        tasks.push(task);
        return json(res, 201, task);
    }

    // GET /tasks/:id
    const match = path.match(/^\/tasks\/(\d+)$/);
    if (req.method === 'GET' && match) {
        const task = tasks.find(t => t.id === Number(match[1]));
        if (!task) return json(res, 404, { error: 'Not found' });
        return json(res, 200, task);
    }

    // 404
    json(res, 404, { error: 'Not found' });
});

server.listen(3000, () => console.log('Listening on :3000'));
```

### Why This Gets Hard Fast

Notice what's missing from the raw `http` approach:
- ❌ No body parsing (you wrote your own)
- ❌ No route parameter extraction (you wrote a regex)
- ❌ No middleware chain
- ❌ No error propagation
- ❌ No async error catching

This is exactly the problem Express solves. But understanding the raw `http` module means you understand what the framework is doing for you.

---

## 🏗️ Assignment

Extend the raw HTTP task server above to handle:
- `PUT /tasks/:id` — update a task's title or done status
- `DELETE /tasks/:id` — remove a task
- Return `405 Method Not Allowed` for invalid methods on known paths

Deliberately **do not use Express**. Feel the pain — it prepares you to appreciate the next lesson.

---

## ✅ Milestone Checklist

- [ ] I created an HTTP server with `createServer`
- [ ] I parsed the URL path and query string with the `URL` class
- [ ] I collected the request body by listening to the `data` and `end` events
- [ ] I understand why routing by hand is painful (motivating the next course)

## ➡️ Next Unit

[Lesson 05 — Environment, Process & CLI Args](./lesson_05.md)
