# Lesson 02 — Variables and Types

**Course:** Python: Zero to Hero · **Lesson:** 2 of 12 · **Time:** ~60 minutes

> By the end of this lesson you will know how to store values in variables,
> understand Python's core data types, and convert between them.

←  [Lesson 01](lesson_01.md) · [Course Index](index.md) · [Lesson 03 →](lesson_03.md)

---

## What is a Variable?

A variable is a **named container** for a value. You store a value once and refer to it by name.

```python
# Without variables — hard to read and change
print(3.14159 * 5 * 5)   # Area of a circle with radius 5

# With variables — clear and reusable
pi = 3.14159
radius = 5
area = pi * radius * radius
print(area)
```

Python creates a variable the moment you assign to it. No declaration needed.

---

## The Four Core Types

Python has four types you'll use in almost every program:

| Type | Name | Example | Use for |
|------|------|---------|---------|
| `int` | Integer | `42`, `-7`, `0` | Whole numbers |
| `float` | Float | `3.14`, `-0.5`, `1.0` | Decimal numbers |
| `str` | String | `"hello"`, `'world'` | Text |
| `bool` | Boolean | `True`, `False` | Yes/no conditions |

```python
age = 25            # int
price = 9.99        # float
name = "Alice"      # str
is_logged_in = True # bool

# Check the type of any value
print(type(age))          # <class 'int'>
print(type(price))        # <class 'float'>
print(type(name))         # <class 'str'>
print(type(is_logged_in)) # <class 'bool'>
```

:::note Python is dynamically typed
You don't declare the type — Python works it out from the value.
`age = 25` is an `int`. `age = "twenty-five"` would make it a `str`.
The type of a variable can change — though it's usually a sign of confusion if it does.
:::
---

## Strings in Detail

Strings hold text. You can use single or double quotes — they're identical.

```python
greeting = "Hello, world!"
name = 'Alice'

# Multi-line strings use triple quotes
message = """
Dear Alice,
Your order has been shipped.
"""

# String length
print(len("hello"))       # 5
print(len(""))            # 0
```

### String operations

```python
first = "Hello"
last = "World"

# Concatenation — joining strings
full = first + ", " + last + "!"
print(full)               # Hello, World!

# Repetition
print("ha" * 3)           # hahaha

# f-strings — the modern way to embed values in strings (Python 3.6+, 🟢 current)
name = "Alice"
age = 30
print(f"My name is {name} and I am {age} years old.")
# My name is Alice and I am 30 years old.

# You can put expressions inside f-strings
print(f"Next year I will be {age + 1}.")
```

:::warning 🟡 Older string formatting — you may see these
```python
# % formatting (Python 2 era, 🟡 legacy — still works, avoid in new code)
print("Hello, %s" % name)

# .format() (Python 3.0+, 🟡 common but verbose — prefer f-strings)
print("Hello, {}".format(name))
```
Use **f-strings** for all new code.
:::
### Useful string methods

```python
text = "  Hello, World!  "

print(text.strip())         # "Hello, World!"   — remove surrounding whitespace
print(text.lower())         # "  hello, world!  "
print(text.upper())         # "  HELLO, WORLD!  "
print(text.replace("World", "Python"))  # "  Hello, Python!  "
print(text.strip().split(", "))         # ["Hello", "World!"]

# Check contents
print("hello".startswith("he"))   # True
print("hello".endswith("lo"))     # True
print("ell" in "hello")           # True
print("xyz" in "hello")           # False
```

---

## Numbers in Detail

```python
# Integer arithmetic
print(10 + 3)   # 13  — addition
print(10 - 3)   # 7   — subtraction
print(10 * 3)   # 30  — multiplication
print(10 ** 3)  # 1000 — exponentiation (10 cubed)
print(10 // 3)  # 3   — integer division (floor)
print(10 % 3)   # 1   — modulo (remainder)

# Float arithmetic
print(10 / 3)   # 3.3333333333333335 — true division (always returns float)

# ⚠️ Floating point is not exact — never test with ==
print(0.1 + 0.2)           # 0.30000000000000004  ← not 0.3!
print(0.1 + 0.2 == 0.3)    # False  ← dangerous!

# Instead:
import math
print(math.isclose(0.1 + 0.2, 0.3))   # True  ← correct
```

---

## ✏️ Try It #1

Create variables for all of the following and print each one with an f-string label:

- Your name (string)
- Your age (int)
- Your height in metres (float)
- Whether you've had coffee today (bool)

Expected output (your values):
```
Name: Alex
Age: 28
Height: 1.75m
Had coffee: True
```

<details>
<summary>Show answer</summary>

```python
name = "Alex"
age = 28
height = 1.75
had_coffee = True

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}m")
print(f"Had coffee: {had_coffee}")
```

</details>

---

## Type Conversion

You can convert between types explicitly:

```python
# str → int / float
age_str = "30"
age = int(age_str)          # 30
price_str = "9.99"
price = float(price_str)    # 9.99

# int / float → str
count = 42
label = str(count)          # "42"

# int → float and back
x = int(3.9)   # 3  (truncates, does NOT round)
y = float(7)   # 7.0

# Check before converting
print("30".isdigit())       # True
print("3.14".isdigit())     # False — isdigit() only works for whole numbers
```

**When conversion fails, Python raises a `ValueError`:**

```python
int("hello")   # ValueError: invalid literal for int() with base 10: 'hello'
```
We'll handle errors properly in Lesson 08.

---

## ✏️ Try It #2

The variable below holds a number as a string. Convert it to an `int`, double it,
then print the result using an f-string.

```python
raw = "21"
```

Expected output:
```
Double 21 is 42
```

<details>
<summary>Show answer</summary>

```python
raw = "21"
number = int(raw)
doubled = number * 2
print(f"Double {number} is {doubled}")
```

</details>

---

## None — The Absence of a Value

`None` is Python's way of saying "no value". It's not zero, not an empty string — it's the absence of anything.

```python
result = None

print(result)          # None
print(type(result))    # <class 'NoneType'>

# Always check for None with 'is', not '=='
if result is None:
    print("No result yet")

# Common source of bugs
def greet(name):
    print(f"Hello, {name}")
    # ← No return statement → function implicitly returns None

value = greet("Alice")  # Prints "Hello, Alice"
print(value)            # None  ← easy to miss
```

---

## Naming Rules

Variable names must follow these rules:

```python
# ✅ Valid names
user_name = "Alice"      # snake_case — the Python convention (PEP 8)
total_price = 99.99
is_active = True
MAX_RETRIES = 3          # ALL_CAPS for constants (by convention)
_private = "internal"    # leading underscore = intended as private

# ❌ Invalid names
2fast = "no"             # Can't start with a number
my-var = "no"            # Hyphens not allowed (that's subtraction)
class = "no"             # 'class' is a reserved keyword
```

**Python convention (PEP 8):** use `snake_case` for variables and functions.
Use `UPPER_CASE` for values that should never be changed (constants).

```python
# ❌ Don't do this — works but confusing
myVariableName = "camelCase — used in JavaScript, not Python"

# ✅ Do this
my_variable_name = "snake_case — the Python way"
```

---

## Summary

| Concept | What you learned |
|---------|-----------------|
| Variables | Named containers — created on assignment, no declaration needed |
| `int` | Whole numbers — supports `+`, `-`, `*`, `//`, `%`, `**` |
| `float` | Decimal numbers — use `math.isclose()` for equality checks |
| `str` | Text — f-strings (`f"..."`) for embedding values |
| `bool` | `True` or `False` |
| `None` | Absence of a value — check with `is None` |
| Type conversion | `int()`, `float()`, `str()` — raises `ValueError` on failure |
| Naming | `snake_case` for variables; `UPPER_CASE` for constants |

---

## ✅ Lesson Checklist

- [ ] Can create variables of all four core types
- [ ] Can use f-strings to build output strings
- [ ] Know why `0.1 + 0.2 != 0.3` and how to handle it
- [ ] Can convert between `str`, `int`, and `float`
- [ ] Know what `None` means and how to check for it
- [ ] Completed both Try It exercises

---

## ➡️ Next Lesson

→ [Lesson 03 — Getting Input and Making Decisions](lesson_03.md)
