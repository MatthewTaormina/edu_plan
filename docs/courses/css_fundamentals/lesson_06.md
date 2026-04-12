# Lesson 06 — Grid Layouts

> **Course:** CSS Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Define grid columns and rows using `grid-template-columns` and `grid-template-rows`
- [ ] Use `fr` units, `repeat()`, and `minmax()` to build flexible grids
- [ ] Place items explicitly using `grid-column` and `grid-row`
- [ ] Create named grid areas with `grid-template-areas`
- [ ] Decide when to use Grid vs. Flexbox

---

## 📖 Concepts

### Grid vs. Flexbox — When to Use Which

| Use Flexbox when... | Use Grid when... |
|--------------------|-----------------|
| Laying out items in a **single row or column** | Laying out items in **rows AND columns simultaneously** |
| Space distribution along one axis | Precise placement in a 2D layout |
| Components (nav bar, button group, card internals) | Page-level page structure |
| Content dictates size | Layout dictates size |

They also combine: a Grid defines the page structure; Flexbox manages the internals of each grid cell.

### Defining a Grid

```css
.container {
    display: grid;

    /* Define columns: three equal columns */
    grid-template-columns: 1fr 1fr 1fr;

    /* Shorthand for repeated patterns */
    grid-template-columns: repeat(3, 1fr);

    /* Mixed: sidebar + content + aside */
    grid-template-columns: 240px 1fr 200px;

    /* Auto-filling: as many 280px columns as fit, fill remaining space */
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

    /* Define explicit row heights */
    grid-template-rows: auto 1fr auto;  /* header: auto, content: fills space, footer: auto */

    /* Space between cells */
    gap: 1.5rem;
    /* column-gap: 2rem; row-gap: 1rem;  — control axes separately */
}
```

### The `fr` Unit

`fr` stands for **fraction of available space**. After fixed widths are subtracted, remaining space is divided into fractions.

```css
/* Two columns: left is 1/3 of remaining space, right is 2/3 */
grid-template-columns: 1fr 2fr;

/* Three equal columns */
grid-template-columns: 1fr 1fr 1fr;

/* Fixed sidebar + flexible main + fixed rail */
grid-template-columns: 260px 1fr 180px;
```

### Auto-Responsive Grid with `minmax()` and `auto-fill`

```css
.card-grid {
    display: grid;
    /* Each card is at least 280px wide, but grows to fill available space.
       auto-fill: creates as many columns as fit the container width. */
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}
/* Result: 3 columns at 1024px, 2 at 640px, 1 at 320px — no media queries needed! */
```

### Placing Items Explicitly

```css
/* Lines are numbered from 1. Negative numbers count from the end. */

.featured-article {
    /* Span from column line 1 to line 3 (spans 2 columns) */
    grid-column: 1 / 3;

    /* Shorthand using span keyword */
    grid-column: span 2;

    /* Full row row span */
    grid-row: span 2;
}

.sidebar {
    /* Place in the last column, all rows */
    grid-column: 3 / 4;
    grid-row: 1 / -1;  /* -1 means the last grid line */
}
```

### Named Grid Areas

For complex page layouts, naming areas makes the code readable:

```css
.page-layout {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header  header"
        "sidebar main"
        "footer  footer";
    min-height: 100vh;
    gap: 0;
}

.page-header  { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-main    { grid-area: main; }
.page-footer  { grid-area: footer; }
```

### Magazine-Style Layout

```html
<div class="magazine-grid">
    <article class="featured">Featured Story</article>
    <article class="story-a">Story A</article>
    <article class="story-b">Story B</article>
    <article class="story-c">Story C</article>
    <aside class="sidebar">Sidebar</aside>
</div>
```

```css
.magazine-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 200px);
    gap: 1rem;
}

.featured {
    grid-column: 1 / 3;  /* Spans first 2 columns */
    grid-row: 1 / 3;     /* Spans first 2 rows */
    background-color: var(--color-primary);
}

.sidebar {
    grid-column: 4 / 5;
    grid-row: 1 / 4;  /* Full height */
    background-color: hsl(220, 15%, 95%);
}

.story-a { grid-column: 3 / 4; grid-row: 1 / 2; }
.story-b { grid-column: 3 / 4; grid-row: 2 / 3; }
.story-c { grid-column: 1 / 4; grid-row: 3 / 4; }
```

---

## 🏗️ Assignments

### Assignment 1 — Auto-Responsive Card Grid

Build a grid of 6 article/project cards. Use `repeat(auto-fill, minmax(280px, 1fr))`. Resize the browser window to see it adapt automatically.

### Assignment 2 — Page Layout

Build a full page layout using `grid-template-areas`:
- Header (full width)
- Sidebar (left, fixed width) + Main content (right, fills space)
- Footer (full width)

The sidebar and main content area should stretch to fill the viewport height between the header and footer.

### Assignment 3 — Feature Highlight

Build a "magazine featured story" section where the lead article spans 2 columns and 2 rows, with three smaller articles filling the remaining space.

---

## ✅ Milestone Checklist

- [ ] I understand when Grid is better than Flexbox (and vice versa)
- [ ] I built an auto-responsive grid with `repeat(auto-fill, minmax(...))`
- [ ] I placed items explicitly using `grid-column` and `grid-row`
- [ ] I used `grid-template-areas` for a page layout

## 🏆 Milestone Complete!

You now control two-dimensional layouts. Combined with Flexbox, you can build any layout on the web.

## ➡️ Next Unit

[Lesson 07 — Responsive Paradigms](./lesson_07.md)
