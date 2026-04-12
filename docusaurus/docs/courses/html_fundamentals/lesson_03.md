# Lesson 03 — Anchors & Navigation

> **Course:** HTML Fundamentals · **Time:** 45 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Create hyperlinks to external websites
- [ ] Create links to other pages within your own site using relative paths
- [ ] Link to specific sections of a page using fragment identifiers (`#`)
- [ ] Open links in new tabs safely using `target="_blank"` and `rel="noopener"`
- [ ] Build a basic site navigation bar using `<nav>` and a list of anchors

---

## 📖 Concepts

### The Anchor Tag `<a>`

The anchor tag is the fundamental building block of the web. Without it, every website would be an isolated island. It creates a clickable hyperlink to another resource.

```html
<a href="https://developer.mozilla.org">Visit MDN Web Docs</a>
```

The `href` (Hypertext Reference) attribute contains the destination URL.

### Absolute vs. Relative URLs

This is one of the most common sources of confusion for beginners.

| Type | When to use | Example |
|------|-------------|---------|
| **Absolute URL** | Linking to a *different* website | `href="https://github.com"` |
| **Relative URL** | Linking to another page *on your own site* | `href="about.html"` or `href="../index.html"` |
| **Root-relative** | Starting from the site's root directory | `href="/contact.html"` |

```html
<!-- Absolute: links to another domain entirely -->
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML">MDN HTML Docs</a>

<!-- Relative: links to about.html in the same folder as the current file -->
<a href="about.html">About Us</a>

<!-- Relative: links to a file one directory up -->
<a href="../home.html">Go Home</a>

<!-- Root-relative: starts from the root of the website, works regardless of current page depth -->
<a href="/contact.html">Contact</a>
```

### Fragment Links (Linking to a Section)

You can link to a specific section of any page using an `id` attribute on the target element and a `#` prefix in the href.

```html
<!-- Clicking this will scroll to the section below -->
<a href="#installation">Jump to Installation</a>

<!-- ...later in the document... -->
<section id="installation">
    <h2>Installation</h2>
    <p>Follow these steps...</p>
</section>
```

This is how documentation sites and "table of contents" links work.

### Opening in a New Tab

```html
<!-- Opens the link in a new browser tab -->
<a href="https://github.com" target="_blank" rel="noopener noreferrer">
    Visit GitHub (opens new tab)
</a>
```

> [!IMPORTANT]
> Always add `rel="noopener noreferrer"` when using `target="_blank"`. Without it, the opened page can access your page via `window.opener`, which is a security vulnerability known as **reverse tababnapping**.

### Building a Navigation Bar

```html
<header>
    <nav aria-label="Main navigation">
        <ul>
            <li><a href="/index.html">Home</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/projects.html">Projects</a></li>
            <li><a href="/contact.html">Contact</a></li>
        </ul>
    </nav>
</header>
```

> [!TIP]
> Wrap navigation links in a `<ul>` inside a `<nav>`. This is semantically correct: a nav is a *list* of links. A screen reader will announce: "Navigation, list with 4 items", giving context to users who can't see the layout.

### Email and Phone Links

```html
<!-- mailto: opens the user's default email client -->
<a href="mailto:hello@example.com">Send me an email</a>

<!-- tel: on mobile, opens the phone dialer -->
<a href="tel:+15551234567">+1 (555) 123-4567</a>
```

---

## 🏗️ Assignments

### Assignment 1 — Multi-Page Site

Create two files: `index.html` (a home page) and `about.html` (an about page). Link each to the other using relative URLs.

### Assignment 2 — Navigation Bar

Add a `<nav>` bar to both pages using the semantic list-based syntax. Make the current page's link visually distinct by wrapping it in a `<strong>` tag (e.g., the Home link is bolded when you are on the home page).

### Assignment 3 — In-Page Table of Contents

In `about.html`, create three sections with `id` attributes (e.g., `id="bio"`, `id="skills"`, `id="contact"`). At the top of the page, add a "Table of Contents" list with anchor links to each section.

---

## ✅ Milestone Checklist

- [ ] I can write absolute and relative links without looking them up
- [ ] I added `rel="noopener noreferrer"` to all `target="_blank"` links
- [ ] I built a semantic navigation bar with `<nav>` and `<ul>`
- [ ] I created a table of contents using `#fragment` links

## 🏆 Milestone Complete!

You now understand how the web is "hyper" — it links documents together.

## ➡️ Next Unit

[Lesson 04 — Immersive Media](./lesson_04.md)
