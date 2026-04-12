# Lesson 07 — Responsive Paradigms

> **Course:** CSS Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Explain the mobile-first CSS methodology
- [ ] Write media queries using `min-width` (mobile-first) and `max-width` (desktop-first)
- [ ] Apply `em`, `rem`, `vw`, `vh`, `clamp()`, and `min()`/`max()` for fluid sizing
- [ ] Build a responsive layout that works at mobile, tablet, and desktop widths

---

## 📖 Concepts

### Mobile-First vs. Desktop-First

**Mobile-first** means you write your base styles for the smallest screen, then use `min-width` media queries to *add* complexity for larger screens.

**Desktop-first** is the opposite — base styles for large screens, then `max-width` queries to *reduce* complexity for small screens.

**Mobile-first is the industry standard.** More people browse on mobile than desktop. Base styles load for everyone; enhancements load only for larger screens.

```css
/* === Mobile-First (preferred) === */

/* Base: applied to ALL screen sizes */
.card {
    flex-direction: column;
    padding: 1rem;
}

/* Tablet and larger (768px+) */
@media (min-width: 48rem) {
    .card {
        flex-direction: row;
        padding: 1.5rem;
    }
}

/* Desktop and larger (1024px+) */
@media (min-width: 64rem) {
    .card {
        padding: 2rem;
    }
}
```

### Common Breakpoints

These are widely adopted conventions (not rules):

| Name | `min-width` value |
|------|-------------------|
| Mobile (default) | No query (base styles) |
| Tablet (sm) | `48rem` (768px) |
| Desktop (md) | `64rem` (1024px) |
| Wide (lg) | `80rem` (1280px) |
| Ultrawide (xl) | `96rem` (1536px) |

> [!TIP]
> Use `rem` units in media queries, not `px`. If the user has changed their browser's base font size (an accessibility setting), `rem`-based breakpoints respect that preference. `px`-based breakpoints don't.

### Relative Units

```css
/* em — relative to the PARENT element's font-size
   (context-dependent; can compound unexpectedly) */
.nested-text { font-size: 1.5em; }  /* 1.5 * parent's font-size */

/* rem — relative to the ROOT element's font-size (usually 16px)
   (consistent throughout the page; preferred for spacing and typography) */
h1 { font-size: 2.5rem; }   /* 2.5 * 16px = 40px */
.section { padding: 1.5rem; } /* 1.5 * 16px = 24px */

/* vw/vh — relative to the viewport width/height */
.hero { height: 100vh; }           /* Full viewport height */
.hero-title { font-size: 6vw; }    /* Scales with viewport width */

/* % — relative to the parent element's size */
.sidebar { width: 30%; }
.main { width: 70%; }

/* ch — relative to the width of the "0" character — ideal for text containers */
.prose { max-width: 65ch; }  /* Limits paragraphs to ~65 characters wide (legibility) */
```

### Modern Fluid Sizing: `clamp()`, `min()`, `max()`

These functions let properties adapt smoothly *between* breakpoints without jumps.

```css
/* clamp(minimum, preferred, maximum)
   => Preferred value if it falls between min and max; otherwise clamped. */
h1 {
    font-size: clamp(1.75rem, 5vw, 3.5rem);
    /* Mobile:  1.75rem (never smaller)
       Fluid:   5vw (scales with viewport)
       Desktop: 3.5rem (never larger) */
}

.container {
    width: min(90%, 1200px);  /* 90% of viewport, but never wider than 1200px */
    margin-inline: auto;      /* Center horizontally */
}

.card-image {
    height: max(200px, 30vh); /* At least 200px, otherwise 30% of viewport height */
}
```

### Practical Responsive Layout

```css
/* Mobile-first page layout */
:root {
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;
}

.site-layout {
    display: grid;
    grid-template-columns: 1fr;  /* Single column on mobile */
    grid-template-areas:
        "header"
        "main"
        "footer";
}

@media (min-width: 48rem) {
    .site-layout {
        grid-template-columns: 240px 1fr;
        grid-template-areas:
            "header header"
            "sidebar main"
            "footer footer";
    }
}

@media (min-width: 80rem) {
    .site-layout {
        grid-template-columns: 260px 1fr 220px;
        grid-template-areas:
            "header  header  header"
            "sidebar main    aside"
            "footer  footer  footer";
    }
}

/* Hidden by default on mobile */
.sidebar { grid-area: sidebar; display: none; }
.page-aside { display: none; }

@media (min-width: 48rem) {
    .sidebar { display: block; }
}

@media (min-width: 80rem) {
    .page-aside { display: block; }
}
```

### Responsive Typography with `clamp()`

```css
body {
    font-size: clamp(1rem, 1rem + 0.2vw, 1.125rem);
    line-height: 1.6;
}

h1 { font-size: clamp(2rem, 5vw, 4rem); }
h2 { font-size: clamp(1.5rem, 3.5vw, 2.5rem); }
h3 { font-size: clamp(1.25rem, 2.5vw, 1.875rem); }
```

---

## 🏗️ Assignments

### Assignment 1 — Mobile-First Article Layout

Build a blog article page:
- Mobile: single column, compact spacing
- Tablet (768px+): wider article, still single column but with more padding
- Desktop (1024px+): article limited to 65ch width, with an aside/TOC in the right column

### Assignment 2 — Fluid Typography

Apply `clamp()` to headings and body text. Open DevTools, set the viewport width to 320px and drag it to 1600px — verify that font sizes scale smoothly.

### Assignment 3 — Responsive Navigation

Start with a nav bar that hides all links (as if for a hamburger menu) on mobile and shows them inline on tablet width and above.

---

## ✅ Milestone Checklist

- [ ] My base CSS styles target mobile first
- [ ] I used `min-width` media queries (not `max-width`) for breakpoints
- [ ] I applied `clamp()` to at least one font size
- [ ] I used `min(90%, 1200px)` to constrain a container width

## 🏆 Milestone Complete!

Your layouts now respond gracefully to any screen size.

## ➡️ Next Unit

[Lesson 08 — Animations & Transitions](./lesson_08.md)
