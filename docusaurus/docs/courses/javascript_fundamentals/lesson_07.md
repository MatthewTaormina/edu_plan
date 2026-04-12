# Lesson 07 — Time & Asynchrony

> **Course:** Vanilla JavaScript Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Use `setTimeout` to run code after a delay
- [ ] Use `setInterval` to repeat code at a fixed interval
- [ ] Understand why JavaScript is single-threaded and what that means practically
- [ ] Explain the Event Loop conceptually (call stack, task queue)
- [ ] Build a real countdown timer with `setInterval`

---

## 📖 Concepts

### `setTimeout` — Run Once After a Delay

```javascript
// setTimeout(callback, delayInMilliseconds, ...args)

// Run a function after 2 seconds
const timerId = setTimeout(() => {
    console.log('2 seconds have passed!');
}, 2000);

// Cancel a pending timeout with clearTimeout
clearTimeout(timerId);  // The callback will NOT run if cleared before the delay

// Practical: Close a notification after 3 seconds
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.setAttribute('role', 'status');  // Announced by screen readers
    document.body.appendChild(notification);

    // Slide in
    setTimeout(() => notification.classList.add('notification--visible'), 10);

    // Auto-close
    const closeTimer = setTimeout(() => {
        notification.classList.remove('notification--visible');
        // Remove from DOM after transition completes
        setTimeout(() => notification.remove(), 300);
    }, duration);

    // Allow manual close
    notification.addEventListener('click', () => {
        clearTimeout(closeTimer);
        notification.remove();
    });
}

showNotification('Settings saved!', 4000);
```

### `setInterval` — Repeat at a Fixed Rate

```javascript
// setInterval(callback, intervalInMilliseconds)
// Returns an ID you can use with clearInterval to stop it

let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log(`Tick #${count}`);

    if (count >= 5) {
        clearInterval(intervalId);  // Stop after 5 ticks
        console.log('Interval cleared');
    }
}, 1000);  // Every 1 second
```

:::warning
`setInterval` does NOT wait for the callback to complete before scheduling the next call. If the callback takes longer than the interval, callbacks will pile up. For long-running work, use a recursive `setTimeout` instead (shown below).
:::

### Recursive `setTimeout` (Safer Interval Pattern)

```javascript
// Schedule the next call only after the previous one finishes
async function pollForUpdates() {
    try {
        const data = await fetchLatestData();
        updateUI(data);
    } finally {
        // Schedule next poll after this one is done (even if it errored)
        setTimeout(pollForUpdates, 5000);
    }
}
pollForUpdates();  // Start the polling loop
```

### The Event Loop (Conceptual)

JavaScript is **single-threaded** — it can only execute one thing at a time. But it handles asynchronous operations without blocking using the Event Loop.

```
Call Stack      Web APIs        Task Queue      Microtask Queue
──────────      ────────        ──────────      ───────────────
main()      ──► setTimeout  
              (2000ms)
              ...time passes...
                             ──► callback()
                                  (waits)
Call Stack      
is empty
            ◄─────────────── Event Loop picks
                              callback from queue
callback()
```

Key rules:
1. **Synchronous code** runs first and must complete before any async callbacks run.
2. **Microtasks** (Promise `.then()`, `queueMicrotask()`) run after the current synchronous code finishes, before any task queue callbacks.
3. **Task queue** (setTimeout, setInterval, events) runs after microtasks.

```javascript
console.log('1: Start');

setTimeout(() => console.log('4: setTimeout callback'), 0);  // Task Queue

Promise.resolve().then(() => console.log('3: Promise microtask'));  // Microtask Queue

console.log('2: End');

// Output order: 1, 2, 3, 4
// "0ms" setTimeout still runs AFTER Promise microtasks!
```

### Building a Countdown Timer

```html
<div id="timer-app">
    <output id="timer-display" class="timer-display">05:00</output>
    <div class="timer-controls">
        <button id="start-btn">Start</button>
        <button id="pause-btn" disabled>Pause</button>
        <button id="reset-btn">Reset</button>
    </div>
</div>
```

```javascript
'use strict';

// --- State ---
const INITIAL_SECONDS = 5 * 60;  // 5 minutes
let totalSeconds = INITIAL_SECONDS;
let intervalId = null;

// --- DOM refs ---
const display  = document.querySelector('#timer-display');
const startBtn = document.querySelector('#start-btn');
const pauseBtn = document.querySelector('#pause-btn');
const resetBtn = document.querySelector('#reset-btn');

// --- Render ---
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateDisplay() {
    display.textContent = formatTime(totalSeconds);
    // Update ARIA label for screen readers
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    display.setAttribute('aria-label', `${m} minutes ${s} seconds remaining`);

    // Flash red at 30 seconds
    display.classList.toggle('timer-display--warning', totalSeconds <= 30);
}

// --- Logic ---
function tick() {
    if (totalSeconds <= 0) {
        stopTimer();
        announceEnd();
        return;
    }
    totalSeconds--;
    updateDisplay();
}

function startTimer() {
    if (intervalId) return;  // Already running
    intervalId = setInterval(tick, 1000);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
}

function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetTimer() {
    stopTimer();
    totalSeconds = INITIAL_SECONDS;
    updateDisplay();
}

function announceEnd() {
    display.textContent = 'Done!';
    display.classList.add('timer-display--done');
    // Could also play a sound or show a notification here
}

// --- Events ---
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// --- Init ---
updateDisplay();
```

---

## 🏗️ Assignments

### Assignment 1 — Notification System

Build a notification function (`showNotification(message, type)`) that:
- Appends a notification div to the page
- Auto-dismisses after 4 seconds with a CSS transition
- Supports types: `'success'` (green), `'error'` (red), `'info'` (blue)
- Can be manually dismissed by clicking an ✕ button

### Assignment 2 — Countdown Timer

Implement the full countdown timer from the example above. Add:
- The ability to input a custom number of minutes before starting
- A visible progress bar that depletes as time runs out

### Assignment 3 — Event Loop Puzzle

In the DevTools console, predict the output ORDER of this code before running it:

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
setTimeout(() => console.log('D'), 100);
console.log('E');
```

Write your prediction, run it, and explain the result.

---

## ✅ Milestone Checklist

- [ ] I can explain what it means for JavaScript to be single-threaded
- [ ] I used `clearInterval` / `clearTimeout` to prevent timer leaks
- [ ] I built a working countdown timer using `setInterval`
- [ ] I predicted the output order of the Event Loop puzzle

## 🏆 Milestone Complete!

You now understand how JavaScript manages time and asynchrony.

## ➡️ Next Unit

[Lesson 08 — Network Requests](./lesson_08.md)
