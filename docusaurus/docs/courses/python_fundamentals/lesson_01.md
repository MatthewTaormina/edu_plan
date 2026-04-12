import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lesson 01 — Your First Python Program

**Course:** Python: Zero to Hero · **Lesson:** 1 of 12 · **Time:** ~45 minutes

> By the end of this lesson you will have written and run your first Python program,
> and understand what Python actually is and why it's worth learning.

---

## What is Python?

Python is a programming language — a way of giving instructions to a computer in a form humans can read.

```
Your instructions (Python code)
         ↓
    Python interpreter    ← reads your code and runs it
         ↓
    Computer does the thing
```

Python was created by **Guido van Rossum** and first released in **1991**. Despite its age it is
🟢 current and actively maintained — it's the most widely used language in data science, DevOps,
automation, and backend development. Python 3.x (released 2008) is the version taught here.

!!! warning "🔴 Python 2 is deprecated"
    Python 2 reached end-of-life on **January 1, 2020**. Any guide, book, or tutorial using
    `print "hello"` (without parentheses) is outdated. Python 3.10+ is the minimum to use today.

---

## Installing Python

If you haven't installed Python yet, follow the setup in the [Course Index](index.md) first.

Check it's working:

<Tabs>
<TabItem value="windows" label="Windows">

```powershell
python --version
# Expected: Python 3.12.x (or later)
```


</TabItem>
<TabItem value="linux" label="Linux">

```bash
python3 --version
# Expected: Python 3.12.x (or later)
```


</TabItem>
</Tabs>

---

## Writing Your First Program

Open any plain text editor (Notepad, VS Code, Nano — anything works).
Create a file called `hello.py`:

```python
# hello.py
# Lines starting with # are comments — Python ignores them.
# They are notes for humans reading the code.

print("Hello, world!")
```

Save it. Now run it:

<Tabs>
<TabItem value="windows" label="Windows">

```powershell
python hello.py
```


</TabItem>
<TabItem value="linux" label="Linux">

```bash
python3 hello.py
```


</TabItem>
</Tabs>

You should see:
```
Hello, world!
```

That's a real program. One line, one instruction, one result.

---

## Understanding `print()`

`print()` is a **function** — a built-in command that displays output.

```python
print("Hello, world!")   # Prints text (a "string")
print(42)                # Prints a number
print(3.14)              # Prints a decimal number
print(True)              # Prints a boolean (True or False)
print()                  # Prints an empty line
```

The thing inside the parentheses is called an **argument** — the data you're giving to the function.
Text must be wrapped in quotes. Numbers don't need quotes.

```python
print("I am learning Python")
print("Today is lesson", 1)          # Multiple arguments, separated by comma
print("Two plus two is", 2 + 2)      # Python evaluates the maths first
```

Output:
```
I am learning Python
Today is lesson 1
Two plus two is 4
```

---

## ✏️ Try It #1

Edit `hello.py` to print three lines:

1. Your name
2. The number 2024
3. The result of `100 + 50 + 25`

Expected output (substitute your name):
```
Alex
2024
175
```

<details>
<summary>Show answer</summary>

```python
print("Alex")
print(2024)
print(100 + 50 + 25)
```

</details>

---

## Comments

Comments explain your code to other humans (and to future you).

```python
# This is a single-line comment
print("This runs")   # Comments can go after code too

# You can comment out code to temporarily disable it:
# print("This won't run")

"""
This is a multi-line string used as a comment.
It's common to see these at the top of files
to describe what the file does.
"""
```

Get into the habit: write a comment for anything that isn't immediately obvious.

---

## The Python REPL

The **REPL** (Read-Evaluate-Print-Loop) is an interactive Python session — type an expression,
see the result immediately. Useful for experimenting.

<Tabs>
<TabItem value="windows" label="Windows">

```powershell
python
```


</TabItem>
<TabItem value="linux" label="Linux">

```bash
python3
```


</TabItem>
</Tabs>

```python
>>> 2 + 2
4
>>> print("hello from the REPL")
hello from the REPL
>>> 100 / 7
14.285714285714286
>>> exit()    # or Ctrl+D (Linux) / Ctrl+Z then Enter (Windows)
```

The REPL does not save your work. For anything you want to keep, write a `.py` file.

---

## ✏️ Try It #2

Open the REPL and try these — predict the output before pressing Enter:

1. `10 * 10`
2. `"hello" + " " + "world"`
3. `type(42)`
4. `type("forty-two")`
5. `type(3.14)`

<details>
<summary>Show answers</summary>

1. `100`
2. `'hello world'` — `+` joins strings together (called concatenation)
3. `<class 'int'>` — integers are type `int`
4. `<class 'str'>` — text is type `str` (string)
5. `<class 'float'>` — decimals are type `float`

</details>

---

## Recommended Editor: VS Code

You can write Python in any text editor. **Visual Studio Code** is the most common choice —
it's free, cross-platform (Windows + Linux), and has excellent Python support.

> **Tool:** VS Code · **Introduced:** 2015 · **Latest:** 1.89 (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern

Install: [https://code.visualstudio.com/](https://code.visualstudio.com/)

After installing, add the **Python extension** by Microsoft from the Extensions panel (Ctrl+Shift+X).

---

## Summary

| Concept | What you learned |
|---------|-----------------|
| Python | A programming language; Python 3.10+ is current; Python 2 is deprecated |
| `print()` | Displays output — text in quotes, numbers without |
| Comments | `#` for single-line notes; ignored by Python |
| REPL | Interactive session for quick experiments; doesn't save work |
| `.py` files | Where your programs live; run with `python hello.py` |

---

## ✅ Lesson Checklist

- [ ] Python 3.12+ is installed and `python --version` shows the correct version
- [ ] Wrote and ran `hello.py` successfully
- [ ] Completed Try It #1 — printed three lines
- [ ] Explored the REPL and completed Try It #2
- [ ] VS Code (or another editor) is set up and ready

---

## ➡️ Next Lesson

→ [Lesson 02 — Variables and Types](lesson_02.md)
