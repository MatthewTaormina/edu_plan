# Lesson 04 — Document Flow & Positioning

> **Course:** CSS Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Explain what "normal document flow" means
- [ ] Apply all five `position` values and know when to use each
- [ ] Use `top`, `right`, `bottom`, `left`, and `z-index` correctly
- [ ] Build a sticky header and a modal overlay using positioning
- [ ] Understand when `position: absolute` needs a positioned ancestor

---

## 📖 Concepts

### Normal Document Flow

By default, elements are laid out in **normal flow**:
- **Block** elements stack vertically
- **Inline** elements flow horizontally like text

```html
<!-- This renders as three stacked blocks -->
<p>Paragraph 1</p>
<p>Paragraph 2</p>  
<p>Paragraph 3</p>
```

Positioning lets you *take elements out of* this flow.

### The Five Position Values

```css
/* === static (DEFAULT) ===
   Normal flow. top/right/bottom/left/z-index have NO effect. */
.element { position: static; }

/* === relative ===
   Appears in normal flow, but can be offset from its original position.
   The space it "would have occupied" is preserved — other elements don't fill it.
   Also creates a "positioning context" for any absolute children. */
.badge {
    position: relative;
    top: -4px;    /* Nudge 4px upward from where it would normally sit */
    left: 2px;
}

/* === absolute ===
   Removed from normal flow (other elements act as if it doesn't exist).
   Positioned relative to the nearest POSITIONED ANCESTOR (not static).
   If no positioned ancestor, it's positioned relative to the <html> element. */
.tooltip {
    position: absolute;
    top: 100%;     /* Below the parent */
    left: 50%;
    transform: translateX(-50%);  /* Horizontally center it */
    z-index: 10;
}

/* === fixed ===
   Like absolute, but positioned relative to the VIEWPORT (the visible window).
   Stays in place when the user scrolls. */
.sticky-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;     /* Full width (right: 0 instead of width: 100% avoids scrollbar issues) */
    z-index: 100;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* === sticky ===
   Hybrid of relative + fixed.
   Initially in normal flow, but "sticks" to a threshold when scrolled past it.
   Sticks within its PARENT element (stops when parent leaves the viewport). */
.table-header th {
    position: sticky;
    top: 0;      /* Sticks to the top of the scroll container */
    background-color: white;
}
```

### The Positioning Context Rule

`position: absolute` children are placed relative to the nearest ancestor with `position` set to anything *other than* `static`. Always declare `position: relative` on the parent if you want to contain an absolute child.

```html
<div class="card">
    <!-- This tag must be absolute within the card, not the page -->
    <span class="badge">New</span>
    <img src="product.jpg" alt="Product photo">
</div>
```

```css
.card {
    position: relative;  /* Creates the positioning context */
    border-radius: 8px;
    overflow: hidden;
}

.badge {
    position: absolute;
    top: 12px;           /* 12px from the card's top edge */
    right: 12px;         /* 12px from the card's right edge */
    background-color: crimson;
    color: white;
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
}
```

### Z-Index (Stacking Order)

When elements overlap (as happens with positioning), `z-index` controls which appears on top.

```css
/* Higher z-index = closer to the viewer (on top) */
.modal-overlay { z-index: 200; }
.modal-dialog  { z-index: 201; }  /* Must be > overlay to appear above it */
.sticky-header { z-index: 100; }
.tooltip       { z-index: 300; }  /* Should be above most things */
```

> [!IMPORTANT]
> `z-index` only works on positioned elements (not `position: static`). If z-index isn't working, check that you've set `position` to `relative`, `absolute`, `fixed`, or `sticky` on that element.

### Building a Modal Overlay

```html
<div class="modal-overlay" id="modal-overlay" aria-hidden="true">
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Confirm Action</h2>
        <p>Are you sure you want to delete this item? This cannot be undone.</p>
        <div class="modal-footer">
            <button id="cancel-btn">Cancel</button>
            <button id="confirm-btn" class="btn-danger">Delete</button>
        </div>
    </div>
</div>
```

```css
.modal-overlay {
    position: fixed;     /* Cover the whole viewport */
    inset: 0;            /* Shorthand for top: 0; right: 0; bottom: 0; left: 0; */
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
}

.modal-overlay[aria-hidden="true"] {
    display: none;
}

.modal-dialog {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    width: min(90vw, 480px);  /* 90% of viewport, but never wider than 480px */
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
}

.btn-danger {
    background-color: #dc2626;
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    cursor: pointer;
}
```

---

## 🏗️ Assignments

### Assignment 1 — Sticky Header

Create a page tall enough to scroll. Add a `<header>` with `position: fixed` at the top, full width. Give it a background and `box-shadow` so it lifts above the content visually. Add `padding-top` to `<main>` to prevent the header from obscuring the first content element.

### Assignment 2 — Product Card with Badge

Build a product card that has:
- An image filling the top of the card
- An "In Stock" or "Sale" badge absolutely positioned in the top-right corner of the image
- A title, price, and button below the image

### Assignment 3 — Sticky Table Header

Create a `<table>` with at least 20 rows. Make the `<thead>` cells sticky using `position: sticky; top: 0` so that scrolling through rows keeps the column headers visible.

---

## ✅ Milestone Checklist

- [ ] I can predict what `position: absolute` is relative to
- [ ] I built a `position: fixed` sticky header
- [ ] I understand that `z-index` requires a non-static position
- [ ] I used `inset: 0` to create a full-viewport overlay

## 🏆 Milestone Complete!

You can now place any element exactly where it needs to be.

## ➡️ Next Unit

[Lesson 05 — Flexbox Layouts](./lesson_05.md)
