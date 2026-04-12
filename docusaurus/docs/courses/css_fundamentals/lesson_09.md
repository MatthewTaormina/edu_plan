# Lesson 09 — Capstone: Responsive Profile Landing Page

> **Course:** CSS Fundamentals · **Time:** 120–180 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Combine the entire CSS Fundamentals course into a single, polished project
- [ ] Apply a design token system using CSS custom properties
- [ ] Build a mobile-first responsive layout using Flexbox and Grid
- [ ] Add animations, transitions, and hover effects throughout
- [ ] Verify the design works across three viewports

---

## 📖 Project Overview

Build a **personal profile landing page** for yourself (or a fictional person). It should include:

- A fixed navigation bar
- A hero section with a name, title, and CTA buttons
- An "About" section with a photo and bio text side by side (on desktop)
- A "Skills" section using a card grid
- A "Projects" showcase section
- A contact form
- A site footer

---

## Starter HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Portfolio and profile of Alex Learner, a junior web developer.">
    <title>Alex Learner — Web Developer</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="dark-mode">

    <header class="navbar" id="top">
        <a class="navbar__brand" href="#top">AL.</a>
        <nav aria-label="Main navigation">
            <ul class="navbar__links">
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
        <a class="btn btn--primary" href="#contact">Hire Me</a>
    </header>

    <main>

        <!-- Hero Section -->
        <section class="hero" id="hero">
            <div class="container">
                <span class="eyebrow">Hello, World!</span>
                <h1 class="hero__title">I'm Alex Learner</h1>
                <p class="hero__subtitle">A junior web developer passionate about accessible, well-crafted interfaces.</p>
                <div class="hero__actions">
                    <a class="btn btn--primary" href="#projects">See My Work</a>
                    <a class="btn btn--outline" href="#contact">Get In Touch</a>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section class="about section" id="about">
            <div class="container about__layout">
                <div class="about__image-wrap">
                    <img
                        class="about__photo"
                        src="https://via.placeholder.com/400x400?text=Photo"
                        alt="Alex Learner smiling outdoors"
                        width="400" height="400"
                    >
                </div>
                <div class="about__text">
                    <span class="eyebrow">About Me</span>
                    <h2>Building the web one semantic tag at a time.</h2>
                    <p>I'm a self-taught developer with a background in graphic design. I transitioned into web development via the Open Learner's Guide and haven't looked back.</p>
                    <p>I care deeply about web standards, accessibility, and making things that work for everyone.</p>
                    <a class="btn btn--ghost" href="resume.pdf">Download Resume →</a>
                </div>
            </div>
        </section>

        <!-- Skills Section -->
        <section class="skills section section--alt" id="skills">
            <div class="container">
                <span class="eyebrow">What I Know</span>
                <h2 class="section__title">Skills</h2>
                <div class="skills__grid">
                    <article class="skill-card">
                        <h3>HTML</h3>
                        <p>Semantic, accessible markup. ARIA, forms, and the full HTML5 element set.</p>
                    </article>
                    <article class="skill-card">
                        <h3>CSS</h3>
                        <p>Flexbox, Grid, responsive design, animations, and custom properties.</p>
                    </article>
                    <article class="skill-card">
                        <h3>JavaScript</h3>
                        <p>DOM manipulation, events, fetch API, and async/await patterns.</p>
                    </article>
                    <article class="skill-card">
                        <h3>Accessibility</h3>
                        <p>WCAG 2.1 AA conformance, keyboard navigation, and screen reader testing.</p>
                    </article>
                    <article class="skill-card">
                        <h3>Git</h3>
                        <p>Version control, branching, pull requests, and atomic commits.</p>
                    </article>
                    <article class="skill-card">
                        <h3>Performance</h3>
                        <p>Core Web Vitals, lazy loading, and optimizing render-blocking resources.</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="contact section" id="contact">
            <div class="container contact__layout">
                <div class="contact__info">
                    <span class="eyebrow">Let's Talk</span>
                    <h2>Get In Touch</h2>
                    <p>I'm open to freelance projects and full-time opportunities. Drop me a message!</p>
                </div>
                <form class="contact__form" action="/contact" method="POST">
                    <div class="form-group">
                        <label for="c-name">Name</label>
                        <input type="text" id="c-name" name="name" required placeholder="Jane Smith">
                    </div>
                    <div class="form-group">
                        <label for="c-email">Email</label>
                        <input type="email" id="c-email" name="email" required placeholder="jane@example.com">
                    </div>
                    <div class="form-group">
                        <label for="c-message">Message</label>
                        <textarea id="c-message" name="message" rows="5" required placeholder="Hello! I'd love to..."></textarea>
                    </div>
                    <button class="btn btn--primary" type="submit">Send Message</button>
                </form>
            </div>
        </section>

    </main>

    <footer class="site-footer">
        <div class="container">
            <p>Designed and built by Alex Learner using HTML &amp; CSS.</p>
            <p>&copy; 2026 Alex Learner. All rights reserved.</p>
        </div>
    </footer>

</body>
</html>
```

## Starter CSS

```css
/* =========================================================
   style.css — Profile Landing Page
   ========================================================= */

/* --- Global Reset & Box Model --- */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* --- Design Tokens --- */
:root {
    /* Colors */
    --clr-primary:       hsl(230, 70%, 60%);
    --clr-primary-dark:  hsl(230, 70%, 45%);
    --clr-accent:        hsl(160, 60%, 45%);
    --clr-surface:       hsl(230, 15%, 96%);
    --clr-bg:            hsl(0, 0%, 100%);
    --clr-text:          hsl(230, 15%, 15%);
    --clr-text-muted:    hsl(230, 10%, 45%);
    --clr-border:        hsl(220, 15%, 88%);

    /* Typography */
    --font-body: 'Inter', system-ui, sans-serif;
    --text-sm:   0.875rem;
    --text-base: 1rem;
    --text-lg:   1.125rem;
    --text-xl:   1.25rem;
    --text-2xl:  1.5rem;
    --text-3xl:  clamp(1.75rem, 4vw, 2.5rem);
    --text-hero: clamp(2.5rem, 7vw, 5rem);

    /* Spacing */
    --space-sm:  0.75rem;
    --space-md:  1.5rem;
    --space-lg:  3rem;
    --space-xl:  6rem;

    /* Effects */
    --radius-sm: 6px;
    --radius-md: 12px;
    --radius-lg: 24px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.10);
    --shadow-lg: 0 12px 48px rgba(0,0,0,0.12);

    --transition: 200ms ease;
}

/* Dark mode variant */
.dark-mode {
    --clr-bg:         hsl(230, 20%, 10%);
    --clr-surface:    hsl(230, 15%, 14%);
    --clr-text:       hsl(230, 15%, 92%);
    --clr-text-muted: hsl(230, 10%, 60%);
    --clr-border:     hsl(230, 15%, 20%);
}

/* --- Base Styles --- */
html { scroll-behavior: smooth; }

body {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: 1.6;
    background-color: var(--clr-bg);
    color: var(--clr-text);
}

img { display: block; max-width: 100%; }
a { color: var(--clr-primary); text-decoration: none; }

/* --- Layout Utilities --- */
.container {
    width: min(90%, 1100px);
    margin-inline: auto;
}

.section {
    padding: var(--space-xl) 0;
}

.section--alt {
    background-color: var(--clr-surface);
}

.section__title {
    font-size: var(--text-3xl);
    font-weight: 700;
    margin-bottom: var(--space-lg);
}

.eyebrow {
    display: block;
    font-size: var(--text-sm);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--clr-primary);
    margin-bottom: 0.5rem;
}

/* --- Buttons --- */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    padding: 0.65rem 1.5rem;
    font-size: var(--text-base);
    font-weight: 600;
    border-radius: var(--radius-sm);
    border: 2px solid transparent;
    cursor: pointer;
    transition:
        background-color var(--transition),
        border-color var(--transition),
        color var(--transition),
        transform var(--transition),
        box-shadow var(--transition);
}

.btn:hover  { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.btn:active { transform: translateY(0);    box-shadow: none; }

.btn--primary {
    background-color: var(--clr-primary);
    color: white;
}
.btn--primary:hover { background-color: var(--clr-primary-dark); }

.btn--outline {
    background-color: transparent;
    border-color: var(--clr-primary);
    color: var(--clr-primary);
}
.btn--outline:hover {
    background-color: var(--clr-primary);
    color: white;
}

.btn--ghost {
    background-color: transparent;
    color: var(--clr-primary);
}

/* --- Navbar --- */
.navbar {
    position: fixed;
    top: 0;
    inset-inline: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem var(--space-md);
    background-color: var(--clr-bg);
    border-bottom: 1px solid var(--clr-border);
    gap: var(--space-md);
}

.navbar__brand {
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--clr-primary);
}

.navbar__links {
    display: flex;
    list-style: none;
    gap: var(--space-md);
}

.navbar__links a {
    font-weight: 500;
    color: var(--clr-text);
    transition: color var(--transition);
}

.navbar__links a:hover { color: var(--clr-primary); }

/* --- Hero --- */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 80px;
    background: linear-gradient(135deg, var(--clr-bg) 60%, hsl(230, 50%, 15%) 100%);
}

.hero__title {
    font-size: var(--text-hero);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: var(--space-sm);
}

.hero__subtitle {
    font-size: var(--text-lg);
    color: var(--clr-text-muted);
    max-width: 55ch;
    margin-bottom: var(--space-md);
}

.hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

/* Hero entrance animation */
@keyframes fade-up {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
}

.hero .eyebrow   { animation: fade-up 500ms ease-out both; }
.hero__title     { animation: fade-up 600ms ease-out 100ms both; }
.hero__subtitle  { animation: fade-up 600ms ease-out 200ms both; }
.hero__actions   { animation: fade-up 600ms ease-out 350ms both; }

/* --- About --- */
.about__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-lg);
    align-items: center;
}

@media (min-width: 48rem) {
    .about__layout {
        grid-template-columns: 1fr 1.5fr;
    }
}

.about__photo {
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
}

.about__text h2 {
    font-size: var(--text-3xl);
    margin-bottom: var(--space-sm);
}

.about__text p {
    color: var(--clr-text-muted);
    margin-bottom: 1rem;
}

/* --- Skills Grid --- */
.skills__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--space-md);
}

.skill-card {
    background-color: var(--clr-bg);
    border: 1px solid var(--clr-border);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    transition: transform var(--transition), box-shadow var(--transition);
}

.skill-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.skill-card h3 {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--clr-primary);
    margin-bottom: 0.5rem;
}

.skill-card p {
    color: var(--clr-text-muted);
    font-size: var(--text-sm);
}

/* --- Contact --- */
.contact__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-lg);
}

@media (min-width: 48rem) {
    .contact__layout { grid-template-columns: 1fr 1.5fr; }
}

.contact__info h2 { font-size: var(--text-3xl); margin-bottom: 1rem; }
.contact__info p  { color: var(--clr-text-muted); }

.contact__form { display: flex; flex-direction: column; gap: 1rem; }

.form-group { display: flex; flex-direction: column; gap: 0.35rem; }

.form-group label {
    font-weight: 500;
    font-size: var(--text-sm);
}

.form-group input,
.form-group textarea {
    padding: 0.65rem 0.9rem;
    border: 1px solid var(--clr-border);
    border-radius: var(--radius-sm);
    background-color: var(--clr-surface);
    color: var(--clr-text);
    font-family: inherit;
    font-size: var(--text-base);
    transition: border-color var(--transition), box-shadow var(--transition);
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--clr-primary);
    box-shadow: 0 0 0 3px hsl(230, 70%, 60%, 0.2);
}

/* --- Footer --- */
.site-footer {
    padding: var(--space-md) 0;
    border-top: 1px solid var(--clr-border);
    text-align: center;
    color: var(--clr-text-muted);
    font-size: var(--text-sm);
}

.site-footer p:first-child { margin-bottom: 0.25rem; }

/* --- Accessibility: Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 🏗️ Assignments

### Submission Requirements

1. Add a real **Projects** section between Skills and Contact. Include at least two projects as cards, each with a screenshot placeholder, title, short description, and two links (Live Demo + GitHub).
2. Implement a simple **dark mode toggle** button in the navbar that adds/removes the `dark-mode` class using a `<script>` tag (just one line: `document.body.classList.toggle('dark-mode')`).
3. Run Lighthouse in Chrome DevTools (Performance + Accessibility tabs). Aim for 90+ on both.

---

## ✅ Milestone Checklist

- [ ] The page works on 375px (mobile), 768px (tablet), and 1280px (desktop)  
- [ ] No inline styles — all styles are in `style.css`
- [ ] Buttons have `:hover` and `:active` transitions
- [ ] Hero section has entrance animations
- [ ] Contact form inputs show a focus ring
- [ ] I added a `prefers-reduced-motion` rule
- [ ] Lighthouse Accessibility score ≥ 90

## 🏆 Milestone Complete!

**CSS Fundamentals is complete.** Save this page — it's your first portfolio project.

## ➡️ Next Course

[Vanilla JavaScript Fundamentals](../javascript_fundamentals/index.md) — Now bring your pages to life.
