import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Python Fundamentals

**Level:** Beginner · **Lessons:** 6 · **Duration:** ~6 hours · **No prerequisites**

> By the end of this course you will be able to write working Python programs:
> handle user input, make decisions, loop over data, and organise code into functions.

---

## Lessons

| # | Lesson | Time |
|---|--------|------|
| [01](lesson_01.md) | Your first Python program | 45 min |
| [02](lesson_02.md) | Variables and types | 60 min |
| [03](lesson_03.md) | Getting input and making decisions | 60 min |
| [04](lesson_04.md) | Loops | 60 min |
| [05](lesson_05.md) | Functions | 75 min |
| [06](lesson_06.md) | Handling errors | 60 min |

---

## What You'll Build

A command-line **number guessing game** that:
- Generates a random secret number
- Gives hi/lo feedback
- Counts guesses and reports the result
- Handles bad input gracefully

---

## Setup

<Tabs>
<TabItem value="windows" label="Windows">

```powershell
# Python 3.12+ — https://python.org/downloads
# ✅ Check "Add Python to PATH" during install
python --version

# uv — fast package manager
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```


</TabItem>
<TabItem value="linux" label="Linux">

```bash
python3 --version
# Ubuntu/Debian: sudo apt install python3
curl -Lsf https://astral.sh/uv/install.sh | sh
```


</TabItem>
</Tabs>

---

## What's Next

After completing this course:

- → [Python: Data and Files](../python_data_and_files/index.md) — lists, dicts, JSON, file I/O
- → [Python: OOP](../python_oop/index.md) — classes and objects
- → [Python Developer Path](../../paths/python_developer.md) — the full sequence

---

## 📚 References

- [Python Official Docs](https://docs.python.org/3/)
- [PEP 8 — Style Guide](https://peps.python.org/pep-0008/)
