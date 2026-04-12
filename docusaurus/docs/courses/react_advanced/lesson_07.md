# Lesson 07 — Capstone: Multi-Page Dashboard

> **Course:** React Advanced · **Time:** 3–4 hours
> **📖 Wiki:** [Frontend Frameworks](../../domains/web_dev/frontend_frameworks.md) · [SSR & CSR](../../domains/web_dev/ssr_csr.md)
> **🔗 Official Docs:** [React Router](https://reactrouter.com/en/main) · [TanStack Query](https://tanstack.com/query/latest)

---

## 🎯 Project Overview

Build a **multi-page admin dashboard** integrating every concept from this course:
- React Router v6 with nested routes and code splitting
- TanStack Query for all server data
- `useReducer` for complex UI state (filters, sort, pagination)
- `React.memo` + `useMemo` for the data table
- Error Boundaries per dashboard section
- Vitest + Testing Library for key user flows
- TypeScript throughout — zero `any`

---

## Architecture

```
src/
├── api/            ← All fetch functions
│   ├── users.ts
│   └── posts.ts
├── components/     ← Shared UI components
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── DataTable.tsx   ← memo'd, sortable
│   └── layout/
│       ├── RootLayout.tsx
│       └── Sidebar.tsx
├── pages/          ← Route-level pages
│   ├── DashboardPage.tsx
│   ├── UsersPage.tsx       ← useReducer for filter/sort/page state
│   ├── PostsPage.tsx
│   └── UserDetailPage.tsx
├── hooks/          ← Custom hooks
├── contexts/       ← Auth + Theme
├── test/           ← Test utilities
└── router.tsx      ← Lazy-loaded routes
```

---

## Key Implementation: Users Page with `useReducer`

```tsx
// src/pages/UsersPage.tsx
import { useReducer, useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { memo } from 'react';

interface UserFilters {
    search:  string;
    role:    'all' | 'admin' | 'user';
    sortBy:  'name' | 'email' | 'joined';
    sortDir: 'asc' | 'desc';
    page:    number;
    perPage: number;
}

type FilterAction =
    | { type: 'SET_SEARCH';  payload: string }
    | { type: 'SET_ROLE';    payload: UserFilters['role'] }
    | { type: 'SET_SORT';    payload: UserFilters['sortBy'] }
    | { type: 'SET_PAGE';    payload: number }
    | { type: 'RESET' };

const initialFilters: UserFilters = {
    search: '', role: 'all', sortBy: 'name', sortDir: 'asc', page: 1, perPage: 20
};

function filterReducer(state: UserFilters, action: FilterAction): UserFilters {
    switch (action.type) {
        case 'SET_SEARCH': return { ...state, search: action.payload, page: 1 };
        case 'SET_ROLE':   return { ...state, role:   action.payload, page: 1 };
        case 'SET_SORT':
            if (state.sortBy === action.payload) {
                return { ...state, sortDir: state.sortDir === 'asc' ? 'desc' : 'asc' };
            }
            return { ...state, sortBy: action.payload, sortDir: 'asc', page: 1 };
        case 'SET_PAGE':   return { ...state, page: action.payload };
        case 'RESET':      return initialFilters;
        default:           return state;
    }
}

export function UsersPage() {
    const [filters, dispatch] = useReducer(filterReducer, initialFilters);

    const { data: allUsers } = useSuspenseQuery({
        queryKey: ['users'],
        queryFn:  () => fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()) as Promise<User[]>
    });

    const visibleUsers = useMemo(() => {
        return allUsers
            .filter(u => filters.role === 'all' || u.role === filters.role)
            .filter(u => u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         u.email.toLowerCase().includes(filters.search.toLowerCase()))
            .sort((a, b) => {
                const dir = filters.sortDir === 'asc' ? 1 : -1;
                return String(a[filters.sortBy as keyof User] ?? '').localeCompare(
                       String(b[filters.sortBy as keyof User] ?? '')) * dir;
            });
    }, [allUsers, filters]);

    const totalPages = Math.ceil(visibleUsers.length / filters.perPage);
    const pageUsers  = visibleUsers.slice(
        (filters.page - 1) * filters.perPage,
         filters.page      * filters.perPage
    );

    return (
        <div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <input
                    value={filters.search}
                    onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                    placeholder="Search users..."
                    className="input flex-1 min-w-48"
                />
                <select
                    value={filters.role}
                    onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value as UserFilters['role'] })}
                    className="input"
                >
                    <option value="all">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <button onClick={() => dispatch({ type: 'RESET' })} className="btn btn-secondary">
                    Reset
                </button>
            </div>

            <UserTable
                users={pageUsers}
                sortBy={filters.sortBy}
                sortDir={filters.sortDir}
                onSort={col => dispatch({ type: 'SET_SORT', payload: col })}
            />

            <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                    Showing {pageUsers.length} of {visibleUsers.length} users
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => dispatch({ type: 'SET_PAGE', payload: filters.page - 1 })}
                        disabled={filters.page <= 1}
                        className="btn btn-secondary disabled:opacity-40"
                    >← Prev</button>
                    <span className="px-4 py-2 text-sm">{filters.page} / {totalPages}</span>
                    <button
                        onClick={() => dispatch({ type: 'SET_PAGE', payload: filters.page + 1 })}
                        disabled={filters.page >= totalPages}
                        className="btn btn-secondary disabled:opacity-40"
                    >Next →</button>
                </div>
            </div>
        </div>
    );
}

// Memoised table — re-renders only when props change
const UserTable = memo(function UserTable({ users, sortBy, sortDir, onSort }: {
    users: User[];
    sortBy: string;
    sortDir: 'asc' | 'desc';
    onSort: (col: 'name' | 'email' | 'joined') => void;
}) {
    const SortIcon = ({ col }: { col: string }) => {
        if (sortBy !== col) return <span className="text-gray-300">↕</span>;
        return <span>{sortDir === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                        {(['name', 'email', 'joined'] as const).map(col => (
                            <th key={col} className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => onSort(col)}>
                                {col} <SortIcon col={col} />
                            </th>
                        ))}
                        <th className="px-6 py-3 text-center">Role</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium">{user.name}</td>
                            <td className="px-6 py-4 text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 text-gray-400">—</td>
                            <td className="px-6 py-4 text-center">
                                <span className="badge badge-blue">User</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});
```

---

## ✅ Milestone Checklist

- [ ] All routes are lazy-loaded with `React.lazy()`
- [ ] Each dashboard section is wrapped in its own `ErrorBoundary`
- [ ] All server data goes through TanStack Query — no raw `useEffect` fetching
- [ ] The users table uses `useReducer` for filter/sort/pagination state
- [ ] `UserTable` is wrapped in `memo` — profiler shows it skips renders when parent filters change
- [ ] I wrote at least 3 tests with Vitest + Testing Library

## 🏆 React Advanced Complete!

## ➡️ Next Course

[Next.js](../nextjs/index.md) — add SSR and SSG to your React superpowers
