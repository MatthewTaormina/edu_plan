# Lesson 04 — Templates: Separating Logic from HTML

> **Course:** PHP & Server-Side Rendering · **Time:** 60 minutes

---

## 🎯 Learning Objectives

- [ ] Separate PHP logic from HTML presentation
- [ ] Use PHP's alternative control flow syntax for templates
- [ ] Include partial templates for reusable components
- [ ] Implement a minimal view rendering helper

---

## 📖 Concepts

### The Problem: Mixing Logic and Presentation

Unstructured PHP quickly becomes unmaintainable:

```php
<?php
// ❌ Bad — logic and HTML entangled
$pdo = new PDO("sqlite:" . __DIR__ . "/data.sqlite");
$stmt = $pdo->query("SELECT * FROM posts");
while ($post = $stmt->fetch(PDO::FETCH_ASSOC)):
?>
<h2><?= htmlspecialchars($post['title']) ?></h2>
<p><?= htmlspecialchars($post['body']) ?></p>
<?php endwhile; ?>
```

### Template Approach — Separate Concerns

```
index.php          ← Controller: load data, validate, redirect
views/
  layout.php       ← HTML structure (header, footer, nav)
  posts/
    index.php      ← Template: loop through $posts
    show.php       ← Template: single post
  partials/
    nav.php        ← Reusable: navigation bar
    flash.php      ← Reusable: success/error messages
```

```php
<?php
// index.php — the "controller"
declare(strict_types=1);
require_once __DIR__ . '/helpers.php';

$posts = loadJson(__DIR__ . '/data/posts.json');

// Pass data to the view
render('posts/index', ['posts' => $posts, 'title' => 'All Posts']);
```

### The `render()` Helper

```php
<?php
// helpers.php
declare(strict_types=1);

/**
 * Render a view template with data.
 * Uses output buffering to capture the view and inject into layout.
 */
function render(string $view, array $data = [], string $layout = 'layout'): void {
    // Extract data as local variables for the template
    extract($data);

    // Capture the view's output
    ob_start();
    require __DIR__ . "/views/{$view}.php";
    $content = ob_get_clean();

    // Render the layout with $content available
    require __DIR__ . "/views/{$layout}.php";
}

/** Escape output for safe HTML rendering */
function e(string|int|float $value): string {
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

/** Load a JSON data file */
function loadJson(string $path): array {
    if (!file_exists($path)) return [];
    return json_decode(file_get_contents($path), true) ?? [];
}

/** Save data to a JSON file */
function saveJson(string $path, array $data): void {
    $dir = dirname($path);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}
```

### The Layout Template

```html
<?php // views/layout.php ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($title ?? 'My Site') ?></title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
    <?php require __DIR__ . '/partials/nav.php'; ?>

    <main class="container">
        <?php require __DIR__ . '/partials/flash.php'; ?>
        <?= $content ?>  <!-- Injected by render() -->
    </main>

    <footer>
        <p>&copy; <?= date('Y') ?> My Site</p>
    </footer>
</body>
</html>
```

### View Templates — Alternative Syntax

PHP has cleaner syntax for control flow inside templates:

```html
<?php // views/posts/index.php ?>

<h1>Posts</h1>

<?php if (empty($posts)): ?>
    <p>No posts yet. <a href="/posts/create.php">Write one!</a></p>
<?php else: ?>
    <ul class="posts-list">
        <?php foreach ($posts as $post): ?>
            <li>
                <a href="/post.php?id=<?= e($post['id']) ?>">
                    <?= e($post['title']) ?>
                </a>
                <span class="date"><?= e($post['created_at']) ?></span>
            </li>
        <?php endforeach; ?>
    </ul>
<?php endif; ?>

<a href="/posts/create.php" class="btn">+ New Post</a>
```

### Flash Messages Partial

```html
<?php // views/partials/flash.php ?>
<?php if (session_status() === PHP_SESSION_NONE) session_start(); ?>

<?php if (!empty($_SESSION['flash_success'])): ?>
    <div class="alert success" role="alert">
        <?= e($_SESSION['flash_success']) ?>
    </div>
    <?php unset($_SESSION['flash_success']); ?>
<?php endif; ?>

<?php if (!empty($_SESSION['flash_error'])): ?>
    <div class="alert error" role="alert">
        <?= e($_SESSION['flash_error']) ?>
    </div>
    <?php unset($_SESSION['flash_error']); ?>
<?php endif; ?>
```

### Setting Flash Messages

```php
<?php
// In a controller / handler
function flash(string $type, string $message): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
    $_SESSION["flash_{$type}"] = $message;
}

// After successful create:
flash('success', 'Post created!');
header('Location: /index.php');
exit;
```

---

## ✅ Milestone Checklist

- [ ] All my PHP controller files follow the pattern: load data → validate → render view
- [ ] I use the `e()` helper (or `htmlspecialchars()`) on every variable echoed in a template
- [ ] The layout is a single file with `$content` injected — not duplicated per page
- [ ] Flash messages use the session and are cleared after display

## ➡️ Next Unit

[Lesson 05 — Sessions & Cookies](./lesson_05.md)
