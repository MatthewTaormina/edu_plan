# Lesson 03 — The Box Model Deep-Dive

> **Course:** CSS Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Visualize and describe the four layers of the CSS box model
- [ ] Switch to `box-sizing: border-box` and explain why it's better
- [ ] Apply `margin`, `padding`, and `border` using shorthand notation
- [ ] Understand margin collapse and predict when it happens
- [ ] Build a polished card component using correct box model properties

---

## 📖 Concepts

### The Four Layers

Every HTML element is a rectangular box composed of four concentric layers:

```text
┌─────────────────────────────────────┐  ← Margin (outside, transparent)
│  ┌───────────────────────────────┐  │
│  │  Border                       │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Padding (transparent)  │  │  │
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │   Content Area    │  │  │  │
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

```css
.box {
    /* Content */
    width: 300px;
    height: 150px;

    /* Padding — space inside the border, around the content */
    padding-top: 16px;
    padding-right: 24px;
    padding-bottom: 16px;
    padding-left: 24px;
    /* Shorthand: top right bottom left (clockwise) */
    padding: 16px 24px;  /* 16px top/bottom, 24px left/right */

    /* Border */
    border-width: 2px;
    border-style: solid;
    border-color: #3d5afe;
    /* Shorthand */
    border: 2px solid #3d5afe;

    /* Margin — space outside the border, between this element and others */
    margin: 1rem;
}
```

### `box-sizing: border-box` — The One Rule You Always Add

By default (`content-box`), `width` refers to the *content area only*. Padding and border are added *on top*:

```
/* box-sizing: content-box (browser default) */
width: 300px + padding: 24px*2 + border: 2px*2 = Total rendered width: 352px 🤦
```

Switch to `border-box` so that `width` *includes* padding and border — far more predictable:

```css
/* Add this to the top of EVERY CSS file you write */
*, *::before, *::after {
    box-sizing: border-box;
}

/* Now: width: 300px means the total rendered width is 300px, always */
.card {
    width: 300px;
    padding: 24px;    /* Included within the 300px */
    border: 2px solid;  /* Included within the 300px */
}
```

### Shorthand Reference

```css
/* All four sides */
margin: 10px;               /* top/right/bottom/left = 10px */
margin: 10px 20px;          /* top/bottom=10px, left/right=20px */
margin: 10px 20px 5px;      /* top=10px, left/right=20px, bottom=5px */
margin: 10px 20px 5px 15px; /* top right bottom left */

/* Same shorthand applies to padding and border-radius */
border-radius: 8px;               /* all corners */
border-radius: 8px 0;             /* top-left+bottom-right, top-right+bottom-left */
border-radius: 50%;               /* makes a circle if width === height */
```

### Margin Collapse

A quirk of CSS: adjacent **vertical** margins collapse into one.

```css
h2 { margin-bottom: 32px; }
p  { margin-top: 16px; }
```

Between an `<h2>` and the `<p>` that follows it, you might expect 48px of gap. But CSS collapses them to the *larger* value: **32px**.

This only happens with **vertical** margins between **block** elements. It does **not** happen with:
- Horizontal margins
- Flex/Grid children
- Elements with `overflow: hidden`, `display: inline-block`, or `padding`

```css
/* To prevent collapse, add a tiny top padding to the parent */
.section {
    padding-top: 1px; /* Prevents children's top margins from collapsing through */
}
```

### Building a Card Component

```css
.card {
    background-color: var(--color-surface, white);
    border: 1px solid hsl(220, 15%, 85%);
    border-radius: 12px;
    padding: 1.5rem;
    max-width: 380px;
    /* A subtle shadow gives depth */
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.08),
        0 4px 16px rgba(0, 0, 0, 0.06);
}

.card__image {
    /* Make image fill its container width */
    width: 100%;
    /* Maintain aspect ratio */
    aspect-ratio: 16 / 9;
    object-fit: cover;  /* Crop to fit without distortion */
    /* Negative margins to bleed image to card edges */
    margin: -1.5rem -1.5rem 1.5rem -1.5rem;
    width: calc(100% + 3rem);
    border-radius: 12px 12px 0 0;
}

.card__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
}

.card__body {
    color: hsl(220, 10%, 40%);
    line-height: 1.6;
    margin: 0 0 1.25rem 0;
}

.card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid hsl(220, 15%, 90%);
}
```

---

## 🏗️ Assignments

### Assignment 1 — Box Model Prediction

Before looking in DevTools, predict the rendered total width of:

```css
.box {
    box-sizing: content-box;
    width: 200px;
    padding: 10px 20px;
    border: 3px solid black;
    margin: 15px;
}
```

Then check your answer in DevTools (F12 → Elements → Computed).

### Assignment 2 — Card Component

Build a blog post card component in HTML+CSS. It should have:
- A hero image (use a placeholder if needed)
- A category label (eyebrow text, uppercase, small)
- A title (`<h2>`)
- A short description paragraph
- A footer row with author name on the left and date on the right

Use `box-shadow` for depth and `border-radius` for rounded corners.

---

## ✅ Milestone Checklist

- [ ] I added `box-sizing: border-box` as a global reset
- [ ] I can write margin/padding shorthand from memory
- [ ] I understand why margin collapse happens and one way to prevent it
- [ ] I built a card component with correct spacing

## 🏆 Milestone Complete!

You've mastered the fundamental unit of all CSS layout.

## ➡️ Next Unit

[Lesson 04 — Document Flow & Positioning](./lesson_04.md)
