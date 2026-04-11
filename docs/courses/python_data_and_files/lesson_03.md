# Lesson 03 — JSON and CSV

**Course:** Python: Data and Files · **Lesson:** 3 of 4 · **Time:** ~45 minutes

← [Lesson 02](lesson_02.md) · [Course Index](index.md) · [Lesson 04 →](lesson_04.md)

---

## JSON — Structured Data Exchange

JSON is the universal format for storing and exchanging structured data.
You already learned the basics in Lesson 02 — here are the patterns you'll use daily.

```python
import json

# Python → JSON
data = {
    "name": "Alice",
    "age": 30,
    "active": True,
    "scores": [95, 87, 92],
    "address": {"city": "London", "postcode": "EC1A"},
    "nickname": None,
}

# To string
json_str = json.dumps(data)               # compact, one line
json_pretty = json.dumps(data, indent=2)  # human-readable

# To file
with open("user.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

# JSON → Python
loaded_str = json.loads(json_str)         # from string
with open("user.json", "r", encoding="utf-8") as f:
    loaded_file = json.load(f)            # from file
```

**Type mapping:**

| Python | JSON |
|--------|------|
| `dict` | `{}` object |
| `list` | `[]` array |
| `str` | `""` string |
| `int`/`float` | number |
| `True`/`False` | `true`/`false` |
| `None` | `null` |

!!! warning "JSON only supports these types"
    `datetime`, `set`, custom classes — not JSON serialisable by default.
    Convert them to strings before serialising.
    ```python
    from datetime import datetime
    data = {"created": datetime.now().isoformat()}   # ✅ "2024-04-11T19:30:00"
    data = {"created": datetime.now()}               # ❌ TypeError
    ```

---

## Useful JSON Patterns

### Safe loading with error handling

```python
import json
from pathlib import Path

def load_json(path: str) -> dict | list:
    """Load a JSON file, raising clear errors on failure."""
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"Not found: {path}")
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in {path}: {e}") from e
```

### Append to a JSON list file

```python
from pathlib import Path
import json

def append_to_json_list(path: str, item: dict) -> None:
    """Add an item to a JSON file containing a list."""
    p = Path(path)
    records = json.loads(p.read_text(encoding="utf-8")) if p.exists() else []
    records.append(item)
    p.write_text(json.dumps(records, indent=2), encoding="utf-8")
```

### Pretty-print for debugging

```python
import json

def pprint_json(data) -> None:
    """Print any JSON-compatible value, nicely formatted."""
    print(json.dumps(data, indent=2, default=str))  # default=str handles non-serialisable types
```

---

## CSV — Tabular Data

CSV (Comma-Separated Values) is used for spreadsheet-compatible data.
Every row is a record; every column is a field.

```python
import csv
from pathlib import Path

# Write CSV
rows = [
    {"name": "Alice", "age": 30, "city": "London"},
    {"name": "Bob",   "age": 25, "city": "Paris"},
    {"name": "Carol", "age": 28, "city": "Berlin"},
]

with open("people.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age", "city"])
    writer.writeheader()
    writer.writerows(rows)

# Read CSV — each row is a dict
with open("people.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['name']} ({row['age']}) — {row['city']}")
```

!!! note "Always use `newline=\"\"` when writing CSV"
    This prevents Python from adding extra blank lines on Windows.
    Always use `encoding="utf-8"` to handle special characters.

---

## Choosing JSON vs CSV

| Need | Use |
|------|-----|
| Nested/hierarchical data | JSON |
| Typed values (bool, null, numbers) | JSON |
| Flat tabular records | CSV |
| Import into a spreadsheet | CSV |
| Config files | JSON (or TOML/YAML — see below) |
| API request/response bodies | JSON |

---

## ✏️ Try It

You have a list of book records. Write them to both a JSON file and a CSV file,
then read the CSV back and print only books published after 2000.

```python
books = [
    {"title": "Clean Code", "author": "Robert Martin", "year": 2008},
    {"title": "The Pragmatic Programmer", "author": "Hunt & Thomas", "year": 1999},
    {"title": "Python Crash Course", "author": "Eric Matthes", "year": 2019},
    {"title": "Design Patterns", "author": "Gang of Four", "year": 1994},
]
```

Expected output when reading back:
```
Recent books (published after 2000):
  Clean Code (2008)
  Python Crash Course (2019)
```

<details>
<summary>Show answer</summary>

```python
import csv
import json
from pathlib import Path

books = [
    {"title": "Clean Code", "author": "Robert Martin", "year": 2008},
    {"title": "The Pragmatic Programmer", "author": "Hunt & Thomas", "year": 1999},
    {"title": "Python Crash Course", "author": "Eric Matthes", "year": 2019},
    {"title": "Design Patterns", "author": "Gang of Four", "year": 1994},
]

# Write JSON
Path("books.json").write_text(json.dumps(books, indent=2), encoding="utf-8")

# Write CSV
with open("books.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["title", "author", "year"])
    writer.writeheader()
    writer.writerows(books)

# Read CSV and filter
print("Recent books (published after 2000):")
with open("books.csv", "r", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        if int(row["year"]) > 2000:
            print(f"  {row['title']} ({row['year']})")
```

</details>

---

## Summary

| Concept | Key points |
|---------|-----------|
| `json.dumps` / `json.loads` | Convert between Python objects and JSON strings |
| `json.dump` / `json.load` | Read/write JSON files directly |
| `csv.DictWriter` | Write CSV with named columns |
| `csv.DictReader` | Read CSV rows as dicts |
| JSON types | dict, list, str, int/float, bool, None — no datetime, no set |
| CSV gotchas | `newline=""` when writing; values are always strings when reading |

---

## 📚 Reference

- [Python `json` Docs](https://docs.python.org/3/library/json.html)
- [Python `csv` Docs](https://docs.python.org/3/library/csv.html)

---

## ✅ Lesson Checklist

- [ ] Can serialise and deserialise JSON safely with error handling
- [ ] Know which Python types are JSON-serialisable
- [ ] Can write and read CSV with `DictWriter`/`DictReader`
- [ ] Know when to use JSON vs CSV
- [ ] Completed the Try It exercise

---

## ➡️ Next Lesson

→ [Lesson 04 — Capstone: Contact Book](lesson_04.md)
