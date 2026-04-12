# Lesson 02 — Routing & Controllers

> **Course:** Laravel Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Routing](https://laravel.com/docs/routing) · [Controllers](https://laravel.com/docs/controllers)

---

## 🎯 Learning Objectives

- [ ] Define web and API routes with route parameters and constraints
- [ ] Group routes with middleware and prefixes
- [ ] Generate and use resource controllers
- [ ] Use route model binding

---

## 📖 Concepts

### Route Basics

```php
<?php
// routes/web.php — browser routes (with sessions, CSRF, cookie middleware)
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PageController;

// Basic verbs
Route::get('/about', [PageController::class, 'about']);
Route::post('/contact', [PageController::class, 'contact']);
Route::put('/posts/{id}', [PostController::class, 'update']);
Route::delete('/posts/{id}', [PostController::class, 'destroy']);

// Route parameters
Route::get('/posts/{slug}', [PostController::class, 'show']);

// Optional parameter
Route::get('/archive/{year?}', [PostController::class, 'archive']);

// Parameter constraint — only numeric IDs
Route::get('/users/{id}', [UserController::class, 'show'])
    ->where('id', '[0-9]+');

// Redirect
Route::redirect('/old-url', '/new-url', 301);

// View shorthand (no controller needed for simple views)
Route::view('/about', 'pages.about', ['title' => 'About Us']);
```

```php
<?php
// routes/api.php — API routes (stateless, no session/CSRF)
use App\Http\Controllers\Api\PostController;

// Prefix is /api automatically
Route::get('/posts',       [PostController::class, 'index']);
Route::post('/posts',      [PostController::class, 'store']);
Route::get('/posts/{id}',  [PostController::class, 'show']);
```

### Resource Controllers

A resource controller provides all CRUD methods following REST conventions:

```bash
php artisan make:controller PostController --resource --model=Post
```

This creates 7 methods automatically:

| HTTP Verb | URI | Method | Name |
|-----------|-----|--------|------|
| GET | /posts | index | posts.index |
| GET | /posts/create | create | posts.create |
| POST | /posts | store | posts.store |
| GET | `/posts/{post}` | show | posts.show |
| GET | `/posts/{post}/edit` | edit | posts.edit |
| PUT/PATCH | `/posts/{post}` | update | posts.update |
| DELETE | `/posts/{post}` | destroy | posts.destroy |

```php
// Register all 7 routes in one line
Route::resource('posts', PostController::class);

// Only specific routes
Route::resource('posts', PostController::class)->only(['index', 'show']);
Route::resource('posts', PostController::class)->except(['destroy']);

// API resource (no create/edit — no HTML forms needed)
Route::apiResource('posts', PostController::class);
```

### Route Groups

```php
// Grouped routes with shared middleware, prefix, name prefix
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    // → path: /admin/dashboard  → name: admin.dashboard
    Route::resource('users', UserController::class);
    // → paths: /admin/users/...  → names: admin.users.index, etc.
});
```

### Route Model Binding

Laravel automatically resolves model instances from route parameters:

```php
// routes/web.php
Route::get('/posts/{post}', [PostController::class, 'show']);
// When {post} matches a Post model's primary key, Laravel auto-fetches it
// Returns 404 if not found — no extra code needed
```

```php
<?php
// app/Http/Controllers/PostController.php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PostController extends Controller
{
    // Route model binding — $post is already fetched from DB
    public function show(Post $post): View
    {
        return view('posts.show', compact('post'));
    }

    // Custom binding key (bind by slug instead of id)
    // Add to Post model: public function getRouteKeyName() { return 'slug'; }
}
```

### Full Resource Controller

```php
<?php
// app/Http/Controllers/PostController.php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PostController extends Controller
{
    // GET /posts
    public function index(): View
    {
        $posts = Post::latest()->paginate(10);
        return view('posts.index', compact('posts'));
    }

    // GET /posts/create
    public function create(): View
    {
        return view('posts.create');
    }

    // POST /posts
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body'  => ['required', 'string'],
            'slug'  => ['required', 'string', 'unique:posts,slug'],
        ]);

        $post = Post::create($validated);

        return redirect()->route('posts.show', $post)
            ->with('success', 'Post created!');
    }

    // GET /posts/{post}
    public function show(Post $post): View
    {
        return view('posts.show', compact('post'));
    }

    // GET /posts/{post}/edit
    public function edit(Post $post): View
    {
        return view('posts.edit', compact('post'));
    }

    // PUT /posts/{post}
    public function update(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body'  => ['required', 'string'],
        ]);

        $post->update($validated);

        return redirect()->route('posts.show', $post)
            ->with('success', 'Post updated!');
    }

    // DELETE /posts/{post}
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();
        return redirect()->route('posts.index')
            ->with('success', 'Post deleted');
    }
}
```

---

## ✅ Milestone Checklist

- [ ] `php artisan route:list` shows all my routes with their names
- [ ] I use `Route::resource()` instead of defining all 7 routes manually
- [ ] Route model binding automatically fetches `Post $post` by ID and 404s if missing
- [ ] I group admin routes behind `middleware(['auth'])` and a `/admin` prefix

## ➡️ Next Unit

[Lesson 03 — Blade Templating Engine](./lesson_03.md)
