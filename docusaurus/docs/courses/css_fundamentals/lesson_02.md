# Lesson 02 — Color & Typography

> **Course:** CSS Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Apply color using hex, RGB, HSL, and CSS custom properties (variables)
- [ ] Control transparency using alpha channels
- [ ] Load and use a Google Font in your project
- [ ] Apply a professional typographic scale with relative units
- [ ] Set line-height, letter-spacing, and text-transform correctly

---

## 📖 Concepts

### Color Formats

CSS supports several color formats. Understanding them lets you choose the right one for the context.

```css
/* === Hex — most common, easy to copy from design tools === */
.text-primary   { color: #1a1a2e; }      /* 6-digit hex */
.text-accent    { color: #e94560; }
.text-muted     { color: #888; }         /* 3-digit shorthand: #888 = #888888 */
.text-accent-50 { color: #e9456080; }   /* 8-digit hex: last 2 digits = alpha (50% opacity) */

/* === RGB — red, green, blue, each 0–255 === */
.box-red  { background-color: rgb(233, 69, 96); }
.box-blue { background-color: rgb(0, 120, 215); }

/* === RGBA — RGB with alpha channel (0 = fully transparent, 1 = fully opaque) === */
.overlay { background-color: rgba(0, 0, 0, 0.6); }  /* black at 60% opacity */

/* === HSL — Hue (0–360°), Saturation (%), Lightness (%) ===
   Great for creating colour palettes programmatically */
.brand-base    { color: hsl(230, 60%, 40%); }    /* deep blue */
.brand-light   { color: hsl(230, 60%, 70%); }    /* lighter blue — same hue, higher lightness */
.brand-dark    { color: hsl(230, 60%, 20%); }    /* darker blue */
.brand-faded   { color: hsl(230, 30%, 40%); }    /* desaturated blue */

/* === HSLA — HSL with alpha === */
.tooltip-bg { background-color: hsla(200, 50%, 10%, 0.9); }

/* === CSS named colors (avoid in production — use for quick prototyping) === */
.example { color: cornflowerblue; }
```

### CSS Custom Properties (Variables)

Custom properties let you define your color palette once and reference it everywhere. Changing a site's primary color becomes a one-line edit.

```css
/* Declare variables on the :root (applies the whole document) */
:root {
    /* Color palette */
    --color-primary:    hsl(230, 70%, 55%);
    --color-secondary:  hsl(160, 60%, 45%);
    --color-accent:     hsl(15, 90%, 60%);
    --color-surface:    hsl(230, 20%, 12%);
    --color-on-surface: hsl(230, 20%, 95%);

    /* Greyscale */
    --color-gray-100: hsl(0, 0%, 95%);
    --color-gray-500: hsl(0, 0%, 50%);
    --color-gray-900: hsl(0, 0%, 10%);
}

/* Use variables with var() */
body {
    background-color: var(--color-surface);
    color: var(--color-on-surface);
}

.btn-primary {
    background-color: var(--color-primary);
}

/* Variables can have fallbacks */
.card {
    color: var(--color-text, #222); /* Use #222 if --color-text is not defined */
}
```

### Typography

```css
/* Import Google Font in your CSS (or in HTML <head>) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Fira+Code&display=swap');

/* --- Base typography on the root element --- */
:root {
    --font-body: 'Inter', system-ui, -apple-system, sans-serif;
    --font-code: 'Fira Code', 'Cascadia Code', monospace;

    /* Typographic scale using rem (relative to html font-size, default 16px) */
    --text-xs:   0.75rem;    /*  12px */
    --text-sm:   0.875rem;   /*  14px */
    --text-base: 1rem;       /*  16px */
    --text-lg:   1.125rem;   /*  18px */
    --text-xl:   1.25rem;    /*  20px */
    --text-2xl:  1.5rem;     /*  24px */
    --text-3xl:  1.875rem;   /*  30px */
    --text-4xl:  2.25rem;    /*  36px */
}

body {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: 1.6;       /* 1.5–1.7 is optimal for readability */
    color: var(--color-gray-900);
}

h1 { font-size: var(--text-4xl); line-height: 1.2; }
h2 { font-size: var(--text-3xl); line-height: 1.3; }
h3 { font-size: var(--text-2xl); line-height: 1.4; }

code, pre {
    font-family: var(--font-code);
    font-size: 0.9em;  /* 0.9em = 90% of parent element's font size */
}
```

### Letter Spacing, Weight, and Transform

```css
/* font-weight: 100 (thin) to 900 (black) */
h1 { font-weight: 700; }  /* bold */
p  { font-weight: 400; }  /* regular */
.label { font-weight: 500; }  /* medium */

/* letter-spacing: tracking between characters */
.eyebrow {             /* small, spaced-out label above a title */
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-primary);
}

/* text-transform */
.uppercase { text-transform: uppercase; }
.capitalize { text-transform: capitalize; }

/* text-decoration */
a {
    color: var(--color-primary);
    text-decoration: none; /* Remove underline */
}
a:hover {
    text-decoration: underline;
}
```

---

## 🏗️ Assignments

### Assignment 1 — Color Palette Setup

In a fresh `style.css`:
1. Define a full `:root` block with at least 5 color variables using HSL.
2. Use these variables to style `body`, `h1`, `h2`, a `.btn`, and a `.card` element.

### Assignment 2 — Typography Setup

Add a Google Font (your choice) with at least two weights (400 and 700).
Apply a `--font-body` custom property to `body`. Define a scale from `--text-sm` to `--text-4xl` and apply each to a heading or label on the page.

### Assignment 3 — Dark Mode Toggle

Define a second set of color variables inside a `.dark-mode` class on `<html>`:

```css
.dark-mode {
    --color-surface: hsl(230, 20%, 10%);
    --color-on-surface: hsl(230, 10%, 95%);
}
```

Manually toggle it in Chrome DevTools to see the effect.

---

## ✅ Milestone Checklist

- [ ] I defined a full color palette using CSS custom properties
- [ ] I imported and applied a Google Font
- [ ] I set a proper `line-height` on `body` for readability
- [ ] I understand the difference between `em` and `rem`

## 🏆 Milestone Complete!

Your site now has a coherent typographic and colour system.

## ➡️ Next Unit

[Lesson 03 — The Box Model Deep-Dive](./lesson_03.md)
