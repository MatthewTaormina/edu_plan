# Lesson 03 — Blade Templating Engine

> **Course:** Laravel Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Blade Templates](https://laravel.com/docs/blade)

---

## 🎯 Learning Objectives

- [ ] Create layouts and extend them in child views
- [ ] Use `@section`, `@yield`, and `@include`
- [ ] Use Blade directives: `@if`, `@foreach`, `@forelse`, `@auth`
- [ ] Create components for reusable UI

---

## 📖 Concepts

### Blade vs Plain PHP Templates

Blade compiles to PHP — it's just syntactic sugar:

```php
// Blade:
{{ $name }}

// Compiles to:
<?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>
// (auto-escaping — XSS safe by default)

// Raw (unescaped, use carefully):
{!! $htmlContent !!}
```

### Layouts with `@extends` / `@yield`

```html
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', config('app.name'))</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    @include('partials.nav')

    <main class="container mx-auto px-4 py-8">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @yield('content')
    </main>

    @include('partials.footer')
</body>
</html>
```

```html
{{-- resources/views/posts/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Blog Posts')

@section('content')
    <h1 class="text-3xl font-bold mb-6">Recent Posts</h1>

    @forelse($posts as $post)
        <article class="mb-6 border-b pb-6">
            <h2>
                <a href="{{ route('posts.show', $post) }}">
                    {{ $post->title }}
                </a>
            </h2>
            <p class="text-gray-500 text-sm">
                {{ $post->created_at->diffForHumans() }}
            </p>
            <p>{{ Str::limit($post->body, 150) }}</p>
        </article>
    @empty
        <p>No posts yet. <a href="{{ route('posts.create') }}">Write the first one!</a></p>
    @endforelse

    {{ $posts->links() }}  {{-- Pagination links --}}
@endsection
```

### Common Blade Directives

```html
{{-- Conditionals --}}
@if($user->isAdmin())
    <a href="/admin">Admin Panel</a>
@elseif($user->isModerator())
    <a href="/moderate">Moderation</a>
@else
    <a href="/profile">My Profile</a>
@endif

{{-- Auth shortcuts --}}
@auth
    <p>Welcome, {{ auth()->user()->name }}!</p>
@endauth

@guest
    <a href="/login">Sign in</a>
@endguest

{{-- Loops --}}
@foreach($tags as $tag)
    <span class="tag">{{ $tag->name }}</span>
@endforeach

@forelse($comments as $comment)
    <div>{{ $comment->body }}</div>
@empty
    <p>No comments yet.</p>
@endforelse

@for($i = 0; $i < 5; $i++)
    <div>Item {{ $i + 1 }}</div>
@endfor

{{-- Loop variable --}}
@foreach($posts as $post)
    @if($loop->first) <ul> @endif
    <li>{{ $loop->index + 1 }}. {{ $post->title }}</li>
    @if($loop->last) </ul> @endif
@endforeach

{{-- Include sub-views --}}
@include('partials.alert', ['type' => 'success', 'message' => 'Saved!'])

{{-- Include only if view exists --}}
@includeIf('partials.sidebar')

{{-- CSRF token (required for all POST forms) --}}
<form method="POST" action="/posts">
    @csrf
    {{-- ... --}}
</form>

{{-- Method spoofing (HTML forms only support GET/POST) --}}
<form method="POST" action="/posts/{{ $post->id }}">
    @csrf
    @method('DELETE')
    <button type="submit">Delete</button>
</form>
```

### Blade Components

Components are reusable UI elements — like React components for Blade:

```bash
php artisan make:component Alert
# Creates: app/View/Components/Alert.php
#          resources/views/components/alert.blade.php
```

```php
<?php
// app/View/Components/Alert.php
namespace App\View\Components;

use Illuminate\View\Component;

class Alert extends Component
{
    public function __construct(
        public readonly string $type    = 'info',
        public readonly string $message = '',
    ) {}

    public function render(): \Illuminate\View\View
    {
        return view('components.alert');
    }
}
```

```html
{{-- resources/views/components/alert.blade.php --}}
<div class="alert alert-{{ $type }} {{ $type === 'error' ? 'bg-red-100' : 'bg-blue-100' }}"
     role="alert">
    {{ $message ?: $slot }}  {{-- $slot = content between component tags --}}
</div>
```

```html
{{-- Usage --}}
<x-alert type="success" message="Post saved!" />

{{-- With slot content --}}
<x-alert type="error">
    <strong>Oops!</strong> Something went wrong.
</x-alert>
```

### Displaying Validation Errors

```html
{{-- After a failed form submission --}}
<form method="POST" action="{{ route('posts.store') }}">
    @csrf
    <div>
        <label for="title">Title</label>
        <input
            id="title"
            name="title"
            type="text"
            value="{{ old('title') }}"
            class="{{ $errors->has('title') ? 'border-red-500' : '' }}"
        >
        @error('title')
            <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
        @enderror
    </div>
</form>
```

`old('title')` repopulates the field with the user's previous input after validation failure.

---

## ✅ Milestone Checklist

- [ ] All views extend a `layouts.app` layout using `@extends`
- [ ] My forms always include `@csrf` (and `@method` for PUT/DELETE)
- [ ] I use `@forelse ... @empty` for lists that might be empty
- [ ] I created at least one Blade component and used it with `<x-...>`
- [ ] Validation errors display next to the relevant field with `@error`

## ➡️ Next Unit

[Lesson 04 — Request Lifecycle & Middleware](./lesson_04.md)
