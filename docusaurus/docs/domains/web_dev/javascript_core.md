import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# JavaScript Core Reference

> **Domain:** Web Development · **Role:** Frontend / Fullstack

JavaScript is the programming language of the Web. While [Programming Basics](../foundations/programming_basics.md) covers general logic (variables, loops, structs), this guide focuses on the inner workings of the JavaScript engine, the Document Object Model (DOM), and its asynchronous architecture.

---

## 📖 Concepts: Execution Context & The Event Loop

JavaScript is a single-threaded, non-blocking, asynchronous, concurrent language. It has a call stack, an event loop, a callback queue, and other APIs.

### The Call Stack

When a script calls a function, the engine adds it to the call stack and starts executing it. If that function calls another function, it is added to the top of the stack. When the current function finishes, the engine pops it off the stack.

### The Event Loop

Because JS is single-threaded, heavy computations or network requests can block the UI. To solve this, browsers provide Web APIs (like `Timeout`, `XMLHttpRequest`, DOM Events). 

1. JS executes synchronous code on the **Call Stack**.
2. When an asynchronous operation (e.g., `setTimeout`) is encountered, it is handed off to the **Web API**.
3. When the Web API finishes, its callback is pushed to the **Task Queue** (or Microtask Queue for Promises).
4. The **Event Loop** continuously checks if the Call Stack is empty. If it is, it takes the first callback from the queues and pushes it onto the Call Stack.

---

## 📖 Concepts: The Prototype Chain

Unlike class-based languages (Java, C++), JavaScript historically uses prototypical inheritance. 
Every object in JavaScript has a built-in property, which is called its prototype. The prototype is itself an object, so the prototype will have its own prototype, making what's called a **prototype chain**.

Modern JS uses the `class` keyword as syntactic sugar over this prototype system.

```javascript
// The legacy prototype way
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  console.log(this.name + ' makes a noise.');
}

// The modern ES6 way (syntactic sugar)
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}
```

---

## 📖 Concepts: The DOM API

The Document Object Model (DOM) is a programming interface for HTML. It represents the page so that programs can change the document structure, style, and content.

### Selection

```javascript
// Returns a single element
const header = document.getElementById('main-header');
const firstButton = document.querySelector('.btn');

// Returns an iterable collection (NodeList)
const allButtons = document.querySelectorAll('.btn');
```

### Event Driven Architecture

The browser relies on an event-driven architecture. Elements dispatch events (clicks, keypresses), and you attach "Listeners" to handle them.

```javascript
const button = document.querySelector('.btn-submit');

button.addEventListener('click', function(event) {
  event.preventDefault(); // Prevents default form submission
  console.log('Button was clicked!');
});
```

### Event Propagation (Bubbling & Capturing)

When an event fires on an element, it first runs the handlers on it, then on its parent, then all the way up on other ancestors. This is called **bubbling**. You can stop it via `event.stopPropagation()`.

Alternatively, **Event Delegation** is a pattern where you attach a single listener to a parent element to handle events for multiple children (even ones created dynamically later).

---

## 📖 Concepts: Asynchronous JavaScript (Promises & Fetch)

Network requests take time. JavaScript handles this natively avoiding execution blocking using `Promises` and the `fetch` API.

### The Promise

A Promise is an object representing the eventual completion or failure of an asynchronous operation.

```javascript
const fetchData = new Promise((resolve, reject) => {
  // Simulating an async task
  setTimeout(() => resolve("Data loaded!"), 1000);
});

fetchData.then(result => console.log(result)).catch(error => console.error(error));
```

### Fetch API and Async/Await

`async/await` is syntactic sugar over Promises, making asynchronous code look synchronous.

```javascript
async function getUserData(userId) {
  try {
    // Await pauses the function execution until the Promise resolves
    const response = await fetch(`https://api.example.com/users/${userId}`);
    
    // Convert the response to JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

// Top level await is supported in modern modules
const user = await getUserData(123);
```

---
## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary">

- [MDN Web Docs: JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MDN Web Docs: Intro to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- [JavaScript.info: The Modern JavaScript Tutorial](https://javascript.info/)
- [Loupe: Visualizing the Event Loop](http://latentflip.com/loupe)


</TabItem>
</Tabs>