# Lesson 06 — TypeScript & the DOM

> **Course:** TypeScript Fundamentals · **Time:** 45 minutes
> **📖 Wiki:** [TypeScript — DOM](../../domains/web_dev/typescript.md#typescript-with-the-dom)
> **🔗 Official Docs:** [TS — DOM Manipulation](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html)

---

## 🎯 Learning Objectives

- [ ] Query DOM elements with correct HTML element types
- [ ] Narrow element types safely (generic overload vs type assertion)
- [ ] Type event handlers with specific event types
- [ ] Handle `null` from DOM queries without runtime crashes
- [ ] Create custom events with typed payloads

---

## 📖 Concepts

### The DOM Type Hierarchy

TypeScript ships with `lib.dom.d.ts` — a complete type declaration for every HTML element. The hierarchy is:

```text
EventTarget
  └── Node
        └── Element
              └── HTMLElement
                    ├── HTMLButtonElement  (has .disabled, .type)
                    ├── HTMLInputElement   (has .value, .checked, .files)
                    ├── HTMLSelectElement  (has .options, .selectedIndex)
                    ├── HTMLFormElement    (has .submit(), .reset(), .elements)
                    ├── HTMLImageElement   (has .src, .alt, .naturalWidth)
                    ├── HTMLAnchorElement  (has .href, .pathname)
                    └── HTMLTextAreaElement (has .value, .rows, .cols)
```

### Querying Elements Safely

```typescript
// querySelector returns Element | null — Element doesn't have input-specific properties
const rawInput = document.querySelector('#email');
// rawInput.value  // ❌ Error: Property 'value' does not exist on type 'Element | null'

// Option 1: Non-null assertion (!) + type assertion (as) — use when certain it exists
const input1 = document.querySelector('#email') as HTMLInputElement;
console.log(input1.value); // ✅

// Option 2: Generic querySelector (preferred — cleaner syntax)
const input2 = document.querySelector<HTMLInputElement>('#email');
if (input2) {
    console.log(input2.value); // ✅ narrowed to HTMLInputElement inside the if
}

// Option 3: getElementById returns HTMLElement | null (less specific)
const el = document.getElementById('email');
if (el instanceof HTMLInputElement) {
    console.log(el.value); // ✅ narrowed by instanceof
}

// querySelectorAll — returns NodeListOf<T>
const buttons = document.querySelectorAll<HTMLButtonElement>('button');
buttons.forEach(btn => {
    btn.disabled = true;  // ✅ TypeScript knows these are HTMLButtonElement
});
```

### Typed Event Handlers

```typescript
// Each event type has a specific interface with relevant properties
const btn = document.querySelector<HTMLButtonElement>('#submit-btn');

btn?.addEventListener('click', (event: MouseEvent) => {
    console.log(event.clientX, event.clientY);  // Mouse coordinates
    event.preventDefault();
});

const input = document.querySelector<HTMLInputElement>('#search');
input?.addEventListener('input', (event: Event) => {
    // InputEvent carries the typed value on event.target
    const target = event.target as HTMLInputElement;
    console.log(target.value);
});

// Form submit
const form = document.querySelector<HTMLFormElement>('#my-form');
form?.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();
    const data = new FormData(form);  // form is typed here
    console.log(data.get('email'));
});

// Keyboard events
document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeModal();
    if (event.ctrlKey && event.key === 's') saveDocument();
});
```

### Helper: Type-Safe DOM Query

Create a utility function to avoid repeating null checks:

```typescript
/**
 * Type-safe querySelector that throws if element is not found.
 * Use only when you're certain the element exists (e.g. in your own markup).
 */
function qs<T extends Element = HTMLElement>(
    selector: string,
    parent: Document | Element = document
): T {
    const el = parent.querySelector<T>(selector);
    if (!el) throw new Error(`Element not found: "${selector}"`);
    return el;
}

/**
 * Null-safe version — returns undefined instead of throwing.
 */
function qsMaybe<T extends Element = HTMLElement>(
    selector: string,
    parent: Document | Element = document
): T | undefined {
    return parent.querySelector<T>(selector) ?? undefined;
}

// Usage
const form      = qs<HTMLFormElement>('#registration-form');
const emailInput = qs<HTMLInputElement>('#email', form);  // scoped to the form
const optPanel  = qsMaybe<HTMLDivElement>('#optional-panel');
```

### Custom Events with Typed Payloads

```typescript
// Define the detail type
interface SearchEvent {
    query: string;
    results: number;
}

// Dispatch a custom event
function notifySearch(query: string, results: number): void {
    const event = new CustomEvent<SearchEvent>('app:search', {
        detail: { query, results },
        bubbles: true
    });
    document.dispatchEvent(event);
}

// Listen and use the typed detail
document.addEventListener('app:search', (event: Event) => {
    const { detail } = event as CustomEvent<SearchEvent>;
    console.log(`Query: "${detail.query}" → ${detail.results} results`);
});
```

---

## 🏗️ Assignments

### Assignment 1 — Typed Todo App (Vanilla TS)

Build a typed Todo application using only TypeScript + DOM APIs:
1. A `Todo` interface: `{ id: number; text: string; completed: boolean; createdAt: Date }`
2. State as `Todo[]`
3. Functions: `addTodo(text: string)`, `toggleTodo(id: number)`, `deleteTodo(id: number)`, `renderTodos()`
4. All DOM queries use the generic `querySelector<T>()` overload
5. Form submit handler is properly typed with `SubmitEvent`

This is the foundation for the capstone.

---

## ✅ Milestone Checklist

- [ ] I use `document.querySelector<HTMLInputElement>()` instead of type assertions
- [ ] My event handlers use specific event types (`MouseEvent`, `KeyboardEvent`, `SubmitEvent`)
- [ ] I handle `null` from DOM queries (either check or use the `qs()` helper)
- [ ] I built a working DOM component with full TypeScript typing

## ➡️ Next Unit

[Lesson 07 — Capstone: Typed Todo App](./lesson_07.md)
