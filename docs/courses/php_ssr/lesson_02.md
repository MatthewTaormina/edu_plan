# Lesson 02 — Syntax Essentials for Web Developers

> **Course:** PHP & Server-Side Rendering · **Time:** 60 minutes
> **🔗 Official Docs:** [PHP Language Reference](https://www.php.net/manual/en/langref.php)

---

## 🎯 Learning Objectives

- [ ] Map PHP types and control flow to JavaScript equivalents
- [ ] Use arrays (indexed and associative) confidently
- [ ] Work with strings, dates, and null safely
- [ ] Write functions and understand PHP's type declarations

---

## 📖 Concepts

### Variables and Types

PHP is dynamically typed (like JS) but has optional strict mode and type declarations:

```php
<?php
declare(strict_types=1);  // Enable strict type checking for this file

// Scalar types
$name    = "Alice";       // string
$age     = 30;            // int
$score   = 3.14;          // float
$active  = true;          // bool
$nothing = null;          // null

// Type declarations on functions
function greet(string $name, int $times = 1): string {
    return str_repeat("Hello, $name! ", $times);
}

echo greet("Bob", 3);  // Hello, Bob! Hello, Bob! Hello, Bob!

// Union types (PHP 8.0+)
function formatId(int|string $id): string {
    return "ID: $id";
}

// Nullables
function findUser(int $id): ?array {   // Returns array or null
    return $id === 1 ? ['id' => 1, 'name' => 'Alice'] : null;
}
```

### Strings

```php
<?php
$first = "Alice";
$last  = "Smith";

// Interpolation (double-quotes only)
$full  = "$first $last";                  // "Alice Smith"
$html  = "<p>Hello, {$first}!</p>";       // {} for complex expressions

// Concatenation
$full2 = $first . " " . $last;

// Useful string functions
strlen("hello")                // 5
strtolower("HELLO")           // "hello"
strtoupper("hello")           // "HELLO"
trim("  hello  ")             // "hello"
str_contains("hello world", "world")  // true  (PHP 8.0+)
str_starts_with("hello", "he")        // true  (PHP 8.0+)
str_replace("world", "PHP", "hello world")  // "hello PHP"
explode(",", "a,b,c")         // ["a", "b", "c"]
implode(", ", ["a", "b", "c"]) // "a, b, c"
substr("hello", 1, 3)         // "ell"
sprintf("Hello, %s! You are %d.", "Alice", 30)  // Formatted string

// ALWAYS escape before echoing into HTML
echo htmlspecialchars($userInput);  // &lt;script&gt; → safe
```

### Arrays

PHP has one array type that works as both a list and a map:

```php
<?php
// Indexed array (list)
$fruits = ["Apple", "Banana", "Cherry"];
$fruits[] = "Date";          // Append
echo $fruits[0];             // "Apple"
echo count($fruits);         // 4

// Associative array (map/object equivalent)
$user = [
    "id"    => 1,
    "name"  => "Alice",
    "email" => "alice@example.com",
    "role"  => "admin",
];

echo $user["name"];          // "Alice"
$user["verified"] = true;    // Add key

// Nested arrays
$posts = [
    ["id" => 1, "title" => "Hello PHP"],
    ["id" => 2, "title" => "Arrays are versatile"],
];

// Useful array functions
$nums = [3, 1, 4, 1, 5, 9];
sort($nums);                              // In-place sort
$doubled = array_map(fn($n) => $n * 2, $nums);  // [2, 8, 2, 10, 18, 6]
$evens   = array_filter($nums, fn($n) => $n % 2 === 0);
$sum     = array_reduce($nums, fn($carry, $n) => $carry + $n, 0);

// Check existence
isset($user["email"])          // true (key exists and is not null)
array_key_exists("role", $user) // true (even if null)
in_array("Apple", $fruits)     // true
```

### Control Flow

```php
<?php
// If / elseif / else
$score = 85;
if ($score >= 90) {
    echo "A";
} elseif ($score >= 80) {
    echo "B";
} else {
    echo "C";
}

// Null coalescing (PHP 7.0+)
$name = $_GET["name"] ?? "World";  // 'World' if key missing or null

// Nullsafe operator (PHP 8.0+)
$city = $user?->address?->city;  // null if any step is null

// Match (PHP 8.0+) — like switch but returns a value, no fallthrough
$label = match(true) {
    $score >= 90 => "Excellent",
    $score >= 70 => "Good",
    default      => "Needs improvement",
};

// Loops
foreach ($fruits as $fruit) {
    echo $fruit;
}

foreach ($user as $key => $value) {
    echo "$key: $value\n";
}

for ($i = 0; $i < 5; $i++) {
    echo $i;
}

$i = 0;
while ($i < 5) {
    echo $i++;
}
```

### Functions

```php
<?php
// Regular function
function slugify(string $text): string {
    $lower  = strtolower($text);
    $slug   = preg_replace('/[^a-z0-9]+/', '-', $lower);
    return trim($slug, '-');
}

// Arrow function (inline, captures outer scope)
$multiplier = 3;
$tripled    = array_map(fn($n) => $n * $multiplier, [1, 2, 3]);  // [3, 6, 9]

// Named arguments (PHP 8.0+)
function createPost(string $title, string $body = '', bool $published = false): array {
    return compact('title', 'body', 'published');
}

$post = createPost(title: 'Hello', published: true);
// Skips $body, still sets $published

// Variadic functions
function sum(int ...$numbers): int {
    return array_sum($numbers);
}
echo sum(1, 2, 3, 4, 5);  // 15
```

---

## ✅ Milestone Checklist

- [ ] I can read and write associative arrays — PHP's equivalent to JS objects
- [ ] I use `?? ` (null coalescing) instead of `isset()` checks for defaults
- [ ] I use `fn()` arrow functions with `array_map` and `array_filter`
- [ ] I have `declare(strict_types=1)` at the top of every PHP file I write

## ➡️ Next Unit

[Lesson 03 — Handling Requests: `$_GET`, `$_POST`, `$_SERVER`](./lesson_03.md)
