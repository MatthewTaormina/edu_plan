# Lesson 03 — Interfaces, Type Aliases & Unions

> **Course:** TypeScript Fundamentals · **Time:** 60 minutes
> **📖 Wiki:** [TypeScript — Objects and Interfaces](../../domains/web_dev/typescript.md#objects-and-interfaces)
> **🔗 Official Docs:** [TS Handbook — Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) · [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

---

## 🎯 Learning Objectives

- [ ] Define reusable object shapes with `interface`
- [ ] Extend and merge interfaces
- [ ] Write `type` aliases for any type
- [ ] Compose types with union (`|`) and intersection (`&`)
- [ ] Use discriminated unions for type-safe state
- [ ] Know when to use `interface` vs `type`

---

## 📖 Concepts

### Interfaces — Named Object Shapes

```typescript
// Basic interface
interface User {
    readonly id: number;    // readonly — cannot be changed after assignment
    name: string;
    email: string;
    role?: "admin" | "learner" | "educator";  // optional
    createdAt: Date;
}

// Creating a value that satisfies an interface
const user: User = {
    id: 1,
    name: "Alex",
    email: "alex@example.com",
    createdAt: new Date()
};

// user.id = 2;  // ❌ Error: Cannot assign to 'id' because it is a read-only property
```

### Interface Extension

```typescript
interface Animal {
    name: string;
    sound(): string;
}

interface Dog extends Animal {
    breed: string;
    fetch(): void;
}

const rex: Dog = {
    name: "Rex",
    breed: "Labrador",
    sound: () => "Woof!",
    fetch: () => console.log("Fetches the ball")
};

// Multiple extension
interface Pet extends Animal {
    owner: string;
}

interface ServiceDog extends Dog, Pet {
    trainedFor: string;
}
```

### Declaration Merging (Interface Only)

Interfaces with the same name in the same scope are automatically merged — useful for augmenting third-party types.

```typescript
interface Window {
    myCustomProperty: string;
}
// TypeScript merges this into the existing Window interface from the DOM typings
window.myCustomProperty = "hello";  // ✅ No error
```

### Type Aliases

A `type` alias can name any type expression — not just objects.

```typescript
// Primitive alias
type ID = string | number;
type Nullable<T> = T | null;

// Object type (similar to interface but cannot be extended with `extends`)
type Point = { x: number; y: number };
type Point3D = Point & { z: number };  // Intersection — combines both

// Function type
type EventHandler<T = Event> = (event: T) => void;
type Formatter = (value: unknown) => string;

// Readonly utility
type ReadonlyUser = Readonly<User>;

// Usage
const p: Point3D = { x: 1, y: 2, z: 3 };
```

### `interface` vs `type` — When to Use Which

| | `interface` | `type` |
|-|-------------|--------|
| Object shapes | ✅ Preferred | ✅ Works |
| Union types | ❌ Cannot | ✅ Only option |
| Intersection | via `extends` | via `&` |
| Declaration merging | ✅ Yes | ❌ No |
| Extending primitives | ❌ No | ✅ Yes |
| Computed properties | ❌ No | ✅ Yes |

**Rule of thumb:** Use `interface` for public-facing object shapes; use `type` for unions, intersections, and aliasing non-object types.

### Union Types

```typescript
// A value can be one type OR another
type StringOrNumber = string | number;

function format(value: StringOrNumber): string {
    if (typeof value === "string") {
        return value.trim();     // TypeScript knows it's string here
    }
    return value.toFixed(2);    // TypeScript knows it's number here
}

// Literal union — one of specific values
type Status     = "pending" | "active" | "completed" | "cancelled";
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Coin       = 1 | 5 | 10 | 25 | 50;

let currentStatus: Status = "active";
// currentStatus = "deleted";  // ❌ Not in the union
```

### Discriminated Unions — Type-Safe State Machines

The most powerful pattern in TypeScript. A shared `kind` or `status` field lets TypeScript narrow to the exact variant.

```typescript
// Discriminated union — each variant has a unique literal "tag"
type LoadingState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: User[] }
    | { status: "error"; error: string };

function renderState(state: LoadingState): string {
    switch (state.status) {
        case "idle":
            return "Start a search.";
        case "loading":
            return "Loading…";
        case "success":
            // TypeScript knows state.data exists only in this branch
            return `Found ${state.data.length} users.`;
        case "error":
            // TypeScript knows state.error exists only here
            return `Error: ${state.error}`;
    }
}
```

### Intersection Types

```typescript
// Intersection — must satisfy BOTH types simultaneously
type Timestamped = { createdAt: Date; updatedAt: Date };
type Identifiable = { id: number };
type BaseEntity = Identifiable & Timestamped;

type Product = BaseEntity & {
    name: string;
    price: number;
};

const product: Product = {
    id: 1,
    name: "Widget",
    price: 9.99,
    createdAt: new Date(),
    updatedAt: new Date()
};
```

---

## 🏗️ Assignments

### Assignment 1 — Model a Domain

Define interfaces for a blog application:
1. `Author` — id, name, email, bio (optional)
2. `Tag` — id, name, slug
3. `Post` — id, title, slug, content, author (Author type), tags (Tag[]), publishedAt (Date | null), status ("draft" | "published" | "archived")

Then write a function `getSummary(post: Post): string` that returns a one-line summary.

### Assignment 2 — Discriminated Union

Model a form field as a discriminated union:
- `type TextField = { kind: "text"; label: string; maxLength: number }`
- `type NumberField = { kind: "number"; label: string; min: number; max: number }`
- `type CheckboxField = { kind: "checkbox"; label: string; defaultChecked: boolean }`
- `type FormField = TextField | NumberField | CheckboxField`

Write a `renderField(field: FormField): string` function that returns different HTML for each kind.

---

## ✅ Milestone Checklist

- [ ] I can define an interface and extend it
- [ ] I know when to use `type` vs `interface`
- [ ] I wrote a discriminated union with a `switch` statement that TypeScript fully type-narrows
- [ ] I modelled a real-world domain with multiple related interfaces

## ➡️ Next Unit

[Lesson 04 — Generics](./lesson_04.md)
