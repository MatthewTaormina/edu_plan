# Lesson 01 — Laravel Setup, Artisan & Project Structure

> **Course:** Laravel Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Laravel Installation](https://laravel.com/docs/installation) · [Directory Structure](https://laravel.com/docs/structure)

---

## 🎯 Learning Objectives

- [ ] Scaffold a Laravel project with Composer
- [ ] Use Artisan to generate files and run the dev server
- [ ] Navigate the Laravel directory structure
- [ ] Set up environment variables with `.env`

---

## 📖 Concepts

### Prerequisites

```bash
# Laravel requires PHP 8.2+ and Composer
php --version     # 8.2.x or higher
composer --version

# Install Composer if missing:
# Windows: https://getcomposer.org/Composer-Setup.exe
# Linux:   curl -sS https://getcomposer.org/installer | php
#          mv composer.phar /usr/local/bin/composer
```

### Creating a Laravel Project

```bash
# Laravel installer (recommended — faster than composer create-project)
composer global require laravel/installer
laravel new my-blog

# OR via Composer directly
composer create-project laravel/laravel my-blog

cd my-blog
php artisan serve     # Development server on http://127.0.0.1:8000
```

### Project Structure

```
my-blog/
├── app/
│   ├── Http/
│   │   ├── Controllers/         ← Controller classes
│   │   └── Middleware/          ← Custom middleware
│   ├── Models/                  ← Eloquent models
│   └── Providers/               ← Service providers (app bootstrap)
│
├── bootstrap/                   ← App bootstrap files
├── config/                      ← All config files (app, auth, mail, etc.)
├── database/
│   ├── migrations/              ← Database schema version control
│   ├── factories/               ← Model factories for testing
│   └── seeders/                 ← Seed sample data
│
├── public/                      ← Web root (index.php lives here)
│   └── index.php                ← ALL requests go through this
│
├── resources/
│   └── views/                   ← Blade templates (.blade.php)
│
├── routes/
│   ├── web.php                  ← Browser routes (with sessions, CSRF)
│   └── api.php                  ← API routes (stateless)
│
├── storage/                     ← Logs, cache, compiled views
├── tests/                       ← PHPUnit tests
├── .env                         ← Environment config (gitignored)
├── .env.example                 ← Example env (committed)
└── artisan                      ← CLI tool
```

**The key flow:**
```
Request → public/index.php → Bootstrap → Route match → Middleware → Controller → Response
```

### Environment Configuration

```bash
# .env — the single source of truth for config
APP_NAME="My Blog"
APP_ENV=local          # local | staging | production
APP_KEY=base64:...     # Generated automatically by Laravel
APP_DEBUG=true         # NEVER true in production
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_blog
DB_USERNAME=root
DB_PASSWORD=
```

Access config in code:

```php
<?php
// Read env directly (use in config files only)
$debug = env('APP_DEBUG', false);

// Read via the config helper (preferred — cached)
$appName = config('app.name');    // Reads config/app.php → 'name' key
$dbHost  = config('database.connections.mysql.host');
```

### Artisan — The Laravel CLI

```bash
# Development server
php artisan serve

# List all commands
php artisan list

# Generate a controller
php artisan make:controller PostController

# Generate a controller with all CRUD methods
php artisan make:controller PostController --resource

# Generate a model
php artisan make:model Post

# Generate a model with migration, factory, seeder, and resource controller
php artisan make:model Post -mfsr

# Generate a migration
php artisan make:migration create_posts_table

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Seed the database
php artisan db:seed

# Open interactive REPL (Tinker)
php artisan tinker

# Clear various caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# List all routes
php artisan route:list
```

### Your First Controller and Route

```bash
php artisan make:controller WelcomeController
```

```php
<?php
// app/Http/Controllers/WelcomeController.php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class WelcomeController extends Controller
{
    public function index(): View
    {
        return view('welcome', [
            'appName' => config('app.name'),
        ]);
    }

    public function health(): JsonResponse
    {
        return response()->json([
            'status'  => 'ok',
            'version' => app()->version(),
        ]);
    }
}
```

```php
<?php
// routes/web.php
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index']);
Route::get('/health', [WelcomeController::class, 'health']);
```

---

## ✅ Milestone Checklist

- [ ] `php artisan serve` starts the server and `http://localhost:8000` loads
- [ ] I can navigate the project structure and find controllers, views, routes
- [ ] I generated a controller with `php artisan make:controller`
- [ ] I understand the difference between `routes/web.php` and `routes/api.php`

## ➡️ Next Unit

[Lesson 02 — Routing & Controllers](./lesson_02.md)
