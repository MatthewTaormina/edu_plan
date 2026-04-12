import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Programming Basics

**Domain:** Foundations · **Time Estimate:** 3–4 weeks · **Language Used:** Python

> **Prerequisites:** None — this is the starting point.
>
> **Who needs this:** Everyone. This is the grammar of programming. Every other unit builds on this.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain what a variable is and why it exists
- [ ] Write programs using conditionals, loops, and functions
- [ ] Work with strings, lists, and dictionaries
- [ ] Read from and write to files on disk
- [ ] Handle errors gracefully so programs don't crash on bad input
- [ ] Break a problem into functions and reason about scope
- [ ] Write a small complete program from scratch without help

---

## 📖 Concepts

### 1. What Is a Program?

A program is a sequence of instructions that tells a computer what to do. The computer executes them one at a time, top to bottom.

```python
print("Hello, world!")  # This is a statement
# The computer executes this one line and moves on
```

**Key insight:** The computer does *exactly* what you say — not what you mean. This is where bugs come from.

---

### 2. Variables and Data Types

A **variable** is a named box that holds a value. The value can change.

```python
name = "Alice"       # str (text)
age = 25             # int (whole number)
height = 5.9         # float (decimal)
is_student = True    # bool (True or False)
```

**Primitive types you must know:**

| Type | Examples | Notes |
|------|---------|-------|
| `int` | `0`, `42`, `-7` | Whole numbers |
| `float` | `3.14`, `-0.5` | Decimal numbers |
| `str` | `"hello"`, `'world'` | Text (immutable) |
| `bool` | `True`, `False` | Logic values |
| `None` | `None` | "Nothing" / absence of value |

**Type conversion:**
```python
age_text = "25"
age_num = int(age_text)   # "25" → 25 (number)
print(type(age_num))       # <class 'int'>
```

!!! tip "Research Question 🔍"
    Why can't you do `"25" + 5` in Python but you can in JavaScript? What does this tell you about the two languages?

---

### 3. Operators

```python
# Arithmetic
10 + 3    # 13
10 - 3    # 7
10 * 3    # 30
10 / 3    # 3.333... (always float)
10 // 3   # 3 (integer division — floor)
10 % 3    # 1 (remainder / modulo)
10 ** 2   # 100 (exponent)

# Comparison (returns bool)
5 == 5    # True
5 != 4    # True
5 > 3     # True
5 <= 5    # True

# Logical
True and False  # False
True or False   # True
not True        # False
```

**The modulo operator `%` is surprisingly useful:**
```python
# Is a number even?
if number % 2 == 0:
    print("even")
```

---

### 4. Control Flow — If / Else

```python
temperature = 72

if temperature > 90:
    print("Hot day!")
elif temperature > 60:
    print("Nice day!")
else:
    print("Cold day!")
```

**Truthiness:** In Python, many things evaluate as `True` or `False`:
```python
# Falsy values (evaluate as False):
None, 0, 0.0, "", [], {}, set()

# Everything else is truthy
if []:        # False — empty list
    print("never runs")
if [1, 2, 3]: # True — non-empty list
    print("this runs")
```

---

### 5. Loops

**`while` — repeat as long as condition is True:**
```python
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1  # Don't forget this! Infinite loop otherwise.
```

**`for` — iterate over a sequence:**
```python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Range: iterate N times
for i in range(5):    # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 10, 2):  # start, stop, step → 2, 4, 6, 8
    print(i)
```

**`break` and `continue`:**
```python
for i in range(10):
    if i == 5:
        break       # Exit loop entirely
    if i % 2 == 0:
        continue    # Skip this iteration
    print(i)        # Prints: 1, 3
```

!!! tip "Research Question 🔍"
    What is an infinite loop? How do you break out of one in a terminal? (Hint: Ctrl+C)

---

### 6. Functions

A function is a named, reusable block of code. Functions are the primary tool for avoiding repetition.

```python
def greet(name, greeting="Hello"):   # greeting has a default value
    """Return a greeting string."""   # This is a docstring
    return f"{greeting}, {name}!"

# Calling the function
message = greet("Alice")             # Uses default greeting
print(message)                        # "Hello, Alice!"

message2 = greet("Bob", "Hi")
print(message2)                       # "Hi, Bob!"
```

**Scope — where variables live:**
```python
x = 10  # Global scope

def my_function():
    x = 99  # Local scope — different x!
    print(x)  # 99

my_function()
print(x)  # Still 10 — global was not changed
```

!!! warning "Common Mistake"
    Functions that don't have a `return` statement return `None` implicitly. If you assign the result to a variable and the function prints instead of returning, you get `None`.

---

### 7. Collections

**Lists — ordered, mutable sequences:**
```python
numbers = [3, 1, 4, 1, 5, 9]

numbers.append(2)      # Add to end
numbers.insert(0, 0)   # Insert at index
numbers.pop()          # Remove and return last
numbers.remove(1)      # Remove first occurrence of 1
numbers.sort()         # Sort in place
length = len(numbers)  # Number of elements

# Slicing
numbers[1:4]   # Elements at index 1, 2, 3
numbers[:3]    # First 3
numbers[-2:]   # Last 2
```

**Dictionaries — key-value pairs:**
```python
person = {
    "name": "Alice",
    "age": 25,
    "city": "Toronto"
}

# Access
print(person["name"])           # "Alice"
print(person.get("email", "no email"))  # Safe access with default

# Modify
person["age"] = 26
person["email"] = "alice@example.com"   # Add new key

# Iterate
for key, value in person.items():
    print(f"{key}: {value}")

# Check if key exists
if "email" in person:
    print("Has email")
```

**List comprehensions (powerful shorthand):**
```python
numbers = [1, 2, 3, 4, 5, 6]

# Old way
evens = []
for n in numbers:
    if n % 2 == 0:
        evens.append(n)

# List comprehension
evens = [n for n in numbers if n % 2 == 0]
squares = [n ** 2 for n in numbers]
```

---

### 8. Strings in Depth

```python
text = "Hello, World!"

# Methods
text.upper()          # "HELLO, WORLD!"
text.lower()          # "hello, world!"
text.strip()          # Remove leading/trailing whitespace
text.split(", ")      # ["Hello", "World!"]
", ".join(["a","b"])  # "a, b"
text.replace("World", "Python")  # "Hello, Python!"
text.startswith("Hello")  # True
text.find("World")    # 7 (index), -1 if not found
len(text)             # 13

# f-strings (use these — they're the modern way)
name = "Alice"
age = 25
print(f"Name: {name}, Age: {age}")
print(f"Next year: {age + 1}")    # Expressions work inside {}
print(f"Pi: {3.14159:.2f}")       # Format specifiers
```

---

### 9. File I/O

```python
# Writing to a file
with open("output.txt", "w") as file:  # "w" = write (overwrites)
    file.write("Line 1\n")
    file.write("Line 2\n")

# Reading from a file
with open("output.txt", "r") as file:  # "r" = read
    content = file.read()    # Read entire file as string

# Read line by line (memory efficient for large files)
with open("output.txt", "r") as file:
    for line in file:
        print(line.strip())  # strip() removes the \n

# Append to existing file
with open("output.txt", "a") as file:  # "a" = append
    file.write("Line 3\n")
```

!!! tip "Why use `with`?"
    The `with` statement automatically closes the file when the block ends — even if an error occurs. Always use it for file I/O.

---

### 10. Error Handling

```python
def divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")
        return None
    except TypeError as e:
        print(f"Error: Wrong type — {e}")
        return None
    finally:
        print("This always runs, error or not")

# Raising your own errors
def get_age(value):
    age = int(value)
    if age < 0 or age > 150:
        raise ValueError(f"Invalid age: {age}")
    return age
```

**Common exceptions to know:**
| Exception | When it occurs |
|-----------|---------------|
| `ValueError` | Right type, wrong value (`int("abc")`) |
| `TypeError` | Wrong type (`"hello" + 5`) |
| `IndexError` | List index out of range |
| `KeyError` | Dictionary key doesn't exist |
| `FileNotFoundError` | File doesn't exist |
| `ZeroDivisionError` | Division by zero |

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- 📺 **[CS50P — Harvard Python Course (FREE)](https://cs50.harvard.edu/python/)** — Weeks 0–6. The gold standard. Do all problem sets.
- 📖 **[Python Docs: Tutorial (FREE)](https://docs.python.org/3/tutorial/)** — Chapters 3–9. Use as reference, not primary reading.


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📺 **[Corey Schafer — Python Tutorials (YouTube, FREE)](https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU)** — Extremely clear explanations, great for individual topics
- 🎮 **[Exercism Python Track (FREE)](https://exercism.org/tracks/python)** — Practice problems with mentoring


</TabItem>
<TabItem value="reference" label="Reference">

- 📖 **[Real Python (FREE + paid)](https://realpython.com/)** — Best Python articles on the web. Search for specific topics.


</TabItem>
</Tabs>

---

## 🏗️ Assignments

!!! note "Why multi-concept assignments?"
    Single-concept exercises are forgettable. These assignments combine everything from this unit into programs you'd actually use.

### Assignment 1 — Temperature Converter (Basics)
**Combines:** Variables, functions, loops, error handling, user input

Build a CLI temperature converter:
- [ ] Convert Celsius ↔ Fahrenheit ↔ Kelvin  
- [ ] Accept input from the user (use `input()`)
- [ ] Validate input — handle non-numeric input without crashing
- [ ] Loop until user types `quit`
- [ ] Display results formatted to 2 decimal places

```
Enter temp (e.g. '100 C' or 'quit'): 100 C
100.00°C = 212.00°F = 373.15K

Enter temp (e.g. '100 C' or 'quit'): abc F
Error: 'abc' is not a valid number.

Enter temp (e.g. '100 C' or 'quit'): quit
Goodbye!
```

---

### Assignment 2 — Contact Book (Collections + File I/O)
**Combines:** Dictionaries, lists, file I/O, error handling, functions, loops

Build a contact manager that **persists to a file**:

- [ ] **Add contact**: name, phone, email
- [ ] **Find contact**: search by name (partial match okay)
- [ ] **Delete contact**: by name
- [ ] **List all contacts**: sorted alphabetically
- [ ] **Save to JSON file** on every change
- [ ] **Load from JSON file** on startup (handle missing file gracefully)

```
Commands: add, find, delete, list, quit
> add
Name: Alice Smith
Phone: 555-1234
Email: alice@example.com
Contact saved!

> find
Search: ali
Found: Alice Smith — 555-1234 — alice@example.com

> list
1. Alice Smith — 555-1234
2. Bob Jones — 555-5678
```

---

### Assignment 3 — Word Frequency Analyzer (Strings + File I/O + Dicts)
**Combines:** File I/O, string manipulation, dictionaries, sorting, comprehensions

Build a tool that analyzes a text file:
- [ ] Open a `.txt` file (accept filename as command-line argument)
- [ ] Count how many times each word appears (case-insensitive)
- [ ] Strip punctuation from words
- [ ] Display top 10 most common words
- [ ] Also display: total words, unique words, average word length

```
$ python word_freq.py hamlet.txt

File: hamlet.txt
Total words: 31957
Unique words: 5447
Average word length: 4.2 characters

Top 10 Words:
  1. the     — 1143 times
  2. and     —  967 times
  3. to      —  745 times
  ...
```

!!! tip "Hint"
    Use `sys.argv` to get command-line arguments. Use Python's built-in `string.punctuation` to know what characters to strip.

---

## ✅ Milestone Checklist

Before moving on, confirm you can do all of these **without looking up syntax**:

- [ ] Write a function with parameters and a return value
- [ ] Use a `for` loop to iterate over a list
- [ ] Create a dictionary and access values safely using `.get()`
- [ ] Read a file and process it line by line
- [ ] Write a `try/except` block that handles at least two error types
- [ ] Use an f-string to format output
- [ ] Write a list comprehension
- [ ] Explain the difference between local and global scope to someone

**All 3 assignments completed and committed to GitHub?**

- [ ] Assignment 1 — Temperature Converter *(on GitHub)*
- [ ] Assignment 2 — Contact Book *(on GitHub)*
- [ ] Assignment 3 — Word Frequency Analyzer *(on GitHub)*

---

## 🏆 Milestone Complete!

> **You can now write real programs that solve real problems.**
>
> You understand the building blocks every programmer uses daily.
> The next step is learning how to *organize* data efficiently — that's **Data Structures**.

**Log this in your kanban:** Move `foundations/programming_basics` to ✅ Done.

---

## ➡️ Next Unit

→ [Data Structures](data_structures.md)

**Or if you're on the Beginner Path:** continue to [Milestone 3 — Data Structures & Algorithms](../../paths/beginner.md#milestone-3--data-structures--algorithms-basics-)
