# Lesson 06 — Authentication with Laravel Breeze

> **Course:** Laravel Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Starter Kits](https://laravel.com/docs/starter-kits) · [Authentication](https://laravel.com/docs/authentication)

---

## 🎯 Learning Objectives

- [ ] Install and configure Laravel Breeze
- [ ] Understand what Breeze generates
- [ ] Use `Auth` facade and `auth()` helper
- [ ] Protect routes and access the authenticated user

---

## 📖 Concepts

### Laravel Breeze

Breeze is Laravel's minimal authentication scaffolding. It generates:
- Login, register, password reset, email verification views
- Auth controllers
- Routes registered in `routes/auth.php`
- A simple dashboard

```bash
# Install Breeze
composer require laravel/breeze --dev

# Scaffold with Blade (simple, no JS framework)
php artisan breeze:install blade

# Run migrations (creates users table)
php artisan migrate

# Install JS dependencies and run Vite
npm install
npm run dev
```

After installation, visit `http://localhost:8000/register`.

### What Breeze Generates

```
app/Http/Controllers/Auth/
├── AuthenticatedSessionController.php   ← Login / Logout
├── RegisteredUserController.php         ← Registration
├── PasswordResetLinkController.php      ← Forgot password email
├── NewPasswordController.php            ← Reset password form
└── EmailVerificationController.php      ← Email verification

resources/views/auth/
├── login.blade.php
├── register.blade.php
├── forgot-password.blade.php
└── reset-password.blade.php

routes/auth.php                          ← All auth routes
```

### The Auth Facade and Helper

```php
<?php
use Illuminate\Support\Facades\Auth;

// Check if logged in
if (Auth::check()) { /* ... */ }
if (auth()->check()) { /* Equivalent */ }

// Get the current user
$user = Auth::user();          // Returns User model or null
$user = auth()->user();

// Get current user's ID
$id   = Auth::id();
$id   = auth()->id();

// Log in manually (e.g. after registration)
Auth::login($user);
Auth::login($user, remember: true);  // Remember me cookie

// From a guard (if using multiple guards)
Auth::guard('api')->user();

// Log out
Auth::logout();
```

### Accessing the User in Controllers

```php
<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(Request $request): View
    {
        // $request->user() same as auth()->user()
        $user = $request->user();

        return view('dashboard', [
            'user'       => $user,
            'postCount'  => $user->posts()->count(),
        ]);
    }
}
```

```html
{{-- In any Blade view --}}
@auth
    <p>Welcome, {{ auth()->user()->name }}!</p>
    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit">Sign out</button>
    </form>
@endauth

@guest
    <a href="{{ route('login') }}">Sign in</a>
    <a href="{{ route('register') }}">Create account</a>
@endguest
```

### Protecting Routes

```php
// routes/web.php
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/',     fn() => view('welcome'));
Route::get('/blog', [PostController::class, 'index']);

// Auth-required routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('posts', PostController::class)->except(['index', 'show']);
});

// Email-verified + auth
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/billing', [BillingController::class, 'index'])->name('billing');
});
```

### Adding Custom Fields to Registration

```php
<?php
// app/Http/Controllers/Auth/RegisteredUserController.php
// Modify the store() method to include extra fields

public function store(Request $request): RedirectResponse
{
    $request->validate([
        'name'     => ['required', 'string', 'max:255'],
        'username' => ['required', 'string', 'max:30', 'unique:users', 'alpha_num'],
        'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    $user = User::create([
        'name'     => $request->name,
        'username' => $request->username,
        'email'    => $request->email,
        'password' => Hash::make($request->password),
    ]);

    event(new Registered($user));
    Auth::login($user);

    return redirect(RouteServiceProvider::HOME);
}
```

---

## ✅ Milestone Checklist

- [ ] `php artisan breeze:install blade` ran successfully and I can register + log in
- [ ] The `/dashboard` route is protected — visiting it unauthenticated redirects to `/login`
- [ ] `auth()->user()->name` works in a controller and in a Blade template
- [ ] I understand what Breeze generated (controllers, views, routes) — it's not magic

## ➡️ Next Unit

[Lesson 07 — Capstone: Blog with Auth](./lesson_07.md)
