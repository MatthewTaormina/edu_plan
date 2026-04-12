# Lesson 03 — Data Binding & Signals

> **Course:** Angular Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Signals](https://angular.dev/guide/signals) · [Computed Signals](https://angular.dev/guide/signals#computed-signals)

---

## 🎯 Learning Objectives

- [ ] Use Angular Signals for reactive state (`signal`, `computed`, `effect`)
- [ ] Explain how Signals differ from zone-based change detection
- [ ] Use `input()` and `output()` as the modern alternative to `@Input`/`@Output`
- [ ] Use two-way binding with `model()`

---

## 📖 Concepts

### Angular's Change Detection History

**Zone.js (Angular 1–16):** Angular patched every browser API (setTimeout, fetch, click events). Any async call triggered a full component tree re-render check. Simple but overcautious.

**Signals (Angular 17+):** Fine-grained reactivity. A Signal is a reactive cell — when it changes, only the components that *read* it re-render. No zones, no full-tree traversal.

### Signals API

```typescript
import { Component, signal, computed, effect, OnInit } from '@angular/core';

@Component({
    selector:   'app-counter',
    standalone: true,
    template: `
        <div>
            <p>Count: {{ count() }}</p>        <!-- Call signal like a function to read -->
            <p>Double: {{ doubled() }}</p>      <!-- computed reads automatically -->
            <button (click)="increment()">+</button>
            <button (click)="decrement()">-</button>
            <button (click)="reset()">Reset</button>
        </div>
    `
})
export class CounterComponent implements OnInit {
    // signal(initialValue) — writable reactive value
    count   = signal(0);

    // computed(() => ...) — derives a value from other signals
    doubled = computed(() => this.count() * 2);
    isNeg   = computed(() => this.count() < 0);

    // effect(() => ...) — runs whenever any signal it reads changes
    // (like a computed but for side effects — no return value)
    ngOnInit() {
        effect(() => {
            document.title = `Count: ${this.count()}`;  // Reads count automatically
        });
    }

    increment(): void { this.count.update(n => n + 1); }  // update — like setCount(prev => prev + 1)
    decrement(): void { this.count.update(n => n - 1); }
    reset(): void     { this.count.set(0); }               // set — direct assignment
}
```

### Signals vs Zone-based

```typescript
// Zone-based (legacy) — any change anywhere triggers re-check
export class OldComponent {
    count = 0;  // Plain property
    get doubled() { return this.count * 2; }

    increment() { this.count++; }  // Zone detects this async, triggers re-render
}

// Signals — only components reading count() re-render
export class NewComponent {
    count   = signal(0);
    doubled = computed(() => this.count() * 2);

    increment() { this.count.update(n => n + 1); }  // Only readers re-render
}
```

### Modern Input/Output with `input()` and `output()`

Angular 17.1+ has functional `input()` and `output()` — cleaner than decorators:

```typescript
import { Component, input, output, model } from '@angular/core';

@Component({
    selector:   'app-color-picker',
    standalone: true,
    template: `
        <div class="color-picker">
            @for (color of colors; track color) {
                <button
                    [style.backgroundColor]="color"
                    [class.selected]="selectedColor() === color"
                    (click)="selectColor(color)"
                    [attr.aria-label]="'Select ' + color"
                ></button>
            }
        </div>
    `
})
export class ColorPickerComponent {
    // input() — required input (TypeScript type inferred)
    colors = input.required<string[]>();

    // model() — two-way bound input (like [(ngModel)] for components)
    selectedColor = model<string | null>(null);

    // output() — event emitter
    colorSelected = output<string>();

    selectColor(color: string): void {
        this.selectedColor.set(color);      // Updates the model (triggers parent binding)
        this.colorSelected.emit(color);     // Emits the event
    }
}
```

```html
<!-- Parent template usage -->
<app-color-picker
    [colors]="palette"
    [(selectedColor)]="currentColor"
    (colorSelected)="onColorSelected($event)"
/>
```

### Signals in a Shopping Cart

```typescript
@Component({
    selector: 'app-cart',
    standalone: true,
    template: `
        <div class="cart">
            <h2>Cart ({{ itemCount() }} items)</h2>
            <p>Total: {{ total() | currency }}</p>

            @for (item of items(); track item.id) {
                <div class="cart-item">
                    <span>{{ item.name }}</span>
                    <button (click)="removeItem(item.id)">×</button>
                </div>
            }

            @if (items().length === 0) {
                <p class="empty">Your cart is empty.</p>
            }
        </div>
    `
})
export class CartComponent {
    items      = signal<CartItem[]>([]);
    itemCount  = computed(() => this.items().length);
    total      = computed(() => this.items().reduce((sum, i) => sum + i.price, 0));

    addItem(item: CartItem): void {
        this.items.update(prev => [...prev, item]);
    }

    removeItem(id: number): void {
        this.items.update(prev => prev.filter(i => i.id !== id));
    }
}
```

---

## ✅ Milestone Checklist

- [ ] I created a `signal`, read it with `signal()`, and mutated it with `.set()` / `.update()`
- [ ] I created a `computed()` that derives from one or more signals
- [ ] I used `input()` instead of `@Input()` for at least one component
- [ ] I understand why Signals are more efficient than Zone-based change detection

## ➡️ Next Unit

[Lesson 04 — Component Communication — Input, Output & Services](./lesson_04.md)
