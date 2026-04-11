# Python: Zero to Hero

**Level:** Beginner → Professional · **Duration:** 16–20 weeks (2–3 hrs/day) · **Platform:** Windows + Linux

> **Prerequisites:** None. This course assumes no programming experience.  
> **What you'll build:** Across three parts you'll build a CLI task manager, a web scraper,
> a REST API, and a deployable Python service.

---

## Course Structure

This course is split into three parts. Complete Part 1 before starting Part 2.

| Part | Title | Lessons | Goal |
|------|-------|---------|------|
| **Part 1** | [Python Fundamentals](#part-1--python-fundamentals) | 01–12 | Write working Python programs |
| **Part 2** | [Intermediate Python](#part-2--intermediate-python) | 13–24 | Write correct, maintainable Python |
| **Part 3** | [Building Real Things](#part-3--building-real-things) | 25–36 | Ship usable software |

---

## Setup — Windows and Linux

=== "Windows"
    ```powershell
    # 1. Install Python 3.12+ from https://python.org/downloads/
    #    During install: ✅ Check "Add Python to PATH"
    python --version     # Should show 3.12.x or later

    # 2. Install uv — modern Python package manager (2023, 🟢 Modern)
    powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
    uv --version

    # 3. Create your workspace
    mkdir C:\Users\<you>\python_course
    cd C:\Users\<you>\python_course
    uv venv
    .venv\Scripts\activate
    ```

=== "Linux"
    ```bash
    # 1. Python 3.12+
    python3 --version
    # Ubuntu/Debian:
    sudo apt install python3 python3-pip python3-venv

    # 2. Install uv
    curl -Lsf https://astral.sh/uv/install.sh | sh

    # 3. Create your workspace
    mkdir ~/python_course && cd ~/python_course
    uv venv
    source .venv/bin/activate
    ```

---

## Part 1 — Python Fundamentals

**Goal:** Write working Python programs. Build a CLI task manager.

| # | Lesson | Status |
|---|--------|--------|
| [01](lesson_01.md) | Your first Python program | ✅ |
| [02](lesson_02.md) | Variables and types | ✅ |
| [03](lesson_03.md) | Getting input and making decisions | ✅ |
| [04](lesson_04.md) | Loops | ✅ |
| [05](lesson_05.md) | Organising data — lists, dicts, sets, tuples | 🚧 |
| [06](lesson_06.md) | Functions | 🚧 |
| [07](lesson_07.md) | Working with files | 🚧 |
| [08](lesson_08.md) | Handling errors | 🚧 |
| [09](lesson_09.md) | Modules, packages, pip, and uv | 🚧 |
| [10](lesson_10.md) | Classes and objects | 🚧 |
| [11](lesson_11.md) | Practical tools — argparse, logging, json, csv | 🚧 |
| [12](lesson_12.md) | **Capstone** — CLI task manager | 🚧 |

---

## Part 2 — Intermediate Python

**Goal:** Write correct, testable, idiomatic Python. *(Planned)*

| # | Lesson | Topics |
|---|--------|--------|
| 13 | Type hints and mypy | `def greet(name: str) -> str`, mypy, pyright |
| 14 | Testing with pytest | Unit tests, fixtures, parametrize, coverage |
| 15 | Decorators | `@property`, `@classmethod`, writing your own |
| 16 | Context managers | `with` in depth, `__enter__`/`__exit__`, `contextlib` |
| 17 | Generators and iterators | `yield`, `next()`, lazy evaluation, memory efficiency |
| 18 | Advanced OOP | Dataclasses, Protocols, ABCs, `__dunder__` methods |
| 19 | Concurrency basics | Threading, multiprocessing, `asyncio` intro |
| 20 | Working with HTTP APIs | `httpx`, `requests`, JSON APIs, auth headers |
| 21 | Virtual environments and project structure | `pyproject.toml`, `uv`, src layout |
| 22 | Packaging and publishing | Build, wheel, PyPI, uv publish |
| 23 | Debugging and profiling | `pdb`, `cProfile`, `line_profiler`, logging strategy |
| 24 | **Capstone** — web scraper with tests | Combine: classes, HTTP, testing, type hints |

---

## Part 3 — Building Real Things

**Goal:** Ship usable software. *(Planned)*

| # | Lesson | Topics |
|---|--------|--------|
| 25 | CLI apps with Typer | Typer (🟢 Modern) vs argparse (🟢 current) — build a polished CLI |
| 26 | REST APIs with FastAPI | FastAPI (🟢 Modern), Pydantic, auto docs |
| 27 | Database access | SQLAlchemy (🟢), Alembic, PostgreSQL connection |
| 28 | Authentication | JWT, OAuth2 basics with FastAPI |
| 29 | Background tasks and queues | Celery, Redis as broker |
| 30 | Data processing | `pandas` basics, CSV/Excel, batch transforms |
| 31 | Automation scripts | File watcher, cron jobs, system automation |
| 32 | Python and Docker | Dockerfile for Python, multi-stage, poetry vs uv |
| 33 | Environment and config | `pydantic-settings`, dotenv, secrets management |
| 34 | Async Python in depth | `asyncio`, `httpx` async, FastAPI async patterns |
| 35 | Performance and optimization | Profiling, caching, connection pooling |
| 36 | **Capstone** — deployable REST API | Full service: FastAPI + DB + Auth + Docker + tests |

---

## 📚 References

These reference pages go deeper on concepts introduced in this course:

- [Python Language Reference](../../reference/python.md) *(planned)*
- [Foundations — Concurrency](../../domains/foundations/concurrency.md)
- [Foundations — Memory Management](../../domains/foundations/memory_management.md)
- [DevOps — Testing](../../domains/devops/testing.md)
- [DevOps — Docker](../../domains/devops/docker.md)

## 📦 Projects

Apply what you've learned:

- Part 1: CLI Task Manager *(Lesson 12 capstone)*
- Part 2: Web Scraper with Test Suite *(Lesson 24 capstone)*  
- Part 3: Deployable REST API *(Lesson 36 capstone)*
