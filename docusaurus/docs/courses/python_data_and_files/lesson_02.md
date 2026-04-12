# Lesson 02 — Working with Files

**Course:** Python: Data and Files · **Lesson:** 2 of 4 · **Time:** ~60 minutes

← [Lesson 01](lesson_01.md) · [Course Index](index.md) · [Lesson 03 →](lesson_03.md)

---

## Reading and Writing Files

Python can read and write any file. The built-in `open()` function is the entry point.

```python
# open(path, mode)
# mode: "r" = read, "w" = write, "a" = append, "b" = binary

# ✅ Always use 'with' — it automatically closes the file when done
with open("hello.txt", "w") as file:
    file.write("Hello, world!\n")
    file.write("Second line.\n")

# Reading the whole file at once
with open("hello.txt", "r") as file:
    content = file.read()
    print(content)

# Reading line by line (memory efficient for large files)
with open("hello.txt", "r") as file:
    for line in file:
        print(line.strip())   # strip() removes the trailing \n

# Reading all lines into a list
with open("hello.txt", "r") as file:
    lines = file.readlines()   # ["Hello, world!\n", "Second line.\n"]
```

**File modes:**

| Mode | Meaning |
|------|---------|
| `"r"` | Read (default) — error if file doesn't exist |
| `"w"` | Write — creates file, **overwrites** if it exists |
| `"a"` | Append — creates file, adds to end if it exists |
| `"x"` | Exclusive create — error if file already exists |
| `"b"` | Binary mode — combine with others: `"rb"`, `"wb"` |
| `"r+"` | Read and write |

:::warning Encoding
Always specify `encoding="utf-8"` when reading/writing text files to avoid platform differences:
```python
with open("notes.txt", "r", encoding="utf-8") as f:
    content = f.read()
```
:::
---

## pathlib — The Modern Way to Handle Paths

> **Tool:** `pathlib` · **Introduced:** Python 3.4 (2014) · **Status:** 🟢 Modern — prefer over `os.path`

`pathlib.Path` objects represent file system paths and work correctly on **Windows and Linux** without worrying about `/` vs `\`.

```python
from pathlib import Path

# Create paths
home = Path.home()                    # /home/alice or C:\Users\alice
docs = home / "Documents"            # ← / operator joins paths (works on both OS)
file = docs / "notes.txt"

print(file)                           # C:\Users\alice\Documents\notes.txt
print(file.name)                      # notes.txt
print(file.stem)                      # notes
print(file.suffix)                    # .txt
print(file.parent)                    # C:\Users\alice\Documents

# Check existence
print(file.exists())           # True / False
print(file.is_file())          # True if it's a file
print(file.is_dir())           # True if it's a directory

# Create directories
(home / "my_project").mkdir(parents=True, exist_ok=True)

# List directory contents
for item in Path(".").iterdir():
    print(item)

# Find files matching a pattern
for py_file in Path(".").glob("*.py"):
    print(py_file)

# Recursive search
for md_file in Path(".").rglob("*.md"):
    print(md_file)

# Read / write directly on Path objects
path = Path("notes.txt")
path.write_text("Hello from pathlib!\n", encoding="utf-8")
content = path.read_text(encoding="utf-8")
```

:::note 🟡 Legacy: os.path
`os.path.join()`, `os.path.exists()` etc. still work but are verbose.
Use `pathlib.Path` for all new code.
:::
---

## Working with JSON

JSON (JavaScript Object Notation) is the standard format for storing and exchanging structured data.

```python
import json

# Python dict → JSON string
data = {
    "name": "Alice",
    "age": 30,
    "hobbies": ["reading", "cycling"],
    "address": {"city": "London", "country": "UK"},
}

json_string = json.dumps(data)                    # Compact
json_pretty = json.dumps(data, indent=2)          # Human-readable
print(json_pretty)

# JSON string → Python dict
loaded = json.loads(json_string)
print(loaded["name"])   # Alice

# Write to a JSON file
with open("user.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

# Read from a JSON file
with open("user.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
```

**JSON ↔ Python type mapping:**

| JSON | Python |
|------|--------|
| object `{}` | `dict` |
| array `[]` | `list` |
| string `""` | `str` |
| number | `int` or `float` |
| `true`/`false` | `True`/`False` |
| `null` | `None` |

---

## ✏️ Try It #1

Write a program that:
1. Creates a `notes/` directory if it doesn't exist
2. Asks the user for a note title and content
3. Saves it as `notes/<title>.txt`
4. Lists all files in the `notes/` directory

<details>
<summary>Show answer</summary>

```python
from pathlib import Path

notes_dir = Path("notes")
notes_dir.mkdir(exist_ok=True)

title = input("Note title: ").strip()
content = input("Note content: ").strip()

note_file = notes_dir / f"{title}.txt"
note_file.write_text(content, encoding="utf-8")
print(f"Saved: {note_file}")

print("\nAll notes:")
for note in sorted(notes_dir.glob("*.txt")):
    print(f"  - {note.name}")
```

</details>

---

## Working with CSV

CSV (Comma-Separated Values) — the universal format for tabular data.

```python
import csv

# Write a CSV file
rows = [
    ["name", "age", "city"],       # header
    ["Alice", 30, "London"],
    ["Bob", 25, "Paris"],
    ["Carol", 28, "Berlin"],
]

with open("people.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerows(rows)

# Read a CSV file
with open("people.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)    # Each row is a dict with header keys
    for row in reader:
        print(f"{row['name']} is {row['age']} from {row['city']}")
```

---

## ✏️ Try It #2

Create a JSON-backed contact book:

- Load contacts from `contacts.json` (create empty list if file doesn't exist)
- Ask the user to add a contact: name and phone number
- Save the updated list back to `contacts.json`
- Print all contacts

<details>
<summary>Show answer</summary>

```python
import json
from pathlib import Path

contacts_file = Path("contacts.json")

# Load existing contacts
if contacts_file.exists():
    contacts = json.loads(contacts_file.read_text(encoding="utf-8"))
else:
    contacts = []

# Add a new contact
name = input("Name: ").strip()
phone = input("Phone: ").strip()
contacts.append({"name": name, "phone": phone})

# Save back
contacts_file.write_text(json.dumps(contacts, indent=2), encoding="utf-8")
print(f"Saved. Total contacts: {len(contacts)}")

print("\nAll contacts:")
for contact in contacts:
    print(f"  {contact['name']}: {contact['phone']}")
```

</details>

---

## Summary

| Concept | What you learned |
|---------|-----------------|
| `open()` + `with` | Open files safely — `with` auto-closes |
| File modes | `r`, `w`, `a`, `x`, `rb`, `wb` |
| `pathlib.Path` | Cross-platform paths — prefer over `os.path` |
| `json` module | `json.load/dump` for files, `json.loads/dumps` for strings |
| `csv` module | `csv.reader`, `csv.writer`, `csv.DictReader` |

---

## 📚 Reference

- [Python `pathlib` Docs](https://docs.python.org/3/library/pathlib.html)
- [Python `json` Docs](https://docs.python.org/3/library/json.html)

---

## ✅ Lesson Checklist

- [ ] Can read and write text files with `open()` and `with`
- [ ] Can use `pathlib.Path` to build cross-platform paths
- [ ] Can save and load data with `json.dump` / `json.load`
- [ ] Can read/write CSV files with `csv.DictReader` / `csv.writer`
- [ ] Completed both Try It exercises

---

## ➡️ Next Lesson

→ [Lesson 03 — JSON and CSV](lesson_03.md)
