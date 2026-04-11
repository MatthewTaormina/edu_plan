# Contributor Style Guide

> How to write content for the Open Learner's Guide.
> Read this before writing or editing any domain unit.

---

## Unit Template

Every atomic unit must follow this structure (in order):

```markdown
# Unit Title

**Domain:** X · **Time Estimate:** N weeks · **Language:** Primary language used

> **Prerequisites:** List what units must come first (link them)
> **Who needs this:** 1-2 sentences

---

## 🎯 Learning Objectives
(5–8 "you will be able to..." statements as checkboxes)

---

## 📖 Concepts
(Grouped concept sections, each with explanation + pseudocode + tabbed real code)

---

## 📚 Resources
(Tabbed: Primary / Supplemental / Practice)

---

## 🏗️ Assignments
(2–4 multi-concept assignments — never single-concept)

---

## ✅ Milestone Checklist
(Binary can/can't list — know it without notes)

---

## 🏆 Milestone Complete!
(Reward message + kanban instruction)

---

## ➡️ Next Unit
(Link to next logical unit)
```

---

## Legacy vs. Modern Policy

This is the most important content decision in this repository. Follow it exactly.

### The Rule

> **Default to modern (2020+). Acknowledge legacy. Never exclude foundations.**

Software evolves. Learners deserve to know what tools are current versus what they'll encounter in old codebases or legacy documentation. This guide handles that with explicit labeling.

### Three Categories

| Category | Definition | How to present |
|----------|-----------|----------------|
| **Modern** | Actively maintained and current best practice — regardless of creation date. Includes tools pre-2020 that are still the dominant standard with no widely-adopted successor (e.g. SSH, Bash, SQL, C, Make). | Primary content — no special label needed |
| **Legacy** | Has a widely-adopted modern alternative AND the community has largely moved on. **Age alone is not sufficient.** | Labeled with the `legacy` admonition — teach it, note the alternative |
| **Foundation** | A core primitive concept that modern tooling wraps but does not replace. Must be understood to debug the abstraction. | Teach in full — note modern tooling sits on top of it |

> **Rule of thumb:** If a tool is still actively maintained, still dominant in its niche, and has no widely-adopted successor — treat it as **current**, not legacy. Examples: SSH (1995), Bash (1989), Make (1976), SQL (1974), POSIX C — all 🟢 current.

### Tool / Framework Information Block

Every time a specific tool, library, or framework is introduced (not just mentioned), include a metadata line using this exact format:

```markdown
> **Tool:** <name> · **Introduced:** <year> · **Latest:** <version> (<year>) · **Deprecated:** <year or "N/A"> · **Status:** <icon + label>
```

Examples:

```markdown
> **Tool:** Webpack · **Introduced:** 2012 · **Latest:** 5.98 (2024) · **Deprecated:** N/A · **Status:** 🟡 Legacy — Vite preferred for new projects; still maintained for existing ones

> **Tool:** Vite · **Introduced:** 2020 · **Latest:** 5.x (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern

> **Tool:** Grunt · **Introduced:** 2012 · **Latest:** 1.6 (2022) · **Deprecated:** N/A · **Status:** 🔴 Deprecated — ecosystem moved to npm scripts / Vite

> **Tool:** docker-compose v1 · **Introduced:** 2014 · **Latest:** 1.29 (2021) · **Deprecated:** July 2023 · **Status:** 🔴 Deprecated — replaced by `docker compose` (v2, no hyphen)

> **Tool:** Python 2.x · **Introduced:** 2000 · **Latest:** 2.7 (2010) · **Deprecated:** January 1, 2020 · **Status:** 🔴 Deprecated — use Python 3.10+
```

**Rules:**
- `Introduced` = year the tool/version first released publicly
- `Deprecated` = year officially end-of-life or superseded (use `N/A` if still actively maintained)
- Always include both fields — they give learners the full timeline at a glance
- For language features (not tools), use an inline note: `` `XMLHttpRequest` (introduced 1999, superseded by `fetch` 2015) ``

Status icons:
- 🟢 **Modern** — actively developed, current best practice
- 🟡 **Legacy** — still supported, common in older codebases, not recommended for new projects
- 🔴 **Deprecated** — abandoned or officially end-of-life; avoid entirely
- 🔵 **Foundation** — a timeless concept or primitive, not subject to modern/legacy classification

### Legacy Admonition

When introducing a legacy tool or pattern:

```markdown
!!! warning "🟡 Legacy Tool"
    **Webpack** — Created 2012 · Still in active use in 2024
    Modern alternative: **Vite** (2020+) for bundling, or **esbuild** for libraries.
    Include this unit because: you will encounter Webpack in existing projects and job codebases.
    Skip to [Vite →](vite.md) if starting a fresh project.
```

### Modern Recommendation

When a modern alternative exists:

```markdown
!!! tip "✅ Modern Best Practice"
    Use **Vite** for new projects (2020+). It is 10-100x faster than Webpack in
    development due to native ES modules. Only use Webpack if joining an existing project.
```

### Foundation Teaching (Core First, Shortcuts Second)

For foundational concepts (e.g., raw pointers before smart pointers, raw SQL before ORMs, manual HTTP before fetch):

```markdown
!!! note "🔵 Foundation Concept"
    This section teaches the underlying mechanism. Modern code uses abstractions
    (smart pointers, ORMs, async libraries) that wrap this — but you must understand
    the foundation to debug when the abstraction breaks.
```

Then immediately follow with the modern approach:

```markdown
=== "Foundation (Manual)"
    ```c
    // Raw pointer management — C, C++ pre-2011
    int* arr = malloc(sizeof(int) * 10);
    // ... use arr ...
    free(arr);
    ```

=== "Modern (Preferred)"
    ```rust
    // Rust owns and frees automatically
    let arr = vec![0i32; 10];
    // Freed when `arr` goes out of scope — no free() needed
    ```
```

### Writing Tabs for Legacy + Modern

When a concept has both legacy and modern implementations, structure tabs as:

```
=== "Modern (Recommended)"   ← first tab, default visible
=== "Legacy (Common)"        ← second tab
=== "Foundation"             ← third if needed (teaching the raw concept)
```

### What "2020+" Means

The cutoff is not strict — it's a signal about maturity and current relevance:

| Examples of Modern (primary content) | Examples of Legacy (acknowledge, label) |
|--------------------------------------|----------------------------------------|
| Vite, esbuild, Turbopack | Webpack, Grunt, Gulp |
| React 18+ (hooks), Vue 3, SvelteKit | jQuery, Angular.js (v1), Backbone |
| TypeScript 5+ | Flow, JSDoc-only typing |
| Docker BuildKit, Compose v2 | Legacy docker-compose v1 syntax |
| GitHub Actions, GitLab CI, Dagger | Jenkins (still common — label 🟡) |
| Python 3.10+ (match, walrus, slots) | Python 2.x (label 🔴 Deprecated) |
| Rust (stable 2021 edition+) | (Rust is modern — no legacy concern) |
| async/await everywhere | Callback hell, Promise chains only |
| `fetch` API | `XMLHttpRequest` |
| ES Modules | CommonJS `require()` |
| CSS Grid, Flexbox, CSS Variables | Floats, tables for layout |

---

## Content Rules

### Code Examples

1. **Always pseudocode first** for conceptual explanations  
   See [`pseudocode_standard.md`](pseudocode_standard.md) for the exact syntax

2. **Tabbed multi-language blocks** for implementations  
   Tab order: `Pseudocode → Python → TypeScript → Rust → C`  
   Only include tabs that add meaningful value  
   Add `Legacy` / `Modern` tabs where the pattern has changed significantly

3. **Never** show only one language for a language-agnostic concept

4. **Language-specific** content (Rust ownership, Python GIL, etc.) stays in that language only — label it with `=== "Rust (Language-Specific)"` or similar

5. **Date new tools** whenever first mentioned: `Vite (2020)`, `Docker BuildKit (2019, default 2021)`

### Assignments

- **Minimum 2 concepts combined** — never single-concept tasks
- Always include clear **expected output** examples
- Mark **optional stretch goals** with `⭐ Stretch:`
- State **which path** the assignment targets (or "All paths")
- At least one assignment per unit should involve **file I/O** or **real data**
- Assignments use **modern tools** by default

### Research Questions

- Marked with 🔍 in the text
- Are **bounded** — the question itself limits the scope
- Are **optional** — placed in `!!! tip` admonition blocks
- Don't repeat knowledge that's already in the unit

### Resource Rules

- Free resources **always** listed before paid ones
- Each resource gets a one-sentence description of **why it's good**
- No "learn X in 30 days" type resources — be specific about what chapters/weeks to use
- Max 3 resources per tab (Primary, Supplemental, Practice)
- **Flag outdated resources:** if linking to documentation for a tool that has a major newer version, note: `(covers v4 — check for v5 changes)`

---

## Admonition Usage

```markdown
!!! tip "Research Question 🔍"
    Bounded optional exploration question.

!!! note "🔵 Foundation Concept"
    Core concept that modern tooling wraps — teach this so the abstraction makes sense.

!!! note "Key Insight"
    Important concept that clarifies a common confusion.

!!! warning "🟡 Legacy Tool"
    Tool/pattern created before 2020, still common. Created YYYY · Status: supported/unsupported.

!!! warning "Common Mistake"
    Something beginners consistently get wrong.

!!! danger "🔴 Deprecated"
    This tool/pattern is abandoned or officially end-of-life. Do not use for new work.

!!! danger "Do Not..."
    Anti-patterns that cause bugs or security issues.

!!! success "✅ Modern Best Practice"
    Created 2020+. Prefer this over the legacy approach.

!!! success "You've Got It When..."
    Concrete signal the learner has understood the concept.

!!! info "Language Note"
    Notes about how this concept differs across languages.
```

---

## Checklist Formatting

```markdown
## ✅ Milestone Checklist

// Binary checklist — true/false, no partial credit
- [ ] Can do X without looking up syntax
- [ ] Can explain Y to someone who has never heard of it
- [ ] All N assignments committed to GitHub
```

Never use "understand" or "know" in checklist items — use concrete, demonstrable actions.

❌ Bad: `- [ ] Understand recursion`  
✅ Good: `- [ ] Can write a recursive function without using a loop`  
✅ Good: `- [ ] Can explain recursion using a real example without notes`

---

## Dependency Links

Every unit must have:
- `**Prerequisites:**` at the top (link to required units)
- `**➡️ Next Unit:**` at the bottom (link to logical next)
- `**Which paths use this:**` in the domain index

Cross-links use relative paths from the file's location.

---

## File Naming

```
docs/
  domains/
    foundations/
      programming_basics.md   // snake_case
      data_structures.md
  paths/
    beginner.md
  meta/
    pseudocode_standard.md
    style_guide.md
```

- Always `snake_case`
- No spaces, no special characters
- Index files are `index.md`, not `README.md` (MkDocs convention)

---

## Git Commit Messages

Follow conventional commits:

```
feat: add data_structures unit (foundations)
fix: correct broken link in beginner path
content: expand algorithms unit with graph examples
style: apply pseudocode standard to memory_management
chore: add stub for rust_advanced unit
meta: update legacy/modern labeling policy
```

Prefixes: `feat`, `fix`, `content`, `style`, `chore`, `meta`
