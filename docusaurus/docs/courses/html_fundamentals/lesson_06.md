# Lesson 06 — Forms & Input

> **Course:** HTML Fundamentals · **Time:** 60 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Build a form using `<form>`, `<label>`, `<input>`, and `<button>`
- [ ] Use `for`/`id` to explicitly associate labels with inputs
- [ ] Apply the correct `type` attribute for different kinds of data
- [ ] Use `required`, `placeholder`, `min`, `max`, and `pattern` for HTML5 validation
- [ ] Group related fields with `<fieldset>` and `<legend>`
- [ ] Understand what `action` and `method` do on the `<form>` element

---

## 📖 Concepts

### The `<form>` Element

A form wraps all the inputs that will be submitted together.

```html
<form action="/register" method="POST">
    <!-- input fields go here -->
    <button type="submit">Create Account</button>
</form>
```

| Attribute | Purpose |
|-----------|---------|
| `action` | The URL where the form data is sent when submitted |
| `method="GET"` | Sends data in the URL (visible, bookmark-able; for search forms) |
| `method="POST"` | Sends data in the request body (hidden; for sensitive data) |

### Labels and Inputs — Always Linked

Every input must have a visible `<label>`. The `for` attribute on the label must match the `id` on the input. This is not optional — it is a fundamental accessibility requirement.

```html
<!-- ✅ Correct: explicitly linked via for/id -->
<label for="email-address">Email Address</label>
<input type="email" id="email-address" name="email" required>

<!-- ❌ Wrong: placeholder text alone is NOT a label -->
<input type="email" placeholder="Enter email">
```

When label and input are linked, clicking on the label text focuses the input — a larger click target, especially helpful on mobile.

### Input Types

The `type` attribute controls the keyboard shown on mobile, built-in validation, and input format.

```html
<!-- Plain text -->
<input type="text" id="username" name="username">

<!-- Email — validates format, shows email keyboard on mobile -->
<input type="email" id="email" name="email">

<!-- Password — hides characters -->
<input type="password" id="password" name="password" minlength="8">

<!-- Number — shows numeric keyboard, allows min/max -->
<input type="number" id="age" name="age" min="18" max="120">

<!-- Date picker — native calendar UI -->
<input type="date" id="birthday" name="birthday">

<!-- Checkbox -->
<input type="checkbox" id="newsletter" name="newsletter" value="yes">
<label for="newsletter">Subscribe to newsletter</label>

<!-- Radio buttons (group them by sharing the same name) -->
<fieldset>
    <legend>Preferred contact method</legend>
    <input type="radio" id="contact-email" name="contact" value="email">
    <label for="contact-email">Email</label>
    <input type="radio" id="contact-phone" name="contact" value="phone">
    <label for="contact-phone">Phone</label>
</fieldset>

<!-- File upload -->
<input type="file" id="avatar" name="avatar" accept="image/*">

<!-- Color picker -->
<input type="color" id="theme-color" name="theme-color" value="#3d5afe">

<!-- Range slider -->
<input type="range" id="skill-level" name="skill-level" min="0" max="10" step="1">

<!-- Hidden — user never sees this but it's submitted with the form -->
<input type="hidden" name="source" value="landing-page">
```

### Textarea and Select

```html
<!-- Multi-line text — use textarea, not type="text" -->
<label for="bio">Biography</label>
<textarea id="bio" name="bio" rows="5" cols="40" maxlength="500">
</textarea>

<!-- Dropdown select menu -->
<label for="country">Country</label>
<select id="country" name="country">
    <option value="">-- Please choose --</option>
    <optgroup label="North America">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="mx">Mexico</option>
    </optgroup>
    <optgroup label="Europe">
        <option value="uk">United Kingdom</option>
        <option value="de">Germany</option>
    </optgroup>
</select>
```

### HTML5 Validation Attributes

HTML5 can validate inputs without any JavaScript:

```html
<input type="text" name="username"
    required             <!-- Cannot be empty -->
    minlength="3"        <!-- At least 3 characters -->
    maxlength="20"       <!-- No more than 20 characters -->
    pattern="[a-zA-Z0-9]+" <!-- Must match regex: letters/numbers only -->
    title="Username must be 3–20 alphanumeric characters."  <!-- Error hint -->
>
```

### A Complete Registration Form

```html
<form action="/api/register" method="POST" novalidate>
    <fieldset>
        <legend>Account Details</legend>

        <div>
            <label for="full-name">Full Name</label>
            <input type="text" id="full-name" name="full_name"
                required minlength="2" placeholder="Jane Smith">
        </div>

        <div>
            <label for="reg-email">Email</label>
            <input type="email" id="reg-email" name="email"
                required placeholder="jane@example.com">
        </div>

        <div>
            <label for="reg-password">Password</label>
            <input type="password" id="reg-password" name="password"
                required minlength="8" autocomplete="new-password">
        </div>
    </fieldset>

    <fieldset>
        <legend>Preferences</legend>
        <input type="checkbox" id="terms" name="terms_agreed" value="yes" required>
        <label for="terms">I agree to the <a href="/terms">Terms of Service</a></label>
    </fieldset>

    <button type="submit">Create Account</button>
    <button type="reset">Clear</button>
</form>
```

---

## 🏗️ Assignments

### Assignment 1 — Contact Form

Build a contact form with: name, email, subject (dropdown with 3 options), message (textarea), and a submit button. Every field must have a linked `<label>`.

### Assignment 2 — Survey Form

Build a survey form that uses: radio buttons (Pick your skill level: Beginner/Intermediate/Advanced), checkboxes (Which languages do you use?), a range slider (Rate your satisfaction 1–10), and a `<select>` for your country.

### Assignment 3 — Validation

Go back to your registration form and add HTML5 validation: `required`, `minlength`, and a `pattern` attribute on the username field that only allows letters and numbers.

---

## ✅ Milestone Checklist

- [ ] Every `<input>` in my form has an explicitly linked `<label>`
- [ ] I used `<fieldset>` and `<legend>` to group related fields
- [ ] I used the correct `type` for email, password, and number fields
- [ ] I applied at least two HTML5 validation attributes

## 🏆 Milestone Complete!

You can now collect user data. Everything a web application needs starts with a well-built form.

## ➡️ Next Unit

[Lesson 07 — Semantic Architecture](./lesson_07.md)
