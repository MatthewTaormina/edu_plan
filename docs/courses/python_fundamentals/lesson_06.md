# Lesson 06 — Handling Errors

**Course:** Python Fundamentals · **Lesson:** 6 of 6 · **Time:** ~60 minutes

← [Lesson 05](lesson_05.md) · [Course Index](index.md)

---

## Why Error Handling?

Without error handling, one unexpected input crashes your entire program:

```python
age = int(input("Enter your age: "))   # User types "hello"
# ValueError: invalid literal for int() with base 10: 'hello'
# ← Program crashes here. Everything after this is lost.
```

Error handling lets you **catch** the problem and **decide what to do** instead of crashing.

---

## try / except

```python
try:
    age = int(input("Enter your age: "))
    print(f"You are {age} years old.")
except ValueError:
    print("That's not a valid number.")

# Program continues here regardless
print("Done.")
```

Flow:
1. Python tries everything in the `try` block
2. If an error occurs, jump to `except`
3. If no error, skip `except`
4. Either way, continue after the block

---

## Catching Specific Exceptions

Always catch the **most specific** exception you can:

```python
try:
    with open("data.txt") as f:
        number = int(f.read().strip())
        result = 100 / number
except FileNotFoundError:
    print("Error: data.txt not found")
except ValueError:
    print("Error: file does not contain a valid number")
except ZeroDivisionError:
    print("Error: number in file is zero")

# Catch multiple exceptions in one clause
except (ValueError, TypeError) as e:
    print(f"Data error: {e}")
```

**Common built-in exceptions:**

| Exception | Raised when |
|-----------|------------|
| `ValueError` | Right type, wrong value — `int("hello")` |
| `TypeError` | Wrong type — `"hello" + 5` |
| `KeyError` | Dict key doesn't exist — `d["missing"]` |
| `IndexError` | List index out of range — `lst[99]` |
| `FileNotFoundError` | File doesn't exist |
| `ZeroDivisionError` | Division by zero |
| `AttributeError` | Object doesn't have that attribute |
| `ImportError` | Module can't be imported |
| `PermissionError` | No permission to access a file |

---

## else and finally

```python
try:
    result = int("42")
except ValueError:
    print("Conversion failed")
else:
    # Runs only if NO exception occurred
    print(f"Success: {result}")
finally:
    # ALWAYS runs — whether exception happened or not
    # Use for cleanup: close connections, release locks
    print("Finished")
```

---

## The Exception Object

Catch the exception into a variable with `as e` to access details:

```python
try:
    value = int("not a number")
except ValueError as e:
    print(f"Error type: {type(e).__name__}")   # ValueError
    print(f"Error message: {e}")               # invalid literal...
```

---

## ✏️ Try It #1

Write a safe number-input function:

```python
def get_positive_int(prompt: str) -> int:
    """Ask for input repeatedly until a positive integer is given."""
    ...
```

It should loop until the user enters a valid positive integer.

```
Enter a positive number: hello
That's not a number. Try again.
Enter a positive number: -5
Must be positive. Try again.
Enter a positive number: 7
Got it: 7
```

<details>
<summary>Show answer</summary>

```python
def get_positive_int(prompt: str) -> int:
    """Ask for input repeatedly until a positive integer is given."""
    while True:
        try:
            value = int(input(prompt))
            if value <= 0:
                print("Must be positive. Try again.")
                continue
            return value
        except ValueError:
            print("That's not a number. Try again.")

number = get_positive_int("Enter a positive number: ")
print(f"Got it: {number}")
```

</details>

---

## Raising Exceptions

You can raise exceptions yourself to signal that something is wrong:

```python
def set_age(age: int) -> None:
    if not isinstance(age, int):
        raise TypeError(f"Age must be an int, got {type(age).__name__}")
    if age < 0 or age > 150:
        raise ValueError(f"Age {age} is out of reasonable range (0-150)")

set_age(200)    # ValueError: Age 200 is out of reasonable range (0-150)
set_age("30")  # TypeError: Age must be an int, got str
```

---

## Custom Exceptions

For clear, descriptive errors in your own code:

```python
class AppError(Exception):
    """Base exception for this application."""
    pass

class UserNotFoundError(AppError):
    """Raised when a user cannot be found."""
    def __init__(self, user_id: int):
        self.user_id = user_id
        super().__init__(f"User {user_id} not found")

class InsufficientFundsError(AppError):
    """Raised when an account has insufficient funds."""
    def __init__(self, required: float, available: float):
        self.required = required
        self.available = available
        super().__init__(f"Need £{required:.2f}, only £{available:.2f} available")

# Use them
try:
    raise UserNotFoundError(42)
except UserNotFoundError as e:
    print(e)           # User 42 not found
    print(e.user_id)   # 42
```

---

## Don't Silence Errors

```python
# ❌ Never do this — swallows ALL errors silently
try:
    do_something()
except:
    pass   # Unknown errors disappear into the void

# ❌ Also bad — catches too broadly
try:
    do_something()
except Exception:
    pass

# ✅ Catch specifically, log or re-raise
try:
    do_something()
except ValueError as e:
    logging.error("Invalid value: %s", e)
    raise   # Re-raise the original exception after logging
```

---

## ✏️ Try It #2

Write a function `load_config(path: str) -> dict` that:

1. Reads a JSON file at the given path
2. Raises `FileNotFoundError` with a helpful message if the file doesn't exist
3. Raises `ValueError` with a helpful message if the file is not valid JSON
4. Returns the parsed dict

Test it with a valid JSON file and an invalid one.

<details>
<summary>Show answer</summary>

```python
import json
from pathlib import Path

def load_config(path: str) -> dict:
    """Load a JSON config file.

    Raises:
        FileNotFoundError: If the file doesn't exist.
        ValueError: If the file contains invalid JSON.
    """
    config_path = Path(path)
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {path}")
    try:
        return json.loads(config_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in {path}: {e}") from e

# Test it
try:
    config = load_config("settings.json")
    print("Loaded:", config)
except FileNotFoundError as e:
    print(f"File error: {e}")
except ValueError as e:
    print(f"Format error: {e}")
```

</details>

---

## Summary

| Concept | What you learned |
|---------|-----------------|
| `try/except` | Catch and handle specific errors |
| `else` | Runs if no exception occurred |
| `finally` | Always runs — use for cleanup |
| `raise` | Signal an error from your own code |
| Custom exceptions | `class MyError(Exception)` — clear, specific errors |
| Don't silence | Always catch specifically; never use bare `except: pass` |

---

## ✅ Lesson Checklist

- [ ] Can use `try/except/else/finally`
- [ ] Can catch specific exceptions (not bare `except`)
- [ ] Can raise exceptions with helpful messages
- [ ] Can create a simple custom exception class
- [ ] Completed both Try It exercises

---

## ✅ Course Complete!

You've finished **Python Fundamentals**. You can now:
- Write structured Python programs
- Handle user input and make decisions
- Loop over data and collections
- Organise code into functions
- Handle errors gracefully

**Next steps:**

- → [Python: Data and Files](../python_data_and_files/index.md) — lists, dicts, file I/O
- → [Python: OOP](../python_oop/index.md) — classes and objects
- → [Python Developer Path](../../paths/python_developer.md)
