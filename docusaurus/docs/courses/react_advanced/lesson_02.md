# Lesson 02 — useReducer & Complex State

> **Course:** React Advanced · **Time:** 60 minutes
> **🔗 Official Docs:** [useReducer](https://react.dev/reference/react/useReducer) · [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)

---

## 🎯 Learning Objectives

- [ ] Explain when `useReducer` is preferable to multiple `useState` calls
- [ ] Write typed reducers with discriminated union actions
- [ ] Handle async actions in reducers (loading/error pattern)
- [ ] Combine `useReducer` with `useContext` for global state

---

## 📖 Concepts

### When to Prefer `useReducer`

Use `useReducer` when:
- State has **multiple sub-values** that update together
- **Next state depends on previous** state in complex ways
- You want to **document all possible state transitions** explicitly
- You need the reducer to be **testable in isolation**

```tsx
// Many useState — hard to see relationships
const [items,    setItems]    = useState<CartItem[]>([]);
const [discount, setDiscount] = useState(0);
const [shipping, setShipping] = useState('standard');
const [coupon,   setCoupon]   = useState<string | null>(null);
const [status,   setStatus]   = useState<'idle' | 'loading' | 'success'>('idle');

// One useReducer — all state and transitions in one place
const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
```

### Writing a Typed Reducer

```tsx
// 1. Define the state shape
interface CartState {
    items:    CartItem[];
    discount: number;
    coupon:   string | null;
    shipping: 'standard' | 'express';
    status:   'idle' | 'loading' | 'success' | 'error';
    error:    string | null;
}

// 2. Define all possible actions as a discriminated union
type CartAction =
    | { type: 'ADD_ITEM';     payload: CartItem }
    | { type: 'REMOVE_ITEM';  payload: { id: number } }
    | { type: 'UPDATE_QTY';   payload: { id: number; qty: number } }
    | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
    | { type: 'REMOVE_COUPON' }
    | { type: 'SET_SHIPPING';  payload: { method: 'standard' | 'express' } }
    | { type: 'CHECKOUT_START' }
    | { type: 'CHECKOUT_SUCCESS' }
    | { type: 'CHECKOUT_ERROR';  payload: { message: string } };

const initialCartState: CartState = {
    items:    [],
    discount: 0,
    coupon:   null,
    shipping: 'standard',
    status:   'idle',
    error:    null
};

// 3. Write the reducer — a pure function
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existing = state.items.find(i => i.id === action.payload.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map(i =>
                        i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
                    )
                };
            }
            return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
        }
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };

        case 'UPDATE_QTY':
            return {
                ...state,
                items: state.items
                    .map(i => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i)
                    .filter(i => i.qty > 0)
            };

        case 'APPLY_COUPON':
            return { ...state, coupon: action.payload.code, discount: action.payload.discount };

        case 'REMOVE_COUPON':
            return { ...state, coupon: null, discount: 0 };

        case 'SET_SHIPPING':
            return { ...state, shipping: action.payload.method };

        case 'CHECKOUT_START':
            return { ...state, status: 'loading', error: null };

        case 'CHECKOUT_SUCCESS':
            return { ...initialCartState, status: 'success' };

        case 'CHECKOUT_ERROR':
            return { ...state, status: 'error', error: action.payload.message };

        default:
            return state;  // Unreachable — TypeScript exhaustion check
    }
}
```

### Using the Reducer in a Component

```tsx
function ShoppingCart() {
    const [state, dispatch] = useReducer(cartReducer, initialCartState);

    const total = state.items.reduce((acc, i) => acc + i.price * i.qty, 0);
    const discountedTotal = total * (1 - state.discount);

    async function handleCheckout() {
        dispatch({ type: 'CHECKOUT_START' });
        try {
            await fetch('/api/checkout', {
                method: 'POST',
                body: JSON.stringify({ items: state.items, coupon: state.coupon }),
                headers: { 'Content-Type': 'application/json' }
            });
            dispatch({ type: 'CHECKOUT_SUCCESS' });
        } catch (err) {
            dispatch({ type: 'CHECKOUT_ERROR', payload: { message: (err as Error).message } });
        }
    }

    if (state.status === 'success') return <OrderConfirmation />;

    return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            {state.items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
                <ul className="space-y-4">
                    {state.items.map(item => (
                        <li key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border">
                            <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty - 1 } })}
                                    className="w-8 h-8 rounded-full border flex items-center justify-center"
                                >−</button>
                                <span className="w-6 text-center">{item.qty}</span>
                                <button
                                    onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty + 1 } })}
                                    className="w-8 h-8 rounded-full border flex items-center justify-center"
                                >+</button>
                                <button
                                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
                                    className="text-red-500 text-sm ml-2"
                                >Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {state.error && <p className="text-red-500 mt-4">{state.error}</p>}

            <div className="mt-6 flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>${discountedTotal.toFixed(2)}</span>
            </div>

            <button
                onClick={handleCheckout}
                disabled={state.items.length === 0 || state.status === 'loading'}
                className="w-full btn btn-primary mt-4 disabled:opacity-50"
            >
                {state.status === 'loading' ? 'Processing…' : 'Checkout'}
            </button>
        </div>
    );
}
```

---

## ✅ Milestone Checklist

- [ ] My reducer is a pure function — no side effects, no direct mutation
- [ ] All action types are a discriminated union — TypeScript narrows `payload` correctly
- [ ] I tested the reducer in isolation (pure function → easy to unit test)
- [ ] I know when to prefer `useReducer` over `useState`

## ➡️ Next Unit

[Lesson 03 — React Router v6](./lesson_03.md)
