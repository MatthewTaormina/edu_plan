# Lesson 04 — Dataclasses

**Course:** Python: OOP · **Lesson:** 4 of 5 · **Time:** ~45 minutes

← [Lesson 03](lesson_03.md) · [Course Index](index.md) · [Lesson 05 →](lesson_05.md)

---

## Why Dataclasses?

Writing a class that mainly holds data is repetitive:

```python
# Without dataclasses — lots of boilerplate
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})"

    def __eq__(self, other):
        return isinstance(other, Point) and self.x == other.x and self.y == other.y
```

`@dataclass` generates `__init__`, `__repr__`, and `__eq__` automatically:

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(p1)         # Point(x=1.0, y=2.0)
print(p1 == p2)   # True
```

---

## Default Values and field()

```python
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

@dataclass
class Task:
    title: str
    priority: int = 1                          # Simple default
    done: bool = False
    tags: list[str] = field(default_factory=list)   # ← mutable default
    created_at: datetime = field(default_factory=datetime.now)
    notes: Optional[str] = None

t = Task("Write tests", priority=3, tags=["dev", "testing"])
print(t)
# Task(title='Write tests', priority=3, done=False, tags=['dev', 'testing'], ...)
```

!!! warning "Don't use mutable defaults directly"
    ```python
    # ❌ This is a bug — all instances share the SAME list
    @dataclass
    class Bad:
        items: list = []

    # ✅ Use field(default_factory=list)
    @dataclass
    class Good:
        items: list = field(default_factory=list)
    ```

---

## Post-Init Processing

Use `__post_init__` to validate or derive values after `__init__` runs:

```python
from dataclasses import dataclass

@dataclass
class Temperature:
    celsius: float

    def __post_init__(self):
        if self.celsius < -273.15:
            raise ValueError(f"Temperature {self.celsius}°C is below absolute zero")
        self.fahrenheit = self.celsius * 9/5 + 32   # Derived field

t = Temperature(100)
print(t.fahrenheit)    # 212.0

Temperature(-300)      # ValueError: below absolute zero
```

---

## Frozen Dataclasses — Immutable Objects

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Coordinate:
    latitude: float
    longitude: float

    def __str__(self) -> str:
        return f"{self.latitude:.4f}°, {self.longitude:.4f}°"

london = Coordinate(51.5074, -0.1278)
print(london)          # 51.5074°, -0.1278°

# london.latitude = 0  ← FrozenInstanceError

# Frozen dataclasses are hashable — can be used as dict keys or in sets
visited = {london, Coordinate(48.8566, 2.3522)}  # London + Paris
```

---

## Ordering

```python
from dataclasses import dataclass

@dataclass(order=True)
class Version:
    major: int
    minor: int
    patch: int

    def __str__(self) -> str:
        return f"{self.major}.{self.minor}.{self.patch}"

versions = [Version(2, 0, 0), Version(1, 9, 3), Version(2, 1, 0)]
print(sorted(versions))
# [1.9.3, 2.0.0, 2.1.0]
```

`order=True` compares fields in the order they're declared, like tuple comparison.

---

## Converting Dataclasses

```python
from dataclasses import dataclass, asdict, astuple, fields

@dataclass
class Contact:
    name: str
    email: str
    phone: str = ""

c = Contact("Alice", "alice@example.com", "07700 111111")

# To dict (great for JSON serialisation)
print(asdict(c))
# {'name': 'Alice', 'email': 'alice@example.com', 'phone': '07700 111111'}

# To tuple
print(astuple(c))
# ('Alice', 'alice@example.com', '07700 111111')

# Inspect fields
for f in fields(c):
    print(f.name, f.type)
```

---

## ✏️ Try It

Design a `BlogPost` dataclass with:
- `title: str`
- `content: str`
- `author: str`
- `tags: list[str]` — defaults to empty list
- `published: bool` — defaults to `False`
- `word_count: int` — computed in `__post_init__` from `content`

Make it `frozen=False` (mutable) and show:
1. Creating a post
2. Printing it (use `__str__` you add manually)
3. Serialising to a dict with `asdict()`

<details>
<summary>Show answer</summary>

```python
from dataclasses import dataclass, field, asdict

@dataclass
class BlogPost:
    title: str
    content: str
    author: str
    tags: list[str] = field(default_factory=list)
    published: bool = False
    word_count: int = field(init=False)  # Excluded from __init__

    def __post_init__(self):
        self.word_count = len(self.content.split())

    def __str__(self) -> str:
        status = "Published" if self.published else "Draft"
        return f"[{status}] {self.title!r} by {self.author} ({self.word_count} words)"

post = BlogPost(
    title="Getting Started with Python",
    content="Python is a great language for beginners and experts alike.",
    author="Alice",
    tags=["python", "tutorial"],
)
print(post)
print(asdict(post))
```

</details>

---

## Regular Class vs Dataclass — When to Use Each

| Scenario | Use |
|----------|-----|
| Mainly storing data, auto-generated `__init__` | `@dataclass` |
| Need significant behaviour / methods | Regular `class` |
| Immutable value object (point, money, colour) | `@dataclass(frozen=True)` |
| Sortable by fields in field order | `@dataclass(order=True)` |
| Complex initialisation logic | Regular `class` (or `__post_init__`) |

---

## ✅ Lesson Checklist

- [ ] Can create a dataclass with required and optional fields
- [ ] Can use `field(default_factory=...)` for mutable defaults
- [ ] Can use `__post_init__` for validation and derived fields
- [ ] Can create a frozen (immutable) dataclass
- [ ] Can convert a dataclass to a dict with `asdict()`
- [ ] Completed the Try It exercise

---

## ➡️ Next Lesson

→ [Lesson 05 — Capstone: Task Management System](lesson_05.md)
