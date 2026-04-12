# Lesson 05 — Functions

**Course:** Python Fundamentals · **Lesson:** 5 of 6 · **Time:** ~75 minutes

← [Lesson 04](lesson_04.md) · [Course Index](index.md) · [Lesson 06 →](lesson_06.md)

---

## What is a Function?

A function is a **named, reusable block of code**. You define it once, call it many times.

```python
# Without a function — repetition
area1 = 3.14159 * 5 ** 2
area2 = 3.14159 * 8 ** 2
area3 = 3.14159 * 12 ** 2

# With a function — define once, reuse forever
def circle_area(radius):
    return 3.14159 * radius ** 2

print(circle_area(5))    # 78.53975
print(circle_area(8))    # 201.06176
print(circle_area(12))   # 452.38896
```

Functions also make code **easier to read, test, and change**.

---

## Defining and Calling Functions

```python
# Anatomy of a function
def greet(name):          # 'def' keyword, function name, parameters in ()
    """Say hello to a person."""   # Docstring (optional but good practice)
    message = f"Hello, {name}!"
    return message        # Return value

# Calling
result = greet("Alice")
print(result)             # Hello, Alice!
print(greet("Bob"))       # Hello, Bob!

# A function with no return statement returns None
def say_hi():
    print("Hi!")

value = say_hi()   # Prints "Hi!"
print(value)       # None
```

---

## Parameters and Arguments

```python
# Required parameters — must be provided
def add(a, b):
    return a + b

add(3, 4)    # ✅ 7
add(3)       # ❌ TypeError: missing argument b

# Default parameters — optional, used if not provided
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))           # Hello, Alice!
print(greet("Alice", "Hi"))     # Hi, Alice!

# Keyword arguments — pass by name, order doesn't matter
def describe(name, age, city):
    return f"{name}, {age}, from {city}"

describe("Alice", 30, "London")              # positional
describe(age=30, city="London", name="Alice") # keyword — any order
describe("Alice", city="London", age=30)     # mixed — positional first
```

---

## *args and **kwargs

```python
# *args — any number of positional arguments (collected as a tuple)
def total(*numbers):
    return sum(numbers)

print(total(1, 2, 3))        # 6
print(total(10, 20, 30, 40)) # 100

# **kwargs — any number of keyword arguments (collected as a dict)
def display(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

display(name="Alice", age=30, city="London")
# name: Alice
# age: 30
# city: London

# Unpack into a function call
def add(a, b, c):
    return a + b + c

numbers = [1, 2, 3]
print(add(*numbers))    # 6  — unpacks list as positional args

data = {"a": 1, "b": 2, "c": 3}
print(add(**data))      # 6  — unpacks dict as keyword args
```

---

## Return Values

```python
# Return multiple values (as a tuple)
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5, 9])

# Return early — exit the function before the end
def find_first_even(numbers):
    for n in numbers:
        if n % 2 == 0:
            return n   # Exit immediately when found
    return None        # Nothing found

result = find_first_even([1, 3, 5, 4, 7])
print(result)  # 4
```

---

## ✏️ Try It #1

Write a function `temperature_convert(value, unit)` that:
- If `unit` is `"C"`, converts Celsius to Fahrenheit: `F = (C × 9/5) + 32`
- If `unit` is `"F"`, converts Fahrenheit to Celsius: `C = (F − 32) × 5/9`
- Returns the converted value rounded to 1 decimal place
- Raises a `ValueError` if unit is neither `"C"` nor `"F"`

```
temperature_convert(100, "C")  → 212.0
temperature_convert(32, "F")   → 0.0
temperature_convert(37, "C")   → 98.6
```

<details>
<summary>Show answer</summary>

```python
def temperature_convert(value, unit):
    if unit == "C":
        return round((value * 9/5) + 32, 1)
    elif unit == "F":
        return round((value - 32) * 5/9, 1)
    else:
        raise ValueError(f"Unknown unit: {unit}. Use 'C' or 'F'.")

print(temperature_convert(100, "C"))  # 212.0
print(temperature_convert(32, "F"))   # 0.0
print(temperature_convert(37, "C"))   # 98.6
```

</details>

---

## Scope — Where Variables Live

```python
total = 0   # Global scope — visible everywhere

def increment():
    total += 1   # ❌ UnboundLocalError!
    # Python treats 'total' as a local variable because you assign to it

# Fix: pass it as a parameter and return the new value
def increment(total):
    return total + 1

total = increment(total)  # ✅

# Or use 'global' keyword (avoid when possible — makes code harder to reason about)
def reset():
    global total
    total = 0
```

**Rule of thumb:** functions should work with their inputs and return outputs. Avoid relying on global state.

```python
# ❌ Uses global state — hard to test
items = []
def add_item(name):
    items.append(name)

# ✅ Pure function — predictable, easy to test
def add_item(items, name):
    return items + [name]
```

---

## Type Hints

Type hints (Python 3.5+, 🟢 current) make your function signatures self-documenting:

```python
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

def find_user(user_id: int) -> dict | None:   # dict or None (Python 3.10+)
    ...
```

Type hints are **not enforced at runtime** — they're documentation for humans and tools.
Use `mypy` or `pyright` to check them statically (covered in Part 2).

---

## Lambda Functions

Short, anonymous functions for simple one-liners:

```python
# Lambda syntax: lambda parameters: expression
double = lambda x: x * 2
print(double(5))   # 10

# Common use: as a key function for sorting
words = ["banana", "apple", "cherry", "date"]
words.sort(key=lambda word: len(word))   # Sort by length
print(words)  # ['date', 'apple', 'banana', 'cherry']

# For anything more than one expression, use def instead
```

---

## Docstrings

Every function should have a docstring explaining what it does:

```python
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """
    Calculate Body Mass Index.

    Args:
        weight_kg: Weight in kilograms.
        height_m: Height in metres.

    Returns:
        BMI as a float, rounded to 1 decimal place.

    Raises:
        ValueError: If height is zero or negative.
    """
    if height_m <= 0:
        raise ValueError("Height must be positive")
    return round(weight_kg / height_m ** 2, 1)
```

---

## ✏️ Try It #2

Write a function `word_stats(text: str) -> dict` that returns:
- `word_count` — number of words
- `char_count` — number of characters (no spaces)
- `longest_word` — the longest word (first if tied)

```python
word_stats("the quick brown fox")
# {'word_count': 4, 'char_count': 15, 'longest_word': 'quick'}
```

<details>
<summary>Show answer</summary>

```python
def word_stats(text: str) -> dict:
    """Return word count, character count, and longest word for a string."""
    words = text.split()
    return {
        "word_count": len(words),
        "char_count": sum(len(w) for w in words),
        "longest_word": max(words, key=len) if words else "",
    }

print(word_stats("the quick brown fox"))
```

</details>

---

## Summary

| Concept | What you learned |
|---------|-----------------|
| `def` | Define a reusable function with parameters |
| `return` | Send a value back to the caller |
| Default params | `def f(x, y=10)` — y is optional |
| `*args` / `**kwargs` | Accept any number of positional / keyword arguments |
| Scope | Variables live in the function they're defined in |
| Type hints | `name: str`, `-> int` — documentation, not enforcement |
| Lambda | `lambda x: x * 2` — one-liner for simple cases |
| Docstrings | `"""What this does."""` — required for shared code |

---

## ✅ Lesson Checklist

- [ ] Can define functions with required and default parameters
- [ ] Can use `*args` and `**kwargs`
- [ ] Understand variable scope
- [ ] Can add type hints and docstrings
- [ ] Completed both Try It exercises

---

## ➡️ Next Lesson

→ [Lesson 06 — Handling Errors](lesson_06.md)
