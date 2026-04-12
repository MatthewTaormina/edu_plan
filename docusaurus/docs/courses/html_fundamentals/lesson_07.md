# Lesson 07 — Semantic Architecture

> **Course:** HTML Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Replace meaningless `<div>` and `<span>` with purpose-built semantic elements
- [ ] Understand how semantic HTML creates a meaningful document outline
- [ ] Place `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>` correctly
- [ ] Use ARIA landmark roles to bridge gaps where native semantics are insufficient
- [ ] Audit an HTML document for "div soup"

---

## 📖 Concepts

### What is Semantic HTML?

A **semantic element** is one that clearly describes its meaning to both the browser and the developer. Compare:

```html
<!-- Non-semantic "div soup" — this tells a browser and screen reader nothing -->
<div class="header">
    <div class="nav">
        <div class="nav-item">Home</div>
    </div>
</div>
<div class="content">
    <div class="article">
        <div class="article-title">Hello World</div>
    </div>
</div>

<!-- Semantic HTML — every element describes its role -->
<header>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
        </ul>
    </nav>
</header>
<main>
    <article>
        <h1>Hello World</h1>
    </article>
</main>
```

With semantic HTML, screen readers can announce "Navigation landmark", "Main content landmark", "Article" — giving users context and keyboard shortcuts to jump between sections.

### The Landmark Elements

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>A Semantic Blog</title>
</head>
<body>

    <!-- Site-wide page header: logo, branding, main nav -->
    <header>
        <a href="/">
            <img src="logo.svg" alt="OpenLearn logo — return to homepage">
        </a>
        <nav aria-label="Main navigation">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/courses">Courses</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    </header>

    <!-- The main content area — only ONE <main> per page -->
    <main>

        <!-- An <article> is self-contained: it could be syndicated on another site -->
        <article>
            <header>
                <!-- A <header> inside an <article> provides article-specific header info -->
                <h1>Understanding Semantic HTML</h1>
                <p>Published on <time datetime="2026-04-11">April 11, 2026</time> by Open Learner's Guide</p>
            </header>

            <!-- <section> groups related content under a heading -->
            <section>
                <h2>Why Semantics Matter</h2>
                <p>Search engines and screen readers rely on the meaning of elements, not their visual appearance.</p>
            </section>

            <section>
                <h2>Common Semantic Elements</h2>
                <p>HTML5 introduced many new semantic elements to replace div soup...</p>
            </section>

            <footer>
                <!-- A <footer> inside an <article> provides metadata about the article -->
                <p>Tags: <a href="/tags/html">HTML</a>, <a href="/tags/accessibility">Accessibility</a></p>
            </footer>
        </article>

        <!-- <aside> is for content tangentially related to the main content -->
        <aside aria-label="Related resources">
            <h2>Also Read</h2>
            <ul>
                <li><a href="/accessibility-intro">Introduction to Accessibility</a></li>
                <li><a href="/aria-guide">ARIA Guide for Beginners</a></li>
            </ul>
        </aside>

    </main>

    <!-- Site-wide footer: copyright, legal links, contact -->
    <footer>
        <nav aria-label="Footer navigation">
            <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
        <p>&copy; 2026 Open Learner's Guide</p>
    </footer>

</body>
</html>
```

### Element Reference

| Element | What it means |
|---------|---------------|
| `<header>` | Introductory content for the page *or* for an `<article>` / `<section>` |
| `<nav>` | A block of navigation links |
| `<main>` | The primary, unique content of the page. One per page. |
| `<article>` | A self-contained, distributable unit of content (a post, a product listing, a comment) |
| `<section>` | A thematic grouping of content, always identified by a heading |
| `<aside>` | Content tangentially related to the main content (sidebar, callout, related links) |
| `<footer>` | Footer content for the whole page *or* for an `<article>` |
| `<time>` | A date/time, with a machine-readable `datetime` attribute |
| `<address>` | Contact information for the nearest `<article>` or the whole document |
| `<figure>` | Self-contained content (image, chart, code) with optional caption |
| `<figcaption>` | Caption for a `<figure>` |

### When is `<div>` Still Appropriate?

`<div>` is a generic, semantically neutral block container. Use it when:
- You need a layout wrapper for CSS purposes and no semantic element fits
- You need a JavaScript hook on a group of elements

```html
<!-- This <div> exists purely for CSS grid layout — acceptable -->
<div class="card-grid">
    <article>...</article>
    <article>...</article>
    <article>...</article>
</div>
```

---

## 🏗️ Assignments

### Assignment 1 — Blog Page

Convert this div soup into fully semantic HTML:

```html
<!-- Your task: replace every div with a semantic equivalent -->
<div class="page">
    <div class="header">
        <div class="logo">TechBlog</div>
        <div class="menu">
            <div class="menu-item"><a href="/">Home</a></div>
            <div class="menu-item"><a href="/about">About</a></div>
        </div>
    </div>
    <div class="main">
        <div class="post">
            <div class="post-title">My First Post</div>
            <div class="post-date">April 11, 2026</div>
            <div class="post-body">This is the body of the post.</div>
        </div>
        <div class="sidebar">
            <div class="sidebar-title">Recent Posts</div>
        </div>
    </div>
    <div class="footer">Copyright 2026</div>
</div>
```

### Assignment 2 — Add `<time>` Tags

Go through your blog page. Wherever a date appears as plain text, wrap it in a `<time>` element with a machine-readable `datetime` attribute. For example: `<time datetime="2026-04-11">April 11, 2026</time>`.

---

## ✅ Milestone Checklist

- [ ] My page has exactly one `<main>` element
- [ ] I used `<article>` for at least one self-contained content piece
- [ ] My navigation uses the `<nav>` element wrapping a `<ul>`
- [ ] I added `aria-label` to differentiate between multiple `<nav>` elements
- [ ] I can articulate the difference between `<section>` and `<article>`

## 🏆 Milestone Complete!

Your HTML is now structured the way the web was intended to work — meaningful, accessible, and crawlable.

## ➡️ Next Unit

[Lesson 08 — Capstone: Accessible Recipe Book](./lesson_08.md)
