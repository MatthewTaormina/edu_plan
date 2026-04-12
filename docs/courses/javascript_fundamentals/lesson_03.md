# Lesson 03 — DOM Manipulation

> **Course:** Vanilla JavaScript Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Change element text and attributes using JavaScript
- [ ] Create new elements and add them to the DOM
- [ ] Remove elements from the DOM
- [ ] Toggle CSS classes to drive visual state
- [ ] Understand why setting `innerHTML` to user content is dangerous (XSS)

---

## 📖 Concepts

### Changing Content and Attributes

```javascript
const heading = document.querySelector('#page-title');

// --- Changing text content ---
heading.textContent = 'Updated Page Title';
// textContent is safe: it treats the value as plain text (no HTML interpretation)

// --- Changing inner HTML (use with caution) ---
const container = document.querySelector('.trophy-case');
// ✅ Safe: content is hardcoded by the developer
container.innerHTML = '<strong>Champion!</strong> 🏆';
// ❌ NEVER do this with user-provided content:
// container.innerHTML = userInput; // XSS vulnerability

// --- Changing attributes ---
const logo = document.querySelector('.site-logo');
logo.src = 'images/logo-v2.png';        // Read/write standard attributes directly
logo.alt = 'Updated logo description';
logo.setAttribute('aria-label', 'Home');

// --- Removing an attribute ---
const btn = document.querySelector('#submit-btn');
btn.removeAttribute('disabled');         // Enables a disabled button

// --- Changing inline styles (prefer CSS classes where possible) ---
heading.style.color = 'crimson';
heading.style.fontSize = '2rem';         // CSS property names become camelCase in JS
heading.style.marginTop = '1.5rem';

// Remove an inline style by setting to empty string
heading.style.color = '';
```

### Toggling CSS Classes — The Right Way to Manage State

Rather than setting inline styles, toggle pre-defined CSS classes. This keeps styling in CSS and logic in JS.

```css
/* style.css */
.hidden { display: none; }
.is-active { color: var(--clr-primary); font-weight: 700; }
.card--featured { border-color: gold; box-shadow: 0 0 0 3px gold; }
```

```javascript
const panel = document.querySelector('.settings-panel');
const navLink = document.querySelector('.nav-link');
const card = document.querySelector('.card');

// classList methods
panel.classList.add('hidden');           // Adds 'hidden' class
panel.classList.remove('hidden');        // Removes 'hidden' class
panel.classList.toggle('hidden');        // Adds if absent, removes if present
const isHidden = panel.classList.contains('hidden');  // true | false

navLink.classList.toggle('is-active', true);   // Force add (second arg = true/false)
navLink.classList.toggle('is-active', false);  // Force remove

// Replace one class with another
card.classList.replace('card--muted', 'card--featured');
```

### Creating and Inserting Elements

```javascript
// Step 1: Create the element
const newItem = document.createElement('li');

// Step 2: Set its content and attributes
newItem.textContent = 'Learn JavaScript';
newItem.classList.add('task', 'task--active');
newItem.dataset.id = '42';  // Sets data-id="42"

// Step 3: Insert it into the DOM

const list = document.querySelector('#task-list');

list.appendChild(newItem);          // Add as the LAST child
list.prepend(newItem);              // Add as the FIRST child

// insertAdjacentElement — precise placement without rearranging existing elements
// positions: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'
const referenceItem = document.querySelector('#pinned-task');
referenceItem.insertAdjacentElement('afterend', newItem);  // After the pinned task

// Cleaner for creating complex HTML — use a template function:
function createTaskElement(text, id) {
    const li = document.createElement('li');
    li.classList.add('task', 'task--active');
    li.dataset.id = id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${id}`;

    const label = document.createElement('label');
    label.htmlFor = `task-${id}`;
    label.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.classList.add('task__delete');
    deleteBtn.setAttribute('aria-label', `Delete task: ${text}`);

    li.append(checkbox, label, deleteBtn);  // append() accepts multiple nodes
    return li;
}

const taskEl = createTaskElement('Write unit tests', 'task-99');
document.querySelector('#task-list').appendChild(taskEl);
```

### Removing Elements

```javascript
const oldBanner = document.querySelector('.promo-banner');

// Modern — remove it directly
oldBanner.remove();

// Legacy (needed for IE support, rarely needed today)
oldBanner.parentElement.removeChild(oldBanner);

// Remove all children (clear a list, for example)
const list = document.querySelector('#task-list');
list.replaceChildren();  // Removes all children (modern)
// or: list.innerHTML = '';  // Works but triggers HTML parsing
```

### A Complete Dynamic List Builder

```html
<!-- HTML -->
<div id="list-app">
    <input type="text" id="new-task-input" placeholder="New task...">
    <button id="add-btn">Add</button>
    <ul id="dynamic-list"></ul>
</div>
```

```javascript
// main.js
'use strict';

const input   = document.querySelector('#new-task-input');
const addBtn  = document.querySelector('#add-btn');
const list    = document.querySelector('#dynamic-list');

let taskIdCounter = 0;

function addTask() {
    const text = input.value.trim();  // .trim() removes leading/trailing whitespace
    if (!text) return;                // Do nothing if empty

    taskIdCounter++;
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = text;
    span.classList.add('task-text');

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.setAttribute('aria-label', `Remove: ${text}`);
    removeBtn.addEventListener('click', () => li.remove());  // Covered in Lesson 04

    li.append(span, removeBtn);
    list.appendChild(li);

    // Clear the input
    input.value = '';
    input.focus();
}

addBtn.addEventListener('click', addTask);
```

---

## 🏗️ Assignments

### Assignment 1 — Highlight Machine

Build a page with several paragraphs. Write a script that:
- Wraps every occurrence of the word "JavaScript" in a `<mark>` element (hint: use `textContent` and string replacement carefully, or `innerHTML` on hardcoded content).
- Adds a "Clear Highlights" button that removes all `<mark>` elements.

### Assignment 2 — Dynamic Shopping List

Build a shopping list app:
- Input field + "Add Item" button
- Each item gets added as an `<li>` with a "Remove" button
- The "Remove" button removes only that item
- If the input is empty when "Add" is clicked, show a validation message

### Assignment 3 — Status Badge

Build a card with a status indicator:
- A "Toggle Status" button should switch the card's badge between "Active" (green) and "Inactive" (red).
- Drive the color change purely through adding/removing CSS classes.

---

## ✅ Milestone Checklist

- [ ] I changed element `textContent` (not `innerHTML`) for user-facing text
- [ ] I used `classList.toggle()` to manage visual state
- [ ] I created elements with `createElement`, set their content, then appended them
- [ ] I removed elements using `.remove()`

## 🏆 Milestone Complete!

You can now build, update, and tear down any part of the page dynamically.

## ➡️ Next Unit

[Lesson 04 — Event Driven Architecture](./lesson_04.md)
