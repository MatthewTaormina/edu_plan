# Lesson 05 — State & Storage

> **Course:** Vanilla JavaScript Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Use JavaScript variables as application state
- [ ] Update the UI to reflect state changes (reactive pattern)
- [ ] Read and write to `localStorage` and `sessionStorage`
- [ ] Store and retrieve complex data (objects, arrays) using `JSON.stringify` / `JSON.parse`
- [ ] Implement a persistent dark mode toggle

---

## 📖 Concepts

### State-Driven UIs

"State" is the data that determines what your UI looks like at any given moment. When state changes, the UI should update to reflect it.

The simplest form: a variable in JavaScript.

```javascript
// State variables
let isDarkMode = false;
let taskCount = 0;
let currentUser = null;

// The UI is a function of state — when state changes, re-render the relevant parts
function updateDarkModeUI() {
    document.body.classList.toggle('dark-mode', isDarkMode);  // sync CSS class to state
    const btn = document.querySelector('#theme-toggle');
    btn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    btn.setAttribute('aria-pressed', isDarkMode.toString());
}

document.querySelector('#theme-toggle').addEventListener('click', () => {
    isDarkMode = !isDarkMode;  // Toggle state
    updateDarkModeUI();        // Reflect in UI
});
```

### `localStorage` — Persistent Across Sessions

Data in `localStorage` survives after the browser is closed. It persists until explicitly cleared.

- Storage limit: ~5MB per origin
- Only stores **strings**
- Synchronous (no `await` needed)

```javascript
// --- Writing ---
localStorage.setItem('theme', 'dark');
localStorage.setItem('username', 'alex');

// --- Reading ---
const theme = localStorage.getItem('theme');     // 'dark' | null if missing
const user  = localStorage.getItem('username');  // 'alex'

// --- Removing ---
localStorage.removeItem('theme');                // Remove a specific key
localStorage.clear();                            // Wipe ALL localStorage for this origin

// --- Storing objects: MUST serialize to JSON ---
const userPrefs = { theme: 'dark', fontSize: 16, language: 'en' };
localStorage.setItem('prefs', JSON.stringify(userPrefs));  // Converts object → string

// Reading it back: MUST parse from JSON
const storedPrefs = localStorage.getItem('prefs');
if (storedPrefs) {
    const prefs = JSON.parse(storedPrefs);       // Converts string → object
    console.log(prefs.theme);                    // 'dark'
}
```

### `sessionStorage` — Cleared on Tab Close

Same API as `localStorage`, but data is cleared when the tab or browser is closed.

```javascript
// Useful for: form wizard progress, temporary session data
sessionStorage.setItem('current-step', '2');
const step = sessionStorage.getItem('current-step');  // '2'
```

| Feature | `localStorage` | `sessionStorage` |
|---------|----------------|-----------------|
| Persistance | Until cleared by code or user | Until the tab/browser closes |
| Scope | All tabs in the same origin | Only the current tab |
| Limit | ~5MB | ~5MB |
| Use case | Theme, user preferences, cached data | Multi-step form progress, wizard state |

### Safe Pattern for Loading from Storage

```javascript
/**
 * Safely read a JSON value from localStorage.
 * Returns the defaultValue if the key doesn't exist or the JSON is malformed.
 */
function loadFromStorage(key, defaultValue) {
    try {
        const raw = localStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch (error) {
        console.warn(`Could not parse localStorage key "${key}":`, error);
        return defaultValue;
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Usage
const tasks = loadFromStorage('tasks', []);  // Load tasks, use [] as default
tasks.push({ id: 1, text: 'Write tests', done: false });
saveToStorage('tasks', tasks);
```

### Complete Persistent Dark Mode Toggle

```html
<!-- HTML -->
<button id="theme-toggle" aria-pressed="false">🌙 Dark Mode</button>
```

```javascript
// main.js
'use strict';

// --- State ---
let isDarkMode = loadFromStorage('isDarkMode', false);

// --- Apply initial state on page load ---
applyTheme();

// --- Event handler ---
document.querySelector('#theme-toggle').addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    saveToStorage('isDarkMode', isDarkMode);
    applyTheme();
});

// --- Render function: syncs UI to state ---
function applyTheme() {
    document.body.classList.toggle('dark-mode', isDarkMode);
    const btn = document.querySelector('#theme-toggle');
    btn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    btn.setAttribute('aria-pressed', isDarkMode.toString());
}

// --- Utility functions ---
function loadFromStorage(key, defaultValue) {
    try {
        const raw = localStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
```

---

## 🏗️ Assignments

### Assignment 1 — Persistent Theme Toggle

Implement the dark mode toggle shown above. Make sure:
1. The theme persists after refreshing the page.
2. The `aria-pressed` attribute updates correctly.
3. The button text reflects the current theme.

### Assignment 2 — Persistent Shopping List

Extend the shopping list from Lesson 03:
1. On each "Add Item", save the full list to `localStorage`.
2. On page load, read the list from `localStorage` and render all saved items.
3. When an item is removed, update `localStorage` immediately.

The list should survive a page refresh.

### Assignment 3 — Form Autosave

Build a `<textarea>` for a draft message. Every time the user types (use the `input` event), save the content to `sessionStorage`. When the page loads, restore the draft if one exists, and show a "Draft restored" banner that closes after 3 seconds.

---

## ✅ Milestone Checklist

- [ ] I understand the difference between `localStorage` and `sessionStorage`
- [ ] I stored an object in localStorage using `JSON.stringify`
- [ ] I safely loaded data with a try/catch and a default value
- [ ] My dark mode (or other preference) persists across page refreshes

## 🏆 Milestone Complete!

Your applications can now remember things between sessions.

## ➡️ Next Unit

[Lesson 06 — Form Handling](./lesson_06.md)
