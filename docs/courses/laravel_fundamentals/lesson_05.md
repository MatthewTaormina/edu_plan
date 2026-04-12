# Lesson 05 — Eloquent Models & Relationships

> **Course:** Laravel Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Eloquent](https://laravel.com/docs/eloquent) · [Relationships](https://laravel.com/docs/eloquent-relationships)

---

## 🎯 Learning Objectives

- [ ] Create and configure an Eloquent model
- [ ] Use Eloquent to query, create, update, and delete records
- [ ] Define `hasMany`, `belongsTo`, and `hasOne` relationships
- [ ] Understand mass assignment protection with `$fillable`

---

## 📖 Concepts

### What Is Eloquent?

Eloquent is Laravel's Active Record ORM. Each database table has a corresponding Model class:

```
Table:  posts         ↔   Model: Post
Column: id            ↔   Property: $post->id
Column: title         ↔   Property: $post->title
Column: user_id       ↔   Relationship: $post->author
```

### Creating a Model

```bash
# Model only
php artisan make:model Post

# Model + migration (recommended)
php artisan make:model Post -m

# Model + migration + factory + seeder + resource controller
php artisan make:model Post -mfsr
```

```php
<?php
// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    // Columns that can be mass-assigned (POST /posts with validated data)
    protected $fillable = ['title', 'body', 'slug', 'published', 'user_id'];

    // Or use $guarded = [] to allow all (less safe)

    // Cast types automatically
    protected $casts = [
        'published'    => 'boolean',
        'published_at' => 'datetime',
    ];

    // ← Relationships defined below

    // Scope — reusable query constraint
    public function scopePublished($query)
    {
        return $query->where('published', true)->orderBy('created_at', 'desc');
    }
}
```

### Basic CRUD with Eloquent

```php
<?php
use App\Models\Post;

// Find all
$posts = Post::all();                          // Collection of all posts

// Find with conditions
$posts = Post::where('published', true)
             ->orderBy('created_at', 'desc')
             ->paginate(10);                   // Returns paginator

// Scope shorthand
$posts = Post::published()->paginate(10);

// Find by primary key — throws ModelNotFoundException if not found
$post  = Post::findOrFail(42);

// Find by any column
$post  = Post::where('slug', 'hello-world')->firstOrFail();

// Create
$post  = Post::create([
    'title'     => 'Hello World',
    'body'      => 'My first post.',
    'slug'      => 'hello-world',
    'published' => true,
    'user_id'   => auth()->id(),
]);

// Update
$post->update(['title' => 'Updated Title', 'published' => false]);

// Or attribute assignment
$post->title = 'New Title';
$post->save();

// Delete
$post->delete();

// Soft deletes (requires deleted_at column + SoftDeletes trait)
// $post->delete()  → sets deleted_at, hides from queries
// Post::withTrashed()->find(1)  → includes soft-deleted
// $post->restore()  → restores
```

### Relationships

```php
<?php
// User has many Posts
// Post belongs to a User

// app/Models/User.php
class User extends Authenticatable
{
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }
}

// app/Models/Post.php
class Post extends Model
{
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Many-to-many: Post has many Tags
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
        // Expects a pivot table: post_tag (post_id, tag_id)
    }
}
```

### Using Relationships

```php
<?php
// Load relationship (causes N+1 if called in a loop!)
$post = Post::findOrFail(1);
echo $post->author->name;     // Queries User table

// Eager load — prevents N+1 queries
$posts = Post::with('author', 'tags')->published()->paginate(10);
// One query for posts, one for authors, one for tags

foreach ($posts as $post) {
    echo $post->author->name;   // No extra queries!
    foreach ($post->tags as $tag) {
        echo $tag->name;
    }
}

// Create via relationship
$user = User::find(1);
$user->posts()->create([
    'title' => 'My post',
    'body'  => '...',
    'slug'  => 'my-post',
]);

// Count without loading all records
$postsCount = $user->posts()->count();

// Where on relationship
$publishedPosts = $user->posts()->where('published', true)->get();
```

---

## ✅ Milestone Checklist

- [ ] My model has `$fillable` defined — not `$guarded = []`
- [ ] I use `Post::with('author')` (eager loading) whenever displaying posts in a list
- [ ] I can create a post through the relationship: `$user->posts()->create(...)`
- [ ] I understand why N+1 queries happen and how eager loading fixes them

## ➡️ Next Unit

[Lesson 06 — Authentication with Laravel Breeze](./lesson_06.md)
