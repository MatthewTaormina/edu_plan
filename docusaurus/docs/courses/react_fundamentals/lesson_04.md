# Lesson 04 — Side Effects with useEffect

> **Course:** React Fundamentals · **Time:** 60 minutes
> **📖 Wiki:** [Frontend Frameworks — Lifecycle](../../domains/web_dev/frontend_frameworks.md#component-lifecycle)
> **🔗 Official Docs:** [useEffect](https://react.dev/reference/react/useEffect) · [Synchronising with Effects](https://react.dev/learn/synchronizing-with-effects)

---

## 🎯 Learning Objectives

- [ ] Explain what a "side effect" is in the React context
- [ ] Run code after a component mounts with an empty dependency array
- [ ] Re-run effects when dependencies change
- [ ] Return a cleanup function to cancel subscriptions and timers
- [ ] Avoid common pitfalls: stale closures, infinite loops

---

## 📖 Concepts

### What is a Side Effect?

A **side effect** is anything that affects something outside the component's render:
- Fetching data from an API
- Setting up a timer or interval
- Subscribing to events or WebSockets
- Updating `document.title`
- Reading/writing to localStorage

React's rendering must be a **pure function** — same props/state → same output, no side effects. Side effects go in `useEffect`.

### `useEffect` Syntax

```tsx
useEffect(() => {
    // the effect
    return () => {
        // cleanup (optional) — runs before the effect re-runs or before component unmounts
    };
}, [/* dependency array */]);
```

### The Three Dependency Array Patterns

```tsx
// 1. Empty array [] — run ONCE after first render (mount)
useEffect(() => {
    const subscription = api.subscribe(handleData);
    return () => subscription.unsubscribe(); // clean up on unmount
}, []);

// 2. With dependencies — run every time [dep] changes
useEffect(() => {
    document.title = `${unreadCount} new messages`;
}, [unreadCount]);

// 3. No array — run after EVERY render (rare — usually a mistake)
useEffect(() => {
    console.log("I run after every render");
});
```

### Fetching Data with useEffect

```tsx
interface User {
    id:       number;
    login:    string;
    name:     string | null;
    avatar_url: string;
    public_repos: number;
}

function GitHubProfile({ username }: { username: string }) {
    const [user, setUser]       = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);

    useEffect(() => {
        // Abort controller — cancels in-flight request when component unmounts
        const controller = new AbortController();

        async function fetchUser() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `https://api.github.com/users/${username}`,
                    { signal: controller.signal }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: User = await res.json();
                setUser(data);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    setError((err as Error).message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchUser();

        // Cleanup: cancel request if username changes before fetch completes
        return () => controller.abort();
    }, [username]); // Re-run when username prop changes

    if (loading) return <div className="animate-pulse h-24 bg-gray-200 rounded-xl" />;
    if (error)   return <p className="text-red-500">Error: {error}</p>;
    if (!user)   return null;

    return (
        <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border shadow-sm">
            <img src={user.avatar_url} alt={user.login} className="w-16 h-16 rounded-full" />
            <div>
                <h2 className="font-bold text-lg">{user.name ?? user.login}</h2>
                <p className="text-gray-500">@{user.login}</p>
                <p className="text-sm text-gray-400 mt-1">{user.public_repos} public repos</p>
            </div>
        </div>
    );
}
```

### Event Listeners

```tsx
function useKeyPress(key: string, handler: () => void) {
    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === key) handler();
        }
        // Add the listener
        window.addEventListener('keydown', onKeyDown);
        // Remove it when the component unmounts or key/handler changes
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [key, handler]);  // React requires all values used inside to be in deps
}

// Usage
function Modal({ onClose }: { onClose: () => void }) {
    useKeyPress('Escape', onClose);  // Close modal on Esc

    return (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <h2>Modal Content</h2>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
```

### Common Pitfalls

```tsx
// ❌ INFINITE LOOP — object/array is recreated every render
useEffect(() => {
    fetch('/api/data');
}, [{ id: 1 }]);  // New object reference every render → triggers effect → render → repeat

// ✅ Use a primitive dependency
useEffect(() => {
    fetch(`/api/users/${userId}`);
}, [userId]);  // userId is a number — stable reference

// ❌ Missing dependency — stale closure
const [count, setCount] = useState(0);
useEffect(() => {
    const id = setInterval(() => {
        setCount(count + 1);  // count is stale — always uses initial value 0
    }, 1000);
    return () => clearInterval(id);
}, []);  // Missing count in deps

// ✅ Use functional updater to avoid needing count in deps
useEffect(() => {
    const id = setInterval(() => {
        setCount(prev => prev + 1);  // Always uses the latest count
    }, 1000);
    return () => clearInterval(id);
}, []);
```

---

## 🏗️ Assignments

### Assignment 1 — Data-Driven Component

Build a `UserSearch` component:
- Text input for a GitHub username
- `useEffect` fetches from `https://api.github.com/users/{username}` when input changes (with 500ms debounce)
- Shows loading skeleton, error message, or user card
- Cleans up with `AbortController`

### Assignment 2 — Document Title Side Effect

Build a component that updates `document.title` using `useEffect` to show the current page name and unread notification count.

---

## ✅ Milestone Checklist

- [ ] I understand the three dependency array patterns
- [ ] I use `AbortController` to cancel fetch requests on cleanup
- [ ] I removed event listeners in the `useEffect` cleanup function
- [ ] I did NOT put an object literal in the dependency array

## ➡️ Next Unit

[Lesson 05 — Events & Forms](./lesson_05.md)
