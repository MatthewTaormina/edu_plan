# Lesson 01 — The Web Document

> **Course:** HTML Fundamentals · **Time:** 45 minutes · **Domain:** Web Development

> **Prerequisites:** A text editor (VS Code recommended) and a web browser.

---

## 🎯 Learning Objectives

- [ ] Understand what HTML is and how it is parsed by a browser
- [ ] Write a valid HTML5 boilerplate from memory
- [ ] Understand the purpose of every section in the `<head>`
- [ ] Distinguish between elements, tags, and attributes
- [ ] Save a file as `.html` and open it in a browser

---

## 📖 Concepts

### What is HTML?

HTML (HyperText Markup Language) is the standard language for creating web pages. It tells the browser *what* the content is — a heading, a paragraph, a link, an image — but does not directly control how it looks (that is CSS's job) or how it behaves (that is JavaScript's job).

A browser requests an HTML file from a server, parses it into a tree of objects (the **Document Object Model**, or DOM), and renders it visually.

### Elements, Tags, and Attributes

| Term | Meaning | Example |
|------|---------|---------|
| **Element** | A complete unit of HTML, including its content | `<p>Hello</p>` |
| **Tag** | The opening or closing marker for an element | `<p>` and `</p>` |
| **Attribute** | Extra information added inside the opening tag | `<a href="...">` |

Most tags have both an **opening tag** (`<p>`) and a **closing tag** (`</p>`).
Some **void elements** are self-closing and have no content: `<img>`, `<br>`, `<input>`, `<meta>`, `<link>`.

### The HTML5 Boilerplate

Every HTML document must start with this scaffold:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A short summary of what this page is about.">
    <title>My First Web Page</title>
    <!-- Link to external stylesheets -->
    <!-- <link rel="stylesheet" href="style.css"> -->
  </head>
  <body>
    <!-- All visible content lives here -->
    <h1>Hello, World!</h1>
    <p>This is my very first web page.</p>
  </body>
</html>
```

Let's break down the `<head>` line by line:

| Line | Purpose |
|------|---------|
| `<!DOCTYPE html>` | Tells the browser this is an HTML5 document. Required. Without it, browsers enter "quirks mode" and behave unpredictably. |
| `<html lang="en">` | Root element of the page. `lang` helps screen readers and search engines. |
| `<meta charset="UTF-8">` | Character encoding. UTF-8 supports virtually every character in every language. Always include this first. |
| `<meta name="viewport" ...>` | Controls how the page scales on mobile screens. Without this, mobile browsers zoom out and show the desktop layout. |
| `<meta name="description" ...>` | Short description used by search engines in result snippets. |
| `<title>` | The text shown in the browser tab and bookmarks. Required for accessibility. |

### Nesting Rules

HTML elements are **nested** — an element can contain other elements, forming a tree.

```html
<!-- ✅ Correct: properly nested -->
<p>This is <strong>important</strong> information.</p>

<!-- ❌ Wrong: overlapping tags -->
<p>This is <strong>important</p></strong>
```

Always close inner tags before outer tags.

---

## 🏗️ Assignments

### Assignment 1 — Your First Page

1. Create a folder called `my-website`.
2. Inside it, create a file called `index.html`.
3. Type (don't paste) the entire boilerplate from memory, then check it against the example.
4. Open the file in your browser by double-clicking it.
5. You should see "Hello, World!" as a large heading.

### Assignment 2 — Metadata Practice

Add all three meta tags (`charset`, `viewport`, `description`) to your file and change the `<title>` to something personal like `John's Learning Journal`. Check the browser tab reflects your change.

---

## ✅ Milestone Checklist

- [ ] I understand what HTML does vs. CSS and JavaScript
- [ ] I can write the HTML5 boilerplate without looking it up
- [ ] I saved a `.html` file and opened it in a browser
- [ ] I understand what a void element is

## 🏆 Milestone Complete!

You've written your first web document. The browser can now *parse* your file.

## ➡️ Next Unit

[Lesson 02 — Text & Flow](./lesson_02.md)
