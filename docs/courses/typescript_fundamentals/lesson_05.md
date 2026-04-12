# Lesson 05 — Utility Types

> **Course:** TypeScript Fundamentals · **Time:** 45 minutes
> **📖 Wiki:** [TypeScript — Utility Types](../../domains/web_dev/typescript.md#utility-types)
> **🔗 Official Docs:** [TS Handbook — Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

---

## 🎯 Learning Objectives

- [ ] Use `Partial`, `Required`, `Readonly` to modify optionality
- [ ] Use `Pick` and `Omit` to create subsets of types
- [ ] Use `Record` for typed dictionaries
- [ ] Use `ReturnType`, `Parameters`, and `Awaited` to extract types from functions
- [ ] Use `NonNullable` and `Extract`/`Exclude` for union manipulation

---

## 📖 Concepts

### Source Type for All Examples

```typescript
interface Product {
    id:          number;
    name:        string;
    price:       number;
    description: string;
    inStock:     boolean;
    category:    string;
    imageUrl?:   string;   // optional
}
```

### Modifying Optionality

```typescript
// Partial<T> — all properties become optional
// Use for: update payloads (PATCH requests), partial form state
type ProductUpdate = Partial<Product>;
// { id?: number; name?: string; price?: number; ... }

function updateProduct(id: number, changes: Partial<Product>): Product {
    // Only the provided fields are updated
    return { ...existingProduct, ...changes };
}

// Required<T> — all properties become mandatory (even optional ones)
type StrictProduct = Required<Product>;
// imageUrl is now required (the ? is removed)

// Readonly<T> — all properties become readonly
const config: Readonly<Product> = { id: 1, name: "Widget", price: 9.99, description: "", inStock: true, category: "misc" };
// config.price = 5;  // ❌ Cannot assign to 'price' — it's readonly
```

### Selecting Properties

```typescript
// Pick<T, Keys> — keep only listed properties
type ProductCard = Pick<Product, "name" | "price" | "imageUrl">;
// { name: string; price: number; imageUrl?: string }

// Use for projection: different views of the same entity
type ProductListItem = Pick<Product, "id" | "name" | "price" | "inStock" | "category">;
type ProductDetail   = Pick<Product, "id" | "name" | "price" | "description" | "imageUrl">;

// Omit<T, Keys> — exclude listed properties
type PublicProduct    = Omit<Product, "id">;            // Remove internal ID
type ProductFormData  = Omit<Product, "id" | "inStock">; // Remove server-managed fields
```

### Record — Typed Dictionaries

```typescript
// Record<KeyType, ValueType>
type StatusMap  = Record<string, boolean>;
type UserLookup = Record<number, User>;  // number → User

// Typed feature flags
type FeatureName = "darkMode" | "betaDashboard" | "newEditor";
type FeatureFlags = Record<FeatureName, boolean>;

const flags: FeatureFlags = {
    darkMode:       true,
    betaDashboard:  false,
    newEditor:      true
};

// HTTP status code map
const statusMessages: Record<number, string> = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    404: "Not Found",
    500: "Internal Server Error"
};
```

### Extracting Types from Functions

```typescript
function createUser(name: string, role: "admin" | "learner") {
    return { id: Math.random(), name, role, createdAt: new Date() };
}

// ReturnType<T> — extract what a function returns
type CreatedUser = ReturnType<typeof createUser>;
// { id: number; name: string; role: "admin" | "learner"; createdAt: Date }

// Parameters<T> — extract parameters as a tuple
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, role: "admin" | "learner"]

// Useful: reuse the type without manually declaring it
function cloneUser(...args: Parameters<typeof createUser>): CreatedUser {
    return createUser(...args);  // correctly typed
}

// Awaited<T> — unwrap a Promise type
type UserPromise = Promise<User>;
type ResolvedUser = Awaited<UserPromise>;  // User (not Promise<User>)

async function fetchUser(): Promise<User> { /* ... */ return user; }
type FetchedUser = Awaited<ReturnType<typeof fetchUser>>;  // User
```

### Union Manipulation

```typescript
// NonNullable<T> — removes null and undefined from a union
type NullableString = string | null | undefined;
type DefiniteString = NonNullable<NullableString>;  // string

// Extract<T, U> — keep only types in T that are assignable to U
type Primitives = string | number | boolean | object | null;
type JustStrings = Extract<Primitives, string>;              // string
type StringOrNumber = Extract<Primitives, string | number>;  // string | number

// Exclude<T, U> — remove types from T that are assignable to U
type WithoutNull = Exclude<Primitives, null | object>;  // string | number | boolean
```

---

## 🏗️ Assignments

### Assignment 1 — API Design with Utility Types

Using the `Product` interface, create:
1. `CreateProductDto` — all fields except `id` (derived via `Omit`)
2. `UpdateProductDto` — same as above but all optional (`Partial<Omit<...>>`)
3. `ProductSummary` — just `id`, `name`, `price`, `inStock` (`Pick`)
4. `ProductCatalog` — a `Record` mapping product `id` (number) to `ProductSummary`

### Assignment 2 — Function Types

Given these functions, use `ReturnType` and `Parameters` to extract their types:
```typescript
async function searchUsers(query: string, page: number, limit: number): Promise<{ users: User[]; total: number }> { ... }
function createSlug(title: string, separator?: string): string { ... }
```

---

## ✅ Milestone Checklist

- [ ] I can apply `Partial`, `Pick`, and `Omit` to model DTO types
- [ ] I used `Record` for a typed dictionary
- [ ] I extracted a function's return type with `ReturnType<typeof fn>`
- [ ] I understand the difference between `Extract` and `Exclude`

## ➡️ Next Unit

[Lesson 06 — TypeScript & the DOM](./lesson_06.md)
