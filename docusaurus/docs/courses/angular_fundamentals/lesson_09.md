# Lesson 09 — Capstone: Project Manager App

> **Course:** Angular Fundamentals · **Time:** 3–4 hours
> **📖 Wiki:** [Frontend Frameworks](../../domains/web_dev/frontend_frameworks.md) · [REST APIs](../../domains/web_dev/rest_api.md)

---

## 🎯 Project Overview

Build a **Kanban-style Project Manager** with:
- Project and task management
- Angular Router with nested routes
- `HttpClient` calling JSONPlaceholder
- Reactive Forms for creating/editing
- Signals for local state
- Services for shared data
- Custom pipes and directives

---

## Architecture

```text
src/app/
├── features/
│   ├── projects/
│   │   ├── projects.routes.ts
│   │   ├── project-list/            ← List all projects
│   │   │   └── project-list.component.ts
│   │   └── project-detail/          ← Kanban board for one project
│   │       └── project-detail.component.ts
│   └── tasks/
│       ├── task-form/               ← Create/edit task (Reactive Form)
│       └── task-card/               ← Kanban card (input directive)
├── services/
│   ├── projects.service.ts          ← HTTP + signal state
│   └── tasks.service.ts
├── pipes/
│   └── relative-date.pipe.ts        ← "2 hours ago"
├── directives/
│   └── draggable.directive.ts       ← Basic drag to reorder
└── guards/
    └── auth.guard.ts
```

---

## Key Implementation: Projects Service with Signals

```typescript
// src/app/services/projects.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient }                            from '@angular/common/http';
import { tap }                                   from 'rxjs';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
    id:        number;
    title:     string;
    status:    TaskStatus;
    priority:  'low' | 'medium' | 'high';
    assignee?: string;
    dueDate?:  string;
}

export interface Project {
    id:          number;
    name:        string;
    description: string;
    tasks:       Task[];
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    private http = inject(HttpClient);
    private _projects  = signal<Project[]>([]);
    private _loading   = signal(false);
    private _error     = signal<string | null>(null);

    readonly projects  = this._projects.asReadonly();
    readonly loading   = this._loading.asReadonly();
    readonly error     = this._error.asReadonly();
    readonly taskCount = computed(() =>
        this._projects().reduce((sum, p) => sum + p.tasks.length, 0)
    );

    loadProjects(): void {
        this._loading.set(true);
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
            .pipe(
                tap({
                    next: users => {
                        // Map users to mock projects
                        this._projects.set(users.slice(0, 5).map(u => ({
                            id:          u.id,
                            name:        u.company.name,
                            description: u.company.catchPhrase,
                            tasks: [
                                { id: u.id * 10 + 1, title: 'Set up CI/CD', status: 'done',        priority: 'high' },
                                { id: u.id * 10 + 2, title: 'Write tests',  status: 'in-progress', priority: 'medium' },
                                { id: u.id * 10 + 3, title: 'Deploy v1.0',  status: 'todo',        priority: 'high' },
                            ] as Task[]
                        })));
                        this._loading.set(false);
                    },
                    error: err => {
                        this._error.set(err.message);
                        this._loading.set(false);
                    }
                })
            )
            .subscribe();
    }

    updateTaskStatus(projectId: number, taskId: number, status: TaskStatus): void {
        this._projects.update(projects =>
            projects.map(p => p.id === projectId ? {
                ...p,
                tasks: p.tasks.map(t => t.id === taskId ? { ...t, status } : t)
            } : p)
        );
    }
}
```

## Kanban Board Component

```typescript
// src/app/features/projects/project-detail/project-detail.component.ts
import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute }                      from '@angular/router';
import { CommonModule }                         from '@angular/common';
import { ProjectsService, Task, TaskStatus }   from '../../../services/projects.service';

const STATUS_COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
    { key: 'todo',        label: 'To Do',       color: 'border-t-gray-400' },
    { key: 'in-progress', label: 'In Progress',  color: 'border-t-blue-500' },
    { key: 'done',        label: 'Done',          color: 'border-t-emerald-500' },
];

@Component({
    selector:   'app-project-detail',
    standalone: true,
    imports:    [CommonModule],
    template: `
        <h1 class="text-3xl font-bold mb-8">{{ project?.name }}</h1>

        <div class="grid grid-cols-3 gap-6">
            @for (col of columns; track col.key) {
                <div class="bg-gray-50 rounded-2xl p-4 border-t-4 {{ col.color }}">
                    <h2 class="font-semibold text-gray-700 mb-4">
                        {{ col.label }}
                        <span class="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                            {{ tasksFor(col.key).length }}
                        </span>
                    </h2>
                    <ul class="space-y-3">
                        @for (task of tasksFor(col.key); track task.id) {
                            <li class="bg-white rounded-xl p-4 shadow-sm border cursor-pointer">
                                <p class="font-medium text-sm">{{ task.title }}</p>
                                <div class="mt-2 flex items-center gap-2">
                                    <span class="priority-badge {{ task.priority }}">{{ task.priority }}</span>
                                    @if (task.dueDate) {
                                        <span class="text-xs text-gray-400">{{ task.dueDate | date:'MMM d' }}</span>
                                    }
                                </div>
                                <div class="mt-3 flex gap-1">
                                    @for (s of statuses; track s) {
                                        @if (s !== col.key) {
                                            <button
                                                (click)="moveTask(task.id, s)"
                                                class="text-xs text-blue-600 hover:underline"
                                            >→ {{ s }}</button>
                                        }
                                    }
                                </div>
                            </li>
                        }
                    </ul>
                </div>
            }
        </div>
    `
})
export class ProjectDetailComponent implements OnInit {
    private route   = inject(ActivatedRoute);
    private service = inject(ProjectsService);

    columns  = STATUS_COLUMNS;
    statuses: TaskStatus[] = ['todo', 'in-progress', 'done'];

    get project() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        return this.service.projects().find(p => p.id === id);
    }

    tasksFor(status: TaskStatus): Task[] {
        return this.project?.tasks.filter(t => t.status === status) ?? [];
    }

    moveTask(taskId: number, status: TaskStatus): void {
        const projectId = Number(this.route.snapshot.paramMap.get('id'));
        this.service.updateTaskStatus(projectId, taskId, status);
    }

    ngOnInit(): void {
        if (this.service.projects().length === 0) {
            this.service.loadProjects();
        }
    }
}
```

---

## ✅ Milestone Checklist

- [ ] Projects load from an API via `HttpClient` and are stored in a Signal
- [ ] Moving a task between columns updates the Signal state
- [ ] The project detail route uses `ActivatedRoute` to get the project ID
- [ ] I used `computed()` for the task count stat
- [ ] I created at least one custom pipe used in the template

## 🏆 Angular Fundamentals Complete!

## ➡️ Continue Learning

- [React Fundamentals](../react_fundamentals/index.md) — compare React vs Angular
- [Next.js](../nextjs/index.md) — SSR with React
- [Frontend Engineer Path](../../paths/frontend_engineer.md) — your complete roadmap
