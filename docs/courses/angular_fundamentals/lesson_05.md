# Lesson 05 — Angular Router

> **Course:** Angular Fundamentals · **Time:** 45 minutes
> **🔗 Official Docs:** [Angular Routing](https://angular.dev/guide/routing)

---

## 🎯 Learning Objectives

- [ ] Define routes and render them with `RouterOutlet`
- [ ] Navigate with `RouterLink` and `Router.navigate()`
- [ ] Read URL params and query params
- [ ] Protect routes with a functional guard
- [ ] Lazy-load feature routes

---

## 📖 Concepts

### Route Configuration

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Redirect root to /home
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // Eager-loaded routes
    {
        path:      'home',
        component: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },

    // Lazy-loaded feature module (loadChildren)
    {
        path:         'blog',
        loadChildren: () => import('./features/blog/blog.routes').then(m => m.BLOG_ROUTES)
    },

    // Protected route
    {
        path:      'dashboard',
        component: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },

    // Wild card — 404
    {
        path:      '**',
        component: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
```

```typescript
// src/app/app.config.ts
import { ApplicationConfig }              from '@angular/core';
import { provideRouter, withViewTransitions }  from '@angular/router';
import { routes }                          from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withViewTransitions())
    ]
};
```

```html
<!-- app.component.html — router outlet renders the active route -->
<app-nav />
<main>
    <router-outlet />
</main>
```

### Navigation

```html
<!-- Declarative navigation -->
<a routerLink="/home" routerLinkActive="nav-active" [routerLinkActiveOptions]="{ exact: true }">
    Home
</a>
<a [routerLink]="['/blog', post.slug]">Read post</a>
<a [routerLink]="['/users']" [queryParams]="{ page: 2 }">Page 2</a>
```

```typescript
// Programmatic navigation
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

export class LoginComponent {
    private router = inject(Router);

    onLoginSuccess(): void {
        this.router.navigate(['/dashboard']);
    }

    onLoginSuccessWithQuery(): void {
        this.router.navigate(['/search'], { queryParams: { q: 'react' } });
    }
}
```

### Reading Route Params

```typescript
// src/app/pages/blog-post/blog-post.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute }                      from '@angular/router';

@Component({
    selector:   'app-blog-post',
    standalone: true,
    template: `
        @if (post()) {
            <article>
                <h1>{{ post()!.title }}</h1>
            </article>
        } @else {
            <app-skeleton />
        }
    `
})
export class BlogPostComponent implements OnInit {
    private route = inject(ActivatedRoute);
    post = signal<Post | null>(null);

    ngOnInit(): void {
        // Read route param
        const slug = this.route.snapshot.paramMap.get('slug')!;

        // Or subscribe for param changes without navigation
        this.route.paramMap.subscribe(params => {
            const slug = params.get('slug')!;
            this.loadPost(slug);
        });
    }

    // Query params: /search?q=react
    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            const query  = params.get('q') ?? '';
            const page   = Number(params.get('page') ?? 1);
        });
    }
}
```

### Functional Auth Guard

```typescript
// src/app/guards/auth.guard.ts
import { inject }     from '@angular/core';
import { Router }     from '@angular/router';
import { AuthService } from '../services/auth.service';
import type { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const auth   = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoggedIn()) {
        return true;
    }

    // Redirect to login, preserving the intended destination
    return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
    });
};
```

### Lazy Loading Feature Routes

```typescript
// src/app/features/blog/blog.routes.ts
import { Routes } from '@angular/router';

export const BLOG_ROUTES: Routes = [
    { path: '',         component: BlogListComponent },
    { path: ':slug',    component: BlogPostComponent },
    { path: ':slug/edit', component: BlogEditComponent }
];
```

These components download only when the user navigates to `/blog/*`.

---

## ✅ Milestone Checklist

- [ ] I configured routes in `app.routes.ts` including a wildcard 404 route
- [ ] I use `routerLink` and `routerLinkActive` for navigation links
- [ ] I read URL params via `ActivatedRoute`
- [ ] I created a functional `authGuard` that redirects if not logged in
- [ ] I lazy-loaded at least one feature route

## ➡️ Next Unit

[Lesson 06 — HTTP & HttpClient](./lesson_06.md)
