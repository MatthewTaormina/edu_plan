# Lesson 08 — Pipes, Directives & Template Utilities

> **Course:** Angular Fundamentals · **Time:** 45 minutes
> **🔗 Official Docs:** [Pipes](https://angular.dev/guide/pipes) · [Directives](https://angular.dev/guide/directives)

---

## 🎯 Learning Objectives

- [ ] Use built-in pipes: `date`, `currency`, `json`, `slice`, `async`
- [ ] Create a custom pipe
- [ ] Create a custom attribute directive
- [ ] Use `AsyncPipe` to subscribe to Observables in templates

---

## 📖 Concepts

### Built-in Pipes

```html
<!-- String / Number pipes -->
{{ 'hello world' | uppercase }}           <!-- HELLO WORLD -->
{{ 'hello world' | titlecase }}           <!-- Hello World -->

{{ 3.14159 | number:'1.2-2' }}           <!-- 3.14 (min 1 int digit, 2 decimal) -->
{{ 0.42 | percent:'1.0-1' }}             <!-- 42% -->
{{ 1234.5 | currency:'GBP' }}            <!-- £1,234.50 -->
{{ 1234.5 | currency:'USD':'symbol':'1.0-0' }} <!-- $1,235 -->

<!-- Array pipe -->
{{ [1,2,3,4,5] | slice:1:3 }}           <!-- [2, 3] -->

<!-- Date pipe -->
{{ today | date:'MMMM d, yyyy' }}        <!-- April 12, 2026 -->
{{ today | date:'shortTime' }}           <!-- 3:45 PM -->
{{ today | date:'relative' }}            <!-- 2 hours ago (Angular 17.2+) -->

<!-- Debug pipe -->
<pre>{{ complexObject | json }}</pre>
```

Pipes are composable:
```html
{{ post.publishedAt | date:'longDate' | uppercase }}
```

### Custom Pipe

```typescript
// src/app/pipes/truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name:       'truncate',
    standalone: true,
    pure:       true     // pure pipes only re-run when input changes (default, preferred)
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, maxLength: number = 100, ellipsis: string = '…'): string {
        if (value.length <= maxLength) return value;
        return value.substring(0, maxLength).trimEnd() + ellipsis;
    }
}

// Usage in a component
// imports: [TruncatePipe]
// template: {{ post.body | truncate:150 }}
```

### `AsyncPipe` — Subscribe in the Template

```typescript
@Component({
    selector:   'app-post-list',
    standalone: true,
    imports:    [CommonModule],   // CommonModule includes AsyncPipe
    template: `
        @if (posts$ | async; as posts) {
            <ul>
                @for (post of posts; track post.id) {
                    <li>{{ post.title }}</li>
                }
            </ul>
        } @else {
            <app-loading />
        }
    `
})
export class PostListComponent implements OnInit {
    private postsService = inject(PostsService);
    posts$!: Observable<Post[]>;  // Angular convention: $ suffix = Observable

    ngOnInit() {
        this.posts$ = this.postsService.getPosts();
    }
}
```

`AsyncPipe` automatically subscribes and unsubscribes — no manual cleanup needed!

### Custom Attribute Directive

```typescript
// src/app/directives/ripple.directive.ts
import { Directive, ElementRef, HostListener, inject } from '@angular/core';

// Attribute directive — adds behaviour to a host element
@Directive({
    selector:   '[appRipple]',  // Applied as an attribute: <button appRipple>
    standalone: true
})
export class RippleDirective {
    private el = inject(ElementRef);

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent): void {
        const button = this.el.nativeElement as HTMLElement;
        const circle = document.createElement('span');

        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius   = diameter / 2;

        const rect = button.getBoundingClientRect();
        circle.style.cssText = `
            width: ${diameter}px;
            height: ${diameter}px;
            left: ${event.clientX - rect.left - radius}px;
            top: ${event.clientY - rect.top - radius}px;
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.4);
            transform: scale(0);
            animation: ripple 600ms linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    }
}

// Usage
// imports: [RippleDirective]
// template: <button appRipple class="btn btn-primary">Click me</button>
```

### Tooltip Directive with `Input`

```typescript
// src/app/directives/tooltip.directive.ts
import { Directive, input, HostListener, ElementRef, inject } from '@angular/core';

@Directive({
    selector:   '[appTooltip]',
    standalone: true
})
export class TooltipDirective {
    appTooltip = input.required<string>();  // directive input via attribute value
    private el = inject(ElementRef);
    private tooltip: HTMLElement | null = null;

    @HostListener('mouseenter')
    showTooltip(): void {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        this.tooltip.textContent = this.appTooltip();
        document.body.appendChild(this.tooltip);

        const rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
        this.tooltip.style.top  = `${rect.bottom + 8 + window.scrollY}px`;
        this.tooltip.style.left = `${rect.left + window.scrollX}px`;
    }

    @HostListener('mouseleave')
    hideTooltip(): void {
        this.tooltip?.remove();
        this.tooltip = null;
    }
}

// Usage: <button [appTooltip]="'Save your changes'">Save</button>
```

---

## ✅ Milestone Checklist

- [ ] I used `date`, `currency`, and `slice` built-in pipes
- [ ] I created a `TruncatePipe` with a configurable max length
- [ ] I used `AsyncPipe` to subscribe to an Observable in the template
- [ ] I created a custom attribute directive using `@HostListener`

## ➡️ Next Unit

[Lesson 09 — Capstone: Project Manager App](./lesson_09.md)
