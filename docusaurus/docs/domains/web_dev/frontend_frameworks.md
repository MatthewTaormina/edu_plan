import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Frontend Frameworks

> **Status:** 🟢 Modern — An evolving ecosystem; React, Angular, Vue, and Svelte are all actively maintained.

This page is the **encyclopedic reference** for frontend framework concepts. For guided, step-by-step courses, see:
- [React Fundamentals](../../courses/react_fundamentals/index.md)
- [React Advanced](../../courses/react_advanced/index.md)
- [Angular Fundamentals](../../courses/angular_fundamentals/index.md)

> **Prerequisite:** [JavaScript Core](./javascript_core.md) · [TypeScript](./typescript.md)

---

## Why Frameworks Exist

Vanilla JavaScript struggles as applications grow:

| Problem | Framework Solution |
|---------|-------------------|
| Manual DOM updates get out of sync with data | **Reactivity** — UI auto-updates when state changes |
| No standard way to split code into pieces | **Component model** — encapsulated, reusable pieces |
| Every page requires a full reload | **Client-side routing** — page transitions without reload |
| Global state management is ad-hoc | **State management** — structured patterns for shared data |

---

## The Component Model

All modern frameworks share the concept of **components** — self-contained units of UI that combine structure, logic, and (sometimes) style.

```
Application
├── AppShell           ← Root component
│   ├── Navbar         ← Navigation component
│   ├── Sidebar        ← Sidebar component
│   └── Main
│       ├── ArticleList  ← Container component (fetches data)
│       │   ├── ArticleCard  ← Presentational component (displays data)
│       │   └── ArticleCard
│       └── Pagination
```

**Design principle: Presentational vs Container components**
- **Presentational**: receive data via props, render UI, emit events. No side effects.
- **Container**: fetch data, manage state, pass data down to presentational children.

---

## Reactivity Models

Different frameworks implement reactivity differently:

### React — Explicit State Updates

State is managed explicitly. The UI re-renders when you call a state setter. React diffs a **virtual DOM** (an in-memory representation of what the DOM should look like) against the previous version and applies the minimum set of real DOM changes.

```jsx
// React — declare state, call setter to update
function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Angular — Zone.js + Signals

Angular traditionally used **Zone.js** to automatically detect when async operations complete and trigger change detection cycles. Angular 16+ introduced **Signals** as a more explicit, fine-grained reactivity primitive similar to React's `useState`.

```typescript
// Angular Signals (v16+)
count = signal(0);  // reactive value
doubled = computed(() => this.count() * 2);  // derived value
```

### Vue — Reactive Proxies

Vue wraps your state object in a JavaScript `Proxy`. Any read or write to a reactive variable is tracked automatically, and only the components that read a given value re-render when it changes.

### Svelte — Compile-Time Reactivity

Svelte has no virtual DOM and no runtime reactivity library. The Svelte compiler analyses your `<script>` block and generates highly optimised, surgical DOM update calls. `let count = 0; count++` literally compiles into a DOM update.

---

## Props and Data Flow

```
Parent Component
  │
  │  props (data flowing DOWN)
  ▼
Child Component
  │
  │  events / callbacks (data flowing UP)
  ▼
Parent Component
```

| Framework | Passing data down | Emitting data up |
|-----------|------------------|-----------------|
| React | props | callback props (`onSubmit`, `onChange`) |
| Angular | `@Input()` | `@Output()` + `EventEmitter` |
| Vue | `:prop-name` binding | `$emit('event-name', payload)` |
| Svelte | `export let propName` | `createEventDispatcher()` |

---

## Component Lifecycle

Every component goes through creation, updates, and destruction. Each framework provides hooks to run code at these points.

| Phase | React Hook | Angular Lifecycle | Vue |
|-------|-----------|------------------|-----|
| Setup / Mount | `useEffect(() => {}, [])` | `ngOnInit()` | `onMounted()` |
| Before destroy | `useEffect(() => { return cleanup }, [])` | `ngOnDestroy()` | `onUnmounted()` |
| On prop/state change | `useEffect(() => {}, [dep])` | `ngOnChanges()` | `watch(dep, handler)` |

---

## State Management

State comes in three scopes:

| Scope | Fits in... | Solution |
|-------|-----------|---------|
| **Local** — belongs to one component | `useState` / `signal` | Framework primitive |
| **Shared** — multiple components need it | React Context, Angular Service | Built-in |
| **Global / complex** — many parts of app, derived state, async | External library | Redux Toolkit, Zustand, Pinia |

### React State Ecosystem

```
useState       — local, simple value
useReducer     — local, complex transitions
Context        — shared within a subtree (theme, auth user)
Zustand        — lightweight global store (recommended for most apps)
Redux Toolkit  — large scale apps with many developers
TanStack Query — server state: caching, fetching, background refresh
```

### Angular State Ecosystem

```
Component property  — local
Service + BehaviorSubject — shared (RxJS-based)
Signal              — fine-grained reactive local/shared state (Angular 16+)
NgRx                — Redux-inspired, large scale
```

---

## Routing

Client-side routing intercepts browser navigation events and swaps component trees without a page reload. This enables Single Page Application (SPA) behaviour.

| Framework | Router |
|-----------|--------|
| React | React Router v6 / TanStack Router |
| Angular | `@angular/router` (built-in) |
| Vue | Vue Router (official) |
| Next.js | App Router (file-based, built-in) |

---

## Framework Comparison Matrix

| | React | Angular | Vue | Svelte |
|-|-------|---------|-----|--------|
| **Language** | JS/TS | TypeScript (required) | JS/TS | JS/TS |
| **Reactivity** | Virtual DOM + explicit state | Zone.js / Signals | Reactive Proxy | Compile-time |
| **Template syntax** | JSX (JS-in-HTML) | HTML template directives | HTML template + JSX option | HTML template |
| **Bundle size (core)** | ~42 KB | ~150 KB | ~22 KB | ~2 KB |
| **Opinionation** | Low (bring your own libraries) | High (batteries included) | Medium | Low |
| **TypeScript** | Opt-in | Required | Opt-in | Opt-in |
| **Job market** | ⭐⭐⭐ Very high | ⭐⭐ High (enterprise) | ⭐⭐ Medium | ⭐ Growing |
| **Best for** | SPAs, diverse teams | Enterprise teams | Progressive enhancement | Performance-critical |

---

## SSR and Meta-Frameworks

Frameworks can run on the server as well as the browser — see [SSR vs CSR](./ssr_csr.md) for a full treatment.

| Framework | Meta-Framework (adds SSR, routing, etc.) |
|-----------|------------------------------------------|
| React | **Next.js** · Remix |
| Angular | **Angular Universal** (built-in) / Analog |
| Vue | **Nuxt.js** |
| Svelte | **SvelteKit** |

---

## 📚 Resources

<Tabs>
<TabItem value="react" label="React">

- [React Docs — Learn React](https://react.dev/learn) — official, interactive
- [react.dev Reference](https://react.dev/reference/react)


</TabItem>
<TabItem value="angular" label="Angular">

- [Angular Docs](https://angular.dev/overview) — comprehensive official guide
- [Tour of Heroes Tutorial](https://angular.dev/tutorials/learn-angular)


</TabItem>
<TabItem value="vue" label="Vue">

- [Vue 3 Guide](https://vuejs.org/guide/introduction)


</TabItem>
<TabItem value="svelte" label="Svelte">

- [Svelte Tutorial](https://learn.svelte.dev/)


</TabItem>
</Tabs>