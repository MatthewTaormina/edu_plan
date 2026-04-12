# Lesson 08 — Animations & Transitions

> **Course:** CSS Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Apply smooth property changes using `transition`
- [ ] Build multi-step animations with `@keyframes` and `animation`
- [ ] Control timing functions to create natural motion
- [ ] Use `transform` for GPU-accelerated position, scale, and rotation
- [ ] Follow the "animate only `transform` and `opacity`" performance rule

---

## 📖 Concepts

### Transitions

A transition smoothly animates a CSS property from one value to another when that property changes (usually on `:hover` or via a class toggle).

```css
/* transition: property duration timing-function delay */

.btn {
    background-color: hsl(230, 70%, 55%);
    color: white;
    padding: 0.6rem 1.5rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;

    /* Transition multiple properties */
    transition:
        background-color 200ms ease,
        transform 150ms ease,
        box-shadow 200ms ease;
}

.btn:hover {
    background-color: hsl(230, 70%, 45%);  /* Darker on hover */
    transform: translateY(-2px);             /* Lift up 2px */
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.btn:active {
    transform: translateY(0);               /* Press down on click */
    box-shadow: none;
}
```

### Timing Functions

```css
/* Built-in timing functions */
transition: color 300ms ease;             /* Slow in, slow out (most natural) */
transition: color 300ms ease-in;          /* Slow at start */
transition: color 300ms ease-out;         /* Slow at end */
transition: color 300ms ease-in-out;      /* Slow at both ends */
transition: color 300ms linear;           /* Constant speed (mechanical, often unnatural) */

/* Cubic bezier — custom curves. Use cubic-bezier.com to experiment. */
transition: color 300ms cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot/spring effect */
```

### The `transform` Property

`transform` moves, scales, rotates, or skews an element **without affecting document flow** (other elements don't shift). It's also GPU-accelerated, making it the smoothest property to animate.

```css
.card {
    transition: transform 200ms ease, box-shadow 200ms ease;
}

.card:hover {
    transform: translateY(-8px) scale(1.02);  /* Rise and slightly enlarge */
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Individual transforms */
transform: translateX(50px);          /* Move right 50px */
transform: translateY(-10px);         /* Move up 10px */
transform: translate(-50%, -50%);     /* Used for centering */
transform: scale(1.1);                /* 110% size */
transform: scale(0.95);               /* 95% size (press-down effect) */
transform: rotate(45deg);             /* Rotate 45 degrees */
transform: rotate(-3deg);             /* Tilt */
transform: skewX(-10deg);             /* Italic shear */
```

### @keyframes Animations

For animations that run automatically or have more than two states, use `@keyframes`:

```css
/* Define the animation */
@keyframes fade-up {
    from {
        opacity: 0;
        transform: translateY(24px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Apply the animation */
.hero-title {
    animation:
        fade-up        /* keyframe name */
        600ms          /* duration */
        ease-out       /* timing */
        200ms          /* delay */
        1              /* iteration count (or 'infinite') */
        both;          /* fill-mode: apply 'from' state before start, 'to' state after end */
}

/* Multi-step animation */
@keyframes pulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.notification-badge {
    animation: pulse 1.5s ease-in-out infinite;
}
```

### Loading Spinner

```html
<div class="spinner" role="status" aria-label="Loading..."></div>
```

```css
@keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid hsl(220, 15%, 85%);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 700ms linear infinite;
}
```

### Performance Rule: Only Animate `transform` and `opacity`

Animating most CSS properties forces the browser to recalculate layout (reflow) or repaint pixels every frame, causing jank.

```css
/* ✅ Performant — GPU composited, no reflow */
.good { transition: transform 200ms ease, opacity 200ms ease; }

/* ❌ Avoid animating these — they trigger reflow */
.bad  { transition: width 200ms, height 200ms, top 200ms, left 200ms; }
```

Use `transform: translateX()` instead of animating `left`. Use `transform: scaleY()` instead of animating `height`.

### A Full Interactive Button Suite

```css
/* Primary button */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    padding: 0.6rem 1.4rem;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 6px;
    border: 2px solid transparent;
    cursor: pointer;
    text-decoration: none;
    transition:
        background-color 180ms ease,
        border-color 180ms ease,
        color 180ms ease,
        transform 120ms ease,
        box-shadow 180ms ease;
}

.btn:hover  { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.btn:active { transform: translateY(0);    box-shadow: none; }

/* Variants */
.btn--primary  { background-color: var(--color-primary); color: white; }
.btn--primary:hover { background-color: hsl(230, 70%, 45%); }

.btn--outline  { background-color: transparent; border-color: var(--color-primary); color: var(--color-primary); }
.btn--outline:hover { background-color: var(--color-primary); color: white; }

.btn--ghost    { background-color: transparent; color: var(--color-primary); }
.btn--ghost:hover { background-color: hsl(230, 70%, 55%, 0.1); }
```

### Accessibility: Respect `prefers-reduced-motion`

Some users have vestibular disorders or motion sensitivity. Always wrap motion in a media query:

```css
/* First, define all animations normally */
.card { transition: transform 200ms ease; }

/* Then wrap in a media query and disable/reduce them */
@media (prefers-reduced-motion: reduce) {
    /* Disable all transitions and animations */
    *, *::before, *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
    }
}
```

---

## 🏗️ Assignments

### Assignment 1 — Button Hover Suite

Build three button variants (Primary, Outline, Ghost) with smooth hover transitions including `transform: translateY(-2px)` and a box-shadow appearance.

### Assignment 2 — Card Lift

Apply a hover effect to a card: it should lift (`translateY(-8px)`) and deepen its shadow. The transition should be smooth and fast.

### Assignment 3 — CSS Loading Spinner

Build the spinner example above. Then modify it to use a gradient instead of a single color.

### Assignment 4 — Entrance Animation

Apply a `fade-up` entrance animation to a hero section. It should start invisible and 24px below its final position, then smoothly rise up.

---

## ✅ Milestone Checklist

- [ ] I applied `transition` to create smooth hover effects
- [ ] I used `transform` instead of `top`/`left` for movement
- [ ] I built a `@keyframes` animation that runs automatically
- [ ] I added a `prefers-reduced-motion` media query

## 🏆 Milestone Complete!

Your interfaces now feel alive and polished.

## ➡️ Next Unit

[Lesson 09 — Capstone: Responsive Profile Landing Page](./lesson_09.md)
