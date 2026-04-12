# Lesson 06 — Forms, Validation & CSRF Protection

> **Course:** PHP & Server-Side Rendering · **Time:** 60 minutes

---

## 🎯 Learning Objectives

- [ ] Build an HTML form that POSTs to a PHP handler
- [ ] Implement CSRF token generation and verification
- [ ] Return and display validation errors without losing form data
- [ ] Handle file uploads safely

---

## 📖 Concepts

### CSRF — Cross-Site Request Forgery

Without CSRF protection, a malicious site can submit forms on behalf of your logged-in users:

```
Attacker's site → <form action="https://yoursite.com/delete-account" method="POST">
                  → Auto-submits with your user's cookies → Account deleted!
```

**Solution:** Generate a random, secret token stored in the session. Include it in every form. Verify it on the server before processing the submission.

```php
<?php
// csrf.php — CSRF helper functions
declare(strict_types=1);

function csrf_generate(): string {
    if (session_status() === PHP_SESSION_NONE) session_start();

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_verify(): void {
    if (session_status() === PHP_SESSION_NONE) session_start();

    $token = $_POST['_csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

    if (!hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        http_response_code(403);
        die('Invalid CSRF token. Please go back and try again.');
    }
}

function csrf_field(): string {
    return '<input type="hidden" name="_csrf_token" value="' . csrf_generate() . '">';
}
```

### Complete Form Handler

```php
<?php
// create-post.php
declare(strict_types=1);
require_once __DIR__ . '/auth.php';     // Redirects to login if not authenticated
require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/helpers.php';

$errors = [];
$input  = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();   // ← Always verify CSRF on POST

    // Read and trim input
    $input = [
        'title' => trim($_POST['title'] ?? ''),
        'body'  => trim($_POST['body']  ?? ''),
        'tags'  => trim($_POST['tags']  ?? ''),
    ];

    // Validate
    if (strlen($input['title']) < 3) {
        $errors['title'] = 'Title must be at least 3 characters.';
    }
    if (strlen($input['title']) > 200) {
        $errors['title'] = 'Title must be under 200 characters.';
    }
    if (empty($input['body'])) {
        $errors['body'] = 'Body is required.';
    }

    if (empty($errors)) {
        // Build the post
        $posts   = loadJson(__DIR__ . '/data/posts.json');
        $posts[] = [
            'id'         => uniqid(),
            'title'      => $input['title'],
            'body'       => $input['body'],
            'slug'       => slugify($input['title']),
            'created_at' => date('Y-m-d H:i:s'),
            'author_id'  => $_SESSION['user_id'],
        ];
        saveJson(__DIR__ . '/data/posts.json', $posts);

        flash('success', 'Post created!');
        header('Location: /index.php');
        exit;
    }
    // If we reach here, re-render the form with $errors and $input
}

render('posts/create', [
    'title'  => 'Create Post',
    'errors' => $errors,
    'input'  => $input,
]);
```

```html
<!-- views/posts/create.php -->
<h1>Create Post</h1>

<form method="POST" action="/create-post.php">
    <?= csrf_field() ?>

    <div class="field">
        <label for="title">Title</label>
        <input
            id="title"
            name="title"
            type="text"
            value="<?= htmlspecialchars($input['title'] ?? '') ?>"
            class="<?= isset($errors['title']) ? 'error' : '' ?>"
            required
        >
        <?php if (isset($errors['title'])): ?>
            <p class="error-msg"><?= htmlspecialchars($errors['title']) ?></p>
        <?php endif; ?>
    </div>

    <div class="field">
        <label for="body">Body</label>
        <textarea id="body" name="body" rows="10"
                  class="<?= isset($errors['body']) ? 'error' : '' ?>"><?= htmlspecialchars($input['body'] ?? '') ?></textarea>
        <?php if (isset($errors['body'])): ?>
            <p class="error-msg"><?= htmlspecialchars($errors['body']) ?></p>
        <?php endif; ?>
    </div>

    <button type="submit">Publish Post</button>
    <a href="/index.php">Cancel</a>
</form>
```

### File Upload Handling

```php
<?php
// upload-avatar.php
declare(strict_types=1);
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/csrf.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();

    $file = $_FILES['avatar'] ?? null;

    if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
        $error = 'Upload failed. Please try again.';
    } else {
        $maxSize   = 5 * 1024 * 1024;   // 5 MB
        $allowed   = ['image/jpeg', 'image/png', 'image/webp'];

        // Verify MIME type using finfo (NOT $_FILES['type'] — that's user-supplied!)
        $finfo    = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowed)) {
            $error = 'Only JPEG, PNG, and WebP images are allowed.';
        } elseif ($file['size'] > $maxSize) {
            $error = 'File too large. Maximum 5 MB.';
        } else {
            $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = bin2hex(random_bytes(16)) . '.' . strtolower($ext);
            $dest     = __DIR__ . '/uploads/' . $filename;

            if (move_uploaded_file($file['tmp_name'], $dest)) {
                $_SESSION['avatar'] = '/uploads/' . $filename;
                flash('success', 'Avatar updated!');
                header('Location: /profile.php');
                exit;
            }
        }
    }
}

render('profile/avatar', ['title' => 'Upload Avatar', 'error' => $error ?? null]);
```

---

## ✅ Milestone Checklist

- [ ] Every POST form includes `<?= csrf_field() ?>` and the handler calls `csrf_verify()`
- [ ] Validation errors show next to the relevant field — form data is re-populated
- [ ] File type is verified with `finfo` — not `$_FILES['type']`
- [ ] Uploaded files use a server-generated filename — never the original name

## ➡️ Next Unit

[Lesson 07 — Capstone: Contact Form + Flat-File Blog](./lesson_07.md)
