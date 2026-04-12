# Lesson 04 — Generics

> **Course:** TypeScript Fundamentals · **Time:** 60 minutes
> **📖 Wiki:** [TypeScript — Generics](../../domains/web_dev/typescript.md#generics)
> **🔗 Official Docs:** [TS Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

---

## 🎯 Learning Objectives

- [ ] Explain what generics solve (reusability without losing types)
- [ ] Write generic functions, interfaces, and type aliases
- [ ] Constrain generic parameters with `extends`
- [ ] Use multiple type parameters
- [ ] Recognise generics in library APIs you use every day

---

## 📖 Concepts

### The Problem Generics Solve

Without generics, you either repeat code for each type or use `any` (and lose safety):

```typescript
// Without generics — must write separate functions per type
function firstString(arr: string[]): string | undefined { return arr[0]; }
function firstNumber(arr: number[]): number | undefined { return arr[0]; }

// With any — loses type information
function firstAny(arr: any[]): any { return arr[0]; }
const result = firstAny(["hello", "world"]);
result.toFixed(2);  // No error — but this WILL crash at runtime!
```

Generics let you write it once and keep type safety:

```typescript
// Generic function — T is a type parameter (a placeholder)
function first<T>(arr: T[]): T | undefined {
    return arr[0];
}

const s = first(["hello", "world"]);   // T inferred as string → returns string | undefined
const n = first([1, 2, 3]);            // T inferred as number → returns number | undefined
const b = first([true, false]);        // T inferred as boolean

s?.toUpperCase();  // ✅ TypeScript knows s is string | undefined
n?.toFixed(2);     // ✅ TypeScript knows n is number | undefined
```

### Generic Functions

```typescript
// Swap two values — works for any type
function swap<A, B>(a: A, b: B): [B, A] {
    return [b, a];
}
const [x, y] = swap("hello", 42);  // x: number, y: string

// Filter — typed predicate
function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
    return arr.filter(predicate);
}
const evens = filter([1, 2, 3, 4], n => n % 2 === 0);  // number[]

// Map — transform type
function map<TInput, TOutput>(arr: TInput[], transform: (item: TInput) => TOutput): TOutput[] {
    return arr.map(transform);
}
const lengths = map(["hello", "world"], s => s.length);  // number[]
```

### Generic Constraints — `extends`

Sometimes T needs to have certain properties. Use `extends` to add a minimum shape requirement.

```typescript
// T must have a .length property
function logLength<T extends { length: number }>(value: T): T {
    console.log(`Length: ${value.length}`);
    return value;
}

logLength("hello");       // ✅ string has .length
logLength([1, 2, 3]);     // ✅ array has .length
// logLength(42);          // ❌ Error — number has no .length

// T must have an id property (useful for generic data tables, lists)
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
const user = findById(users, 1);  // TS knows user is { id: number, name: string } | undefined

// Using keyof — T must have key K
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user2 = { id: 1, name: "Alice", email: "alice@example.com" };
const name = getProperty(user2, "name");      // type: string
const id   = getProperty(user2, "id");        // type: number
// getProperty(user2, "phone");  // ❌ Error — 'phone' is not a key of user2
```

### Generic Interfaces and Types

```typescript
// Generic interface — the response wrapper pattern
interface ApiResponse<TData> {
    data: TData;
    status: number;
    message: string;
    timestamp: string;
}

type UserListResponse = ApiResponse<User[]>;
type SingleUserResponse = ApiResponse<User>;

// Define once, infer types from use
async function fetchUsers(): Promise<ApiResponse<User[]>> {
    const res = await fetch('/api/users');
    return res.json();
}

const response = await fetchUsers();
response.data[0].name;  // ✅ TypeScript knows this is User

// Generic Stack
interface Stack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    readonly size: number;
}

class TypedStack<T> implements Stack<T> {
    private items: T[] = [];

    push(item: T): void           { this.items.push(item); }
    pop(): T | undefined          { return this.items.pop(); }
    peek(): T | undefined         { return this.items[this.items.length - 1]; }
    get size(): number            { return this.items.length; }
}

const numStack = new TypedStack<number>();
numStack.push(1);
numStack.push(2);
const top = numStack.pop();  // number | undefined
```

### Generics in Everyday APIs

You already use generics constantly — TypeScript's standard library is full of them:

```typescript
// Promise<T> — async operations with typed resolution
const userFetch: Promise<User> = fetch('/api/user').then(r => r.json());

// Array<T> — better than T[] for method chaining
const names: Array<string> = ["Alice", "Bob"];

// Map<K, V> — typed key-value store
const userMap: Map<number, User> = new Map();
userMap.set(1, { id: 1, name: "Alice", email: "a@ex.com", createdAt: new Date() });

// Set<T> — typed collection of unique values
const tagSet: Set<string> = new Set(["css", "html", "js"]);

// React.useState<T> — typed state (covered in React course)
// const [count, setCount] = useState<number>(0);
```

---

## 🏗️ Assignments

### Assignment 1 — Generic Utilities

Implement these generic utility functions:
1. `last<T>(arr: T[]): T | undefined` — returns the last element
2. `chunk<T>(arr: T[], size: number): T[][]` — splits an array into chunks
3. `groupBy<T, K extends string | number>(arr: T[], key: (item: T) => K): Record<K, T[]>` — groups items by a computed key
4. `pipe<T>(...fns: Array<(x: T) => T>): (x: T) => T` — compose functions left-to-right

### Assignment 2 — Generic Result Type

Implement a `Result<T, E = Error>` type that represents success or failure:
```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
```

Write a `safeParseJSON<T>(json: string): Result<T>` function that returns a typed Result.

---

## ✅ Milestone Checklist

- [ ] I can write a generic function with a type parameter `<T>`
- [ ] I constrained a generic with `extends` to require a minimum shape
- [ ] I wrote a generic interface
- [ ] I recognise `Promise<T>`, `Map<K, V>`, and `Array<T>` as generics I use daily

## ➡️ Next Unit

[Lesson 05 — Utility Types](./lesson_05.md)
