# Lesson 05 — Error Boundaries & Suspense

> **Course:** React Advanced · **Time:** 45 minutes
> **🔗 Official Docs:** [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) · [Suspense](https://react.dev/reference/react/Suspense)

---

## 🎯 Learning Objectives

- [ ] Install and use `react-error-boundary` to catch render errors
- [ ] Provide fallback UI and a reset mechanism for errors
- [ ] Use `<Suspense>` for lazy-loaded components
- [ ] Understand what React 18 Suspense does (and doesn't do) with data fetching

---

## 📖 Concepts

### Error Boundaries — Catching Render Errors

JavaScript errors during rendering crash the entire React tree. Error Boundaries catch them and display a fallback.

```bash
npm install react-error-boundary
```

```tsx
import { ErrorBoundary } from 'react-error-boundary';

// The fallback component receives the error and a reset function
function ErrorFallback({ error, resetErrorBoundary }: {
    error: Error;
    resetErrorBoundary: () => void;
}) {
    return (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
            <p className="text-sm text-red-600 mt-1 mb-4">{error.message}</p>
            <button onClick={resetErrorBoundary} className="btn btn-secondary">
                Try again
            </button>
        </div>
    );
}

// Wrap any component that might throw
function App() {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <DataSection />
        </ErrorBoundary>
    );
}
```

> [!NOTE]
> Error boundaries do NOT catch errors in event handlers, async code, or server-side rendering.
> They ONLY catch errors that occur during rendering (in render functions or lifecycle effects).

### Granular Error Boundaries

```tsx
// Wrap each section independently — a broken widget doesn't kill the page
function Dashboard() {
    return (
        <div className="grid grid-cols-2 gap-6">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <RevenueChart />
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <UserGrowthChart />
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <RecentOrders />
            </ErrorBoundary>
        </div>
    );
}
```

### `<Suspense>` — Lazy-Loaded Components

```tsx
import { lazy, Suspense } from 'react';

// Lazy-load heavy components — they're only downloaded when needed
const HeavyEditor = lazy(() => import('./components/HeavyEditor'));
const ChartPanel  = lazy(() => import('./components/ChartPanel'));

function App() {
    const [showEditor, setShowEditor] = useState(false);

    return (
        <div>
            <button onClick={() => setShowEditor(true)}>Open Editor</button>
            {showEditor && (
                <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-xl" />}>
                    <HeavyEditor />
                </Suspense>
            )}
        </div>
    );
}
```

### Route-Level Code Splitting

```tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Each route is its own chunk — not downloaded until navigated to
const HomePage       = lazy(() => import('./pages/HomePage'));
const DashboardPage  = lazy(() => import('./pages/DashboardPage'));
const SettingsPage   = lazy(() => import('./pages/SettingsPage'));

const router = createBrowserRouter([{
    path:    '/',
    element: <RootLayout />,
    children: [
        {
            index: true,
            element: (
                <Suspense fallback={<PageSkeleton />}>
                    <HomePage />
                </Suspense>
            )
        },
        {
            path:    'dashboard',
            element: (
                <Suspense fallback={<PageSkeleton />}>
                    <DashboardPage />
                </Suspense>
            )
        },
    ]
}]);

function PageSkeleton() {
    return (
        <div className="animate-pulse space-y-4 py-8">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
    );
}
```

### TanStack Query + Suspense Mode

TanStack Query v5 supports Suspense mode — your component only renders when data is ready:

```tsx
import { useSuspenseQuery } from '@tanstack/react-query';

// No need to handle isLoading — Suspense handles it
function PostList() {
    const { data: posts } = useSuspenseQuery({
        queryKey: ['posts'],
        queryFn: api.getPosts
    });

    // TypeScript knows posts is Post[] — never undefined here
    return (
        <ul>
            {posts.map(post => <PostItem key={post.id} post={post} />)}
        </ul>
    );
}

// Wrap in Suspense + ErrorBoundary at the route level
<ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<PostsSkeleton />}>
        <PostList />
    </Suspense>
</ErrorBoundary>
```

---

## ✅ Milestone Checklist

- [ ] I wrapped each independent section of my UI in its own `ErrorBoundary`
- [ ] I used `lazy()` + `<Suspense>` for at least one heavy component
- [ ] I apply code splitting at the route level
- [ ] I understand that Error Boundaries do NOT catch async errors or event handler errors

## ➡️ Next Unit

[Lesson 06 — Testing React with Vitest + Testing Library](./lesson_06.md)
