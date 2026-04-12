# Lesson 01 — PHP Runtime & Setup

> **Course:** PHP & Server-Side Rendering · **Time:** 45 minutes
> **🔗 Official Docs:** [PHP Installation](https://www.php.net/manual/en/install.php) · [Built-in server](https://www.php.net/manual/en/features.commandline.webserver.php)

---

## 🎯 Learning Objectives

- [ ] Install PHP on Windows and Linux
- [ ] Run the built-in PHP development server
- [ ] Understand PHP's request model vs Node.js
- [ ] Create and execute a basic PHP script

---

## 📖 Concepts

### How PHP Works (vs Node.js)

**Node.js** runs a long-lived process. It receives every request in that same process.

**PHP** (traditional model) works differently:
1. A web server (Apache, Nginx) receives an HTTP request
2. PHP spawns a new process (or uses FPM workers) for that request
3. The PHP script runs top-to-bottom and exits
4. No persistent state between requests (unless you use sessions or a cache)

```
Browser → Apache/Nginx → PHP-FPM → script.php (runs, terminates) → HTML response
```

This "share-nothing" model is simpler to reason about — each request gets a blank slate.

### Installation

=== "Windows"
    The easiest approach on Windows is via [XAMPP](https://www.apachefriends.org/) (bundles PHP, Apache, MySQL) or installing PHP standalone:

    ```powershell
    # With Chocolatey (recommended)
    choco install php

    # Verify
    php --version

    # Or download the zip from php.net and add to PATH manually
    ```

=== "Linux (Ubuntu/Debian)"
    ```bash
    sudo apt update
    sudo apt install php php-cli php-mbstring php-xml php-curl -y
    php --version
    ```

=== "Linux (Fedora/RHEL)"
    ```bash
    sudo dnf install php php-cli php-mbstring php-xml php-curl
    php --version
    ```

### The Built-in Development Server

PHP ships a web server — no Apache/Nginx needed for development:

```bash
# Serve the current directory on port 8080
php -S localhost:8080

# Serve a specific directory
php -S localhost:8080 -t public/

# With a router script (handle all URLs)
php -S localhost:8080 router.php
```

```php
<?php
// hello.php
echo "Hello from PHP!";
echo " Running PHP " . PHP_VERSION;
?>
```

```bash
php -S localhost:8080
# Open http://localhost:8080/hello.php
```

### PHP's Request Model

```php
<?php
// request_info.php
// PHP automatically populates superglobals for each request

echo "Method:  " . $_SERVER['REQUEST_METHOD'] . "\n";
echo "URI:     " . $_SERVER['REQUEST_URI'] . "\n";
echo "Query:   " . $_SERVER['QUERY_STRING'] . "\n";
echo "IP:      " . $_SERVER['REMOTE_ADDR'] . "\n";

// GET /request_info.php?name=Alice
// $_GET['name'] === 'Alice'

echo "Name: " . ($_GET['name'] ?? 'world');
```

### PHP Tags and Mixing HTML

PHP's superpower is embedding in HTML — no template engine needed:

```php
<?php
// PHP block — write PHP here
$name  = "Alice";
$items = ["Apple", "Banana", "Cherry"];
?>

<!DOCTYPE html>
<html>
<head><title>Hello, <?= htmlspecialchars($name) ?></title></head>
<body>
    <h1>Welcome, <?= htmlspecialchars($name) ?>!</h1>
    <ul>
        <?php foreach ($items as $item): ?>
            <li><?= htmlspecialchars($item) ?></li>
        <?php endforeach; ?>
    </ul>
</body>
</html>
```

> [!IMPORTANT]
> **Always** use `htmlspecialchars()` when echoing user-supplied data into HTML. This prevents Cross-Site Scripting (XSS) attacks.

### Running PHP from CLI

```bash
# Run a script
php myscript.php

# Evaluate code directly
php -r "echo 'Hello ' . PHP_VERSION;"

# Open interactive REPL
php -a

# Check syntax without running
php -l myscript.php
```

---

## ✅ Milestone Checklist

- [ ] `php --version` succeeds on my machine
- [ ] `php -S localhost:8080` starts a dev server I can open in the browser
- [ ] I understand that PHP creates a new execution context per request
- [ ] I know to use `htmlspecialchars()` before echoing user data

## ➡️ Next Unit

[Lesson 02 — Syntax Essentials for Web Developers](./lesson_02.md)
