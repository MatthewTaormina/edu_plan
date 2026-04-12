# Lesson 07 — Capstone: Contact Form + Flat-File Blog

> **Course:** PHP & Server-Side Rendering · **Time:** 90 minutes
> **Prerequisites:** All previous lessons

---

## 🎯 Project Overview

Build a **flat-file blog** with a contact form:
- Public blog: list posts, view a post
- Protected admin: login, create/edit posts, delete posts
- Contact form: CSRF-protected, validates input, sends email (or just saves to JSON)
- No database — data stored in JSON files

---

## Project Structure

```text
blog/
├── index.php           ← POST list
├── post.php            ← Single post view
├── create-post.php     ← Admin: create post
├── edit-post.php       ← Admin: edit post
├── delete-post.php     ← Admin: delete post (POST)
├── contact.php         ← Contact form
├── login.php
├── logout.php
├── auth.php            ← Session guard (redirect if not logged in)
├── csrf.php            ← CSRF token helpers
├── helpers.php         ← render(), loadJson(), saveJson(), e(), flash()
├── data/
│   ├── posts.json
│   └── messages.json
├── views/
│   ├── layout.php
│   ├── nav.php
│   ├── partials/
│   │   └── flash.php
│   ├── blog/
│   │   ├── index.php
│   │   └── post.php
│   ├── admin/
│   │   ├── create.php
│   │   └── edit.php
│   └── contact/
│       └── form.php
├── assets/
│   └── style.css
└── uploads/            ← gitignored
```

---

## Key Implementation

### Blog Index

```php
<?php
// index.php
declare(strict_types=1);
require_once __DIR__ . '/helpers.php';

$posts = loadJson(__DIR__ . '/data/posts.json');

// Sort newest first
usort($posts, fn($a, $b) => strcmp($b['created_at'], $a['created_at']));

render('blog/index', [
    'title' => 'Blog',
    'posts' => $posts,
]);
```

```html
<!-- views/blog/index.php -->
<h1 class="page-title">Recent Posts</h1>

<?php if (empty($posts)): ?>
    <p>No posts yet.</p>
<?php else: ?>
    <div class="posts-grid">
        <?php foreach ($posts as $post): ?>
            <article class="post-card">
                <h2><a href="/post.php?slug=<?= e($post['slug']) ?>"><?= e($post['title']) ?></a></h2>
                <time><?= e($post['created_at']) ?></time>
                <p><?= e(substr($post['body'], 0, 150)) ?>...</p>
            </article>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<?php if (isset($_SESSION['user_id'])): ?>
    <a href="/create-post.php" class="btn">+ New Post</a>
<?php endif; ?>
```

### Contact Form Handler

```php
<?php
// contact.php
declare(strict_types=1);
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/csrf.php';

$errors = [];
$input  = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();

    $input = [
        'name'    => trim($_POST['name']    ?? ''),
        'email'   => trim($_POST['email']   ?? ''),
        'message' => trim($_POST['message'] ?? ''),
    ];

    if (strlen($input['name']) < 2) {
        $errors['name'] = 'Please enter your name.';
    }
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Please enter a valid email.';
    }
    if (strlen($input['message']) < 10) {
        $errors['message'] = 'Message must be at least 10 characters.';
    }

    if (empty($errors)) {
        $messages   = loadJson(__DIR__ . '/data/messages.json');
        $messages[] = [
            'id'         => uniqid(),
            'name'       => $input['name'],
            'email'      => $input['email'],
            'message'    => $input['message'],
            'created_at' => date('Y-m-d H:i:s'),
            'read'       => false,
        ];
        saveJson(__DIR__ . '/data/messages.json', $messages);

        flash('success', 'Thanks! We\'ll get back to you soon.');
        header('Location: /contact.php');
        exit;
    }
}

render('contact/form', [
    'title'  => 'Contact Us',
    'errors' => $errors,
    'input'  => $input,
]);
```

### Slug-Based Routing

```php
<?php
// router.php — used with: php -S localhost:8080 router.php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route map
$routes = [
    '/'        => 'index.php',
    '/post'    => 'post.php',
    '/contact' => 'contact.php',
    '/login'   => 'login.php',
    '/logout'  => 'logout.php',
    '/admin'   => 'create-post.php',
    '/admin/create' => 'create-post.php',
    '/admin/edit'   => 'edit-post.php',
    '/admin/delete' => 'delete-post.php',
];

$file = $routes[$path] ?? null;

if ($file && file_exists(__DIR__ . '/' . $file)) {
    require __DIR__ . '/' . $file;
} elseif (is_file(__DIR__ . $path)) {
    return false;   // Serve static file (CSS, JS, uploads)
} else {
    http_response_code(404);
    require __DIR__ . '/views/404.php';
}
```

```bash
# Start with the router
php -S localhost:8080 router.php
```

---

## ✅ Milestone Checklist

- [ ] Public blog lists all posts sorted newest-first
- [ ] Single post view loads by `?slug=` and 404s if not found
- [ ] Contact form validates, shows errors, and saves to `messages.json`
- [ ] Login/logout session flow works with CSRF protection on all forms
- [ ] Admin create/edit pages are protected — visiting without login redirects to `/login`
- [ ] All user-supplied output is escaped with `e()` / `htmlspecialchars()`

## 🏆 PHP & SSR Complete!

## ➡️ Next Course

[Laravel Fundamentals](../laravel_fundamentals/index.md) — professional PHP with MVC, ORM, and Breeze auth
