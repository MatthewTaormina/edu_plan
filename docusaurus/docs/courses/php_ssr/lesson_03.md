# Lesson 03 — Handling Requests: `$_GET`, `$_POST`, `$_SERVER`

> **Course:** PHP & Server-Side Rendering · **Time:** 45 minutes

---

## 🎯 Learning Objectives

- [ ] Read URL query strings with `$_GET`
- [ ] Read form POST data with `$_POST`
- [ ] Inspect request metadata with `$_SERVER`
- [ ] Sanitize and validate input safely

---

## 📖 Concepts

### The Superglobals

PHP populates these arrays automatically for every request:

| Superglobal | Contains |
|-------------|---------|
| `$_GET` | URL query string parameters |
| `$_POST` | HTML form POST data (`application/x-www-form-urlencoded` / `multipart/form-data`) |
| `$_SERVER` | Server and request metadata |
| `$_COOKIE` | Cookies sent by the browser |
| `$_SESSION` | Session data (after `session_start()`) |
| `$_FILES` | Uploaded files |
| `$_REQUEST` | Merged `$_GET` + `$_POST` + `$_COOKIE` (avoid — ambiguous) |

### `$_GET` — Query String Parameters

```php
<?php
// URL: /search.php?q=php+tutorial&page=2&sort=date

$query = $_GET['q']    ?? '';   // 'php tutorial'
$page  = (int)($_GET['page'] ?? 1);   // 2  — cast to int
$sort  = $_GET['sort'] ?? 'relevance';

// ALWAYS sanitize before echoing into HTML
echo "Results for: " . htmlspecialchars($query);
echo "Page: $page";
```

### `$_POST` — Form Data

```php
<?php
// routes this request: POST /login.php
// Body: email=alice@example.com&password=secret

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email']    ?? '');
    $password = trim($_POST['password'] ?? '');

    // Validate
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }
    if (strlen($password) < 8) {
        $errors[] = 'Password must be at least 8 characters';
    }

    if (empty($errors)) {
        // Process login...
        header('Location: /dashboard.php');
        exit;    // ALWAYS exit after header redirect
    }
}
```

### `$_SERVER` — Request Metadata

```php
<?php
$method     = $_SERVER['REQUEST_METHOD'];    // 'GET', 'POST'
$uri        = $_SERVER['REQUEST_URI'];       // '/search.php?q=php'
$host       = $_SERVER['HTTP_HOST'];         // 'example.com'
$userAgent  = $_SERVER['HTTP_USER_AGENT'];   // 'Mozilla/5.0 ...'
$remoteIp   = $_SERVER['REMOTE_ADDR'];       // '203.0.113.1'
$protocol   = $_SERVER['SERVER_PROTOCOL'];   // 'HTTP/1.1'
$scriptPath = $_SERVER['SCRIPT_FILENAME'];   // '/var/www/html/search.php'

// Is this HTTPS?
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
           || $_SERVER['SERVER_PORT'] == 443;

// Reading a custom header: X-API-Key → HTTP_X_API_KEY
$apiKey = $_SERVER['HTTP_X_API_KEY'] ?? null;
```

### Input Validation and Sanitization

**Validate** = check rules (required, email format, max length).
**Sanitize** = clean the data for output (escape HTML, strip tags).

```php
<?php
// Built-in filters
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$age   = filter_input(INPUT_POST, 'age',   FILTER_VALIDATE_INT);
$url   = filter_input(INPUT_GET,  'next',  FILTER_VALIDATE_URL);

// Returns false if invalid, null if missing
if ($email === false || $email === null) {
    die("Invalid email");
}

// Sanitize an integer (remove non-numeric chars)
$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);

// Strip HTML tags
$clean = strip_tags($_POST['comment'] ?? '');

// For HTML output — escape special chars
$safe = htmlspecialchars($clean, ENT_QUOTES, 'UTF-8');
```

### Dispatching by Method — Mini Router Pattern

```php
<?php
// tasks.php — handles GET (list) and POST (create)
declare(strict_types=1);

$method = $_SERVER['REQUEST_METHOD'];

match ($method) {
    'GET'  => handleGet(),
    'POST' => handlePost(),
    default => http_response_code(405) && die('Method Not Allowed'),
};

function handleGet(): void {
    // Read tasks from a JSON file (no DB in this course)
    $tasks = loadTasks();
    include 'views/tasks/index.php';
}

function handlePost(): void {
    $title = trim($_POST['title'] ?? '');
    $errors = [];

    if (empty($title)) $errors[] = 'Title is required';
    if (strlen($title) > 200) $errors[] = 'Title too long';

    if (!empty($errors)) {
        http_response_code(422);
        include 'views/tasks/create.php';
        return;
    }

    $tasks = loadTasks();
    $tasks[] = ['id' => uniqid(), 'title' => $title, 'done' => false];
    saveTasks($tasks);

    header('Location: /tasks.php');
    exit;
}

function loadTasks(): array {
    $file = __DIR__ . '/data/tasks.json';
    if (!file_exists($file)) return [];
    return json_decode(file_get_contents($file), true) ?? [];
}

function saveTasks(array $tasks): void {
    file_put_contents(__DIR__ . '/data/tasks.json', json_encode($tasks, JSON_PRETTY_PRINT));
}
```

---

## ✅ Milestone Checklist

- [ ] I check `$_SERVER['REQUEST_METHOD']` before accessing `$_POST`
- [ ] I always call `exit` after `header('Location: ...')`
- [ ] I use `htmlspecialchars()` on every `$_GET`/`$_POST` value echoed into HTML
- [ ] I use `(int)` or `filter_input(... FILTER_VALIDATE_INT)` for numeric inputs

## ➡️ Next Unit

[Lesson 04 — Templates: Separating Logic from HTML](./lesson_04.md)
