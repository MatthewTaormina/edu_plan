# Lesson 08 — Capstone: Accessible Recipe Book

> **Course:** HTML Fundamentals · **Time:** 90–120 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Combine every concept from Lessons 01–07 into a single, polished project
- [ ] Write valid, semantic HTML that passes an HTML validator
- [ ] Use accessible alt text, linked labels, and landmark elements throughout
- [ ] Create an internal navigation using fragment links

---

## 📖 Project Overview

You will build a **single-page HTML recipe book** with at least two recipes. No CSS, no JavaScript — pure HTML. The focus is correctness, semantics, and accessibility.

### Requirements Checklist

- [ ] Valid HTML5 boilerplate (`<!DOCTYPE html>`, `<html lang>`, `<head>`, `<body>`)
- [ ] Page `<title>` that describes the content
- [ ] One `<h1>` for the page title (the book name)
- [ ] `<header>` with title and in-page `<nav>` (table of contents)
- [ ] `<main>` wrapping all recipe content
- [ ] Each recipe in its own `<article>` with its own `<header>`, `<h2>`, and `<footer>`
- [ ] Ingredients in a `<ul>` inside a `<section>`
- [ ] Steps in an `<ol>` inside a `<section>`
- [ ] At least one `<img>` with meaningful `alt` text, wrapped in `<figure>` + `<figcaption>`
- [ ] Nutrition info (if included) in a `<table>` with `<caption>`, `<thead>`, `<tbody>`, and `scope` attributes
- [ ] An "Add a comment" `<form>` below each recipe with name + message fields, properly labeled
- [ ] A site-wide `<footer>` with copyright and contact link

---

## 📖 Reference Implementation

Use this as a starting point, then expand it with your own recipes and sections:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A collection of tried-and-tested home recipes by Alex Learner.">
    <title>Alex's Recipe Book</title>
</head>
<body>

    <header>
        <h1>Alex's Recipe Book</h1>
        <nav aria-label="Recipe navigation">
            <p>Jump to a recipe:</p>
            <ul>
                <li><a href="#bolognese">Spaghetti Bolognese</a></li>
                <li><a href="#banana-bread">Banana Bread</a></li>
            </ul>
        </nav>
    </header>

    <main>

        <!-- Recipe 1 -->
        <article id="bolognese">
            <header>
                <h2>Spaghetti Bolognese</h2>
                <p>
                    A rich, meaty Italian classic.
                    Prep: <time datetime="PT20M">20 minutes</time> ·
                    Cook: <time datetime="PT45M">45 minutes</time> ·
                    Serves: 4
                </p>
            </header>

            <figure>
                <img
                    src="images/bolognese.jpg"
                    alt="A shallow bowl of spaghetti topped with thick bolognese sauce and fresh basil"
                    width="600"
                >
                <figcaption>Classic spaghetti bolognese, garnished with fresh basil.</figcaption>
            </figure>

            <section>
                <h3>Ingredients</h3>
                <ul>
                    <li>400g spaghetti</li>
                    <li>500g minced beef</li>
                    <li>1 onion, finely chopped</li>
                    <li>2 cloves garlic, minced</li>
                    <li>400g tinned tomatoes</li>
                    <li>2 tbsp tomato paste</li>
                    <li>1 tsp dried oregano</li>
                    <li>Salt and pepper to taste</li>
                    <li>Parmesan cheese to serve</li>
                </ul>
            </section>

            <section>
                <h3>Instructions</h3>
                <ol>
                    <li>Heat a large frying pan over medium heat. Add a drizzle of olive oil.</li>
                    <li>Add the chopped onion and cook for 5 minutes until softened.</li>
                    <li>Add the garlic and cook for 1 further minute.</li>
                    <li>Add the minced beef, breaking it apart. Cook until browned, about 8 minutes.</li>
                    <li>Stir in the tomato paste, tinned tomatoes, oregano, salt, and pepper.</li>
                    <li>Reduce heat and simmer for 30 minutes, stirring occasionally.</li>
                    <li>Cook the spaghetti according to package directions. Drain and serve topped with the sauce.</li>
                    <li>Finish with grated Parmesan cheese.</li>
                </ol>
            </section>

            <section>
                <h3>Nutrition (per serving)</h3>
                <table>
                    <caption>Approximate nutritional values per serving</caption>
                    <thead>
                        <tr>
                            <th scope="col">Nutrient</th>
                            <th scope="col">Amount</th>
                            <th scope="col">% Daily Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Calories</th>
                            <td>620 kcal</td>
                            <td>31%</td>
                        </tr>
                        <tr>
                            <th scope="row">Protein</th>
                            <td>38g</td>
                            <td>76%</td>
                        </tr>
                        <tr>
                            <th scope="row">Carbohydrates</th>
                            <td>72g</td>
                            <td>27%</td>
                        </tr>
                        <tr>
                            <th scope="row">Fat</th>
                            <td>18g</td>
                            <td>26%</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h3>Leave a Comment</h3>
                <form action="/comments" method="POST">
                    <input type="hidden" name="recipe" value="bolognese">
                    <div>
                        <label for="comment-name-1">Your Name</label>
                        <input type="text" id="comment-name-1" name="commenter_name" required>
                    </div>
                    <div>
                        <label for="comment-body-1">Comment</label>
                        <textarea id="comment-body-1" name="comment" rows="4" required></textarea>
                    </div>
                    <button type="submit">Post Comment</button>
                </form>
            </section>

            <footer>
                <p>Recipe by <address><a href="mailto:alex@example.com">Alex Learner</a></address> — adapted from a family tradition.</p>
            </footer>
        </article>


        <!-- Recipe 2 -->
        <article id="banana-bread">
            <header>
                <h2>Banana Bread</h2>
                <p>
                    A moist, simple loaf — perfect for over-ripe bananas.
                    Prep: <time datetime="PT10M">10 minutes</time> ·
                    Cook: <time datetime="PT1H">60 minutes</time> ·
                    Makes: 1 loaf
                </p>
            </header>

            <figure>
                <img
                    src="images/banana-bread.jpg"
                    alt="A golden-brown sliced banana bread on a wooden cutting board"
                    width="600"
                >
                <figcaption>Banana bread with a cracked, deeply golden crust.</figcaption>
            </figure>

            <section>
                <h3>Ingredients</h3>
                <ul>
                    <li>3 very ripe bananas, mashed</li>
                    <li>75g butter, melted</li>
                    <li>150g plain flour</li>
                    <li>100g caster sugar</li>
                    <li>1 egg, beaten</li>
                    <li>1 tsp vanilla extract</li>
                    <li>1 tsp baking soda</li>
                    <li>Pinch of salt</li>
                </ul>
            </section>

            <section>
                <h3>Instructions</h3>
                <ol>
                    <li>Preheat oven to 175°C (350°F). Grease a 4x8 inch loaf pan.</li>
                    <li>In a mixing bowl, mash the bananas thoroughly with a fork.</li>
                    <li>Stir in the melted butter.</li>
                    <li>Mix in the baking soda and salt.</li>
                    <li>Add the sugar, beaten egg, and vanilla extract. Mix well.</li>
                    <li>Fold in the flour until just combined — do not overmix.</li>
                    <li>Pour batter into the prepared loaf pan.</li>
                    <li>Bake for 55–65 minutes, or until a toothpick inserted into the center comes out clean.</li>
                    <li>Cool in the pan for 5 minutes, then turn out onto a rack.</li>
                </ol>
            </section>

            <section>
                <h3>Leave a Comment</h3>
                <form action="/comments" method="POST">
                    <input type="hidden" name="recipe" value="banana-bread">
                    <div>
                        <label for="comment-name-2">Your Name</label>
                        <input type="text" id="comment-name-2" name="commenter_name" required>
                    </div>
                    <div>
                        <label for="comment-body-2">Comment</label>
                        <textarea id="comment-body-2" name="comment" rows="4" required></textarea>
                    </div>
                    <button type="submit">Post Comment</button>
                </form>
            </section>

            <footer>
                <p>Recipe by <address><a href="mailto:alex@example.com">Alex Learner</a></address> — grandmother's favourite.</p>
            </footer>
        </article>

    </main>

    <footer>
        <nav aria-label="Footer navigation">
            <ul>
                <li><a href="/about">About</a></li>
                <li><a href="mailto:alex@example.com">Contact</a></li>
            </ul>
        </nav>
        <p>&copy; 2026 Alex's Recipe Book. All rights reserved.</p>
    </footer>

</body>
</html>
```

---

## 🏗️ Assignments

### Submission Requirements

1. Create your own version of the recipe book with **your own two recipes** (don't just copy the examples).
2. Run your file through the [W3C HTML Validator](https://validator.w3.org/) — aim for zero errors and zero warnings.
3. Open DevTools in your browser, go to the Accessibility panel (or use Lighthouse), and run an accessibility audit.

---

## ✅ Milestone Checklist

- [ ] My HTML passes W3C validation with zero errors
- [ ] Every `<img>` has meaningful `alt` text
- [ ] Every `<input>` has an explicitly linked `<label>`
- [ ] I used `<article>`, `<section>`, `<header>`, `<footer>` correctly
- [ ] I have an in-page `<nav>` table of contents with fragment links
- [ ] I have at least one `<table>` with `<caption>` and `scope` attributes

## 🏆 Milestone Complete!

**HTML Fundamentals is complete.** You can now build any structured page the web needs, accessibly and correctly.

## ➡️ Next Course

[CSS Fundamentals](../css_fundamentals/index.md) — Now give your pages visual life.
