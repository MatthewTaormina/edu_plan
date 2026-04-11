# Lesson 05 — Capstone: Task Management System

**Course:** Python: OOP · **Lesson:** 5 of 5 · **Time:** ~90 minutes

← [Lesson 04](lesson_04.md) · [Course Index](index.md)

---

## What You're Building

A command-line **task management system** using object-oriented design.

```
python tasks.py add "Write unit tests" --priority high --tags dev,testing
python tasks.py list
python tasks.py list --filter pending
python tasks.py complete 1
python tasks.py delete 1
```

This capstone applies everything from this course:
- Classes and objects (Lesson 01)
- Inheritance and composition (Lesson 02)
- Dunder methods (Lesson 03)
- Dataclasses (Lesson 04)
- File persistence from [Python: Data and Files — Lesson 04](../python_data_and_files/lesson_04.md)

---

## Domain Model

```
TaskStatus     — enum of valid states (pending, in_progress, done)
Task           — dataclass with title, priority, status, tags, dates
TaskList       — class that holds tasks, provides add/complete/delete/filter
TaskStore      — handles JSON persistence (composition)
TaskCLI        — argparse-based entry point
```

---

## Step 1 — Status and Priority Enums (`models.py`)

```python
# models.py
from dataclasses import dataclass, field, asdict
from datetime import datetime
from enum import Enum
from typing import Optional

class Priority(str, Enum):
    LOW    = "low"
    MEDIUM = "medium"
    HIGH   = "high"

class Status(str, Enum):
    PENDING     = "pending"
    IN_PROGRESS = "in_progress"
    DONE        = "done"

@dataclass
class Task:
    id: int
    title: str
    priority: Priority = Priority.MEDIUM
    status: Status = Status.PENDING
    tags: list[str] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    completed_at: Optional[str] = None

    def complete(self) -> None:
        self.status = Status.DONE
        self.completed_at = datetime.now().isoformat()

    def to_dict(self) -> dict:
        d = asdict(self)
        d["priority"] = self.priority.value
        d["status"] = self.status.value
        return d

    @classmethod
    def from_dict(cls, data: dict) -> "Task":
        data["priority"] = Priority(data["priority"])
        data["status"] = Status(data["status"])
        return cls(**data)

    def __str__(self) -> str:
        tag_str = f" [{', '.join(self.tags)}]" if self.tags else ""
        status_icon = {"pending": "○", "in_progress": "◐", "done": "●"}[self.status.value]
        return f"{status_icon} [{self.id:3}] {self.title}{tag_str} ({self.priority.value})"
```

---

## Step 2 — Task List (`task_list.py`)

```python
# task_list.py
from typing import Optional
from models import Task, Status, Priority

class TaskList:
    def __init__(self):
        self._tasks: list[Task] = []
        self._next_id: int = 1

    def _load(self, tasks: list[Task], next_id: int) -> None:
        """Used by TaskStore to set initial state."""
        self._tasks = tasks
        self._next_id = next_id

    def add(self, title: str, priority: Priority = Priority.MEDIUM,
            tags: list[str] | None = None) -> Task:
        task = Task(id=self._next_id, title=title, priority=priority,
                    tags=tags or [])
        self._tasks.append(task)
        self._next_id += 1
        return task

    def get(self, task_id: int) -> Optional[Task]:
        return next((t for t in self._tasks if t.id == task_id), None)

    def complete(self, task_id: int) -> Task:
        task = self.get(task_id)
        if task is None:
            raise KeyError(f"Task {task_id} not found")
        task.complete()
        return task

    def delete(self, task_id: int) -> Task:
        task = self.get(task_id)
        if task is None:
            raise KeyError(f"Task {task_id} not found")
        self._tasks.remove(task)
        return task

    def filter(self, status: Optional[Status] = None,
               priority: Optional[Priority] = None) -> list[Task]:
        result = self._tasks
        if status:
            result = [t for t in result if t.status == status]
        if priority:
            result = [t for t in result if t.priority == priority]
        return result

    def all_tasks(self) -> list[Task]:
        return list(self._tasks)

    def __len__(self) -> int:
        return len(self._tasks)
```

---

## Step 3 — Persistence (`store.py`)

```python
# store.py
import json
from pathlib import Path
from models import Task
from task_list import TaskList

STORE_FILE = Path("tasks.json")

class TaskStore:
    def load(self, task_list: TaskList) -> None:
        if not STORE_FILE.exists():
            return
        data = json.loads(STORE_FILE.read_text(encoding="utf-8"))
        tasks = [Task.from_dict(t) for t in data.get("tasks", [])]
        next_id = data.get("next_id", 1)
        task_list._load(tasks, next_id)

    def save(self, task_list: TaskList) -> None:
        data = {
            "tasks": [t.to_dict() for t in task_list.all_tasks()],
            "next_id": task_list._next_id,
        }
        STORE_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")
```

---

## Step 4 — CLI Entry Point (`tasks.py`)

```python
# tasks.py
import argparse
import sys
from models import Priority, Status
from task_list import TaskList
from store import TaskStore

def main() -> None:
    store = TaskStore()
    tasks = TaskList()
    store.load(tasks)

    parser = argparse.ArgumentParser(description="Task manager")
    sub = parser.add_subparsers(dest="command", required=True)

    # add
    p_add = sub.add_parser("add")
    p_add.add_argument("title")
    p_add.add_argument("--priority", choices=["low", "medium", "high"], default="medium")
    p_add.add_argument("--tags", default="")

    # list
    p_list = sub.add_parser("list")
    p_list.add_argument("--filter", dest="status",
                        choices=["pending", "in_progress", "done"])

    # complete
    p_done = sub.add_parser("complete")
    p_done.add_argument("id", type=int)

    # delete
    p_del = sub.add_parser("delete")
    p_del.add_argument("id", type=int)

    args = parser.parse_args()

    if args.command == "add":
        tags = [t.strip() for t in args.tags.split(",") if t.strip()]
        task = tasks.add(args.title, Priority(args.priority), tags)
        store.save(tasks)
        print(f"Added: {task}")

    elif args.command == "list":
        status = Status(args.status) if args.status else None
        results = tasks.filter(status=status)
        if not results:
            print("No tasks.")
        for task in results:
            print(task)

    elif args.command == "complete":
        try:
            task = tasks.complete(args.id)
            store.save(tasks)
            print(f"Completed: {task}")
        except KeyError as e:
            print(f"Error: {e}")
            sys.exit(1)

    elif args.command == "delete":
        try:
            task = tasks.delete(args.id)
            store.save(tasks)
            print(f"Deleted: {task}")
        except KeyError as e:
            print(f"Error: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
```

---

## Step 5 — Run It

```bash
python tasks.py add "Write unit tests" --priority high --tags dev,testing
python tasks.py add "Read Python docs" --priority low
python tasks.py list
# ○ [  1] Write unit tests [dev, testing] (high)
# ○ [  2] Read Python docs (low)

python tasks.py complete 1
python tasks.py list --filter done
# ● [  1] Write unit tests [dev, testing] (high)
```

---

## ✨ Extension Challenges

1. **Edit** — add an `edit` command to change the title or priority
2. **Due dates** — add an optional `due_date` field and warn on overdue tasks
3. **Tags filter** — add `--tag` filter to `list`
4. **Export** — add `export --format csv`

---

## ✅ Course Complete!

You've finished **Python: OOP**. You can now:

- Model domains with classes, inheritance, and composition
- Use ABCs to enforce interfaces
- Implement dunder methods to integrate with Python's built-in behaviours
- Use dataclasses to reduce boilerplate on data-holding classes
- Build a multi-module OOP application

**Next steps:**

- → [Python: Professional Tools](../python_professional/index.md) — add tests, logging, packaging
- → [Python Developer Path](../../paths/python_developer.md) — the full sequence
