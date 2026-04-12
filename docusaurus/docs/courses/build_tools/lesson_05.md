# Lesson 05 — Testing Setup (Vitest + jsdom)

> **Course:** Build Tools & Toolchain · **Time:** 45 minutes
> **🔗 Official Docs:** [Vitest Docs](https://vitest.dev/guide/) · [Testing Library Docs](https://testing-library.com/)

---

## 🎯 Learning Objectives

- [ ] Explain unit, integration, and end-to-end tests and when to use each
- [ ] Configure Vitest in a Vite project
- [ ] Write and run unit tests with `describe`, `it`, and `expect`
- [ ] Test DOM interactions using jsdom and Testing Library

---

## 📖 Concepts

### The Testing Pyramid

```
            ╱ E2E ╲            Fewer, slower, more realistic
           ╱─────────╲        (Playwright, Cypress)
          ╱ Integration ╲
         ╱───────────────╲    Tests multiple units working together
        ╱    Unit Tests    ╲
       ╱─────────────────────╲ Many, fast, isolated
                                (Vitest, Jest)
```

- **Unit**: test a single function in isolation
- **Integration**: test multiple functions/components working together
- **E2E**: test the real browser (covered in React Advanced)

### Setting Up Vitest

```bash
npm install --save-dev vitest @vitest/ui jsdom @testing-library/dom
```

```typescript
// vite.config.ts — add test configuration
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        environment: 'jsdom',   // Simulate a browser DOM in Node
        globals: true,          // No need to import describe/it/expect
        setupFiles: ['./src/test-setup.ts'],
    }
});
```

```json
// package.json
{
    "scripts": {
        "test":        "vitest",
        "test:run":    "vitest run",    // Run once, no watch
        "test:ui":     "vitest --ui",   // Opens browser UI
        "test:cover":  "vitest run --coverage"
    }
}
```

### Writing Unit Tests

```typescript
// src/utils/math.ts
export function add(a: number, b: number): number { return a + b; }
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
```

```typescript
// src/utils/math.test.ts
import { describe, it, expect } from 'vitest';
import { add, clamp } from './math';

describe('add()', () => {
    it('returns the sum of two positive numbers', () => {
        expect(add(2, 3)).toBe(5);
    });

    it('handles negative numbers', () => {
        expect(add(-1, 1)).toBe(0);
    });
});

describe('clamp()', () => {
    it('returns the value when within range', () => {
        expect(clamp(5, 0, 10)).toBe(5);
    });

    it('returns the min when value is too low', () => {
        expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('returns the max when value is too high', () => {
        expect(clamp(15, 0, 10)).toBe(10);
    });
});
```

### Common Matchers

```typescript
// Equality
expect(result).toBe(42);          // Strict equality (===) — use for primitives
expect(result).toEqual({ a: 1 }); // Deep equality — use for objects/arrays

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(0.1 + 0.2).toBeCloseTo(0.3);  // Floating point equality
expect(result).toBeGreaterThan(5);
expect(result).toBeLessThanOrEqual(10);

// Strings
expect("Hello World").toContain("World");
expect("user@email.com").toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

// Arrays
expect([1, 2, 3]).toContain(2);
expect([1, 2, 3]).toHaveLength(3);

// Errors
expect(() => riskyFunction()).toThrow();
expect(() => riskyFunction()).toThrow('specific message');

// Async
await expect(fetchUser(1)).resolves.toEqual({ id: 1, name: 'Alex' });
await expect(fetchUser(-1)).rejects.toThrow('Not found');
```

### Testing DOM Interactions

```typescript
// src/counter.ts
export function createCounter(container: HTMLElement): void {
    let count = 0;
    const btn = document.createElement('button');
    btn.textContent = '0';
    btn.addEventListener('click', () => {
        count++;
        btn.textContent = String(count);
    });
    container.appendChild(btn);
}
```

```typescript
// src/counter.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createCounter } from './counter';

describe('createCounter()', () => {
    let container: HTMLElement;

    beforeEach(() => {
        // Fresh DOM for each test
        container = document.createElement('div');
        document.body.appendChild(container);
        createCounter(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it('renders a button with initial count 0', () => {
        const btn = container.querySelector('button');
        expect(btn).not.toBeNull();
        expect(btn!.textContent).toBe('0');
    });

    it('increments the count on click', () => {
        const btn = container.querySelector('button')!;
        btn.click();
        btn.click();
        expect(btn.textContent).toBe('2');
    });
});
```

---

## ✅ Milestone Checklist

- [ ] Vitest is configured in my Vite project with jsdom environment
- [ ] I can write a test using `describe`, `it`, and `expect`
- [ ] I understand the testing pyramid and when to use each level
- [ ] I tested a DOM interaction (button click)

## 🏆 Build Tools Complete!

You now have a professional development environment. Every subsequent course will build on this toolchain.

## ➡️ Next Course

Choose your next course:
- [Tailwind CSS](../tailwind_css/index.md) — if you want to focus on UI
- [TypeScript Fundamentals](../typescript_fundamentals/index.md) — if you want to go to React or Angular
