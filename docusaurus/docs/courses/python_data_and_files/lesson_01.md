# Lesson 01 — Organising Data

**Course:** Python: Data and Files · **Lesson:** 1 of 4 · **Time:** ~75 minutes

[Course Index](index.md) · [Lesson 02 →](lesson_02.md)

---

## The Four Built-in Collections

Python has four ways to group multiple values:

| Type | Mutable? | Ordered? | Duplicates? | Literal syntax |
|------|----------|----------|-------------|----------------|
| `list` | ✅ Yes | ✅ Yes | ✅ Yes | `[1, 2, 3]` |
| `tuple` | ❌ No | ✅ Yes | ✅ Yes | `(1, 2, 3)` |
| `dict` | ✅ Yes | ✅ Yes* | Keys unique | `{"a": 1}` |
| `set` | ✅ Yes | ❌ No | ❌ No | `{1, 2, 3}` |

*Dicts preserve insertion order since Python 3.7+.

---

## Lists

A list is an **ordered, mutable sequence**. The most-used collection in Python.

```python
fruits = ["apple", "banana", "cherry"]

# Indexing (0-based)
print(fruits[0])    # apple
print(fruits[-1])   # cherry  (last item)
print(fruits[1:3])  # ["banana", "cherry"]  (slice)

# Modifying
fruits.append("date")           # Add to end
fruits.insert(1, "avocado")     # Insert at index 1
fruits.remove("banana")         # Remove by value (first match)
popped = fruits.pop()           # Remove and return last item
del fruits[0]                   # Remove by index

# Info
print(len(fruits))              # Number of items
print("cherry" in fruits)       # True
print(fruits.index("cherry"))   # Index of first match
print(fruits.count("cherry"))   # How many times it appears

# Sorting
fruits.sort()                   # Sort in-place (modifies the list)
sorted_copy = sorted(fruits)    # Returns new sorted list
fruits.reverse()                # Reverse in-place
```

**Common patterns:**

```python
# Build a list from a loop
squares = [x ** 2 for x in range(1, 6)]   # [1, 4, 9, 16, 25]

# Filter
evens = [x for x in range(20) if x % 2 == 0]

# Flatten — join multiple lists
a = [1, 2, 3]
b = [4, 5, 6]
combined = a + b          # [1, 2, 3, 4, 5, 6]
repeated = a * 3          # [1, 2, 3, 1, 2, 3, 1, 2, 3]

# Unpack a list into variables
first, second, *rest = [1, 2, 3, 4, 5]
print(first)   # 1
print(rest)    # [3, 4, 5]
```

---

## Tuples

A tuple is an **ordered, immutable sequence**. Use when the data shouldn't change.

```python
point = (10, 20)
rgb = (255, 128, 0)

x, y = point   # Unpack
print(x)       # 10

# Tuples are faster than lists and signal "don't change this"
# Common use: returning multiple values from a function
def min_max(numbers):
    return min(numbers), max(numbers)   # Returns a tuple

low, high = min_max([3, 1, 4, 1, 5, 9])
print(low, high)  # 1 9

# Single-element tuple needs a trailing comma
single = (42,)    # ← Without comma this is just parentheses: (42) == 42
```

---

## Dictionaries

A dict maps **keys to values**. Keys must be unique and immutable (strings, ints, tuples).

```python
user = {
    "name": "Alice",
    "age": 30,
    "city": "London",
}

# Access
print(user["name"])              # Alice
print(user.get("email"))         # None  (no KeyError)
print(user.get("email", "N/A"))  # N/A   (default value)

# Modify
user["email"] = "alice@example.com"   # Add or update
del user["city"]                       # Remove key
user.update({"age": 31, "role": "admin"})  # Merge another dict

# Check keys
print("name" in user)    # True
print("city" in user)    # False

# Iterate
for key in user:                      # Iterate keys
    print(key)

for value in user.values():           # Iterate values
    print(value)

for key, value in user.items():       # Iterate key-value pairs
    print(f"{key}: {value}")

# Dict comprehension
squares = {x: x ** 2 for x in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

---

## ✏️ Try It #1

Create a dict representing a product in an online store with keys:  
`name`, `price`, `in_stock` (bool), `tags` (list).

Then print a formatted summary:
```
Product: Wireless Keyboard
Price: £29.99
In stock: Yes
Tags: electronics, peripherals, wireless
```

<details>
<summary>Show answer</summary>

```python
product = {
    "name": "Wireless Keyboard",
    "price": 29.99,
    "in_stock": True,
    "tags": ["electronics", "peripherals", "wireless"],
}

in_stock_label = "Yes" if product["in_stock"] else "No"
tags_str = ", ".join(product["tags"])

print(f"Product: {product['name']}")
print(f"Price: £{product['price']}")
print(f"In stock: {in_stock_label}")
print(f"Tags: {tags_str}")
```

</details>

---

## Sets

A set contains **unique values** with no order. Use for membership testing and deduplication.

```python
# Create
tags = {"python", "web", "backend"}
numbers = {1, 2, 3, 2, 1}   # Duplicates removed
print(numbers)               # {1, 2, 3}

# Add / remove
tags.add("linux")
tags.discard("web")     # Remove if present (no error if missing)

# Membership — much faster than list for large collections
print("python" in tags)   # True

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a & b)    # {3, 4}     — intersection (in both)
print(a | b)    # {1,2,3,4,5,6} — union (in either)
print(a - b)    # {1, 2}     — difference (in a but not b)
print(a ^ b)    # {1,2,5,6}  — symmetric difference (in one but not both)

# Deduplicate a list
names = ["Alice", "Bob", "Alice", "Carol", "Bob"]
unique = list(set(names))
# Order is not guaranteed — sort if order matters
unique_sorted = sorted(set(names))
```

---

## Choosing the Right Collection

```
Does order matter?              YES → list or tuple
  Can it change?                YES → list
                                NO  → tuple
  Is it always the same size?   (e.g. x,y coordinate) → tuple

Do you need key-value lookup?   YES → dict

Do you need unique values only? YES → set
  And fast membership tests?    YES → set
```

---

## ✏️ Try It #2

Given a list of words, write code that:
1. Removes duplicates (preserving order — tricky!)
2. Sorts them alphabetically
3. Prints the total count of unique words

```python
words = ["banana", "apple", "cherry", "apple", "banana", "date"]
```

Expected output:
```
Unique words (4): apple, banana, cherry, date
```

<details>
<summary>Show answer</summary>

```python
words = ["banana", "apple", "cherry", "apple", "banana", "date"]

# Remove duplicates preserving order
seen = set()
unique = []
for word in words:
    if word not in seen:
        seen.add(word)
        unique.append(word)

unique.sort()
print(f"Unique words ({len(unique)}): {', '.join(unique)}")
```

</details>

---

## Summary

| Type | Use for |
|------|---------|
| `list` | Ordered, changeable collections — most common |
| `tuple` | Fixed collections, multiple return values |
| `dict` | Key-value lookup, structured data |
| `set` | Unique values, fast membership tests, set algebra |

---

## ✅ Lesson Checklist

- [ ] Can create, read, and modify all four collection types
- [ ] Can use list comprehensions and dict comprehensions
- [ ] Know when to choose list vs tuple vs dict vs set
- [ ] Completed both Try It exercises

---

## ➡️ Next Lesson

→ [Lesson 02 — Working with Files](lesson_02.md)
