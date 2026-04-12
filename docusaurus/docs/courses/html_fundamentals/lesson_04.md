# Lesson 04 — Immersive Media

> **Course:** HTML Fundamentals · **Time:** 45 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Embed images using `<img>` with correct `src` and `alt` attributes
- [ ] Understand when `alt` text should be descriptive vs. empty
- [ ] Use `<figure>` and `<figcaption>` to caption media correctly
- [ ] Embed video and audio using the HTML5 media elements
- [ ] Embed external content with `<iframe>` (for maps and YouTube videos)

---

## 📖 Concepts

### The Image Tag `<img>`

`<img>` is a **void element** (no closing tag). Its two required attributes are `src` (where to load the image from) and `alt` (a text description).

```html
<!-- External image from the web -->
<img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/240px-HTML5_logo_and_wordmark.svg.png"
    alt="HTML5 logo — a stylized 5 inside an orange shield"
    width="240"
    height="240"
>

<!-- Local image from the same folder -->
<img src="images/team-photo.jpg" alt="The four founding team members standing outdoors" width="600">
```

### Writing Good Alt Text

The `alt` attribute is not optional — it is essential for accessibility and also displayed when an image fails to load.

| Scenario | What to write |
|----------|---------------|
| Informative image | A full sentence describing what the image shows and why it matters |
| Decorative image (e.g., a background swirl) | `alt=""` — explicitly empty, so screen readers skip it |
| Image that is *also* a link | Describe the *destination*, not the image: `alt="Go to our homepage"` |
| Chart or diagram | Provide a full text alternative of the data |

```html
<!-- Informative: describe content AND context -->
<img src="heatmap.png" alt="A heatmap showing most user clicks are clustered around the top-right CTA button">

<!-- Decorative: empty alt, screen reader skips it -->
<img src="wave-divider.svg" alt="">

<!-- Linked image: describe destination -->
<a href="/home">
    <img src="logo.svg" alt="Return to Open Learner's Guide homepage">
</a>
```

### Figure and Figcaption

```html
<!-- <figure> groups an image with its caption -->
<figure>
    <img
        src="images/flexbox-diagram.png"
        alt="Diagram showing a flex container with three flex items aligned to center"
        width="600"
    >
    <figcaption>
        Figure 1: A flex container with <code>justify-content: center</code> applied.
    </figcaption>
</figure>
```

### HTML5 Video

```html
<video
    controls
    width="720"
    poster="thumbnail.jpg"
    preload="metadata"
>
    <!-- Provide multiple formats for browser compatibility -->
    <source src="media/intro-tour.webm" type="video/webm">
    <source src="media/intro-tour.mp4" type="video/mp4">

    <!-- Fallback for browsers that don't support the element -->
    <p>
        Your browser does not support HTML5 video.
        <a href="media/intro-tour.mp4">Download the video here.</a>
    </p>
</video>
```

| Attribute | Purpose |
|-----------|---------|
| `controls` | Shows play/pause, volume, progress bar |
| `poster` | An image shown before the video plays |
| `autoplay` | Plays immediately (avoid unless muted — browsers block audible autoplay) |
| `muted` | Needed for `autoplay` to work in most browsers |
| `loop` | Repeats the video |

### HTML5 Audio

```html
<audio controls preload="none">
    <source src="audio/podcast-ep1.ogg" type="audio/ogg">
    <source src="audio/podcast-ep1.mp3" type="audio/mpeg">
    <p>Your browser does not support HTML5 audio. <a href="audio/podcast-ep1.mp3">Download here.</a></p>
</audio>
```

### Embedding External Content with `<iframe>`

```html
<!-- Embedding a YouTube video -->
<iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    title="YouTube video: An Example Embed"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
></iframe>

<!-- Embedding a Google Map -->
<iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!..."
    width="600"
    height="450"
    style="border:0;"
    allowfullscreen
    loading="lazy"
    title="Office location map"
></iframe>
```

:::tip
Always give `<iframe>` elements a meaningful `title` attribute. Screen readers announce "iframe without a title" if it's missing, giving no context to the user.
:::

---

## 🏗️ Assignments

### Assignment 1 — Image Gallery

Create a page called `gallery.html` with at least four images. For each one:
- Write meaningful `alt` text
- Wrap it in `<figure>` with a `<figcaption>`
- Mix local (`src="images/..."`) and external (`src="https://..."`) sources

### Assignment 2 — Media Page

Add an `<audio>` player to your page. You can use any free audio file (e.g., from [freesound.org](https://freesound.org)).

### Assignment 3 — Accessibility Audit

Review each of your images. Ask: "If this image didn't load, would a user know what they're missing?" Revise any `alt` text that doesn't answer that question.

---

## ✅ Milestone Checklist

- [ ] All my images have meaningful `alt` text (or `alt=""` if decorative)
- [ ] I used `<figure>` and `<figcaption>` for at least one image
- [ ] I embedded a media file (audio or video) with a fallback message
- [ ] I understand why `alt=""` is correct for decorative images

## 🏆 Milestone Complete!

Your pages can now communicate visually, audibly, and with context.

## ➡️ Next Unit

[Lesson 05 — Table Data](./lesson_05.md)
