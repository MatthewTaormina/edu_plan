# Lesson 01 — What is React, Vite Setup & JSX

> **Course:** React Fundamentals · **Time:** 60 minutes
> **📖 Wiki:** [Frontend Frameworks](../../domains/web_dev/frontend_frameworks.md)
> **🔗 Official Docs:** [React — Your First Component](https://react.dev/learn/your-first-component) · [JSX](https://react.dev/learn/writing-markup-with-jsx)

---

## 🎯 Learning Objectives

- [ ] Create a Vite + React + TypeScript project
- [ ] Explain how React renders components to the real DOM
- [ ] Write valid JSX and understand how it differs from HTML
- [ ] Use JSX expressions, conditional rendering, and className

---

## 📖 Concepts

### What React Does

React is a **JavaScript library for building user interfaces**. You describe *what* the UI should look like as a tree of components. React figures out the most efficient way to update the real DOM to match.

```
Your Code:
  <UserCard name="Alex" role="admin" />

React renders:
  <div class="card">
    <h2>Alex</h2>
    <span class="badge">admin</span>
  </div>

When name changes to "Sam", React:
  → Compares (diffs) the new virtual DOM with the previous
  → Updates ONLY the text node inside <h2> in the real DOM
```

This is the **virtual DOM** — React maintains an in-memory tree and surgically patches the real DOM.

### Project Setup

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
```

Project structure:
```
my-react-app/
├── index.html         ← Entry HTML — has <div id="root">
├── src/
│   ├── main.tsx       ← Mounts React into #root
│   ├── App.tsx        ← Root component
│   └── App.css
├── vite.config.ts
└── tsconfig.json
```

```tsx
// src/main.tsx — React's entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mount the React component tree into the DOM element with id="root"
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

`React.StrictMode` renders components twice in development (but not production) to help detect side effects. Leave it on.

### JSX — JavaScript XML

JSX looks like HTML but it's JavaScript (or TypeScript). Babel/esbuild compiles it to `React.createElement()` calls.

```tsx
// JSX
const element = <h1 className="title">Hello, World!</h1>;

// Compiles to:
const element = React.createElement('h1', { className: 'title' }, 'Hello, World!');
```

**Key differences from HTML:**

| HTML | JSX |
|------|-----|
| `class="..."` | `className="..."` |
| `for="..."` | `htmlFor="..."` |
| `onclick="..."` | `onClick={handler}` |
| `<br>` | `<br />` (must self-close) |
| `<!-- comment -->` | `{/* comment */}` |
| Inline style: `style="color: red"` | `style={{ color: 'red' }}` |

```tsx
// JSX expressions — embed JavaScript with {}
const name = "Alex";
const isAdmin = true;

return (
    <div>
        <h1>Welcome, {name}!</h1>
        <p>Role: {isAdmin ? "Administrator" : "User"}</p>
        <p>Today: {new Date().toLocaleDateString()}</p>
    </div>
);
```

### Your First Component

A React component is a **function that returns JSX**.

```tsx
// Greeting.tsx — PascalCase file names are a strong convention
interface GreetingProps {
    name: string;
    timeOfDay: "morning" | "afternoon" | "evening";
}

export function Greeting({ name, timeOfDay }: GreetingProps) {
    const salutations = {
        morning:   "Good morning",
        afternoon: "Good afternoon",
        evening:   "Good evening"
    };

    return (
        <div className="greeting-card">
            <h1 className="text-2xl font-bold">
                {salutations[timeOfDay]}, {name}!
            </h1>
            <p className="text-gray-500 mt-1">Welcome back.</p>
        </div>
    );
}
```

```tsx
// App.tsx — using the component
import { Greeting } from './Greeting';

export default function App() {
    return (
        <main className="p-8">
            <Greeting name="Alex" timeOfDay="morning" />
        </main>
    );
}
```

### JSX Rules

1. **One root element** — a component must return a single root element
   ```tsx
   // ❌ Error: Adjacent JSX elements must be wrapped
   return (
       <h1>Title</h1>
       <p>Body</p>
   );

   // ✅ Wrap in a div or Fragment
   return (
       <>
           <h1>Title</h1>
           <p>Body</p>
       </>
   );
   ```

2. **Close all tags** — `<br />`, `<input />`, `<img />`

3. **camelCase attributes** — `onClick`, `onChange`, `tabIndex`, `className`

---

## 🏗️ Assignments

### Assignment 1 — Profile Card Component

Create a `ProfileCard` component that accepts:
- `name: string`
- `role: string`
- `avatar: string` (URL)
- `bio: string`
- `isOnline: boolean`

Render a card with a green/grey dot indicator based on `isOnline`. Use Tailwind CSS classes.

### Assignment 2 — Component Composition

Create three components: `PageHeader`, `PageFooter`, and `App`. Compose them in `App`. Each returns a fully typed JSX element.

---

## ✅ Milestone Checklist

- [ ] I have a working Vite + React + TypeScript project (`npm run dev` opens in browser)
- [ ] I know the 4 key JSX differences from HTML (`className`, `htmlFor`, self-closing, camelCase events)
- [ ] I wrote a typed component with an interface for its props
- [ ] I understand what `React.StrictMode` does

## ➡️ Next Unit

[Lesson 02 — Components, Props & Children](./lesson_02.md)
