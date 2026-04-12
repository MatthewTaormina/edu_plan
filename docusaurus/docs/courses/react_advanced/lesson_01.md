# Lesson 01 — Performance: useMemo, useCallback, memo

> **Course:** React Advanced · **Time:** 60 minutes
> **🔗 Official Docs:** [useMemo](https://react.dev/reference/react/useMemo) · [useCallback](https://react.dev/reference/react/useCallback) · [memo](https://react.dev/reference/react/memo)

---

## 🎯 Learning Objectives

- [ ] Explain when React re-renders and why most re-renders are fine
- [ ] Use `React.memo` to skip re-rendering a component when props are unchanged
- [ ] Use `useCallback` to stabilise function references
- [ ] Use `useMemo` to skip expensive recalculations
- [ ] Profile a component tree with React DevTools

---

## 📖 Concepts

### Why React Re-renders

A component re-renders when:
1. Its **state** changes
2. Its **props** change
3. Its **parent** re-renders (even if props didn't change!)

Most re-renders are fine — React is fast. Optimise only when you have a measured problem.

### `React.memo` — Skip Redundant Renders

```tsx
import { memo } from 'react';

interface ExpensiveItemProps {
    name:    string;
    price:   number;
    onBuy:   () => void;
}

// Wrapped in memo — only re-renders when its own props change
const ExpensiveItem = memo(function ExpensiveItem({ name, price, onBuy }: ExpensiveItemProps) {
    console.log(`Rendering ${name}`);
    return (
        <div className="p-4 border rounded-xl">
            <p>{name} — ${price}</p>
            <button onClick={onBuy} className="btn btn-primary mt-2">Buy</button>
        </div>
    );
});
```

**The catch:** Function props (like `onBuy`) are new references every render, so `memo` still re-renders. This is where `useCallback` comes in.

### `useCallback` — Stable Function References

```tsx
import { useState, useCallback, memo } from 'react';

function ShopPage() {
    const [cart, setCart]    = useState<string[]>([]);
    const [filter, setFilter] = useState('');

    // Without useCallback: new function reference every render → ExpensiveItem always re-renders
    // With useCallback: same reference as long as setCart doesn't change
    const handleBuy = useCallback((productName: string) => {
        setCart(prev => [...prev, productName]);
    }, []);  // setCart is stable — empty deps OK

    return (
        <div>
            <input value={filter} onChange={e => setFilter(e.target.value)} className="input" placeholder="Filter" />
            <p>Cart: {cart.length} items</p>
            {/* Changing filter re-renders ShopPage but NOT ExpensiveItem (memo + useCallback) */}
            <ExpensiveItem name="Widget" price={29.99} onBuy={() => handleBuy("Widget")} />
        </div>
    );
}
```

### `useMemo` — Cache Expensive Computations

```tsx
import { useState, useMemo } from 'react';

function DataTable({ data }: { data: Record<string, number>[] }) {
    const [sortKey, setSortKey] = useState<string>('name');
    const [filter, setFilter]  = useState('');

    // Only re-sorts when data, sortKey, or filter changes
    const processedData = useMemo(() => {
        return data
            .filter(row => String(row[sortKey] ?? '').toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? '')));
    }, [data, sortKey, filter]);

    return (
        <div>
            <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter..." className="input" />
            <table className="w-full mt-4">
                <tbody>
                    {processedData.map((row, i) => (
                        <tr key={i} className="border-b">
                            {Object.values(row).map((cell, j) => (
                                <td key={j} className="py-2 px-4">{String(cell)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

### When to Optimise

| Scenario | Fix |
|----------|-----|
| Child always re-renders even with same props | `React.memo` |
| Stable function references for memoized children | `useCallback` |
| Expensive sort/filter on large datasets | `useMemo` |
| Slow initial render of large list | `react-window` or `react-virtual` (virtualisation) |

:::warning
`useMemo` and `useCallback` have their own overhead. Only add them when React DevTools
Profiler confirms a performance problem — premature optimisation adds complexity without benefit.
:::

### Profiling with React DevTools

1. Install the **React Developer Tools** browser extension
2. Open DevTools → Profiler tab → ⏺ Record → Interact → ⏹ Stop
3. Click on a flame bar to see which component took longest
4. Look for components rendering unexpectedly many times

---

## 🏗️ Assignment

Build a product list with 500+ items (generate dummy data). Add text filtering.
1. Without `memo`/`useCallback` — observe lag in DevTools Profiler
2. Add `memo` to the item component and `useCallback` to handlers
3. Profile again — measure the improvement

---

## ✅ Milestone Checklist

- [ ] I used React DevTools Profiler to identify a slow component
- [ ] I applied `React.memo` and measured the improvement
- [ ] I understand that `useMemo` caches a VALUE and `useCallback` caches a FUNCTION
- [ ] I did NOT blindly add `memo`/`useMemo` everywhere

## ➡️ Next Unit

[Lesson 02 — useReducer & Complex State](./lesson_02.md)
