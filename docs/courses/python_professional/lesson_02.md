# Lesson 02 — Building CLI Tools

**Course:** Python: Professional Tools · **Lesson:** 2 of 4 · **Time:** ~75 minutes

← [Lesson 01](lesson_01.md) · [Course Index](index.md) · [Lesson 03 →](lesson_03.md)

---

## This Lesson

Before you build the capstone project, you need four tools from the standard library
that show up in almost every real Python program:

1. **`argparse`** — parse command-line arguments
2. **`logging`** — structured logs instead of print()
3. **`json`** — already covered in Lesson 07; review patterns here
4. **`datetime`** — working with dates and times

---

## 1. argparse — Command-Line Interfaces

`argparse` reads arguments from the command line so users can configure your program without editing source code.

```bash
python my_tool.py --name Alice --count 3
```

```python
import argparse

def main():
    parser = argparse.ArgumentParser(
        description="A tool that greets people."
    )

    # Positional argument — required, no flag
    parser.add_argument("name", help="Name to greet")

    # Optional argument — has a default
    parser.add_argument(
        "--count",
        type=int,
        default=1,
        help="How many times to greet (default: 1)"
    )

    # Flag — True if present, False if absent
    parser.add_argument(
        "--shout",
        action="store_true",
        help="Print in uppercase"
    )

    args = parser.parse_args()

    message = f"Hello, {args.name}!"
    if args.shout:
        message = message.upper()

    for _ in range(args.count):
        print(message)

if __name__ == "__main__":
    main()
```

```bash
python greet.py Alice
# Hello, Alice!

python greet.py Alice --count 3 --shout
# HELLO, ALICE!
# HELLO, ALICE!
# HELLO, ALICE!

python greet.py --help
# usage: greet.py [-h] [--count COUNT] [--shout] name
# ...
```

---

## 2. logging — Proper Log Messages

`print()` is fine for learning. Production code uses `logging` because:
- You can control log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- Logs include timestamps and source location
- You can write to file without changing your code

```python
import logging

# Configure once, at the top of your program
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)   # One logger per module

# Use the right level
logger.debug("Detailed debug — only shown when level=DEBUG")
logger.info("Something happened normally")
logger.warning("Something unexpected, but not an error")
logger.error("An error occurred")
logger.critical("Everything is on fire")

# Pass variables as arguments (NOT f-strings — avoids building string if not logged)
user_id = 42
logger.info("Processing user %s", user_id)   # ✅
logger.info(f"Processing user {user_id}")    # ❌ — builds string even if INFO is off
```

**Log to a file:**

```python
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    handlers=[
        logging.FileHandler("app.log", encoding="utf-8"),
        logging.StreamHandler(),   # Also print to terminal
    ],
)
```

```python
# In each module — get a named logger
import logging
logger = logging.getLogger(__name__)

def process(item):
    logger.info("Processing %s", item)
    try:
        result = do_work(item)
        logger.debug("Result: %s", result)
        return result
    except Exception as e:
        logger.error("Failed to process %s: %s", item, e)
        raise
```

---

## 3. datetime — Dates and Times

```python
from datetime import datetime, date, timedelta

# Current date and time
now = datetime.now()
today = date.today()

print(now)           # 2024-04-11 19:30:00.123456
print(today)         # 2024-04-11

# Format for display
print(now.strftime("%Y-%m-%d %H:%M"))    # 2024-04-11 19:30
print(now.strftime("%d %B %Y"))          # 11 April 2024
print(now.strftime("%A, %d %B"))         # Thursday, 11 April

# Parse from a string
birthday = datetime.strptime("1994-07-15", "%Y-%m-%d")
print(birthday.year)    # 1994

# Date arithmetic with timedelta
one_week = timedelta(weeks=1)
next_week = today + one_week
yesterday = today - timedelta(days=1)

# How long ago?
past = datetime(2024, 1, 1)
diff = now - past
print(diff.days)   # Number of days since 2024-01-01

# Compare dates
print(today > date(2023, 1, 1))   # True
```

---

## ✏️ Try It

Build a simple time tracker as practice for the capstone.

Write a script `timer.py` that:
- Accepts `--task` (required) and `--duration` (required, in minutes) as arguments
- Logs "Starting task: <name>" at start
- Waits for the duration (use `time.sleep(duration * 60)` — or just 5 seconds for testing)
- Logs "Completed task: <name>, duration: <X> minutes"
- Saves a record to `log.json` (append to existing list)

<details>
<summary>Show answer</summary>

```python
# timer.py
import argparse
import json
import logging
import time
from datetime import datetime
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

LOG_FILE = Path("log.json")

def load_log() -> list:
    if LOG_FILE.exists():
        return json.loads(LOG_FILE.read_text(encoding="utf-8"))
    return []

def save_log(records: list) -> None:
    LOG_FILE.write_text(json.dumps(records, indent=2), encoding="utf-8")

def main():
    parser = argparse.ArgumentParser(description="Simple task timer")
    parser.add_argument("--task", required=True, help="Task name")
    parser.add_argument("--duration", type=int, required=True, help="Duration in minutes")
    args = parser.parse_args()

    start = datetime.now()
    logger.info("Starting task: %s", args.task)

    time.sleep(5)   # Replace with args.duration * 60 for real use

    end = datetime.now()
    logger.info("Completed task: %s, duration: %s minutes", args.task, args.duration)

    records = load_log()
    records.append({
        "task": args.task,
        "started": start.isoformat(),
        "ended": end.isoformat(),
        "duration_minutes": args.duration,
    })
    save_log(records)
    logger.info("Logged to %s (%d records total)", LOG_FILE, len(records))

if __name__ == "__main__":
    main()
```

</details>

---

## Summary

| Tool | Use for |
|------|---------|
| `argparse` | CLI argument parsing — named flags, types, defaults, help text |
| `logging` | Structured logs with levels — replace `print()` in production code |
| `datetime` | Date/time creation, formatting (`strftime`), parsing (`strptime`), arithmetic |

---

## ✅ Lesson Checklist

- [ ] Can build a CLI tool with `argparse` with positional, optional, and flag arguments
- [ ] Can configure `logging` with level, format, and file handler
- [ ] Can use `datetime.now()`, `strftime`, `strptime`, and `timedelta`
- [ ] Completed the Try It exercise

---

## ➡️ Next Lesson

→ [Lesson 03 — Testing with pytest](lesson_03.md)
