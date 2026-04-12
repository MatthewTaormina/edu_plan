# Lesson 02 — Components, Props & Children

> **Course:** React Fundamentals · **Time:** 60 minutes
> **📖 Wiki:** [Frontend Frameworks — Component Model](../../domains/web_dev/frontend_frameworks.md#the-component-model)
> **🔗 Official Docs:** [Passing Props](https://react.dev/learn/passing-props-to-a-component) · [Children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)

---

## 🎯 Learning Objectives

- [ ] Define typed props interfaces and destructure them
- [ ] Pass strings, numbers, booleans, objects, arrays, and functions as props
- [ ] Use the `children` prop to compose components
- [ ] Apply default prop values
- [ ] Understand what triggers a re-render

---

## 📖 Concepts

### Props — Data Flowing Down

Props are immutable inputs to a component. A parent controls the data; the child renders it.

```tsx
// Define the props shape with an interface
interface ButtonProps {
    label:     string;
    variant:   "primary" | "secondary" | "danger";
    disabled?: boolean;    // optional
    onClick:   () => void; // function prop
}

function Button({ label, variant, disabled = false, onClick }: ButtonProps) {
    const variantStyles = {
        primary:   "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
        danger:    "bg-red-600 hover:bg-red-700 text-white"
    };

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                       focus:outline-none focus:ring-2 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       ${variantStyles[variant]}`}
        >
            {label}
        </button>
    );
}

// Usage — all these props are verified by TypeScript
<Button label="Save" variant="primary" onClick={() => console.log("saved")} />
<Button label="Cancel" variant="secondary" onClick={handleCancel} />
<Button label="Delete" variant="danger" disabled={!canDelete} onClick={handleDelete} />
```

### Prop Types Patterns

```tsx
// Object and array props
interface ArticleCardProps {
    article: {
        id:          number;
        title:       string;
        excerpt:     string;
        author:      string;
        tags:        string[];
        publishedAt: Date;
    };
}

function ArticleCard({ article }: ArticleCardProps) {
    return (
        <article className="border rounded-xl p-6">
            <div className="flex flex-wrap gap-2 mb-3">
                {article.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="text-gray-500 mt-2">{article.excerpt}</p>
            <div className="mt-4 text-sm text-gray-400">
                {article.author} · {article.publishedAt.toLocaleDateString()}
            </div>
        </article>
    );
}
```

### The `children` Prop

`children` lets a component wrap arbitrary JSX, enabling flexible composition.

```tsx
import type { ReactNode } from 'react';

interface CardProps {
    title:    string;
    children: ReactNode;        // Anything renderable: JSX, string, number, array
    footer?:  ReactNode;        // Optional slot
    className?: string;
}

function Card({ title, children, footer, className = "" }: CardProps) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="px-6 py-4">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    {footer}
                </div>
            )}
        </div>
    );
}

// Usage — children are passed as nested JSX
<Card
    title="User Profile"
    footer={<button className="text-sm text-blue-600">Edit profile</button>}
>
    <p className="text-gray-600">Name: Alex Kim</p>
    <p className="text-gray-600">Role: Administrator</p>
</Card>
```

### Spreading Props

```tsx
// Spread remaining props onto the DOM element (useful for building primitives)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

function LabeledInput({ label, error, ...inputProps }: InputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
                {...inputProps}   // Spreads type, placeholder, value, onChange, etc.
                className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                           ${error ? 'border-red-400' : 'border-gray-300'}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

// All standard input props work automatically
<LabeledInput
    label="Email"
    type="email"
    placeholder="you@example.com"
    required
    error="Please enter a valid email"
/>
```

### Presentational vs Container Components

```tsx
// Presentational — receives data as props, focused on rendering
function UserAvatar({ name, imageUrl, size = "md" }: UserAvatarProps) {
    const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };
    return (
        <img
            src={imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`}
            alt={name}
            className={`${sizes[size]} rounded-full object-cover`}
        />
    );
}

// Container — orchestrates data and passes it down
function UserHeader({ userId }: { userId: number }) {
    // (In a real app, this would fetch data — covered in Lesson 04)
    const user = { name: "Alex Kim", imageUrl: null };
    return (
        <header className="flex items-center gap-4 p-6">
            <UserAvatar name={user.name} imageUrl={user.imageUrl} size="lg" />
            <h1 className="text-2xl font-bold">{user.name}</h1>
        </header>
    );
}
```

---

## 🏗️ Assignments

### Assignment 1 — Design System Components

Build a small component library with typed props:
1. `Badge` — accepts `text`, `color` ("blue" | "green" | "red" | "gray"), optional `icon`
2. `Alert` — accepts `type` ("info" | "success" | "warning" | "error"), `message`, optional `onDismiss` callback
3. `Skeleton` — accepts `width` and `height` classes, renders a pulsing grey placeholder

### Assignment 2 — Composition Challenge

Build a `StatCard` component using `Card` as the wrapper. `StatCard` accepts: `title`, `value`, `trend` (+/- percentage string), `trendDirection` ("up" | "down"). Render 4 stat cards in a 2×2 grid.

---

## ✅ Milestone Checklist

- [ ] I typed props with an interface including optional, required, and function props
- [ ] I used `children: ReactNode` to make a wrapper component
- [ ] I spread extra props (`...rest`) onto a DOM element
- [ ] I understand the difference between presentational and container components

## ➡️ Next Unit

[Lesson 03 — State with useState](./lesson_03.md)
