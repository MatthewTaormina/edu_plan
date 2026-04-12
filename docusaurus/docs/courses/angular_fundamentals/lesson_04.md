# Lesson 04 — Component Communication & Services

> **Course:** Angular Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Services and DI](https://angular.dev/guide/di) · [Component Interaction](https://angular.dev/guide/components/inputs)

---

## 🎯 Learning Objectives

- [ ] Pass data from parent to child via `input()`
- [ ] Emit events from child to parent via `output()`
- [ ] Create a typed service with `@Injectable`
- [ ] Inject a service using the Angular Dependency Injector

---

## 📖 Concepts

### Parent → Child: `input()`

```typescript
// Child: product-card.component.ts
@Component({
    selector:   'app-product-card',
    standalone: true,
    imports:    [CommonModule],
    template: `
        <div class="card" [class.featured]="featured()">
            <h3>{{ product().name }}</h3>
            <p class="price">{{ product().price | currency }}</p>
            <button (click)="onAddToCart()">Add to cart</button>
        </div>
    `
})
export class ProductCardComponent {
    product  = input.required<Product>();     // Required input
    featured = input(false);                  // Optional with default

    addToCart = output<Product>();            // Emits when clicked

    onAddToCart(): void {
        this.addToCart.emit(this.product());
    }
}
```

```typescript
// Parent: product-page.component.ts
@Component({
    selector:   'app-product-page',
    standalone: true,
    imports:    [ProductCardComponent, CommonModule],
    template: `
        <div class="grid">
            @for (p of products; track p.id) {
                <app-product-card
                    [product]="p"
                    [featured]="p.id === featuredId"
                    (addToCart)="onAddToCart($event)"
                />
            }
        </div>
        <p>Cart items: {{ cartCount }}</p>
    `
})
export class ProductPageComponent {
    products  = [/* ... */];
    featuredId = 1;
    cartCount  = 0;

    onAddToCart(product: Product): void {
        this.cartCount++;
        console.log('Added:', product.name);
    }
}
```

### Services — Shared State and Logic

Services are **singleton injectable classes** that:
- Share state between components
- Encapsulate business logic
- Talk to APIs

```typescript
// src/app/services/cart.service.ts
import { Injectable, signal, computed } from '@angular/core';

interface CartItem { id: number; name: string; price: number; qty: number; }

// @Injectable — makes this class available for injection
// providedIn: 'root' — singleton across the entire app
@Injectable({ providedIn: 'root' })
export class CartService {
    // Private writable signal — only the service can modify it
    private _items = signal<CartItem[]>([]);

    // Public readable signals — components read these
    readonly items     = this._items.asReadonly();
    readonly itemCount = computed(() => this._items().reduce((sum, i) => sum + i.qty, 0));
    readonly total     = computed(() => this._items().reduce((sum, i) => sum + i.price * i.qty, 0));

    addItem(item: Omit<CartItem, 'qty'>): void {
        this._items.update(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    }

    removeItem(id: number): void {
        this._items.update(prev => prev.filter(i => i.id !== id));
    }

    clearCart(): void {
        this._items.set([]);
    }
}
```

### Injecting Services

```typescript
// src/app/components/cart-summary/cart-summary.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { CartService }        from '../../services/cart.service';

@Component({
    selector:   'app-cart-summary',
    standalone: true,
    imports:    [CommonModule],
    template: `
        <div class="cart-summary">
            <h3>Cart ({{ cartService.itemCount() }})</h3>
            <p>Total: {{ cartService.total() | currency }}</p>
            <ul>
                @for (item of cartService.items(); track item.id) {
                    <li>
                        {{ item.name }} × {{ item.qty }}
                        <button (click)="cartService.removeItem(item.id)">×</button>
                    </li>
                }
            </ul>
            <button (click)="cartService.clearCart()" [disabled]="cartService.itemCount() === 0">
                Clear cart
            </button>
        </div>
    `
})
export class CartSummaryComponent {
    // inject() — modern Angular DI (alternative to constructor injection)
    readonly cartService = inject(CartService);
}
```

```typescript
// A different component — gets the SAME singleton instance
@Component({ /* ... */ })
export class ProductCardComponent {
    private cartService = inject(CartService);  // Same cart instance

    addToCart(product: Product): void {
        this.cartService.addItem({ id: product.id, name: product.name, price: product.price });
    }
}
```

### Constructor vs `inject()` DI

```typescript
// Legacy — constructor injection (still valid, common in older code)
export class MyComponent {
    constructor(private cartService: CartService) {}
}

// Modern — inject() function (cleaner, works outside constructors)
export class MyComponent {
    private cartService = inject(CartService);
}
```

---

## ✅ Milestone Checklist

- [ ] I passed data from parent to child with `input.required<T>()`
- [ ] I emitted events from child to parent with `output<T>()`
- [ ] I created a service with `@Injectable({ providedIn: 'root' })`
- [ ] I injected the service with `inject()` in two different components and verified they share state

## ➡️ Next Unit

[Lesson 05 — Angular Router](./lesson_05.md)
