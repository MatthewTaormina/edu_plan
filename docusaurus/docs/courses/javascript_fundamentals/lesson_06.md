# Lesson 06 — Form Handling

> **Course:** Vanilla JavaScript Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Intercept form submission with `event.preventDefault()`
- [ ] Read form values using `FormData` and direct property access
- [ ] Validate input data in JavaScript and display user-friendly error messages
- [ ] Clear and reset forms programmatically
- [ ] Show loading states during async form operations

---

## 📖 Concepts

### Intercepting Form Submission

By default, submitting a form causes the browser to navigate to the URL in `action`. To handle it with JavaScript instead, prevent this default.

```javascript
const form = document.querySelector('#contact-form');

form.addEventListener('submit', (event) => {
    // Stop the browser from reloading the page / navigating
    event.preventDefault();

    // Now we can handle the submission with JavaScript
    console.log('Form submitted');
});
```

### Reading Form Values

```html
<form id="registration-form">
    <input type="text"  name="username"  id="reg-username">
    <input type="email" name="email"     id="reg-email">
    <input type="password" name="password" id="reg-password">
    <select name="role" id="reg-role">
        <option value="learner">Learner</option>
        <option value="educator">Educator</option>
    </select>
    <input type="checkbox" name="terms" id="reg-terms">
    <button type="submit">Register</button>
</form>
```

```javascript
const form = document.querySelector('#registration-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // --- Method 1: Read individual inputs directly ---
    const username = document.querySelector('#reg-username').value.trim();
    const email    = document.querySelector('#reg-email').value.trim();
    const password = document.querySelector('#reg-password').value;
    const role     = document.querySelector('#reg-role').value;
    const agreed   = document.querySelector('#reg-terms').checked;  // boolean

    // --- Method 2: FormData — collects all named fields automatically ---
    const data = new FormData(form);

    console.log(data.get('username'));   // same as reading input.value
    console.log(data.get('email'));
    console.log(data.get('role'));
    console.log(data.get('terms'));      // 'on' if checked, null if unchecked

    // Convert to a plain object
    const formValues = Object.fromEntries(data.entries());
    // { username: 'alex', email: 'alex@...', role: 'learner', ... }
    console.log(formValues);
});
```

### JavaScript Form Validation

HTML5 validation (from Lesson 06 of HTML Fundamentals) is a first line of defense. JavaScript validation gives you more control and better error messages.

```javascript
function validateRegistrationForm(values) {
    const errors = {};

    if (!values.username || values.username.length < 3) {
        errors.username = 'Username must be at least 3 characters.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email || !emailPattern.test(values.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!values.password || values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
    }

    if (!values.terms) {
        errors.terms = 'You must agree to the Terms of Service.';
    }

    return errors;  // Empty object means no errors
}

function showErrors(errors) {
    // Clear previous errors first
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    for (const [field, message] of Object.entries(errors)) {
        const input = document.querySelector(`[name="${field}"]`);
        if (!input) continue;

        // Mark the input
        input.classList.add('input-error');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `${field}-error`);

        // Insert the error message
        const errorEl = document.createElement('p');
        errorEl.id = `${field}-error`;
        errorEl.classList.add('field-error');
        errorEl.textContent = message;
        errorEl.setAttribute('role', 'alert');

        input.insertAdjacentElement('afterend', errorEl);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data    = new FormData(form);
    const values  = Object.fromEntries(data.entries());
    const errors  = validateRegistrationForm(values);

    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        // Focus the first field with an error for keyboard accessibility
        const firstErrorField = form.querySelector('[aria-invalid="true"]');
        firstErrorField?.focus();
        return;
    }

    // Validation passed — handle submission
    submitForm(values);
});
```

### Loading State During Submission

While waiting for a server response, disable the button to prevent double-submission and give visual feedback.

```javascript
async function submitForm(values) {
    const submitBtn = form.querySelector('[type="submit"]');

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('btn--loading');

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const result = await response.json();

        // Success
        form.reset();  // Clear all form fields
        showSuccessMessage('Account created! Check your email to verify.');

    } catch (error) {
        console.error('Submission failed:', error);
        showErrors({ _general: 'Something went wrong. Please try again.' });

    } finally {
        // Always restore the button, success or failure
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
        submitBtn.classList.remove('btn--loading');
    }
}
```

---

## 🏗️ Assignments

### Assignment 1 — Registration Form with Validation

Build the complete registration form with:
- Fields: username (min 3 chars), email (valid format), password (min 8 chars)
- JavaScript validation that shows field-specific error messages
- Error messages cleared when the user corrects the field
- A simulated submission that shows a success message after 1 second

### Assignment 2 — Real-Time Password Strength Meter

Build a password input that shows a strength bar as the user types:
- Red: fewer than 8 characters
- Yellow: 8+ chars but no numbers or symbols
- Green: 8+ chars with both a number and a symbol

### Assignment 3 — Multi-Step Form

Build a 3-step form with "Next" and "Back" buttons. Each step is a `<fieldset>`. State (which step is visible) is tracked in a JS variable.

---

## ✅ Milestone Checklist

- [ ] I prevented default form submission with `event.preventDefault()`
- [ ] I read form values using `FormData` and `Object.fromEntries()`
- [ ] I displayed field-specific validation errors with `aria-invalid` set
- [ ] I disabled the submit button during a pending async operation

## 🏆 Milestone Complete!

You can now process user input safely and with clear feedback.

## ➡️ Next Unit

[Lesson 07 — Time & Asynchrony](./lesson_07.md)
