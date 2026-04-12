# Lesson 03 — React Router v6

> **Course:** React Advanced · **Time:** 60 minutes
> **🔗 Official Docs:** [React Router Docs](https://reactrouter.com/en/main) · [Tutorial](https://reactrouter.com/en/main/start/tutorial)

---

## 🎯 Learning Objectives

- [ ] Set up React Router with `createBrowserRouter` and `RouterProvider`
- [ ] Define nested routes with shared layouts
- [ ] Navigate programmatically and declaratively
- [ ] Read URL params and search params
- [ ] Create a route-level loading state with `loader` functions

---

## 📖 Concepts

### Installation & Setup

```bash
npm install react-router-dom
```

```tsx
// src/router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout }       from './layouts/RootLayout';
import { HomePage }         from './pages/HomePage';
import { ArticlesPage }     from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { NotFoundPage }     from './pages/NotFoundPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,   // Shared layout (navbar + footer)
        errorElement: <NotFoundPage />,
        children: [
            { index: true,            element: <HomePage /> },
            { path: 'articles',       element: <ArticlesPage /> },
            { path: 'articles/:slug', element: <ArticleDetailPage /> },
        ]
    }
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
```

```tsx
// src/main.tsx
import { AppRouter } from './router';
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>
);
```

### Shared Layout with `<Outlet />`

```tsx
// src/layouts/RootLayout.tsx
import { Outlet, NavLink } from 'react-router-dom';

export function RootLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b px-6 py-4 flex items-center gap-8 sticky top-0 z-50">
                <NavLink to="/" className="font-bold text-xl">MyApp</NavLink>
                <nav className="flex gap-6 text-sm font-medium text-gray-600">
                    {/* NavLink adds an 'active' class when the route matches */}
                    <NavLink
                        to="/"
                        end  // Only active when EXACTLY "/"
                        className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-gray-900'}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/articles"
                        className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-gray-900'}
                    >
                        Articles
                    </NavLink>
                </nav>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
                <Outlet />   {/* Child routes render here */}
            </main>

            <footer className="border-t px-6 py-4 text-sm text-gray-500 text-center">
                © 2026 MyApp
            </footer>
        </div>
    );
}
```

### URL Params and Navigation

```tsx
// Reading URL params — /articles/:slug
import { useParams, useNavigate, Link } from 'react-router-dom';

export function ArticleDetailPage() {
    const { slug } = useParams<{ slug: string }>();  // Typed params
    const navigate  = useNavigate();

    // Go back programmatically
    const handleBack = () => navigate(-1);

    // Or navigate to a path
    const handleEdit = () => navigate(`/articles/${slug}/edit`);

    return (
        <article>
            <button onClick={handleBack} className="btn btn-secondary mb-6">← Back</button>
            <h1 className="text-3xl font-bold">{slug}</h1>
            {/* Link to a related article */}
            <Link to="/articles" className="text-blue-600 hover:underline">All articles</Link>
        </article>
    );
}
```

### Search Params — URL Query String

```tsx
import { useSearchParams } from 'react-router-dom';

export function ArticlesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const search   = searchParams.get('q') ?? '';
    const category = searchParams.get('cat') ?? 'all';

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (e.target.value) {
                next.set('q', e.target.value);
            } else {
                next.delete('q');
            }
            return next;
        });
    }

    // URL updates to /articles?q=react&cat=typescript
    return (
        <div>
            <input value={search} onChange={handleSearch} placeholder="Search..." className="input" />
            <select
                value={category}
                onChange={e => setSearchParams(prev => { prev.set('cat', e.target.value); return prev; })}
                className="input mt-2"
            >
                <option value="all">All</option>
                <option value="typescript">TypeScript</option>
                <option value="react">React</option>
            </select>
        </div>
    );
}
```

### Protected Routes

```tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RequireAuth({ redirectTo = '/login' }: { redirectTo?: string }) {
    const { user } = useAuth();
    if (!user) return <Navigate to={redirectTo} replace />;
    return <Outlet />;
}

// In router config:
{
    element: <RequireAuth />,
    children: [
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'settings',  element: <SettingsPage /> },
    ]
}
```

---

## ✅ Milestone Checklist

- [ ] My app uses `createBrowserRouter` with nested routes and a shared layout
- [ ] I use `NavLink` with an `isActive` callback for active navigation styling
- [ ] I use `useParams` to read URL segments
- [ ] I use `useSearchParams` to read/write query string filters
- [ ] I have a `RequireAuth` guard for protected routes

## ➡️ Next Unit

[Lesson 04 — Server State with TanStack Query](./lesson_04.md)
