import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lesson 02 — Primitive, Array, Tuple & Object Types

> **Course:** TypeScript Fundamentals · **Time:** 45 minutes
> **📖 Wiki:** [TypeScript — The Type System](../../domains/web_dev/typescript.md#the-type-system)
> **🔗 Official Docs:** [TS Handbook — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

---

## 🎯 Learning Objectives

- [ ] Annotate variables with primitive types
- [ ] Use type inference and know when to annotate explicitly
- [ ] Type arrays and use the `readonly` modifier
- [ ] Write typed tuples for fixed-structure data
- [ ] Type function parameters and return values

---

## 📖 Concepts

### Primitives and Type Inference

```typescript
// Explicit annotation (: Type)
const name: string    = "Alex";
const age:  number    = 28;
const active: boolean = true;

// Inferred — TypeScript figures it out from the initial value
// Prefer inference for local variables; annotate when it aids readability
const city = "London";   // inferred: string
const pi   = 3.14159;    // inferred: number
const tags = ["css", "html"]; // inferred: string[]

// `any` — the escape hatch — avoid it
let value: any = 42;  // disables type checking for this variable
value = "now a string";  // no error — any allows anything
value.whoops();          // no error — any is fully trust-the-developer mode
```

:::warning
`any` turns off TypeScript for that value. Every time you use `any`, you give up the safety TypeScript provides. Use `unknown` instead when you genuinely don't know the type.
:::

### `unknown` — The Safe Alternative to `any`

```typescript
// unknown — TypeScript forces you to check the type before using the value
function processInput(input: unknown): string {
    if (typeof input === "string") {
        return input.toUpperCase();  // ✅ TypeScript knows it's a string here
    }
    if (typeof input === "number") {
        return input.toFixed(2);     // ✅ TypeScript knows it's a number here
    }
    throw new Error("Unsupported input type");
}
```

### Functions

```typescript
// Parameter and return type annotations
function add(a: number, b: number): number {
    return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional parameters (? after the name)
function greet(name: string, greeting?: string): string {
    return `${greeting ?? "Hello"}, ${name}!`;
}

// Default values (no ? needed — TypeScript infers the type)
function createUser(name: string, role: string = "learner") {
    return { name, role };
}

// Rest parameters
function sum(...numbers: number[]): number {
    return numbers.reduce((acc, n) => acc + n, 0);
}

// void — function returns nothing
function log(message: string): void {
    console.log(message);
}

// never — function never returns (throws or infinite loops)
function fail(message: string): never {
    throw new Error(message);
}
```

### Arrays

```typescript
// Two equivalent syntaxes
const names: string[]     = ["Alice", "Bob"];
const scores: Array<number> = [95, 87, 100];

// Readonly arrays — cannot push/pop/splice
const config: readonly string[] = ["dev", "test", "prod"];
const ids: ReadonlyArray<number> = [1, 2, 3];
// config.push("staging"); // ❌ Error: push does not exist on readonly string[]

// Inferred from initial value
const flags = [true, false, true];  // inferred: boolean[]
```

### Tuples — Fixed-Length, Mixed-Type Arrays

```typescript
// A tuple specifies the type at each position
const point: [number, number]        = [10, 20];
const entry: [string, number]        = ["score", 95];
const rgb:   [number, number, number] = [255, 128, 0];

// Named tuple members (TypeScript 4.0+) — more readable
type Coordinate = [x: number, y: number, z: number];
const origin: Coordinate = [0, 0, 0];

// Destructuring works naturally
const [x, y] = point;
console.log(x, y); // 10 20

// Common use: multiple return values
function divMod(a: number, b: number): [quotient: number, remainder: number] {
    return [Math.floor(a / b), a % b];
}
const [quotient, remainder] = divMod(17, 5);  // [3, 2]
```

### Object Types

```typescript
// Inline object type — use for simple, one-off shapes
function formatAddress(address: { street: string; city: string; postcode: string }): string {
    return `${address.street}, ${address.city} ${address.postcode}`;
}

// Optional properties
function createProfile(data: { name: string; bio?: string; avatar?: string }) {
    return {
        name: data.name,
        bio: data.bio ?? "No bio provided.",
        avatar: data.avatar ?? "/default-avatar.png"
    };
}

// Nested object types
type Config = {
    server: {
        host: string;
        port: number;
    };
    database: {
        url: string;
        maxConnections: number;
    };
};
```

---

## 🏗️ Assignments

### Assignment 1 — Function Signatures

Type these five functions (make up sensible parameter/return types):
1. `getUserById(id)` — fetches a user by numeric ID, returns a user object with `id`, `name`, `email`
2. `formatPrice(amount, currency)` — formats a price like "$12.99", returns a string
3. `clamp(value, min, max)` — constraints a number to a range
4. `pickRandom(items)` — picks a random element from an array. Make it work for ANY array type.
5. `logEvent(event, metadata?)` — logs an event name with optional metadata object

### Assignment 2 — Tuple Usefulness

Write a function `parseCSVRow(row: string): [string, number, boolean]` that splits `"Alice,95,true"` and returns it as a typed tuple. Destructure the result and use all three values.

---

## ✅ Milestone Checklist

- [ ] I can annotate function parameters and return types
- [ ] I know when to let TypeScript infer vs when to annotate explicitly
- [ ] I used `readonly` on an array
- [ ] I wrote a tuple type with named members

## ➡️ Next Unit

[Lesson 03 — Interfaces, Type Aliases & Unions](./lesson_03.md)
