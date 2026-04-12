# Lesson 04 — Capstone: Contact Book

**Course:** Python: Data and Files · **Lesson:** 4 of 4 · **Time:** ~60 minutes

← [Lesson 03](lesson_03.md) · [Course Index](index.md)

---

## What You're Building

A command-line **contact book** that stores contacts in a JSON file.

```
python contacts.py add --name "Alice" --email "alice@example.com" --phone "07700 123456"
python contacts.py list
python contacts.py find --name "Alice"
python contacts.py delete --name "Alice"
```

This capstone combines everything from this course:
- Lists and dicts (Lesson 01)
- File I/O with `pathlib` (Lesson 02)
- JSON read/write (Lesson 03)
- Error handling (cross-reference: [Python Fundamentals — Lesson 06](../python_fundamentals/lesson_06.md))
- CLI arguments (introduced here, covered in depth in [Python: Professional Tools](../python_professional/index.md))

---

## Step 1 — Project Structure

Create this layout:

```text
contact_book/
├── contacts.py       ← entry point
├── storage.py        ← JSON file read/write
├── models.py         ← Contact data model
└── contacts.json     ← created on first run
```

---

## Step 2 — The Contact Model (`models.py`)

```python
# models.py
from dataclasses import dataclass, asdict
from typing import Optional

@dataclass
class Contact:
    name: str
    email: str
    phone: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> "Contact":
        return cls(**data)

    def __str__(self) -> str:
        phone_str = f" | {self.phone}" if self.phone else ""
        return f"{self.name} <{self.email}>{phone_str}"
```

---

## Step 3 — Storage (`storage.py`)

```python
# storage.py
import json
from pathlib import Path
from models import Contact

CONTACTS_FILE = Path("contacts.json")

def load_contacts() -> list[Contact]:
    """Load all contacts from the JSON file."""
    if not CONTACTS_FILE.exists():
        return []
    data = json.loads(CONTACTS_FILE.read_text(encoding="utf-8"))
    return [Contact.from_dict(item) for item in data]

def save_contacts(contacts: list[Contact]) -> None:
    """Save all contacts to the JSON file."""
    CONTACTS_FILE.write_text(
        json.dumps([c.to_dict() for c in contacts], indent=2),
        encoding="utf-8",
    )
```

---

## Step 4 — Commands (`contacts.py`)

```python
# contacts.py
import argparse
import sys
from storage import load_contacts, save_contacts
from models import Contact

def cmd_add(args) -> None:
    contacts = load_contacts()
    # Check for duplicate name
    if any(c.name.lower() == args.name.lower() for c in contacts):
        print(f"Error: contact '{args.name}' already exists.")
        sys.exit(1)
    new_contact = Contact(name=args.name, email=args.email, phone=args.phone)
    contacts.append(new_contact)
    save_contacts(contacts)
    print(f"Added: {new_contact}")

def cmd_list(args) -> None:
    contacts = load_contacts()
    if not contacts:
        print("No contacts yet. Use 'add' to create one.")
        return
    for i, contact in enumerate(sorted(contacts, key=lambda c: c.name), start=1):
        print(f"{i:3}. {contact}")

def cmd_find(args) -> None:
    contacts = load_contacts()
    matches = [c for c in contacts if args.name.lower() in c.name.lower()]
    if not matches:
        print(f"No contacts matching '{args.name}'.")
        return
    for contact in matches:
        print(contact)

def cmd_delete(args) -> None:
    contacts = load_contacts()
    original_count = len(contacts)
    contacts = [c for c in contacts if c.name.lower() != args.name.lower()]
    if len(contacts) == original_count:
        print(f"Error: no contact named '{args.name}'.")
        sys.exit(1)
    save_contacts(contacts)
    print(f"Deleted '{args.name}'.")

def main() -> None:
    parser = argparse.ArgumentParser(description="Command-line contact book")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # add
    p_add = subparsers.add_parser("add", help="Add a contact")
    p_add.add_argument("--name",  required=True)
    p_add.add_argument("--email", required=True)
    p_add.add_argument("--phone", default=None)
    p_add.set_defaults(func=cmd_add)

    # list
    p_list = subparsers.add_parser("list", help="List all contacts")
    p_list.set_defaults(func=cmd_list)

    # find
    p_find = subparsers.add_parser("find", help="Search contacts by name")
    p_find.add_argument("--name", required=True)
    p_find.set_defaults(func=cmd_find)

    # delete
    p_del = subparsers.add_parser("delete", help="Delete a contact by name")
    p_del.add_argument("--name", required=True)
    p_del.set_defaults(func=cmd_delete)

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
```

---

## Step 5 — Run and Test

```bash
# Add contacts
python contacts.py add --name "Alice" --email "alice@example.com" --phone "07700 111111"
python contacts.py add --name "Bob"   --email "bob@example.com"

# List all
python contacts.py list
#   1. Alice <alice@example.com> | 07700 111111
#   2. Bob <bob@example.com>

# Find by name (partial match)
python contacts.py find --name "ali"
# Alice <alice@example.com> | 07700 111111

# Delete
python contacts.py delete --name "Bob"
python contacts.py list
```

---

## ✨ Extension Challenges

Try extending the contact book on your own:

1. **Edit** — add an `edit` command that updates an existing contact's email or phone
2. **Export** — add an `export --format csv` flag that writes `contacts.csv`
3. **Import** — add an `import --file contacts.csv` command
4. **Validation** — validate email format before adding (check for `@` and `.`)

<details>
<summary>Hint for email validation</summary>

```python
def is_valid_email(email: str) -> bool:
    """Very basic email check — not production-grade."""
    return "@" in email and "." in email.split("@")[-1]
```

</details>

---

## ✅ Course Complete!

You've finished **Python: Data and Files**. You can now:

- Organise and manipulate data with lists, dicts, sets, and tuples
- Read and write files safely using `pathlib`
- Persist data with JSON and exchange tabular data with CSV
- Build a multi-command CLI tool backed by a JSON store

**Next steps:**

- → [Python: OOP](../python_oop/index.md) — model your contact book with a proper class hierarchy
- → [Python: Professional Tools](../python_professional/index.md) — add logging, tests, and packaging
- → [Python Developer Path](../../paths/python_developer.md) — the full sequence
