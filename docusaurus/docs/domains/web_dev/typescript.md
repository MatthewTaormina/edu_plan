import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TypeScript

> **Tool:** TypeScript · **Introduced:** 2012 · **Latest:** 5.x (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern

TypeScript is a **typed superset of JavaScript** maintained by Microsoft. It compiles to plain JavaScript and adds a static type system that catches errors before runtime, enables better IDE tooling, and makes large codebases maintainable.

> **Prerequisite:** [JavaScript Core](./javascript_core.md)
> **Course:** [TypeScript Fundamentals](../../courses/typescript_fundamentals/index.md)

---

## Why TypeScript?

JavaScript is dynamically typed — the type of a variable is determined at runtime. This allows rapid prototyping but causes entire categories of bugs that only surface when real users hit them.

TypeScript adds types *at authoring time*:

```typescript
// JavaScript — no error until runtime
function greet(user) {
    return "Hello, " + user.nme; // Typo! .nme instead of .name
}

// TypeScript — error at compile time, before you ship
function greet(user: { name: string }): string {
    return "Hello, " + user.nme; // TS Error: Property 'nme' does not exist
}
```

---

## Setup

```bash
# Install TypeScript locally in a project
npm install --save-dev typescript

# Initialise a tsconfig.json
npx tsc --init

# Compile a single file
npx tsc main.ts

# Watch mode (recompile on save)
npx tsc --watch
```

### `tsconfig.json` — Key Options

```json
{
  "compilerOptions": {
    "target": "ES2022",         // Compile to which JS version
    "module": "ESNext",         // Module system (ESNext for Vite/bundlers)
    "moduleResolution": "bundler", // How imports are resolved
    "strict": true,             // Enable ALL strict checks (always do this)
    "noUncheckedIndexedAccess": true, // arr[0] is T | undefined, not T
    "outDir": "./dist",         // Where compiled JS goes
    "rootDir": "./src",         // Where TypeScript source lives
    "declaration": true,        // Emit .d.ts declaration files
    "skipLibCheck": true        // Skip type-checking node_modules (faster)
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## The Type System

### Primitive Types

```typescript
// Explicit type annotations (often optional — TS infers from the value)
const name: string    = "Alex";
const age: number     = 28;
const active: boolean = true;
const nothing: null   = null;
const missing: undefined = undefined;

// Type inference — TS figures it out (prefer this for locals)
const city = "London";  // inferred as string
const pi   = 3.14;      // inferred as number
```

### Arrays and Tuples

```typescript
// Arrays
const tags: string[]       = ["html", "css", "js"];
const scores: number[]     = [95, 87, 100];
const flags: Array<boolean> = [true, false];  // Generic form

// Tuples — fixed-length array where each position has a known type
const point: [number, number]  = [10, 20];  // 2D coordinate
const entry: [string, number]  = ["age", 28];

// Named tuple members (TypeScript 4.0+)
type Coordinate = [x: number, y: number, z: number];
const origin: Coordinate = [0, 0, 0];
```

### Objects and Interfaces

```typescript
// Inline object type
function greetUser(user: { name: string; age: number }): string {
    return `Hello ${user.name}, you are ${user.age}.`;
}

// Interface — reusable named object shape (preferred for public APIs)
interface User {
    readonly id: number;    // Can't be changed after creation
    name: string;
    email: string;
    role?: "admin" | "learner"; // Optional property (? = may be undefined)
    createdAt: Date;
}

// Using the interface
const user: User = {
    id: 1,
    name: "Alex",
    email: "alex@example.com",
    createdAt: new Date()
};

// Interfaces can extend other interfaces
interface AdminUser extends User {
    permissions: string[];
}
```

### Type Aliases

```typescript
// Type alias — like an interface but more flexible (can alias any type)
type ID = string | number;  // Union type — can be one OR the other
type Nullable<T> = T | null;
type Callback = (error: Error | null, result: string) => void;

// Use type for: primitives, unions, intersections, function signatures
// Use interface for: object shapes (especially if they'll be extended)
type Point = { x: number; y: number };
type Point3D = Point & { z: number };  // Intersection — combines both

const p: Point3D = { x: 1, y: 2, z: 3 };
```

### Union and Literal Types

```typescript
// Union — one of several types
type StringOrNumber = string | number;

// Literal types — a specific value, not just the type
type Direction = "north" | "south" | "east" | "west";
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;

let heading: Direction = "north"; // OK
// heading = "up";  // ❌ Error: '"up"' is not assignable to type 'Direction'

// Discriminated unions — pattern for type-safe state machines
type Result<T> =
    | { status: "success"; data: T }
    | { status: "error"; error: string };

function handleResult(result: Result<User>): void {
    if (result.status === "success") {
        console.log(result.data.name); // TS knows result.data exists here
    } else {
        console.error(result.error);   // TS knows result.error exists here
    }
}
```

---

## Generics

Generics make components reusable across types without losing type safety.

```typescript
// Without generics — only works for one type
function identityString(arg: string): string { return arg; }

// With generics — works for ANY type, still fully typed
function identity<T>(arg: T): T { return arg; }

const s = identity("hello"); // T inferred as string => returns string
const n = identity(42);      // T inferred as number => returns number

// Generic interfaces
interface ApiResponse<TData> {
    data: TData;
    status: number;
    message: string;
}

type UserResponse    = ApiResponse<User>;
type ProductResponse = ApiResponse<{ id: number; name: string }>;

// Generic constraints — T must have a .length property
function logLength<T extends { length: number }>(value: T): T {
    console.log(`Length: ${value.length}`);
    return value;
}

logLength("hello");      // OK — strings have .length
logLength([1, 2, 3]);    // OK — arrays have .length
// logLength(42);        // ❌ Error — numbers don't have .length
```

---

## Utility Types

TypeScript ships with built-in generic types that transform existing types.

```typescript
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    inStock: boolean;
}

// Partial<T> — all properties become optional (useful for update payloads)
type ProductUpdate = Partial<Product>;
// { id?: number; name?: string; price?: number; ... }

// Required<T> — all properties become mandatory
type StrictProduct = Required<Product>;

// Pick<T, K> — select specific properties
type ProductCard = Pick<Product, "name" | "price" | "inStock">;
// { name: string; price: number; inStock: boolean }

// Omit<T, K> — exclude specific properties
type PublicProduct = Omit<Product, "id">;

// Record<K, V> — object with keys K and values V
type StatusMap = Record<string, boolean>;
const featureFlags: StatusMap = { darkMode: true, newDashboard: false };

// Readonly<T> — all properties become readonly
const config: Readonly<Product> = { id: 1, name: "Item", price: 9.99, description: "", inStock: true };
// config.price = 5;  // ❌ Cannot assign to 'price' because it is a read-only property

// ReturnType<T> — extract the return type of a function
function getUser() { return { id: 1, name: "Alex" }; }
type UserType = ReturnType<typeof getUser>;  // { id: number; name: string }

// Parameters<T> — extract the parameter types of a function as a tuple
type GreetParams = Parameters<typeof greetUser>; // [user: { name: string; age: number }]
```

---

## TypeScript with the DOM

```typescript
// querySelector returns Element | null — you must narrow the type
const input = document.querySelector('#email');
// input.value  // ❌ Error: Property 'value' does not exist on type 'Element'

// Option 1: Type assertion (you tell TS what it is)
const input1 = document.querySelector('#email') as HTMLInputElement;
console.log(input1.value); // ✅

// Option 2: Generic overload (preferred — safer)
const input2 = document.querySelector<HTMLInputElement>('#email');
if (input2) {
    console.log(input2.value); // ✅ TS knows it's HTMLInputElement
}

// Event handlers
const btn = document.querySelector<HTMLButtonElement>('#submit-btn');
btn?.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLButtonElement;
    console.log(target.textContent);
});

// Custom event types
interface SearchEvent extends CustomEvent {
    detail: { query: string; filters: string[] };
}
```

---

## Enums

```typescript
// Numeric enum (auto-increments from 0)
enum Direction {
    Up,    // 0
    Down,  // 1
    Left,  // 2
    Right  // 3
}

// String enum (preferred — clearer in logs and serialisation)
enum Status {
    Pending  = "PENDING",
    Active   = "ACTIVE",
    Inactive = "INACTIVE"
}

// Const enum — erased at compile time (no runtime object created)
const enum HttpMethod {
    GET    = "GET",
    POST   = "POST",
    PUT    = "PUT",
    DELETE = "DELETE"
}
```

> [!TIP]
> Prefer string literal union types over enums for simple cases:
> `type Status = "PENDING" | "ACTIVE" | "INACTIVE"`. They're lighter, don't require
> imports, and work well with JSON APIs.

---

## Declaration Files (`.d.ts`)

Declaration files describe the types of a JavaScript library without shipping TypeScript source.

```typescript
// my-util.d.ts — types for a JS module that has no built-in types
declare module 'my-utility' {
    export function clamp(value: number, min: number, max: number): number;
    export const VERSION: string;
}
```

Most popular libraries ship types via `@types/` packages on npm:
```bash
npm install --save-dev @types/node @types/react
```

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary">

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — the authoritative reference
- [TypeScript Playground](https://www.typescriptlang.org/play) — run TS in the browser


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- [Total TypeScript Free Tutorials](https://www.totaltypescript.com/tutorials) — Matt Pocock, extremely practical
- [Type Challenges](https://github.com/type-challenges/type-challenges) — exercises for mastering the type system


</TabItem>
</Tabs>