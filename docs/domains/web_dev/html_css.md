# HTML & CSS Reference

> **Domain:** Web Development · **Role:** Frontend / Fullstack

This reference guide covers the structural and aesthetic backbone of the open web. Elements covered here are assumed knowledge for the associated courses in the Web Development track.

---

## 📖 Concepts: HTML Architecture

HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. Modern web applications rely on **semantic HTML** to provide meaning and accessiblity to user agents and screen readers.

### The Document Structure

Every HTML document consists of a tree of nodes (the Document Object Model or DOM) originating from a single root.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Title</title>
  </head>
  <body>
    <!-- Visible content goes here -->
  </body>
</html>
```

### Semantic Architecture

Avoid `<div>` soup. Use semantic elements that describe their meaning to both the browser and the developer.

- **`<header>`**: Introductory content, typically containing navigation links or logos.
- **`<nav>`**: A section of a page whose purpose is to provide navigation links.
- **`<main>`**: The dominant content of the `<body>` of a document. A document must not have more than one `<main>` element.
- **`<article>`**: A self-contained composition (e.g., a forum post, a magazine or newspaper article, or a blog entry).
- **`<section>`**: A standalone section of a document, which doesn't have a more specific semantic element to represent it.
- **`<aside>`**: Content indirectly related to the document's main content (e.g., sidebars).
- **`<footer>`**: A footer for its nearest sectioning content.

---

## 📖 Concepts: CSS Mechanics

CSS (Cascading Style Sheets) controls the presentation, formatting, and layout of the HTML document.

### The Cascade & Specificity

The "Cascade" determines which CSS rules apply if multiple rules target the same element. It calculates a weight (specificity) based on the selector types.

1. **Inline styles** (`style="..."`): Highest specificity.
2. **IDs** (`#header`): High specificity.
3. **Classes, attributes, and pseudo-classes** (`.card`, `[type="text"]`, `:hover`): Medium specificity.
4. **Elements and pseudo-elements** (`div`, `h1`, `::before`): Low specificity.

> [!TIP]
> **Best Practice:** Keep specificity low. Rely on classes (`.button`) rather than IDs (`#submit-button`) or element nesting (`div ul li a`) to make overriding styles easier and your CSS more maintainable.

### The Box Model

Every element in web design is a rectangular box. CSS determines the size and properties of these boxes.

- **Content**: The content of the box, where text and images appear.
- **Padding**: Clears an area around the content. The padding is transparent.
- **Border**: A border that goes around the padding and content.
- **Margin**: Clears an area outside the border. The margin is transparent.

The native box model calculates width as: `Width = Content Width`. Padding and Borders are *added* to this.
Modern CSS recommends changing this behavior globally:

```css
/* Apply a more intuitive box model */
*, *::before, *::after {
  box-sizing: border-box;
}
```
With `border-box`, `Width = Content + Padding + Border`.

---

## 📖 Layout Paradigms

Historically, layouts were achieved using floats or tables. Modern CSS uses two primary layout systems: Flexbox (1D) and Grid (2D).

### Flexbox (1-Dimensional Layout)

Flexbox is designed for laying out items in a single dimension—either in a row or a column.

- **Main Axis**: The primary axis along which flex items are laid out (horizontal if `flex-direction: row`). Directed by `justify-content`.
- **Cross Axis**: The axis perpendicular to the main axis (vertical if `flex-direction: row`). Directed by `align-items`.

```css
.flex-container {
  display: flex;
  flex-direction: row; /* or column */
  justify-content: space-between; /* align on main axis */
  align-items: center; /* align on cross axis */
  flex-wrap: wrap; /* allow items to flow to next line */
}
```

### CSS Grid (2-Dimensional Layout)

Grid is designed for two-dimensional layouts—managing columns and rows simultaneously.

```css
.grid-container {
  display: grid;
  /* Define 3 equal columns */
  grid-template-columns: repeat(3, 1fr);
  /* Define rows automatically based on content, min 100px */
  grid-auto-rows: minmax(100px, auto);
  /* Spacing between grid items */
  gap: 1rem;
}
```

---

## 📖 Responsive Design

Responsive web design ensures that web pages render well on a variety of devices and window or screen sizes.

### Media Queries

Media queries apply CSS properties only if a certain condition is true (e.g., the browser width is below or above a certain pixel count).

```css
/* Base styles apply to mobile first */
.container {
  width: 100%;
}

/* Tablet and larger */
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}

/* Desktop and larger */
@media (min-width: 1024px) {
  .container {
    width: 960px;
  }
}
```

### Relative Units

- **`em` / `rem`**: Font-size relative to the parent (`em`) or the root element (`rem`). Use `rem` for typography and spacing to maintain accessible scaling.
- **`vw` / `vh`**: 1% of the viewport width/height. Use cautiously for typography, as it does not respect user zoom settings gracefully.

---
## 📚 Resources

=== "Primary"
    - [MDN Web Docs: HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
    - [MDN Web Docs: CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

=== "Supplemental"
    - [CSS-Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
    - [CSS-Tricks: A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
