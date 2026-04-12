# Lesson 07 — Capstone: Typed Todo App

> **Course:** TypeScript Fundamentals · **Time:** 90–120 minutes
> **📖 Wiki:** [TypeScript Reference](../../domains/web_dev/typescript.md)
> **🔗 Official Docs:** [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 🎯 Learning Objectives

- [ ] Apply all TypeScript concepts (types, interfaces, generics, utility types) in a real app
- [ ] Separate concerns using typed modules
- [ ] Implement a typed localStorage persistence layer
- [ ] Build a component-like rendering pattern in vanilla TypeScript

---

## 📖 Project Overview

Build a **feature-complete, fully typed Todo application** with:
- Add, complete, and delete todos
- Filter by All / Active / Completed
- Persist todos to localStorage
- Live item count
- Keyboard shortcuts (Enter to add, Escape to clear input)

---

## Types and Data Model

```typescript
// src/types.ts

export interface Todo {
    readonly id:  number;
    text:         string;
    completed:    boolean;
    readonly createdAt: Date;
}

export type FilterMode = "all" | "active" | "completed";

export interface AppState {
    todos:      Todo[];
    filter:     FilterMode;
    nextId:     number;
}
```

## Storage Layer

```typescript
// src/storage.ts
import type { AppState } from './types';

const STORAGE_KEY = 'typed-todo-app';

const DEFAULT_STATE: AppState = {
    todos:  [],
    filter: "all",
    nextId: 1
};

export function loadState(): AppState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULT_STATE };
        const parsed = JSON.parse(raw) as AppState;
        // Dates are serialised as strings — re-hydrate them
        parsed.todos = parsed.todos.map(todo => ({
            ...todo,
            createdAt: new Date(todo.createdAt)
        }));
        return parsed;
    } catch {
        return { ...DEFAULT_STATE };
    }
}

export function saveState(state: AppState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
```

## State Management

```typescript
// src/state.ts
import type { AppState, FilterMode, Todo } from './types';
import { loadState, saveState } from './storage';

let state: AppState = loadState();

function commit(update: Partial<AppState>): void {
    state = { ...state, ...update };
    saveState(state);
}

export function getState(): Readonly<AppState> {
    return state;
}

export function addTodo(text: string): void {
    const newTodo: Todo = {
        id:        state.nextId,
        text:      text.trim(),
        completed: false,
        createdAt: new Date()
    };
    commit({ todos: [...state.todos, newTodo], nextId: state.nextId + 1 });
}

export function toggleTodo(id: number): void {
    commit({
        todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
    });
}

export function deleteTodo(id: number): void {
    commit({ todos: state.todos.filter(todo => todo.id !== id) });
}

export function clearCompleted(): void {
    commit({ todos: state.todos.filter(todo => !todo.completed) });
}

export function setFilter(filter: FilterMode): void {
    commit({ filter });
}

export function getVisibleTodos(): Todo[] {
    const { todos, filter } = state;
    switch (filter) {
        case "active":    return todos.filter(t => !t.completed);
        case "completed": return todos.filter(t => t.completed);
        default:          return todos;
    }
}

export function getRemainingCount(): number {
    return state.todos.filter(t => !t.completed).length;
}
```

## Rendering

```typescript
// src/render.ts
import type { Todo, FilterMode } from './types';
import { getState, getVisibleTodos, getRemainingCount } from './state';

// Type-safe DOM helper
function qs<T extends Element>(selector: string, parent: Document | Element = document): T {
    const el = parent.querySelector<T>(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);
    return el;
}

// DOM refs — initialise once
const todoList      = qs<HTMLUListElement>('#todo-list');
const itemCount     = qs<HTMLSpanElement>('#item-count');
const filterButtons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
const clearBtn      = qs<HTMLButtonElement>('#clear-completed');

function createTodoElement(todo: Todo): HTMLLIElement {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' todo-item--done' : ''}`;
    li.dataset.id = String(todo.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.id = `todo-${todo.id}`;
    checkbox.className = 'todo-item__check';
    checkbox.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`);

    const label = document.createElement('label');
    label.htmlFor = `todo-${todo.id}`;
    label.textContent = todo.text;
    label.className = 'todo-item__text';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = '✕';
    deleteBtn.className = 'todo-item__delete';
    deleteBtn.setAttribute('aria-label', `Delete "${todo.text}"`);

    li.append(checkbox, label, deleteBtn);
    return li;
}

export function render(): void {
    const todos  = getVisibleTodos();
    const { filter } = getState();

    // Render list
    todoList.replaceChildren(
        ...todos.map(createTodoElement)
    );

    // Update count
    const remaining = getRemainingCount();
    itemCount.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;

    // Update active filter button
    filterButtons.forEach(btn => {
        btn.classList.toggle('filter-btn--active', btn.dataset.filter === filter);
        btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter));
    });

    // Show/hide clear button
    const hasCompleted = getState().todos.some(t => t.completed);
    clearBtn.hidden = !hasCompleted;
}
```

## Main Entrypoint

```typescript
// src/main.ts
import { addTodo, toggleTodo, deleteTodo, clearCompleted, setFilter } from './state';
import type { FilterMode } from './types';
import { render } from './render';

function qs<T extends Element>(selector: string): T {
    const el = document.querySelector<T>(selector);
    if (!el) throw new Error(`Not found: ${selector}`);
    return el;
}

const form      = qs<HTMLFormElement>('#todo-form');
const input     = qs<HTMLInputElement>('#todo-input');
const todoList  = qs<HTMLUListElement>('#todo-list');
const clearBtn  = qs<HTMLButtonElement>('#clear-completed');

// Add todo on form submit
form.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTodo(text);
    input.value = '';
    render();
});

// Keyboard shortcuts
input.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        input.value = '';
        input.blur();
    }
});

// Event delegation on list — handle checkbox + delete
todoList.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const li = target.closest<HTMLLIElement>('.todo-item');
    if (!li || !li.dataset.id) return;

    const id = Number(li.dataset.id);

    if (target.closest('.todo-item__delete')) {
        deleteTodo(id);
        render();
    }
});

todoList.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.matches('.todo-item__check')) return;
    const li = target.closest<HTMLLIElement>('.todo-item')!;
    toggleTodo(Number(li.dataset.id));
    render();
});

// Filter buttons
document.addEventListener('click', (event: MouseEvent) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (!btn?.dataset.filter) return;
    setFilter(btn.dataset.filter as FilterMode);
    render();
});

// Clear completed
clearBtn.addEventListener('click', () => {
    clearCompleted();
    render();
});

// Initial render
render();
```

---

## 🏗️ Extension Assignments

1. Add **drag-to-reorder** — reorder todos by dragging them.
2. Add an **edit-in-place** feature — double-click a todo text to edit it.
3. Add **due dates** — extend the `Todo` interface with `dueDate?: Date` and highlight overdue items.

---

## ✅ Milestone Checklist

- [ ] My entire app has zero TypeScript errors (`tsc --noEmit` passes)
- [ ] State is strictly typed — no `any`
- [ ] DOM queries use generic `querySelector<T>()` or a typed helper
- [ ] The storage layer re-hydrates `Date` objects correctly
- [ ] All three filter modes work correctly

## 🏆 TypeScript Fundamentals Complete!

You're ready for React — which is essentially TypeScript-first.

## ➡️ Next Course

[React Fundamentals](../react_fundamentals/index.md)
