# Lesson 06 — Lists, Keys & Conditional Rendering

> **Course:** React Fundamentals · **Time:** 45 minutes
> **🔗 Official Docs:** [Rendering Lists](https://react.dev/learn/rendering-lists) · [Conditional Rendering](https://react.dev/learn/conditional-rendering)

---

## 🎯 Learning Objectives

- [ ] Render arrays of elements using `.map()` with correct `key` props
- [ ] Explain what happens when `key` is missing or incorrectly set
- [ ] Conditionally render components using `&&`, ternary, and early returns
- [ ] Render different content for empty states

---

## 📖 Concepts

### Rendering Lists

```tsx
interface Product {
    id:      number;
    name:    string;
    price:   number;
    inStock: boolean;
}

const products: Product[] = [
    { id: 1, name: "Widget Pro", price: 29.99, inStock: true },
    { id: 2, name: "Gadget Max", price: 49.99, inStock: false },
    { id: 3, name: "Doohickey",  price: 9.99,  inStock: true },
];

function ProductList() {
    return (
        <ul className="divide-y divide-gray-200">
            {products.map(product => (
                // key MUST be a unique, stable identifier from your DATA
                // key is NOT a prop — you cannot read it inside ProductItem
                <ProductItem key={product.id} product={product} />
            ))}
        </ul>
    );
}

function ProductItem({ product }: { product: Product }) {
    return (
        <li className="flex items-center justify-between py-4">
            <div>
                <p className="font-medium">{product.name}</p>
                <p className={`text-sm ${product.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                    {product.inStock ? "In stock" : "Out of stock"}
                </p>
            </div>
            <span className="font-mono text-gray-700">${product.price.toFixed(2)}</span>
        </li>
    );
}
```

### The `key` Prop — Why It Matters

`key` helps React identify which item changed, was added, or was removed. Without it, React re-renders the entire list on every change.

```tsx
// ❌ Index as key — breaks when items are reordered or removed
{items.map((item, index) => (
    <Item key={index} item={item} />  // React loses track of identity on deletion
))}

// ✅ Stable data ID as key
{items.map(item => (
    <Item key={item.id} item={item} />
))}
```

### Filtering and Sorting Before Rendering

```tsx
function ProductCatalog() {
    const [search, setSearch]       = useState('');
    const [showInStock, setShowInStock] = useState(false);
    const [sortBy, setSortBy]       = useState<'name' | 'price'>('name');

    const filteredProducts = products
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .filter(p => (showInStock ? p.inStock : true))
        .sort((a, b) => sortBy === 'price' ? a.price - b.price : a.name.localeCompare(b.name));

    return (
        <div>
            {/* Controls */}
            <div className="flex gap-4 mb-6">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="input flex-1"
                />
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={showInStock} onChange={e => setShowInStock(e.target.checked)} />
                    In stock only
                </label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as 'name' | 'price')} className="input">
                    <option value="name">Sort by name</option>
                    <option value="price">Sort by price</option>
                </select>
            </div>

            {/* List */}
            {filteredProducts.length > 0 ? (
                <ul className="divide-y">
                    {filteredProducts.map(p => <ProductItem key={p.id} product={p} />)}
                </ul>
            ) : (
                <EmptyState message={search ? `No results for "${search}"` : "No products available"} />
            )}
        </div>
    );
}
```

### Conditional Rendering Patterns

```tsx
// Pattern 1: Early return — cleanest for loading/error states
function UserCard({ userId }: { userId: number }) {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    // (fetch data in useEffect...)

    if (error)  return <ErrorMessage message={error} />;
    if (!user)  return <Skeleton />;
    return <div>{user.name}</div>;
}

// Pattern 2: && — render only if truthy
function Notification({ message, type }: { message?: string; type: "info" | "error" }) {
    return (
        <div>
            {message && (  // Only renders the Alert if message is truthy
                <Alert type={type}>{message}</Alert>
            )}
        </div>
    );
}
// ⚠️ WARNING: {count && <Badge />} — if count is 0, React renders "0"!
// Fix: {count > 0 && <Badge count={count} />}

// Pattern 3: Ternary — choose between two things
function ToggleButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
    return (
        <button onClick={onToggle} className="btn btn-secondary">
            {isOpen ? "Close panel" : "Open panel"}
        </button>
    );
}

// Pattern 4: Object lookup — replace long if/else chains
type Status = "idle" | "loading" | "success" | "error";

const statusConfig: Record<Status, { icon: string; color: string; label: string }> = {
    idle:    { icon: "○", color: "text-gray-400", label: "Not started" },
    loading: { icon: "◌", color: "text-blue-500", label: "Loading..." },
    success: { icon: "●", color: "text-emerald-500", label: "Complete" },
    error:   { icon: "✕", color: "text-red-500",   label: "Failed" }
};

function StatusIndicator({ status }: { status: Status }) {
    const { icon, color, label } = statusConfig[status];
    return (
        <span className={`flex items-center gap-1 text-sm ${color}`}>
            {icon} {label}
        </span>
    );
}
```

### Empty State Component

```tsx
function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-semibold text-gray-700">{message}</h3>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
```

---

## ✅ Milestone Checklist

- [ ] Every `.map()` has a `key` prop using a stable data ID (not index)
- [ ] I conditionally render using `&&` (with guard against falsy 0) and ternaries
- [ ] I have an empty state for every list
- [ ] I filter/sort derived data from state before rendering

## ➡️ Next Unit

[Lesson 07 — Context & useContext](./lesson_07.md)
