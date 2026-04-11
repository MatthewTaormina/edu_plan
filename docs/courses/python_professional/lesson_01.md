# Lesson 01 — Modules, Packages, and Virtual Environments

**Course:** Python: Professional Tools · **Lesson:** 1 of 4 · **Time:** ~75 minutes

[Course Index](index.md) · [Lesson 02 →](lesson_02.md)

---

## Modules — Splitting Code Across Files

A **module** is any `.py` file. Importing it gives you access to everything defined inside.

```
my_project/
├── calculator.py    ← module
└── main.py          ← imports calculator
```

```python
# calculator.py
PI = 3.14159

def add(a, b):
    return a + b

def circle_area(radius):
    return PI * radius ** 2
```

```python
# main.py
import calculator

print(calculator.PI)                  # 3.14159
print(calculator.add(3, 4))          # 7
print(calculator.circle_area(5))     # 78.53975

# Import specific names
from calculator import add, PI
print(add(1, 2))     # no 'calculator.' prefix needed

# Import with alias
import calculator as calc
print(calc.add(1, 2))
```

---

## The Standard Library

Python ships with a large standard library — no install needed:

```python
import math
print(math.sqrt(16))      # 4.0
print(math.ceil(3.2))     # 4
print(math.pi)            # 3.14159...

import random
print(random.randint(1, 10))
print(random.choice(["a", "b", "c"]))

import os
print(os.getcwd())
print(os.environ.get("HOME"))

import sys
print(sys.version)
print(sys.argv)          # Command-line arguments as a list

import time
time.sleep(1)            # Pause for 1 second
```

---

## `if __name__ == "__main__"`

This pattern lets a file work as both an importable module and a runnable script:

```python
# calculator.py
def add(a, b):
    return a + b

# Only runs when you execute this file directly
# Never runs when the file is imported
if __name__ == "__main__":
    print("Testing calculator")
    print(add(3, 4))   # 7
```

Always put your "run this script" code inside `if __name__ == "__main__"`.

---

## Virtual Environments — Project Isolation

Every project needs its own isolated environment to avoid version conflicts.

### Using `uv` (🟢 Modern — recommended)

> **Tool:** `uv` · **Introduced:** 2023 (Astral) · **Status:** 🟢 Modern — 10-100x faster than pip

=== "Windows"
    ```powershell
    uv venv               # Create .venv/
    .venv\Scripts\activate
    # Prompt changes: (.venv) C:\...>

    uv pip install requests
    uv pip install -r requirements.txt
    deactivate
    ```

=== "Linux"
    ```bash
    uv venv
    source .venv/bin/activate
    # Prompt changes: (.venv) user@host:~$

    uv pip install requests
    deactivate
    ```

### Using `venv` (🟢 Built-in)

=== "Windows"
    ```powershell
    python -m venv .venv
    .venv\Scripts\activate
    pip install requests
    ```

=== "Linux"
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install requests
    ```

!!! note "Always use a virtual environment"
    Installing globally (`pip install ...` without activating a venv) causes version
    conflicts across projects. One project = one venv.

---

## pip and requirements.txt

```bash
pip install requests                  # Latest version
pip install requests==2.31.0          # Specific version
pip install "requests>=2.28,<3.0"     # Version range
pip freeze > requirements.txt         # Save current environment
pip install -r requirements.txt       # Restore from file
pip list                              # List installed
pip show requests                     # Package details
```

**`requirements.txt`:**
```
requests==2.31.0
httpx>=0.25.0
python-dotenv==1.0.0
```

---

## Finding Packages — PyPI

[pypi.org](https://pypi.org) — search before you build.

| Package | Use for |
|---------|---------|
| `requests` / `httpx` | HTTP calls |
| `pydantic` | Data validation |
| `rich` | Beautiful terminal output |
| `python-dotenv` | Load `.env` files |
| `pytest` | Testing |
| `ruff` | Linting (🟢 Modern) |
| `black` | Code formatting |

---

## ✏️ Try It

Set up a proper project:

1. Create `greeting_app/` with `greeter.py` (a `greet(name) -> str` function)
2. Create `main.py` that imports `greeter`, uses `argparse` for `--name`, and calls `greet()`
3. Create a `venv` with `uv venv` and activate it
4. Add a `requirements.txt` (no external dependencies yet — add a comment)

Run: `python main.py --name Alice` → `Hello, Alice!`

<details>
<summary>Show answer</summary>

```python
# greeter.py
def greet(name: str) -> str:
    """Return a greeting string."""
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("World"))
```

```python
# main.py
import argparse
from greeter import greet

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--name", required=True)
    args = parser.parse_args()
    print(greet(args.name))
```

```
# requirements.txt
# No external dependencies
```

</details>

---

## Summary

| Concept | What you learned |
|---------|-----------------|
| Modules | Any `.py` file — import with `import` or `from ... import` |
| Standard library | `math`, `random`, `os`, `sys` — no install needed |
| `__name__` | `"__main__"` when run directly; module name when imported |
| Virtual environments | Isolated per-project Python — always use one |
| `uv` | Fast modern package manager — prefer over bare pip |
| `requirements.txt` | Record all project dependencies |

---

## ✅ Lesson Checklist

- [ ] Can import from own modules and the standard library
- [ ] Use `if __name__ == "__main__"` correctly
- [ ] Can create and activate a virtual environment with `uv venv`
- [ ] Have a `requirements.txt` in the project
- [ ] Completed the Try It exercise

---

## ➡️ Next Lesson

→ [Lesson 02 — Building CLI Tools](lesson_02.md)
