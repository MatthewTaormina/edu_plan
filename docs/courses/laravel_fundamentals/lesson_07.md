# Lesson 07 — Capstone: Blog with Auth

> **Course:** Laravel Fundamentals · **Time:** 120 minutes
> **Prerequisites:** All previous lessons

---

## 🎯 Project Overview

Build a **multi-author blog** with auth-protected admin:
- Public: list posts, view post, paginated
- Auth: register, login, password reset (Breeze)
- Authenticated users: create and edit *their own* posts
- Admins: manage all posts and view contact messages

---

## API / Route Plan

```
Public
  GET  /                         → Latest posts (paginated)
  GET  /posts/{post:slug}        → View post
  GET  /contact                  → Contact form
  POST /contact                  → Submit message

Auth (Breeze provides)
  GET/POST /register, /login, /forgot-password, /reset-password

Authenticated
  GET  /dashboard                → My posts
  GET  /posts/create             → Create form
  POST /posts                    → Store post
  GET  /posts/{post}/edit        → Edit form (own posts only)
  PUT  /posts/{post}             → Update (own posts only)
  DELETE /posts/{post}           → Delete (own posts only)

Admin
  GET  /admin/posts              → All posts
  GET  /admin/messages           → Contact messages
```

---

## Key Files

### Models

```php
<?php
// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Post extends Model
{
    protected $fillable = ['title', 'body', 'slug', 'published', 'user_id'];

    protected $casts = ['published' => 'boolean'];

    protected static function booted(): void
    {
        // Auto-generate slug from title on create
        static::creating(function (Post $post) {
            $post->slug ??= Str::slug($post->title);
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';  // Route model binding by slug
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopePublished($query)
    {
        return $query->where('published', true)->latest();
    }
}
```

### Policy — Authorization

```bash
php artisan make:policy PostPolicy --model=Post
```

```php
<?php
// app/Policies/PostPolicy.php
namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    // Can the user see this post in admin?
    public function view(User $user, Post $post): bool
    {
        return $user->role === 'admin' || $post->user_id === $user->id;
    }

    // Can the user update this post?
    public function update(User $user, Post $post): bool
    {
        return $user->role === 'admin' || $post->user_id === $user->id;
    }

    // Can the user delete this post?
    public function delete(User $user, Post $post): bool
    {
        return $user->role === 'admin' || $post->user_id === $user->id;
    }
}
```

```php
<?php
// app/Http/Controllers/PostController.php — using the policy
public function edit(Post $post): View
{
    $this->authorize('update', $post);  // 403 if not owner or admin
    return view('posts.edit', compact('post'));
}

public function update(Request $request, Post $post): RedirectResponse
{
    $this->authorize('update', $post);

    $validated = $request->validate([
        'title'     => ['required', 'string', 'max:255'],
        'body'      => ['required', 'string'],
        'published' => ['boolean'],
    ]);

    $post->update($validated);

    return redirect()->route('posts.show', $post)->with('success', 'Post updated!');
}
```

### Frontend Blog View

```html
{{-- resources/views/posts/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Blog')

@section('content')
<div class="max-w-3xl mx-auto">
    <h1 class="text-4xl font-bold mb-8">Latest Posts</h1>

    @forelse($posts as $post)
        <article class="mb-10 pb-10 border-b border-gray-200">
            <h2 class="text-2xl font-semibold">
                <a href="{{ route('posts.show', $post) }}" class="hover:underline">
                    {{ $post->title }}
                </a>
            </h2>
            <div class="text-sm text-gray-500 mt-1 mb-3">
                By {{ $post->author->name }} · {{ $post->created_at->diffForHumans() }}
            </div>
            <p class="text-gray-700">{{ Str::limit($post->body, 200) }}</p>
            <a href="{{ route('posts.show', $post) }}" class="text-blue-600 hover:underline text-sm mt-2 block">
                Read more →
            </a>
        </article>
    @empty
        <p>No posts published yet.</p>
    @endforelse

    {{ $posts->links() }}
</div>
@endsection
```

---

## ✅ Milestone Checklist

- [ ] Public post list is paginated with `paginate(10)` and `$posts->links()` renders nav
- [ ] Route model binding loads posts by `slug` — wrong slug returns 404
- [ ] `$this->authorize('update', $post)` returns 403 if a user tries to edit someone else's post
- [ ] Admins can see and manage all posts (policy checks `role === 'admin'`)
- [ ] Contact messages are stored and viewable at `/admin/messages` (admin only)

## 🏆 Laravel Fundamentals Complete!

## ➡️ Continue Learning

- [Backend Developer Path](../../paths/backend_developer.md)
- [Full Stack Path](../../paths/fullstack.md) — Connect to a React/Next.js frontend
