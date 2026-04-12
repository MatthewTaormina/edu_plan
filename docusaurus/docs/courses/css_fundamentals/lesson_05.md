# Lesson 05 — Flexbox Layouts

> **Course:** CSS Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Understand the main axis and cross axis
- [ ] Use `justify-content` and `align-items` to align flex children
- [ ] Use `flex-grow`, `flex-shrink`, and `flex-basis` (and the `flex` shorthand)
- [ ] Build a responsive navigation bar using Flexbox
- [ ] Use `flex-wrap` and `gap` to create flowing card grids

---

## 📖 Concepts

### What is Flexbox?

Flexbox is a **one-dimensional** layout system. It excels at distributing space along a single axis (either horizontal or vertical). Use it for:
- Navigation bars
- Button groups
- Card rows
- Centering content vertically and horizontally

Activate it with `display: flex` on the **parent** (the flex container).

### The Two Axes

```text
flex-direction: row (default)

Main axis ────────────────────────────────────────────►
          ┌──────┐  ┌──────┐  ┌──────┐
          │Item 1│  │Item 2│  │Item 3│
          └──────┘  └──────┘  └──────┘
          │                           │
Cross     ▼
axis
```

- **Main axis**: driven by `flex-direction` (`row` = horizontal, `column` = vertical)
- **Cross axis**: perpendicular to the main axis
- `justify-content` aligns items along the **main** axis
- `align-items` aligns items along the **cross** axis

### Container Properties

```css
.flex-container {
    display: flex;

    /* Main axis direction */
    flex-direction: row;          /* row | row-reverse | column | column-reverse */

    /* Main axis alignment */
    justify-content: flex-start;  /* flex-start | flex-end | center | space-between | space-around | space-evenly */

    /* Cross axis alignment */
    align-items: stretch;         /* stretch | flex-start | flex-end | center | baseline */

    /* Wrap when items don't fit */
    flex-wrap: nowrap;            /* nowrap | wrap | wrap-reverse */

    /* Gap between items (no more need for margins!) */
    gap: 1rem;                    /* row-gap column-gap */
    /* gap: 1rem 2rem; — different gaps for rows and columns */
}
```

### Item Properties

```css
.flex-item {
    /* flex-grow: how much extra space does this item absorb?
       0 = don't grow, 1+ = grow proportionally */
    flex-grow: 0;

    /* flex-shrink: can this item shrink if there's not enough space?
       1 = yes (default), 0 = never shrink */
    flex-shrink: 1;

    /* flex-basis: the item's initial main-axis size before growing/shrinking
       auto = use the item's width/height
       0    = start from nothing and distribute all space via flex-grow */
    flex-basis: auto;

    /* Shorthand: flex: grow shrink basis */
    flex: 1;         /* grow=1, shrink=1, basis=0 — equal width columns */
    flex: 0 0 200px; /* fixed 200px, never grow or shrink */
    flex: none;      /* 0 0 auto — use content size, don't grow or shrink */

    /* Override the container's align-items for this item only */
    align-self: flex-start;

    /* Control visual order without changing HTML order */
    order: 2;  /* default is 0; lower numbers appear first */
}
```

### Common Patterns

#### 1. Centering (Both Axes)

```css
.center-everything {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;  /* Full viewport height */
}
```

#### 2. Navigation Bar

```html
<nav class="navbar">
    <a class="navbar__logo" href="/">MyBrand</a>
    <ul class="navbar__links">
        <li><a href="/about">About</a></li>
        <li><a href="/work">Work</a></li>
        <li><a href="/blog">Blog</a></li>
    </ul>
    <a class="btn" href="/contact">Contact</a>
</nav>
```

```css
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 2rem;
    background-color: var(--color-surface);
    border-bottom: 1px solid hsl(220, 15%, 85%);
}

.navbar__logo {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
    text-decoration: none;
}

.navbar__links {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 2rem;
}

.navbar__links a {
    color: inherit;
    text-decoration: none;
    font-weight: 500;
}

.navbar__links a:hover {
    color: var(--color-primary);
}
```

#### 3. Flexible Card Grid with Wrap

```css
.card-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
}

.card-row > .card {
    flex: 1 1 280px;  /* Grow and shrink, never smaller than 280px */
    /* This creates a natural responsive grid:
       3 wide at 1280px, 2 wide at 760px, 1 wide on mobile */
}
```

#### 4. Sidebar Layout

```css
.layout {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
}

.sidebar {
    flex: 0 0 260px;  /* Fixed width sidebar, never grows */
}

.main-content {
    flex: 1;          /* Takes all remaining space */
}
```

---

## 🏗️ Assignments

### Assignment 1 — Navigation Bar

Build a full navigation bar matching the HTML structure shown above. On small screens (using `flex-wrap: wrap`), let it wrap naturally.

### Assignment 2 — Centering Practice

Create a full-viewport-height section (`min-height: 100vh`) and center a card element within it using Flexbox.

### Assignment 3 — Feature Cards

Build a row of three "feature" cards (icon + title + description, each with a CTA button pinned to the bottom). Use `flex-grow` to ensure all cards are equal height and the buttons align.

---

## ✅ Milestone Checklist

- [ ] I can describe the main axis and cross axis for both `row` and `column`
- [ ] I built a navigation bar with `justify-content: space-between`
- [ ] I used `flex: 1 1 280px` for a wrapping card grid
- [ ] I understand the difference between `flex-grow`, `flex-shrink`, and `flex-basis`

## 🏆 Milestone Complete!

One-dimensional layouts are now under your control.

## ➡️ Next Unit

[Lesson 06 — Grid Layouts](./lesson_06.md)
