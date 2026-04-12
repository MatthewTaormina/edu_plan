# Lesson 08 — Network Requests

> **Course:** Vanilla JavaScript Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Use `fetch()` to make HTTP GET and POST requests
- [ ] Handle the two-step resolution of `fetch` (response and body)
- [ ] Use `async/await` to write asynchronous code that reads synchronously
- [ ] Handle errors: network failures and non-OK HTTP status codes
- [ ] Show loading and error states in the UI

---

## 📖 Concepts

### The `fetch` API

`fetch()` is the modern browser API for making network requests. It replaced the older `XMLHttpRequest`.

For a deep-dive into Promises and the fetch API's execution model, see the [JavaScript Core Reference](../../domains/web_dev/javascript_core.md).

```javascript
// fetch() always returns a Promise
// The Promise resolves with a Response object when the server replies
fetch('https://api.example.com/users')
    .then(response => {
        console.log(response.status);  // 200, 404, 500, etc.
        console.log(response.ok);      // true if status is 200–299
        return response.json();        // Parse the body as JSON — also a Promise
    })
    .then(data => {
        console.log(data);  // The actual JavaScript object
    })
    .catch(error => {
        // .catch() only fires on NETWORK failures (offline, DNS failure)
        // NOT on 404/500 responses (those resolve normally!)
        console.error('Network error:', error);
    });
```

:::info
`fetch()` only rejects (goes to `.catch()`) on **network failures** (no internet, CORS block). A `404 Not Found` or `500 Server Error` still *resolves* the Promise — you must check `response.ok` yourself.
:::

### `async/await` — The Modern Pattern

`async/await` is syntactic sugar over Promises. It makes async code look and behave more like synchronous code.

```javascript
async function getUser(userId) {
    // 'await' pauses execution of THIS function until the Promise resolves
    // Other JS code continues executing while we wait
    const response = await fetch(`https://api.github.com/users/${userId}`);

    // Two-step: first get the Response, then parse its body
    const data = await response.json();

    return data;
}

// Calling an async function always returns a Promise
getUser('torvalds').then(user => console.log(user.name));   // Linus Torvalds
```

### Error Handling — The Complete Pattern

```javascript
async function fetchUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        // Check for HTTP error status (4xx, 5xx)
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`User "${username}" not found.`);
            }
            throw new Error(`Request failed with status ${response.status}`);
        }

        const user = await response.json();
        return user;

    } catch (error) {
        // Catches both network errors AND our manually thrown errors above
        throw error;  // Re-throw so the caller can handle it
    }
}

// Usage with proper error handling
async function loadUserProfile() {
    const username = document.querySelector('#username-input').value.trim();

    setLoadingState(true);
    clearErrors();

    try {
        const user = await fetchUser(username);
        renderUserCard(user);

    } catch (error) {
        showError(error.message);

    } finally {
        setLoadingState(false);  // Always runs, success or failure
    }
}
```

### Making a POST Request

```javascript
async function createPost(postData) {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `HTTP ${response.status}`);
    }

    return response.json();
}

// Usage
createPost({ title: 'Hello', body: 'World', userId: 1 })
    .then(post => console.log('Created post ID:', post.id))
    .catch(err => console.error(err));
```

### A Complete GitHub Profile Lookup

```html
<div id="github-lookup">
    <form id="lookup-form">
        <label for="gh-username">GitHub Username</label>
        <input type="text" id="gh-username" name="username" placeholder="e.g. torvalds" required>
        <button type="submit">Look Up</button>
    </form>

    <!-- Loading spinner (hidden by default) -->
    <div id="loading" class="spinner" aria-label="Loading..." hidden></div>

    <!-- Error message -->
    <p id="error-message" class="error-message" role="alert" hidden></p>

    <!-- Result card (hidden by default) -->
    <article id="user-card" class="user-card" hidden>
        <img id="user-avatar" alt="" width="96" height="96">
        <div class="user-card__info">
            <h2 id="user-name"></h2>
            <p id="user-bio" class="user-bio"></p>
            <dl class="user-stats">
                <dt>Followers</dt><dd id="user-followers"></dd>
                <dt>Repos</dt><dd id="user-repos"></dd>
            </dl>
            <a id="user-link" class="btn btn--outline" target="_blank" rel="noopener noreferrer">
                View on GitHub
            </a>
        </div>
    </article>
</div>
```

```javascript
'use strict';

const form         = document.querySelector('#lookup-form');
const input        = document.querySelector('#gh-username');
const spinner      = document.querySelector('#loading');
const errorBox     = document.querySelector('#error-message');
const card         = document.querySelector('#user-card');

// DOM refs inside the card
const avatar       = document.querySelector('#user-avatar');
const userName     = document.querySelector('#user-name');
const bio          = document.querySelector('#user-bio');
const followersEl  = document.querySelector('#user-followers');
const reposEl      = document.querySelector('#user-repos');
const profileLink  = document.querySelector('#user-link');

// --- UI State Helpers ---

function setLoading(isLoading) {
    spinner.hidden = !isLoading;
    form.querySelector('button').disabled = isLoading;
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    card.hidden = true;
}

function clearState() {
    errorBox.hidden = true;
    card.hidden = true;
}

// --- API ---

async function fetchGitHubUser(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (response.status === 404) {
        throw new Error(`No GitHub user found with username "${username}".`);
    }
    if (response.status === 403) {
        throw new Error(`GitHub API rate limit exceeded. Wait a minute and try again.`);
    }
    if (!response.ok) {
        throw new Error(`GitHub returned an error: ${response.status}`);
    }

    return response.json();
}

// --- Render ---

function renderUser(user) {
    avatar.src       = user.avatar_url;
    avatar.alt       = `Profile picture of ${user.login}`;
    userName.textContent = user.name || user.login;
    bio.textContent  = user.bio || 'No bio provided.';
    bio.hidden       = !user.bio;
    followersEl.textContent = user.followers.toLocaleString();
    reposEl.textContent     = user.public_repos.toLocaleString();
    profileLink.href        = user.html_url;
    profileLink.textContent = `@${user.login} on GitHub`;

    card.hidden = false;
}

// --- Event Handler ---

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = input.value.trim();
    if (!username) return;

    clearState();
    setLoading(true);

    try {
        const user = await fetchGitHubUser(username);
        renderUser(user);
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
});
```

---

## 🏗️ Assignments

### Assignment 1 — GitHub Lookup

Implement the complete GitHub profile lookup shown above. Test it with:
- A valid username (`torvalds`, `gaearon`)
- A non-existent username (`zzzz-does-not-exist-zzzz`)
- An empty submission

### Assignment 2 — Random Fact Generator

Use the free [uselessfacts API](https://uselessfacts.jsph.pl/api/v2/facts/random?language=en) to build a "Random Fact" page:
- A "Get Fact" button fetches a new random fact
- Show a loading spinner while fetching
- Render the fact text in a card
- Each fact has a "Copy to Clipboard" button (use `navigator.clipboard.writeText()`)

### Assignment 3 — Error Handling Only

Write a fetch function that gracefully handles all these scenarios with user-friendly messages:
1. Network failure (disable internet in DevTools → Network → Offline)
2. 404 response
3. Server error (use `https://httpstat.us/500` to simulate a 500 error)

---

## ✅ Milestone Checklist

- [ ] I understand why I check `response.ok` even if `fetch` doesn't reject
- [ ] I used `async/await` with `try/catch/finally`
- [ ] I showed a loading spinner during the request and hid it in `finally`
- [ ] I handled 404 and network errors with different user-facing messages

## 🏆 Milestone Complete!

Your pages can now communicate with any API on the internet.

## ➡️ Next Unit

[Lesson 09 — Capstone: Dynamic Weather Dashboard](./lesson_09.md)
