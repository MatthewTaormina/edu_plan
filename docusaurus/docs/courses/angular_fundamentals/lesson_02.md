# Lesson 02 — Standalone Components & Templates

> **Course:** Angular Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Angular Templates](https://angular.dev/guide/templates) · [Control Flow](https://angular.dev/guide/templates/control-flow)

---

## 🎯 Learning Objectives

- [ ] Write Angular templates with interpolation, property, and event binding
- [ ] Use Angular 17+ control flow syntax (`@if`, `@for`, `@switch`)
- [ ] Apply class and style bindings
- [ ] Scope component styles with `ViewEncapsulation`

---

## 📖 Concepts

### Template Binding Syntax

```html
<!-- Interpolation — renders a TypeScript expression as text -->
<h1>{{ title }}</h1>
<p>Count: {{ items.length }}</p>
<span>{{ 2 + 2 }}</span>
<span>{{ user.name | uppercase }}</span>  <!-- pipe -->

<!-- Property binding — sets a DOM/component property -->
<img [src]="user.avatar" [alt]="user.name">
<button [disabled]="isLoading">Save</button>
<input [value]="searchQuery">

<!-- Event binding — listens for DOM events -->
<button (click)="handleClick()">Click me</button>
<input (input)="onInput($event)" (keydown.enter)="submit()">
<form (submit)="onSubmit($event)">

<!-- Two-way binding — prop + event combined (requires FormsModule) -->
<input [(ngModel)]="searchQuery">   <!-- same as [value]="x" (input)="x=$event.target.value" -->
```

### Angular 17+ Control Flow

Modern Angular replaces structural directives with built-in template control flow:

```html
<!-- @if / @else if / @else -->
@if (user.isAdmin) {
    <span class="badge badge-admin">Administrator</span>
} @else if (user.role === 'editor') {
    <span class="badge badge-editor">Editor</span>
} @else {
    <span class="badge">Member</span>
}

<!-- @for — iterating over lists -->
@for (item of items; track item.id) {
    <li class="list-item">{{ item.name }}</li>
} @empty {
    <li class="empty-state">No items found.</li>
}

<!-- @switch -->
@switch (status) {
    @case ('loading') { <app-spinner /> }
    @case ('error')   { <p class="error">{{ errorMessage }}</p> }
    @case ('success') { <app-result [data]="result" /> }
    @default          { <p>Unknown state</p> }
}
```

The `track` expression in `@for` is the equivalent of React's `key`. It must be a **unique, stable identifier** from the data — not the loop index.

### Class and Style Bindings

```html
<!-- Single class toggle -->
<div [class.active]="isActive">...</div>
<div [class.error]="hasError">...</div>

<!-- Object syntax — multiple classes from a condition map -->
<div [ngClass]="{
    'text-green-600': isValid,
    'text-red-600':   !isValid,
    'font-bold':      isPrimary
}">

<!-- Inline style -->
<div [style.color]="brandColor">...</div>
<div [style.width.px]="cardWidth">...</div>

<!-- Object of styles -->
<div [ngStyle]="{ width: '100%', maxWidth: maxWidth + 'px' }">
```

### A Complete Component

```typescript
// src/app/components/product-list/product-list.component.ts
import { Component, OnInit }    from '@angular/core';
import { CommonModule }          from '@angular/common';

interface Product {
    id:      number;
    name:    string;
    price:   number;
    inStock: boolean;
    category: string;
}

@Component({
    selector:   'app-product-list',
    standalone: true,
    imports:    [CommonModule],
    template: `
        <div class="product-list">
            <header class="list-header">
                <h2>Products ({{ filtered.length }} of {{ products.length }})</h2>
                <input
                    class="search-input"
                    type="search"
                    placeholder="Search..."
                    (input)="onSearch($event)"
                    [value]="searchQuery"
                >
            </header>

            @if (filtered.length === 0) {
                <div class="empty-state">
                    <p>No products match "{{ searchQuery }}"</p>
                    <button (click)="clearSearch()">Clear search</button>
                </div>
            } @else {
                <ul class="product-grid">
                    @for (product of filtered; track product.id) {
                        <li class="product-card" [class.out-of-stock]="!product.inStock">
                            <h3>{{ product.name }}</h3>
                            <p class="price">{{ product.price | currency }}</p>
                            <span class="category">{{ product.category }}</span>
                            <span [class.badge-green]="product.inStock"
                                  [class.badge-red]="!product.inStock"
                                  class="badge">
                                {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                            </span>
                        </li>
                    }
                </ul>
            }
        </div>
    `
})
export class ProductListComponent {
    products: Product[] = [
        { id: 1, name: 'Widget Pro',  price: 29.99, inStock: true,  category: 'gadgets' },
        { id: 2, name: 'Gadget Max',  price: 49.99, inStock: false, category: 'gadgets' },
        { id: 3, name: 'Doohickey',   price: 9.99,  inStock: true,  category: 'tools' },
    ];
    searchQuery = '';

    get filtered(): Product[] {
        const q = this.searchQuery.toLowerCase();
        return q
            ? this.products.filter(p =>
                p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
            : this.products;
    }

    onSearch(event: Event): void {
        this.searchQuery = (event.target as HTMLInputElement).value;
    }

    clearSearch(): void {
        this.searchQuery = '';
    }
}
```

### ViewEncapsulation — Scoped Styles

By default, Angular applies CSS only to the component's own elements (Emulated encapsulation). This prevents styles leaking.

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    // ...
    encapsulation: ViewEncapsulation.Emulated,  // Default — scoped
    // encapsulation: ViewEncapsulation.None,   // Global — use for theming
    // encapsulation: ViewEncapsulation.ShadowDom,  // True shadow DOM
})
```

---

## ✅ Milestone Checklist

- [ ] I use `{{ }}` for interpolation, `[prop]` for property binding, `(event)` for event binding
- [ ] I use `@for ... track item.id` instead of `*ngFor`
- [ ] I use `@if` / `@else` instead of `*ngIf`
- [ ] I used `[class.active]` for conditional classes

## ➡️ Next Unit

[Lesson 03 — Data Binding & Signals](./lesson_03.md)
