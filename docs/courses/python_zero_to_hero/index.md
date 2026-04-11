# Python: Zero to Hero

**Level:** Beginner · **Duration:** 8 weeks (2–3 hrs/day) · **Platform:** Windows + Linux

> **Prerequisites:** None. This course assumes no programming experience.  
> **What you'll build:** By the end you will have built 3 real projects: a CLI task manager, a web scraper, and a REST API.

---

## Syllabus

| Lesson | Topic | Concepts |
|--------|-------|---------|
| [01](lesson_01.md) | Your first Python program | Install Python, run a script, `print()`, comments |
| [02](lesson_02.md) | Variables and types | `int`, `float`, `str`, `bool`, type() |
| [03](lesson_03.md) | Getting input and making decisions | `input()`, `if`/`elif`/`else`, comparison operators |
| [04](lesson_04.md) | Repeating yourself (loops) | `for`, `while`, `range()`, `break`, `continue` |
| [05](lesson_05.md) | Organising data | Lists, tuples, dicts, sets, list comprehensions |
| [06](lesson_06.md) | Functions | `def`, parameters, return values, scope, docstrings |
| [07](lesson_07.md) | Working with files | Open, read, write, `with` statement, `pathlib` |
| [08](lesson_08.md) | Handling errors | `try`/`except`/`finally`, raising exceptions |
| [09](lesson_09.md) | Modules and packages | `import`, `pip`, virtual environments, `uv` |
| [10](lesson_10.md) | Classes and objects | `class`, `__init__`, methods, `self`, inheritance |
| [11](lesson_11.md) | Practical Python tools | `argparse`, `logging`, `json`, `csv`, `datetime` |
| [12](lesson_12.md) | Capstone project | CLI task manager — applies all lessons |

---

## Setup — Windows and Linux

=== "Windows"
    ```powershell
    # Download and install Python 3.12+ from https://python.org/downloads/
    # During install: ✅ Check "Add Python to PATH"

    # Verify installation
    python --version     # Should show 3.12.x or later
    pip --version

    # Install uv (modern Python package manager — Introduced 2023, 🟢 Modern)
    # https://docs.astral.sh/uv/
    powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
    uv --version

    # Create your course workspace
    mkdir C:\Users\<you>\python_course
    cd C:\Users\<you>\python_course
    uv venv
    .venv\Scripts\activate
    ```

=== "Linux"
    ```bash
    # Python 3.12+ (most distros ship 3.10+; update if needed)
    python3 --version
    # Ubuntu/Debian:
    sudo apt install python3 python3-pip python3-venv

    # Install uv
    curl -Lsf https://astral.sh/uv/install.sh | sh

    # Create your course workspace
    mkdir ~/python_course && cd ~/python_course
    uv venv
    source .venv/bin/activate
    ```

---

## Lesson 01 — Your First Python Program

→ [Go to Lesson 01](lesson_01.md)
