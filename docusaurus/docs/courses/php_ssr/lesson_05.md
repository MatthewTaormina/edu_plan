# Lesson 05 — Sessions & Cookies

> **Course:** PHP & Server-Side Rendering · **Time:** 45 minutes
> **🔗 Official Docs:** [PHP Sessions](https://www.php.net/manual/en/book.session.php) · [PHP Cookies](https://www.php.net/manual/en/function.setcookie.php)

---

## 🎯 Learning Objectives

- [ ] Start and manage PHP sessions
- [ ] Implement a simple login/logout flow with sessions
- [ ] Set and read cookies with correct security flags
- [ ] Understand the difference between sessions and cookies

---

## 📖 Concepts

### Sessions vs Cookies

| | Session | Cookie |
|-|---------|--------|
| Storage | Server-side (files/DB) | Client-side (browser) |
| Sent on every request | Session ID (cookie) | Yes |
| Size limit | Server limited | 4 KB |
| Visible to user? | No (just the ID) | Yes |
| Expires | Server-controlled | By expiry date |
| Best for | Auth, cart, preferences | Remember me, analytics, theme |

### Sessions

```php
<?php
// MUST be called before any output — at the very top of the file
session_start();

// Store data
$_SESSION['user_id']   = 42;
$_SESSION['user_name'] = 'Alice';
$_SESSION['role']      = 'admin';

// Read data
$userId = $_SESSION['user_id'] ?? null;

// Delete one value
unset($_SESSION['role']);

// Destroy the entire session (logout)
session_destroy();              // Removes server-side data
setcookie(session_name(), '', time() - 3600, '/');  // Expire the cookie

// Regenerate session ID (do this after login — prevents session fixation)
session_regenerate_id(true);
```

### Simple Login / Logout Flow

```php
<?php
// login.php
declare(strict_types=1);
session_start();

// If already logged in, go to dashboard
if (!empty($_SESSION['user_id'])) {
    header('Location: /dashboard.php');
    exit;
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email']    ?? '');
    $password = trim($_POST['password'] ?? '');

    // (In a real app, look up user in DB and verify password_verify())
    // Here: hardcoded demo user
    $users = [
        ['id' => 1, 'email' => 'alice@example.com', 'hash' => password_hash('secret123', PASSWORD_BCRYPT), 'name' => 'Alice'],
    ];

    $user = null;
    foreach ($users as $u) {
        if ($u['email'] === $email && password_verify($password, $u['hash'])) {
            $user = $u;
            break;
        }
    }

    if ($user) {
        session_regenerate_id(true);   // Prevent session fixation
        $_SESSION['user_id']   = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        header('Location: /dashboard.php');
        exit;
    } else {
        $errors[] = 'Invalid email or password';
    }
}
?>
<!DOCTYPE html>
<html>
<body>
<form method="POST">
    <?php foreach ($errors as $e): ?>
        <p style="color:red"><?= htmlspecialchars($e) ?></p>
    <?php endforeach; ?>
    <input type="email"    name="email"    required>
    <input type="password" name="password" required>
    <button type="submit">Log in</button>
</form>
</body>
</html>
```

```php
<?php
// auth.php — shared guard, include at top of protected pages
declare(strict_types=1);
session_start();

if (empty($_SESSION['user_id'])) {
    header('Location: /login.php');
    exit;
}
```

```php
<?php
// logout.php
session_start();
$_SESSION = [];
session_destroy();
setcookie(session_name(), '', time() - 3600, '/');
header('Location: /login.php');
exit;
```

### Cookies

```php
<?php
// Set a cookie
setcookie(
    'theme',                   // Name
    'dark',                    // Value
    [
        'expires'  => time() + (30 * 24 * 60 * 60),  // 30 days
        'path'     => '/',
        'domain'   => '',       // Current domain
        'secure'   => true,     // HTTPS only (always true in production)
        'httponly' => false,    // JavaScript CAN read this cookie (theme is non-sensitive)
        'samesite' => 'Lax',   // CSRF protection
    ]
);

// Read a cookie
$theme = $_COOKIE['theme'] ?? 'light';

// Delete a cookie (set expiry in the past)
setcookie('theme', '', time() - 3600, '/');
```

:::info
Use `httponly: true` for any authentication-related cookie. This prevents JavaScript from reading it, protecting against XSS attacks.
Use `secure: true` in production — cookies must only travel over HTTPS.
:::

### Cookie Security Flags Summary

| Flag | Value | Effect |
|------|-------|--------|
| `httponly` | `true` | JS cannot read cookie (XSS protection — use for auth) |
| `secure` | `true` | Only sent over HTTPS |
| `samesite` | `Lax` | Safe default — sent on top-level navigation |
| `samesite` | `Strict` | Never sent cross-site (breaks OAuth redirects) |
| `samesite` | `None` | Sent everywhere — requires `secure: true` |

---

## ✅ Milestone Checklist

- [ ] I call `session_start()` before any output (headers must come first)
- [ ] I call `session_regenerate_id(true)` immediately after a successful login
- [ ] `logout.php` clears `$_SESSION`, destroys the session, and expires the cookie
- [ ] I use `httponly: true` for the session cookie
- [ ] I understand the difference between what sessions and cookies store

## ➡️ Next Unit

[Lesson 06 — Forms, Validation & CSRF Protection](./lesson_06.md)
