# Lesson 05 — Table Data

> **Course:** HTML Fundamentals · **Time:** 45 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Build a complete, accessible HTML table
- [ ] Use `<thead>`, `<tbody>`, and `<tfoot>` to structure table sections
- [ ] Apply `scope` attributes to header cells for accessibility
- [ ] Span rows and columns using `colspan` and `rowspan`
- [ ] Know when NOT to use tables (layout is never a valid reason)

---

## 📖 Concepts

### When to Use Tables

Tables are for **tabular data** — information that makes sense in rows and columns, like spreadsheets.

✅ **Use tables for:**
- Pricing comparisons
- Course schedules
- Statistical data
- Feature comparison charts

❌ **Never use tables for:**
- Page layout (use CSS Flexbox or Grid instead)
- Multi-column text (use CSS columns)
- Navigation menus

### Basic Table Structure

```html
<table>
    <thead>
        <tr>
            <th scope="col">Course</th>
            <th scope="col">Duration</th>
            <th scope="col">Level</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>HTML Fundamentals</td>
            <td>6–8 hours</td>
            <td>Beginner</td>
        </tr>
        <tr>
            <td>CSS Fundamentals</td>
            <td>8–10 hours</td>
            <td>Beginner</td>
        </tr>
        <tr>
            <td>Vanilla JavaScript</td>
            <td>10–12 hours</td>
            <td>Beginner–Intermediate</td>
        </tr>
    </tbody>
</table>
```

| Element | Purpose |
|---------|---------|
| `<table>` | Container for the entire table |
| `<thead>` | Table header — contains column labels |
| `<tbody>` | Table body — contains the data rows |
| `<tfoot>` | Table footer — optional, for totals or summaries |
| `<tr>` | Table row — always contains cells |
| `<th>` | Table header cell — bold, centered by default; adds semantic meaning |
| `<td>` | Table data cell — regular content |

### The `scope` Attribute for Accessibility

The `scope` attribute on `<th>` tells screen readers whether a header describes a **column** or a **row**.

```html
<!-- scope="col" — this header applies to everything in this column -->
<th scope="col">Date</th>

<!-- scope="row" — this header applies to everything in this row -->
<tr>
    <th scope="row">Total</th>
    <td>$120.00</td>
    <td>4 items</td>
</tr>
```

### Merging Cells with `colspan` and `rowspan`

```html
<table>
    <thead>
        <tr>
            <th scope="col">Name</th>
            <!-- This header spans 2 columns -->
            <th scope="col" colspan="2">Contact</th>
        </tr>
        <tr>
            <th></th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <!-- This cell spans 2 rows -->
            <td rowspan="2">Alice Johnson</td>
            <td>alice@example.com</td>
            <td>555-0101</td>
        </tr>
        <tr>
            <td>alice.work@example.com</td>
            <td>555-0102</td>
        </tr>
    </tbody>
</table>
```

### Adding a Table Caption

```html
<table>
    <caption>Course Schedule — Spring 2026</caption>
    <thead>
        <!-- ... -->
    </thead>
    <tbody>
        <!-- ... -->
    </tbody>
</table>
```

The `<caption>` is the first child of `<table>`. Screen readers announce it before reading the table, giving users crucial context.

### A Complete Invoice Example

```html
<table>
    <caption>Invoice #1042 — April 2026</caption>
    <thead>
        <tr>
            <th scope="col">Item</th>
            <th scope="col">Qty</th>
            <th scope="col">Unit Price</th>
            <th scope="col">Subtotal</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Web Consulting (hours)</td>
            <td>10</td>
            <td>$75.00</td>
            <td>$750.00</td>
        </tr>
        <tr>
            <td>Hosting Setup</td>
            <td>1</td>
            <td>$50.00</td>
            <td>$50.00</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row" colspan="3">Total</th>
            <td>$800.00</td>
        </tr>
    </tfoot>
</table>
```

---

## 🏗️ Assignments

### Assignment 1 — Schedule Table

Build a weekly class schedule. Columns: Mon, Tue, Wed, Thu, Fri. Rows: each hour from 9 AM to 12 PM. Use `colspan` to span a class that takes two hours, and `rowspan` to show a recurring event.

### Assignment 2 — Comparison Table

Build a feature comparison table for three plans (Free, Pro, Enterprise). Add a `<tfoot>` row with "Get Started" text for each plan.

---

## ✅ Milestone Checklist

- [ ] My table correctly uses `<thead>`, `<tbody>`, and `<tfoot>`
- [ ] All `<th>` elements have a `scope` attribute
- [ ] I gave the table a `<caption>`
- [ ] I can explain when NOT to use a table

## 🏆 Milestone Complete!

You can now present structured data clearly and accessibly.

## ➡️ Next Unit

[Lesson 06 — Forms & Input](./lesson_06.md)
