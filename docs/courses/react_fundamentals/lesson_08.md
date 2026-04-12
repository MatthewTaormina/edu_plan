# Lesson 08 — Custom Hooks

> **Course:** React Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

## 🎯 Learning Objectives

- [ ] Explain what custom hooks are and why they exist
- [ ] Extract stateful logic from a component into a reusable hook
- [ ] Build common utility hooks: `useDebounce`, `useLocalStorage`, `useFetch`
- [ ] Know the naming convention rule (`use` prefix is mandatory)

---

## 📖 Concepts

### What Are Custom Hooks?

Custom hooks are **functions that use other hooks**. They let you extract and share stateful logic between components — without changing the component tree or requiring render props.

```
Before: Component does everything
  ├── fetch data
  ├── manage loading/error state
  ├── manage form state
  └── render UI

After: Component delegates to hooks
  ├── useFetchUser()       → hook
  ├── useForm(initialValues) → hook
  └── render UI (clean component)
```

**Rule:** A custom hook must start with `use`. This tells React to enforce the rules of hooks for it.

### `useDebounce` — Delay Rapid Updates

```tsx
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);  // Cancel if value changes before delay
    }, [value, delay]);

    return debouncedValue;
}

// Usage — search only fires 500ms after user stops typing
function SearchBar() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch) {
            fetch(`/api/search?q=${debouncedSearch}`);
        }
    }, [debouncedSearch]);  // Only called when debounced value settles

    return <input value={search} onChange={e => setSearch(e.target.value)} className="input" />;
}
```

### `useLocalStorage` — Synchronised Persistent State

```tsx
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    function setValue(value: T | ((prev: T) => T)) {
        try {
            const valueToStore = typeof value === 'function'
                ? (value as (prev: T) => T)(storedValue)
                : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error saving to localStorage key "${key}":`, error);
        }
    }

    return [storedValue, setValue];
}

// Usage — drop-in replacement for useState, but persists
function ThemeToggle() {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
}
```

### `useFetch` — Generic Data Fetching

```tsx
import { useState, useEffect, useRef } from 'react';

interface FetchState<T> {
    data:     T | null;
    loading:  boolean;
    error:    string | null;
    refetch:  () => void;
}

function useFetch<T>(url: string | null): FetchState<T> {
    const [data, setData]       = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);
    const refetchTrigger        = useRef(0);

    useEffect(() => {
        if (!url) return;

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetch(url, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                return res.json() as Promise<T>;
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [url, refetchTrigger.current]);

    return {
        data,
        loading,
        error,
        refetch: () => { refetchTrigger.current++; }
    };
}

// Usage
function UserProfile({ userId }: { userId: number }) {
    const { data: user, loading, error, refetch } =
        useFetch<User>(userId ? `/api/users/${userId}` : null);

    if (loading) return <Spinner />;
    if (error)   return <ErrorMessage message={error} onRetry={refetch} />;
    if (!user)   return null;
    return <UserCard user={user} />;
}
```

### `useWindowSize` — Viewport Dimensions

```tsx
import { useState, useEffect } from 'react';

interface WindowSize { width: number; height: number; }

function useWindowSize(): WindowSize {
    const [size, setSize] = useState<WindowSize>({
        width:  window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        function handleResize() {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}

// Usage
function AdaptiveLayout() {
    const { width } = useWindowSize();
    return (
        <div className={width >= 768 ? 'grid grid-cols-2' : 'flex flex-col'}>
            ...
        </div>
    );
}
```

---

## 🏗️ Assignments

### Assignment 1 — Hook Library

Build these custom hooks:
1. `useToggle(initial = false)` — returns `[value, toggle]`
2. `useCounter(initial = 0, { min, max }?)` — returns `{ count, increment, decrement, reset }`
3. `useMediaQuery(query: string)` — returns `boolean` (example: `useMediaQuery('(min-width: 768px)')`)
4. `usePrevious<T>(value: T): T | undefined` — returns the previous render's value

### Assignment 2 — Form Hook

Extract the `useForm` logic from Lesson 05 into a proper custom hook file. Add a `validate` function parameter. Demonstrate it used in two different forms.

---

## ✅ Milestone Checklist

- [ ] All my custom hooks start with `use`
- [ ] My hooks extract real logic (state + effects) rather than just wrapping components
- [ ] `useLocalStorage` correctly handles JSON parse errors
- [ ] `useFetch` cleans up with `AbortController`

## ➡️ Next Unit

[Lesson 09 — Capstone: Reading List Tracker](./lesson_09.md)
