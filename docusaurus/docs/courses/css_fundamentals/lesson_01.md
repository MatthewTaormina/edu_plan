# Lesson 01 — The Cascade & Selectors

> **Course:** CSS Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Link a CSS file to an HTML document using `<link>`
- [ ] Write valid CSS syntax: selector, property, value
- [ ] Use element, class, ID, attribute, and pseudo-class selectors
- [ ] Understand the cascade and how conflicting rules are resolved
- [ ] Calculate specificity to predict which rule wins

---

## 📖 Concepts

### Three Ways to Add CSS

```html
<!-- 1. External stylesheet (preferred — keeps concerns separated) -->
<link rel="stylesheet" href="style.css">

<!-- 2. Internal <style> block (useful for quick prototypes) -->
<style>
    h1 { color: crimson; }
</style>

<!-- 3. Inline styles (avoid except for dynamic JS-driven values) -->
<h1 style="color: crimson;">Hello</h1>
```

:::tip
Always use external stylesheets in real projects. They are cached by the browser (pages load faster after the first visit) and keep structure (HTML) separate from presentation (CSS).
:::

### CSS Syntax

```css
/* selector { property: value; } */
h1 {
    color: navy;
    font-size: 2.5rem;
    margin-bottom: 1rem;
}
```

### Selector Types

```css
/* === Element selectors — match by tag name === */
p { line-height: 1.6; }
h2 { font-weight: 700; }

/* === Class selectors — match elements with class="btn" === */
.btn {
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
}

/* === ID selectors — match ONE element with id="hero" (use sparingly) === */
#hero {
    background-color: #1a1a2e;
}

/* === Attribute selectors === */
input[type="email"] { border-color: blue; }
a[href^="https"] { color: green; }   /* href starts with "https" */
a[href$=".pdf"] { color: red; }      /* href ends with ".pdf" */

/* === Pseudo-class selectors (element state) === */
a:hover { text-decoration: underline; }
a:focus { outline: 3px solid yellow; }  /* keyboard navigation */
li:first-child { font-weight: bold; }
li:last-child { margin-bottom: 0; }
li:nth-child(odd) { background-color: #f0f0f0; }  /* zebra-stripe rows */
input:required { border-left: 3px solid red; }

/* === Pseudo-element selectors (virtual elements) === */
p::first-line { font-variant: small-caps; }
.article::before { content: "📌 "; }  /* inject content via CSS */
```

### Combinators

```css
/* Descendant combinator (space) — any .note inside a .article */
.article .note { color: gray; }

/* Child combinator (>) — direct children only */
.nav > li { display: inline-block; }

/* Adjacent sibling (+) — the <p> immediately after an <h2> */
h2 + p { font-size: 1.1rem; }

/* General sibling (~) — all <p> that are siblings of an <h2> */
h2 ~ p { margin-left: 1rem; }
```

### The Cascade — How Conflicts Are Resolved

When multiple rules target the same element, the browser uses this order:

1. **`!important`** declarations (avoid; breaks maintainability)
2. **Specificity** (more specific selectors win)
3. **Source order** (later rules in the file override earlier ones)

### Specificity

Specificity is calculated as a three-part score `(a, b, c)`:

| Selector type | Contribution |
|--------------|-------------|
| Inline style (`style=""`) | `(1,0,0)` |
| ID selector (`#main`) | `(0,1,0)` |
| Class, attribute, pseudo-class (`.btn`, `[type]`, `:hover`) | `(0,0,1)` |
| Element, pseudo-element (`div`, `::before`) | `(0,0,1)` — no: `(0,0,1)` |

```css
/* Specificity (0,0,1) */
p { color: black; }

/* Specificity (0,1,0) — wins */
.intro { color: navy; }

/* Specificity (0,0,2) — two elements, still loses to .intro */
article p { color: gray; }

/* ❌ Don't use !important to fix specificity wars — fix the selectors */
p { color: red !important; }
```

:::tip
Keep specificity low. Write rules using classes where possible. The moment you need `!important`, it is a sign your CSS architecture has a problem.
:::

### The Inheritance Chain

Some CSS properties are inherited by default (text-related ones):
- `color`, `font-family`, `font-size`, `line-height`, `text-align`

Other properties are NOT inherited by default:
- `width`, `height`, `margin`, `padding`, `border`, `background-color`

```css
body {
    /* Set once on <body> — all text elements inherit this */
    font-family: 'Inter', sans-serif;
    color: #222;
}
```

---

## 🏗️ Assignments

### Assignment 1 — Selector Specificity Game

Create an HTML file with one paragraph that has:
- An element selector (`p`) setting color to black
- A class selector (`.intro`) setting color to blue
- An ID selector (`#main-text`) setting color to red

Predict which wins before opening the browser, then verify.

### Assignment 2 — State Styling

Style a navigation link (`<a>`) with four distinct states: `:link`, `:visited`, `:hover`, and `:focus`. Make each visually distinct so you can test them.

### Assignment 3 — Zebra Striping

Style a `<ul>` list so that odd items have a light gray background and even items have white. Use `:nth-child(odd)` and `:nth-child(even)` pseudo-class selectors.

---

## ✅ Milestone Checklist

- [ ] I linked an external CSS file and it applied to my HTML
- [ ] I understand the specificity scoring system
- [ ] I used at least five different selector types
- [ ] I added `:hover` and `:focus` states to an interactive element

## 🏆 Milestone Complete!

You understand why CSS rules conflict and how to predict which one wins.

## ➡️ Next Unit

[Lesson 02 — Color & Typography](./lesson_02.md)
