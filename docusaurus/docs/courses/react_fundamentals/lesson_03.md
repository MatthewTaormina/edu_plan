# Lesson 03 — State with useState

> **Course:** React Fundamentals · **Time:** 60 minutes
> **📖 Wiki:** [Frontend Frameworks — State Management](../../domains/web_dev/frontend_frameworks.md#state-management)
> **🔗 Official Docs:** [useState](https://react.dev/reference/react/useState) · [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)

---

## 🎯 Learning Objectives

- [ ] Declare and update state with `useState`
- [ ] Explain why state triggers re-renders and props do not
- [ ] Update objects and arrays in state correctly (immutably)
- [ ] Lift state up to share it between sibling components
- [ ] Distinguish between controlled and uncontrolled components

---

## 📖 Concepts

### `useState` — Reactive Local State

State is data that changes over time. When state changes, React re-renders the component.

```tsx
import { useState } from 'react';

function Counter() {
    // [currentValue, setterFunction] = useState(initialValue)
    const [count, setCount] = useState(0);

    return (
        <div className="flex items-center gap-4">
            <button onClick={() => setCount(count - 1)} className="btn btn-secondary">−</button>
            <span className="text-2xl font-bold w-8 text-center">{count}</span>
            <button onClick={() => setCount(count + 1)} className="btn btn-primary">+</button>
        </div>
    );
}
```

**Key rules:**
1. `useState` returns `[value, setter]` — always destructure as a pair
2. Calling the setter triggers a re-render
3. React batches state updates within event handlers (multiple `setState` calls = one re-render)
4. State is **local** — each component instance has its own state

### State Updates with Previous Value

When the new state depends on the old state, use the **functional updater form** to avoid stale closures:

```tsx
// ❌ Stale closure problem (rare but real in effects and event handlers)
setCount(count + 1); // count may be stale in async contexts

// ✅ Always current — React passes the latest value to the callback
setCount(prevCount => prevCount + 1);
```

### TypeScript with `useState`

```tsx
// TypeScript infers the type from the initial value
const [count, setCount] = useState(0);          // number
const [name, setName]   = useState("Alex");     // string
const [open, setOpen]   = useState(false);      // boolean

// Explicitly type when initial value is null or ambiguous
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);
```

### Updating Objects in State — Immutability

**Never mutate state directly.** Always create a new object/array.

```tsx
interface UserProfile {
    name:     string;
    email:    string;
    bio:      string;
    darkMode: boolean;
}

function ProfileEditor() {
    const [profile, setProfile] = useState<UserProfile>({
        name:     "Alex Kim",
        email:    "alex@example.com",
        bio:      "Frontend developer",
        darkMode: false
    });

    function updateField<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
        // Spread to copy, then override the changed field
        setProfile(prev => ({ ...prev, [key]: value }));
    }

    return (
        <form className="space-y-4">
            <input
                value={profile.name}
                onChange={e => updateField('name', e.target.value)}
                className="input"
                placeholder="Name"
            />
            <input
                value={profile.bio}
                onChange={e => updateField('bio', e.target.value)}
                className="input"
                placeholder="Bio"
            />
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={profile.darkMode}
                    onChange={e => updateField('darkMode', e.target.checked)}
                />
                Dark mode
            </label>
            <pre className="text-sm bg-gray-100 p-3 rounded">{JSON.stringify(profile, null, 2)}</pre>
        </form>
    );
}
```

### Updating Arrays in State

```tsx
function TodoList() {
    const [todos, setTodos] = useState<string[]>([]);
    const [input, setInput]  = useState('');

    // ADD — create new array with added item
    const addTodo = () => {
        if (!input.trim()) return;
        setTodos(prev => [...prev, input.trim()]);
        setInput('');
    };

    // REMOVE — filter out the item
    const removeTodo = (index: number) => {
        setTodos(prev => prev.filter((_, i) => i !== index));
    };

    // UPDATE — map and replace
    const updateTodo = (index: number, newText: string) => {
        setTodos(prev => prev.map((todo, i) => i === index ? newText : todo));
    };

    return (
        <div>
            <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} className="input flex-1" placeholder="New todo" />
                <button onClick={addTodo} className="btn btn-primary">Add</button>
            </div>
            <ul className="mt-4 space-y-2">
                {todos.map((todo, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                        <span className="flex-1">{todo}</span>
                        <button onClick={() => removeTodo(i)} className="text-red-500 text-sm">Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

### Lifting State Up

When sibling components need the same state, move it to their nearest common parent.

```tsx
// Both ColorPicker and ColorPreview need the selected color
// Solution: lift state to their parent App component

function ColorPicker({ color, onChange }: { color: string; onChange: (c: string) => void }) {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    return (
        <div className="flex gap-2">
            {colors.map(c => (
                <button
                    key={c}
                    onClick={() => onChange(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        c === color ? 'border-gray-900 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={c}
                />
            ))}
        </div>
    );
}

function ColorPreview({ color }: { color: string }) {
    return (
        <div
            className="w-32 h-32 rounded-2xl transition-colors"
            style={{ backgroundColor: color }}
        />
    );
}

function App() {
    // State lives in the PARENT, shared downward via props
    const [selectedColor, setSelectedColor] = useState('#3b82f6');

    return (
        <div className="p-8 flex flex-col items-center gap-8">
            <ColorPreview color={selectedColor} />
            <ColorPicker color={selectedColor} onChange={setSelectedColor} />
        </div>
    );
}
```

---

## 🏗️ Assignments

### Assignment 1 — Shopping Cart State

Build a simple shopping cart:
- A list of products (hardcoded array of objects)
- Each product has an "Add to cart" button
- A cart panel showing items and total price
- Items can be removed from cart
- State is lifted appropriately

### Assignment 2 — Multi-Step Form

Build a 3-step wizard form with Next/Back buttons. State tracks current step and form values. Display a summary on step 3.

---

## ✅ Milestone Checklist

- [ ] I understand that calling `setState` triggers a re-render
- [ ] I updated objects and arrays immutably (never mutating in place)
- [ ] I used the functional updater form `setState(prev => ...)`
- [ ] I lifted state up to share it between sibling components

## ➡️ Next Unit

[Lesson 04 — Side Effects with useEffect](./lesson_04.md)
