# Lesson 02 — Querying the DOM

> **Course:** Vanilla JavaScript Fundamentals · **Time:** 45 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Select elements using `getElementById`, `querySelector`, and `querySelectorAll`
- [ ] Understand the difference between a NodeList and an Array
- [ ] Traverse the DOM using `parentElement`, `children`, and `nextElementSibling`
- [ ] Read element properties: `textContent`, `innerHTML`, `classList`, `dataset`
- [ ] Check if an element exists before accessing its properties

---

## 📖 Concepts

### Selection Methods

The DOM (Document Object Model) is a programmable representation of the HTML on the page. JavaScript uses it to find and modify elements.

```html
<!-- HTML to query against -->
<main id="app">
    <h1 class="title" data-version="2">Welcome Back</h1>
    <ul id="task-list">
        <li class="task task--done">Write HTML</li>
        <li class="task task--done">Write CSS</li>
        <li class="task task--active">Write JavaScript</li>
    </ul>
    <button class="btn btn--primary" id="add-task-btn">Add Task</button>
</main>
```

```javascript
// --- getElementById ---
// Returns: one Element or null
// Use: fast lookup when you have an id
const appRoot    = document.getElementById('app');          // <main id="app">
const addTaskBtn = document.getElementById('add-task-btn'); // <button>
const missing    = document.getElementById('non-existent'); // null

// --- querySelector ---
// Returns: the FIRST matching Element, or null
// Accepts: any valid CSS selector
const title      = document.querySelector('.title');        // <h1 class="title">
const activeTask = document.querySelector('.task--active'); // <li class="task task--active">
const firstTask  = document.querySelector('#task-list li'); // First <li> inside #task-list

// --- querySelectorAll ---
// Returns: a static NodeList (all matching elements)
// Must iterate to use (forEach, for...of, spread to Array)
const allTasks   = document.querySelectorAll('.task');      // NodeList[3]
const doneTasks  = document.querySelectorAll('.task--done'); // NodeList[2]
```

### NodeList vs. Array

A `NodeList` looks like an array but doesn't have all array methods.

```javascript
const tasks = document.querySelectorAll('.task');

// ✅ These work on a NodeList:
tasks.forEach(task => console.log(task.textContent));
tasks.length; // 3

// ❌ These do NOT work on a NodeList:
// tasks.map(...)
// tasks.filter(...)
// tasks.find(...)

// ✅ Convert to a real Array to use all array methods:
const tasksArray = Array.from(tasks);
// or: const tasksArray = [...tasks];

const done = tasksArray.filter(task => task.classList.contains('task--done'));
console.log(`${done.length} tasks are done.`);  // "2 tasks are done."
```

### Reading Element Properties

```javascript
const title = document.querySelector('.title');

// textContent — the raw text content of an element (safe, no HTML)
console.log(title.textContent); // "Welcome Back"

// innerHTML — the full HTML content (can read/write nested HTML)
// ⚠️ Never write user-provided data into innerHTML — XSS risk!
console.log(title.innerHTML);   // "Welcome Back"

// classList — access CSS classes
console.log(title.classList);               // DOMTokenList ["title"]
console.log(title.classList.contains('title'));  // true
console.log(title.classList.contains('hidden')); // false

// dataset — read data-* attributes
console.log(title.dataset.version);  // "2"  (reads data-version="2")
```

### Defensive Querying (Always Check for null)

If the element doesn't exist (wrong selector, or the element hasn't been added yet), your script will crash with `TypeError: Cannot read properties of null`.

```javascript
// ❌ Dangerous — will crash if #settings-panel is absent
document.getElementById('settings-panel').classList.add('open');

// ✅ Safe — check before accessing
const panel = document.getElementById('settings-panel');
if (panel) {
    panel.classList.add('open');
}

// ✅ Optional chaining (ES2020) — short-circuit if null
document.getElementById('settings-panel')?.classList.add('open');
```

### DOM Traversal

Sometimes you need to navigate *relative to* an element you've already found.

```javascript
const activeTask = document.querySelector('.task--active');

// Navigate the DOM tree
console.log(activeTask.parentElement);           // <ul id="task-list">
console.log(activeTask.parentElement.id);        // "task-list"
console.log(activeTask.children);               // HTMLCollection (the task's child elements)
console.log(activeTask.nextElementSibling);     // null (it's the last item)
console.log(activeTask.previousElementSibling); // <li class="task task--done">CSS</li>

// Get the closest ancestor matching a selector (like .closest() in jQuery)
const nav = activeTask.closest('main');
console.log(nav.id); // "app"
```

---

## 🏗️ Assignments

### Assignment 1 — Inspection Tool

On any webpage (using the console, not a file), use `querySelectorAll` to:
1. Select all `<a>` tags and log the number found.
2. Select all images and log their `src` attributes.
3. Find the first `<h2>` on the page and log its text.

### Assignment 2 — Todo List Reading

Build the HTML structure from the example above. Write a script that:
1. Queries all `.task` elements.
2. Logs each task's `textContent` along with whether it has the `task--done` class.
3. Counts and logs how many tasks are done vs. still active.

---

## ✅ Milestone Checklist

- [ ] I understand the difference between `querySelector` and `querySelectorAll`
- [ ] I can convert a NodeList to an Array using `Array.from()`
- [ ] I always null-check before accessing element properties
- [ ] I can navigate the DOM tree using `parentElement` and `closest()`

## 🏆 Milestone Complete!

You can now reach any element on the page.

## ➡️ Next Unit

[Lesson 03 — DOM Manipulation](./lesson_03.md)
