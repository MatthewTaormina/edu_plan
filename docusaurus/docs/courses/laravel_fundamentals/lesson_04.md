# Lesson 04 — Request Lifecycle & Middleware

> **Course:** Laravel Fundamentals · **Time:** 45 minutes
> **🔗 Official Docs:** [Request Lifecycle](https://laravel.com/docs/lifecycle) · [Middleware](https://laravel.com/docs/middleware)

---

## 🎯 Learning Objectives

- [ ] Trace a request from HTTP to controller response
- [ ] Create a custom middleware class
- [ ] Register middleware globally, per-route, and in groups
- [ ] Use Laravel's built-in middleware (auth, throttle, verified)

---

## 📖 Concepts

### The Laravel Request Lifecycle

```
Browser Request
    ↓
public/index.php          ← Web root (all requests enter here)
    ↓
Bootstrap the application (App\Http\Kernel, service providers)
    ↓
HTTP Kernel pipeline
    ↓
Global middleware stack    ← TrimStrings, ConvertEmptyStrings, etc.
    ↓
Route matching
    ↓
Route middleware           ← auth, throttle, verified, etc.
    ↓
Controller method
    ↓
Response sent to browser
```

### Creating Custom Middleware

```bash
php artisan make:middleware EnsureApiKey
```

```php
<?php
// app/Http/Middleware/EnsureApiKey.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $key = $request->header('X-API-Key');

        if (!$key || $key !== config('services.api_key')) {
            return response()->json(['error' => 'Invalid API key'], 401);
        }

        return $next($request);   // Pass to next middleware / controller
    }
}
```

### Logging Middleware Example

```php
<?php
// app/Http/Middleware/LogRequests.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        $response = $next($request);   // Run the rest of the pipeline

        $duration = round((microtime(true) - $start) * 1000, 2);

        Log::info('Request', [
            'method'   => $request->method(),
            'path'     => $request->path(),
            'status'   => $response->getStatusCode(),
            'duration' => "{$duration}ms",
            'ip'       => $request->ip(),
        ]);

        return $response;
    }
}
```

### Registering Middleware

```php
<?php
// bootstrap/app.php (Laravel 11+)
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {

        // Add to ALL HTTP requests
        $middleware->append(\App\Http\Middleware\LogRequests::class);

        // Register with an alias for use in routes
        $middleware->alias([
            'api.key'   => \App\Http\Middleware\EnsureApiKey::class,
            'role'      => \App\Http\Middleware\CheckRole::class,
        ]);

        // Add to a named group
        $middleware->group('api', [
            \App\Http\Middleware\EnsureApiKey::class,
            'throttle:60,1',
        ]);
    })
    ->create();
```

### Built-in Middleware

```php
// routes/web.php
use Illuminate\Support\Facades\Route;

// auth — redirect to /login if not authenticated
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::resource('posts', PostController::class)->except(['index', 'show']);
});

// guest — redirect if already logged in (for login/register pages)
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthController::class, 'loginForm']);
    Route::get('/register', [AuthController::class, 'registerForm']);
});

// throttle — rate limiting (60 requests per minute)
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/contact', [ContactController::class, 'send']);
});

// verified — requires email verification
Route::middleware(['auth', 'verified'])->get('/secure', fn() => 'Secret!');
```

### Middleware Parameters

```php
// Custom middleware that accepts parameters
Route::middleware('role:admin,editor')->get('/cms', [CmsController::class, 'index']);

// In the middleware
public function handle(Request $request, Closure $next, string ...$roles): Response
{
    if (!in_array($request->user()?->role, $roles)) {
        abort(403, 'Insufficient permissions');
    }
    return $next($request);
}
```

---

## ✅ Milestone Checklist

- [ ] I traced a request through the lifecycle in my own words
- [ ] I created a middleware that terminates early (returns a response before `$next`)
- [ ] I registered middleware with an alias and applied it to a route group
- [ ] Dashboard and admin routes are protected with `middleware('auth')`

## ➡️ Next Unit

[Lesson 05 — Eloquent Models & Relationships](./lesson_05.md)
