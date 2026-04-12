# Lesson 01 — Why TypeScript & Setup

> **Course:** TypeScript Fundamentals · **Time:** 45 minutes
> **📖 Wiki:** [TypeScript Reference](../../domains/web_dev/typescript.md)
> **🔗 Official Docs:** [TypeScript — Getting Started](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html) · [tsconfig Reference](https://www.typescriptlang.org/tsconfig)

---

## 🎯 Learning Objectives

- [ ] Explain what TypeScript adds over JavaScript
- [ ] Set up a TypeScript project with `tsc` and `tsconfig.json`
- [ ] Enable `strict` mode and understand what it guards against
- [ ] Run TypeScript in watch mode
- [ ] Use TypeScript with Vite

---

## 📖 Concepts

### What TypeScript Adds

TypeScript adds a **type layer** on top of JavaScript. This type layer only exists at development time — the compiled output is plain JavaScript that any browser or Node.js runtime can execute.

```typescript
// Without TypeScript — bug is silent until runtime
function getFullName(user) {
    return user.firstName + ' ' + user.familyName; // Typo: should be lastName
}

// With TypeScript — error flagged immediately by your editor
interface User {
    firstName: string;
    lastName: string;
}

function getFullName(user: User): string {
    return user.firstName + ' ' + user.familyName; // ❌ Error: 'familyName' does not exist
}
```

**Benefits:**
- **Catch bugs before running the code** — the most valuable benefit
- **IDE autocomplete and refactoring** — editors know what properties exist
- **Self-documenting code** — function signatures describe what they need and return
- **Safer refactoring** — renaming a property gives errors everywhere it's used

### Installation and Setup

```bash
# Create a new project
mkdir ts-project
cd ts-project
npm init -y
npm install --save-dev typescript

# Generate tsconfig.json
npx tsc --init
```

### `tsconfig.json` — The Configuration File

```json
{
    "compilerOptions": {
        // --- Target ---
        "target": "ES2022",          // Which JS features to compile down to
        "module": "ESNext",          // Module system (ESNext = keep import/export)
        "moduleResolution": "bundler",// How imports resolve (use "bundler" with Vite)

        // --- strictness ---
        "strict": true,              // Enable ALL strict checks — ALWAYS DO THIS
        "noUncheckedIndexedAccess": true, // arr[0] is T | undefined

        // --- Output ---
        "outDir": "./dist",          // Compiled JS goes here
        "rootDir": "./src",          // Source TypeScript lives here

        // --- Quality of life ---
        "declaration": true,         // Generate .d.ts files
        "sourceMap": true,           // Source maps for debugging
        "skipLibCheck": true,        // Skip type-checking node_modules (faster)
        "esModuleInterop": true      // Better CommonJS interop
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

### What `strict: true` Enables

```typescript
// strict: true enables all of these:

// 1. strictNullChecks — null and undefined are not assignable to other types
let name: string = null;       // ❌ Error without strict
let name2: string | null = null; // ✅ Explicit

// 2. noImplicitAny — variables/params must have a type
function process(data) { ... }  // ❌ Error: 'data' has implicit 'any' type

// 3. strictFunctionTypes — function parameter types are checked properly
// 4. strictPropertyInitialization — class properties must be initialised
// ...and several more guards
```

### Compilation

```bash
# Compile once
npx tsc

# Watch mode — recompile on save
npx tsc --watch

# Type-check without emitting JS (faster, for CI)
npx tsc --noEmit
```

### TypeScript with Vite

Vite handles TypeScript natively — no separate `tsc` compilation step needed in development.

```bash
npm create vite@latest my-ts-app -- --template vanilla-ts
cd my-ts-app
npm install
npm run dev
```

Vite uses esbuild to strip types (transpile-only, very fast). For type *checking*, run `tsc --noEmit` separately (usually in CI):

```json
{
    "scripts": {
        "dev":        "vite",
        "build":      "tsc --noEmit && vite build",
        "typecheck":  "tsc --noEmit"
    }
}
```

---

## 🏗️ Assignments

### Assignment 1 — First TypeScript File

1. Create a Vite project with `--template vanilla-ts`.
2. Open `src/main.ts` and add a function `greet(name: string): string` that returns `"Hello, {name}!"`.
3. Deliberately introduce a type error (pass a number where a string is expected).
4. Verify the error shows in your editor and on `npm run build`.

### Assignment 2 — tsconfig Exploration

Open the generated `tsconfig.json`. It has comments explaining each option. Read through and identify which options relate to: (a) output target, (b) strictness, (c) module resolution.

---

## ✅ Milestone Checklist

- [ ] I understand what TypeScript compiles to
- [ ] My `tsconfig.json` has `"strict": true`
- [ ] I can run `tsc --noEmit` to type-check without generating output
- [ ] I have a working Vite + TypeScript project

## ➡️ Next Unit

[Lesson 02 — Primitive, Array, Tuple & Object Types](./lesson_02.md)
