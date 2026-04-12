# Lesson 03 — Dunder Methods

**Course:** Python: OOP · **Lesson:** 3 of 5 · **Time:** ~60 minutes

← [Lesson 02](lesson_02.md) · [Course Index](index.md) · [Lesson 04 →](lesson_04.md)

---

## What Are Dunder Methods?

Dunder (double-underscore) methods like `__init__`, `__str__`, `__len__` let your classes
hook into Python's built-in behaviours. When you write `len(obj)`, Python calls `obj.__len__()`.
When you write `a + b`, Python calls `a.__add__(b)`.

---

## String Representations

```python
class Product:
    def __init__(self, name: str, price: float):
        self.name = name
        self.price = price

    def __str__(self) -> str:
        """Human-readable — used by print() and str()."""
        return f"{self.name} (£{self.price:.2f})"

    def __repr__(self) -> str:
        """Developer-readable — used in REPL, logs, repr()."""
        return f"Product(name={self.name!r}, price={self.price})"


p = Product("Keyboard", 49.99)
print(p)        # Keyboard (£49.99)        — __str__
print(repr(p))  # Product(name='Keyboard', price=49.99) — __repr__
```

Rule of thumb:
- `__str__` → readable output for end users
- `__repr__` → enough info to recreate the object; used in debugging

---

## Comparison Methods

```python
from dataclasses import dataclass

@dataclass
class Version:
    major: int
    minor: int
    patch: int

    def __str__(self) -> str:
        return f"{self.major}.{self.minor}.{self.patch}"

    def __eq__(self, other) -> bool:
        if not isinstance(other, Version):
            return NotImplemented
        return (self.major, self.minor, self.patch) == (other.major, other.minor, other.patch)

    def __lt__(self, other) -> bool:
        if not isinstance(other, Version):
            return NotImplemented
        return (self.major, self.minor, self.patch) < (other.major, other.minor, other.patch)

    def __le__(self, other) -> bool:
        return self == other or self < other


v1 = Version(1, 2, 3)
v2 = Version(2, 0, 0)

print(v1 == v2)   # False
print(v1 < v2)    # True
print(sorted([v2, v1]))  # [1.2.3, 2.0.0]
```

:::tip Use `@dataclass(order=True)` for simple cases
If your comparisons are just element-wise comparisons of attributes in order,
`@dataclass(order=True)` generates all comparison methods automatically.
:::
---

## Container Methods

Make your class behave like a built-in collection:

```python
class Playlist:
    def __init__(self, name: str):
        self.name = name
        self._tracks: list[str] = []

    def add(self, track: str) -> None:
        self._tracks.append(track)

    def __len__(self) -> int:
        """len(playlist)"""
        return len(self._tracks)

    def __getitem__(self, index: int) -> str:
        """playlist[0]"""
        return self._tracks[index]

    def __contains__(self, track: str) -> bool:
        """'Song' in playlist"""
        return track in self._tracks

    def __iter__(self):
        """for track in playlist"""
        return iter(self._tracks)

    def __str__(self) -> str:
        return f"Playlist({self.name!r}, {len(self)} tracks)"


p = Playlist("Chill Mix")
p.add("Lo-fi Beat")
p.add("Rainy Day")
p.add("Calm Study")

print(len(p))                  # 3
print(p[0])                    # Lo-fi Beat
print("Rainy Day" in p)        # True
for track in p:                # Iteration
    print(f"  ♪ {track}")
print(p)                       # Playlist('Chill Mix', 3 tracks)
```

---

## Arithmetic Methods

```python
class Money:
    def __init__(self, amount: float, currency: str = "GBP"):
        self.amount = round(amount, 2)
        self.currency = currency

    def _check_currency(self, other: "Money") -> None:
        if self.currency != other.currency:
            raise ValueError(f"Cannot mix {self.currency} and {other.currency}")

    def __add__(self, other: "Money") -> "Money":
        self._check_currency(other)
        return Money(self.amount + other.amount, self.currency)

    def __sub__(self, other: "Money") -> "Money":
        self._check_currency(other)
        return Money(self.amount - other.amount, self.currency)

    def __mul__(self, factor: float) -> "Money":
        return Money(self.amount * factor, self.currency)

    def __str__(self) -> str:
        return f"£{self.amount:.2f}"

    def __repr__(self) -> str:
        return f"Money({self.amount}, {self.currency!r})"


price = Money(9.99)
tax   = Money(2.00)
total = price + tax
print(total)           # £11.99
print(total * 3)       # £35.97
```

---

## ✏️ Try It

Build a `ShoppingCart` class that:
- Stores `(product_name, price)` tuples internally
- Supports `cart.add("Mug", 12.99)`
- Supports `len(cart)` — number of items
- Supports `"Mug" in cart` — check by name
- Supports `for item in cart` — iterate over `(name, price)` tuples
- Has a `total()` method returning the sum of all prices
- Has a sensible `__str__`

```python
cart = ShoppingCart()
cart.add("Keyboard", 49.99)
cart.add("Mouse", 29.99)
cart.add("Mug", 12.99)

print(len(cart))           # 3
print("Mouse" in cart)     # True
print(cart.total())        # 92.97
for name, price in cart:
    print(f"  {name}: £{price}")
print(cart)                # ShoppingCart(3 items, £92.97)
```

<details>
<summary>Show answer</summary>

```python
class ShoppingCart:
    def __init__(self):
        self._items: list[tuple[str, float]] = []

    def add(self, name: str, price: float) -> None:
        self._items.append((name, price))

    def total(self) -> float:
        return round(sum(price for _, price in self._items), 2)

    def __len__(self) -> int:
        return len(self._items)

    def __contains__(self, name: str) -> bool:
        return any(item_name == name for item_name, _ in self._items)

    def __iter__(self):
        return iter(self._items)

    def __str__(self) -> str:
        return f"ShoppingCart({len(self)} items, £{self.total():.2f})"


cart = ShoppingCart()
cart.add("Keyboard", 49.99)
cart.add("Mouse", 29.99)
cart.add("Mug", 12.99)
print(len(cart))
print("Mouse" in cart)
print(cart.total())
for name, price in cart:
    print(f"  {name}: £{price}")
print(cart)
```

</details>

---

## Common Dunder Methods Reference

| Method | Triggered by | Use for |
|--------|-------------|---------|
| `__init__` | `MyClass(...)` | Initialise instance |
| `__str__` | `str(obj)`, `print(obj)` | Human-readable string |
| `__repr__` | `repr(obj)`, REPL | Developer-readable string |
| `__len__` | `len(obj)` | Length/size |
| `__getitem__` | `obj[key]` | Index/key access |
| `__contains__` | `x in obj` | Membership test |
| `__iter__` | `for x in obj` | Iteration |
| `__eq__` | `a == b` | Equality |
| `__lt__` | `a < b` | Less-than comparison |
| `__add__` | `a + b` | Addition |
| `__mul__` | `a * b` | Multiplication |
| `__enter__`/`__exit__` | `with obj:` | Context manager |

---

## ✅ Lesson Checklist

- [ ] Know the difference between `__str__` and `__repr__`
- [ ] Can implement comparison methods (`__eq__`, `__lt__`)
- [ ] Can make a class behave like a container (`__len__`, `__iter__`, `__contains__`)
- [ ] Can implement arithmetic operators
- [ ] Completed the Try It exercise

---

## ➡️ Next Lesson

→ [Lesson 04 — Dataclasses](lesson_04.md)
