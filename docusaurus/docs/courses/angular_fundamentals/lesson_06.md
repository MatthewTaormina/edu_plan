# Lesson 06 — HTTP & HttpClient

> **Course:** Angular Fundamentals · **Time:** 45 minutes
> **📖 Wiki:** [REST APIs](../../domains/web_dev/rest_api.md)
> **🔗 Official Docs:** [HttpClient](https://angular.dev/guide/http)

---

## 🎯 Learning Objectives

- [ ] Configure `HttpClient` with `provideHttpClient()`
- [ ] Make typed GET, POST, PUT, DELETE requests
- [ ] Handle loading state, errors, and retry logic
- [ ] Use an HTTP interceptor for auth headers

---

## 📖 Concepts

### Setup

```typescript
// src/app/app.config.ts
import { ApplicationConfig }                from '@angular/core';
import { provideRouter }                    from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes }                           from './app.routes';
import { authInterceptor }                  from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([authInterceptor])  // Register interceptors here
        )
    ]
};
```

### Typed HTTP Service

```typescript
// src/app/services/posts.service.ts
import { Injectable, inject }             from '@angular/core';
import { HttpClient, HttpErrorResponse }  from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';

export interface Post {
    id:      number;
    title:   string;
    body:    string;
    userId:  number;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
    private http    = inject(HttpClient);
    private baseUrl = 'https://jsonplaceholder.typicode.com';

    // GET — TypeScript generic informs the returned Observable
    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.baseUrl}/posts`).pipe(
            retry(2),                    // Retry failed requests up to 2 times
            catchError(this.handleError) // Format errors consistently
        );
    }

    getPost(id: number): Observable<Post> {
        return this.http.get<Post>(`${this.baseUrl}/posts/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    // POST
    createPost(data: Omit<Post, 'id'>): Observable<Post> {
        return this.http.post<Post>(`${this.baseUrl}/posts`, data).pipe(
            catchError(this.handleError)
        );
    }

    // PUT
    updatePost(id: number, data: Partial<Post>): Observable<Post> {
        return this.http.put<Post>(`${this.baseUrl}/posts/${id}`, data).pipe(
            catchError(this.handleError)
        );
    }

    // DELETE
    deletePost(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/posts/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        const message = error.status === 0
            ? 'Network error — check your connection'
            : `Server error ${error.status}: ${error.error?.message ?? error.statusText}`;
        return throwError(() => new Error(message));
    }
}
```

### Using the Service in a Component

```typescript
// src/app/pages/posts/posts.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { PostsService, Post }                 from '../../services/posts.service';

@Component({
    selector:   'app-posts',
    standalone: true,
    imports:    [CommonModule],
    template: `
        @if (loading()) {
            <div class="loading-grid">
                @for (_ of [1,2,3]; track $index) {
                    <div class="skeleton h-24"></div>
                }
            </div>
        } @else if (error()) {
            <div class="error-banner" role="alert">
                <p>{{ error() }}</p>
                <button (click)="loadPosts()">Try again</button>
            </div>
        } @else {
            <ul class="space-y-4">
                @for (post of posts(); track post.id) {
                    <li class="post-card">
                        <h2>{{ post.title }}</h2>
                        <p>{{ post.body | slice:0:120 }}...</p>
                        <button (click)="deletePost(post.id)">Delete</button>
                    </li>
                }
            </ul>
        }
    `
})
export class PostsComponent implements OnInit {
    private postsService = inject(PostsService);

    posts   = signal<Post[]>([]);
    loading = signal(true);
    error   = signal<string | null>(null);

    ngOnInit(): void {
        this.loadPosts();
    }

    loadPosts(): void {
        this.loading.set(true);
        this.error.set(null);

        this.postsService.getPosts().subscribe({
            next:     posts => { this.posts.set(posts); this.loading.set(false); },
            error:    err   => { this.error.set(err.message); this.loading.set(false); }
        });
    }

    deletePost(id: number): void {
        this.postsService.deletePost(id).subscribe({
            next: () => this.posts.update(prev => prev.filter(p => p.id !== id)),
            error: err => alert(err.message)
        });
    }
}
```

### Auth Interceptor

```typescript
// src/app/interceptors/auth.interceptor.ts
import { inject }   from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';
import { AuthService }            from '../services/auth.service';

// Functional interceptor (Angular 15+)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const token = auth.getToken();

    if (token) {
        // Clone the request — requests are immutable
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(authReq);
    }

    return next(req);
};
```

---

## ✅ Milestone Checklist

- [ ] I configured `provideHttpClient()` in `app.config.ts`
- [ ] My service methods are typed (`Observable<Post[]>`, `Observable<Post>`)
- [ ] I handle loading and error states in the component
- [ ] I created a functional interceptor that attaches auth headers

## ➡️ Next Unit

[Lesson 07 — Reactive Forms](./lesson_07.md)
