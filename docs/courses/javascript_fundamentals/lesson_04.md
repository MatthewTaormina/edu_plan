# Lesson 04 — Event Driven Architecture

> **Course:** Vanilla JavaScript Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Attach event listeners using `addEventListener`
- [ ] Use the `event` object to read event details and prevent default behavior
- [ ] Understand event bubbling and how to stop it
- [ ] Implement event delegation to handle dynamically added elements
- [ ] Handle keyboard events (`keydown`, `keyup`) and input events

---

## 📖 Concepts

### `addEventListener`

```javascript
// Syntax: element.addEventListener(eventType, callbackFunction, options)

const btn = document.querySelector('#my-btn');

// Named function (preferred for readability and removability)
function handleClick(event) {
    console.log('Clicked!', event);
}
btn.addEventListener('click', handleClick);

// Anonymous arrow function (convenient for simple handlers)
btn.addEventListener('click', (event) => {
    console.log('Also clicked:', event.target);
});

// Remove a listener (you must pass the same function reference)
btn.removeEventListener('click', handleClick);
```

### The Event Object

Every event handler receives an `event` (or `e`) object containing details about what happened.

```javascript
document.querySelector('#submit-btn').addEventListener('click', (event) => {
    // The element that triggered the event
    console.log(event.target);           // <button id="submit-btn">

    // The element the listener is attached to (same as target if not bubbling)
    console.log(event.currentTarget);

    // Prevent the default browser action
    event.preventDefault();  // Stops form submission, link navigation, etc.

    // Check modifier keys held during the click
    console.log(event.ctrlKey);   // true if Ctrl was held
    console.log(event.shiftKey);  // true if Shift was held

    // Mouse position
    console.log(event.clientX, event.clientY);  // Viewport-relative coordinates
    console.log(event.pageX, event.pageY);      // Page-relative coordinates
});
```

### Common Event Types

```javascript
// --- Mouse ---
el.addEventListener('click', handler);          // Single click
el.addEventListener('dblclick', handler);        // Double click
el.addEventListener('mouseenter', handler);      // Mouse enters element (no bubbling)
el.addEventListener('mouseleave', handler);      // Mouse leaves element (no bubbling)
el.addEventListener('mouseover', handler);       // Mouse enters element or any child (bubbles)

// --- Keyboard ---
document.addEventListener('keydown', (e) => {   // Key pressed (repeats while held)
    console.log(e.key);     // "a", "Enter", "ArrowUp", "Escape", etc.
    console.log(e.code);    // "KeyA", "Enter" (physical key, layout-independent)

    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter' && !e.shiftKey) submitForm();  // Enter but not Shift+Enter
});
document.addEventListener('keyup', handler);     // Key released

// --- Form / Input ---
input.addEventListener('input', handler);        // Fires on EVERY character (live)
input.addEventListener('change', handler);       // Fires when input loses focus (committed)
input.addEventListener('focus', handler);        // Input gains focus
input.addEventListener('blur', handler);         // Input loses focus
form.addEventListener('submit', handler);        // Form submitted

// --- Lifecycle ---
document.addEventListener('DOMContentLoaded', () => {
    // DOM is parsed; safe to query elements
    console.log('DOM ready');
});
window.addEventListener('load', () => {
    // Everything (images, fonts) is loaded
});
window.addEventListener('beforeunload', (e) => {
    // User is navigating away — alert them if there's unsaved data
    e.preventDefault();
    e.returnValue = '';  // Required for Chrome
});
```

### Event Bubbling and `stopPropagation`

When an event fires on an element, it "bubbles up" through every ancestor element. Each ancestor's listeners for that event will also fire.

```html
<div id="outer">
    <div id="inner">
        <button id="the-btn">Click Me</button>
    </div>
</div>
```

```javascript
document.querySelector('#outer').addEventListener('click', () => console.log('outer clicked'));
document.querySelector('#inner').addEventListener('click', () => console.log('inner clicked'));
document.querySelector('#the-btn').addEventListener('click', (e) => {
    console.log('button clicked');
    // Output order: "button clicked", "inner clicked", "outer clicked"
    // (bubbles from innermost to outermost)

    // To stop bubbling:
    e.stopPropagation();  // Now only "button clicked" logs
});
```

### Event Delegation — Handle Dynamic Elements

When you have many children, or children are added dynamically, attach ONE listener to the parent and use `event.target` to identify which child was interacted with.

```html
<ul id="todo-list">
    <!-- Items are added dynamically by JS -->
</ul>
```

```javascript
const list = document.querySelector('#todo-list');

// ✅ One listener on the parent — catches events from all children,
// including those added AFTER the listener was attached.
list.addEventListener('click', (event) => {
    const item = event.target.closest('li');  // Find the nearest li ancestor of click target
    if (!item) return;  // Clicked outside a list item

    const deleteBtn = event.target.closest('.task__delete');
    if (deleteBtn) {
        item.remove();
        return;
    }

    const checkbox = event.target.closest('input[type="checkbox"]');
    if (checkbox) {
        item.classList.toggle('task--done', checkbox.checked);
    }
});

// ❌ Wrong — this listener is attached once; items added later won't have it
document.querySelectorAll('#todo-list li').forEach(li => {
    li.addEventListener('click', handler);  // If new li's are added, they won't respond
});
```

### Keyboard Shortcuts

```javascript
document.addEventListener('keydown', (e) => {
    // Ctrl+S (or Cmd+S on Mac) — save action
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();   // Prevent browser's "Save Page" dialog
        saveDocument();
    }

    // Escape — close the active modal
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal[aria-hidden="false"]');
        modal?.classList.add('hidden');
    }

    // Arrow keys — navigate a list
    if (e.key === 'ArrowDown') {
        focusNextItem();
    }
    if (e.key === 'ArrowUp') {
        focusPrevItem();
    }
});
```

---

## 🏗️ Assignments

### Assignment 1 — Interactive Quiz

Build a 3-question multiple-choice quiz:
- Each question has 4 radio-button options.
- A "Submit" button prevents default form submission and instead calculates the score.
- Show feedback: correct/incorrect per question and total score.

### Assignment 2 — Keyboard-Accessible Dropdown

Build a custom dropdown menu. It should open on click and close when:
1. The close button is clicked
2. The Escape key is pressed
3. The user clicks anywhere outside the dropdown

Use event delegation for the close-on-outside-click behavior.

### Assignment 3 — Live Character Counter

Add a `<textarea>` with a 200-character limit and a live character count beneath it. As the user types (use the `input` event), update the counter. Turn the counter red when 180+ characters are used.

---

## ✅ Milestone Checklist

- [ ] I used `addEventListener` for all interactions (no inline `onclick` attributes)
- [ ] I called `event.preventDefault()` on a form submission
- [ ] I implemented event delegation on a parent list element
- [ ] I handled keyboard events (`keydown`) for at least one interaction

## 🏆 Milestone Complete!

Your pages now respond to users in real time.

## ➡️ Next Unit

[Lesson 05 — State & Storage](./lesson_05.md)
