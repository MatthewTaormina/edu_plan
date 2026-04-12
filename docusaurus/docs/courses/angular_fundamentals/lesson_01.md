# Lesson 01 — Angular Architecture & CLI Setup

> **Course:** Angular Fundamentals · **Time:** 60 minutes
> **📖 Wiki:** [Frontend Frameworks](../../domains/web_dev/frontend_frameworks.md)
> **🔗 Official Docs:** [Angular Getting Started](https://angular.dev/start) · [CLI Overview](https://angular.dev/tools/cli)

---

## 🎯 Learning Objectives

- [ ] Understand Angular's architecture (Modules vs Standalone components)
- [ ] Create a new project with the Angular CLI
- [ ] Understand the role of `AppComponent`, `main.ts`, and `index.html`
- [ ] Generate components, services, and pipes with the CLI
- [ ] Run the development server and understand the build pipeline

---

## 📖 Concepts

### How Angular Differs from React

| | React | Angular |
|-|-------|---------|
| Type | Library | Full framework |
| Rendering | Virtual DOM | Change detection zones/signals |
| Templating | JSX | HTML-like templates + TypeScript |
| Routing | React Router (external) | `@angular/router` (built-in) |
| HTTP | `fetch` / TanStack Query | `HttpClient` (built-in) |
| Forms | Formik / React Hook Form | ReactiveForms (built-in) |
| DI | Context / props | Hierarchical Injector |
| Testing | Vitest / Testing Library | Jasmine + TestBed |

Angular is **opinionated** — it makes decisions so your team doesn't have to. All Angular projects share the same structure and conventions.

### Installation

```bash
npm install -g @angular/cli
ng version  # Verify — should show v17+
ng new my-app --routing --style=css --standalone
cd my-app
ng serve   # http://localhost:4200
```

```powershell
# Windows — same commands work in PowerShell
```

The `--standalone` flag generates standalone components. This is the **modern Angular API** (Angular 17+). The older NgModule approach is legacy.

### Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts      ← Root component
│   │   ├── app.component.html    ← Root template
│   │   ├── app.component.css     ← Component styles (scoped)
│   │   ├── app.component.spec.ts ← Unit tests
│   │   └── app.routes.ts         ← Route config
│   ├── index.html                ← Entry HTML
│   └── main.ts                   ← Bootstraps the app
├── angular.json                  ← Build config
└── tsconfig.json
```

### The Root Component

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector:    'app-root',    // Used as <app-root> in index.html
    standalone:  true,          // No NgModule needed
    imports:     [RouterOutlet],  // Import what this component uses
    templateUrl: './app.component.html',
    styleUrl:    './app.component.css'
})
export class AppComponent {
    title = 'my-app';
}
```

```typescript
// src/main.ts — bootstraps the app
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig }            from './app/app.config';
import { AppComponent }         from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
```

### CLI Generator Commands

```bash
# Generate a component
ng generate component components/user-card
# Shorthand:
ng g c components/user-card

# Generate a service
ng g s services/user

# Generate a pipe
ng g p pipes/currency-format

# Generate a guard
ng g guard guards/auth

# Generate without test files (faster prototyping)
ng g c components/nav --skip-tests
```

All generated files are automatically added to the right place. The CLI is central to the Angular developer experience — use it rather than creating files manually.

### Component Anatomy

```typescript
// src/app/components/user-card/user-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';

interface User {
    id:    number;
    name:  string;
    email: string;
}

@Component({
    selector:   'app-user-card',  // <app-user-card> in templates
    standalone: true,
    imports:    [CommonModule],    // Gives access to *ngIf, *ngFor, pipes
    template: `
        <div class="card">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
        </div>
    `,
    styles: [`
        .card {
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
        }
    `]
})
export class UserCardComponent {
    @Input({ required: true }) user!: User;
}
```

---

## ✅ Milestone Checklist

- [ ] I installed the Angular CLI and created a project with `ng new`
- [ ] I understand the difference between `@Component`, `selector`, `standalone`, and `imports`
- [ ] I used `ng generate component` to create a component
- [ ] My `ng serve` runs without errors at localhost:4200

## ➡️ Next Unit

[Lesson 02 — Standalone Components & Templates](./lesson_02.md)
