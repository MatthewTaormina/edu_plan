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

## Content Rules

### Code Examples

1. **Always pseudocode first** for conceptual explanations  
   See [`pseudocode_standard.md`](pseudocode_standard.md) for the exact syntax

2. **Tabbed multi-language blocks** for implementations  
   Tab order: `Pseudocode → Python → TypeScript → Rust → C → Java/Kotlin → C#`  
   Only include tabs that add meaningful value

3. **Never** show only one language for a language-agnostic concept

4. **Language-specific** content (Rust ownership, Python GIL, etc.) stays in that language only — label it with `=== "Rust (Language-Specific)"` or similar

### Assignments

- **Minimum 2 concepts combined** — never single-concept tasks
- Always include clear **expected output** examples
- Mark **optional stretch goals** with `⭐ Stretch:`
- State **which path** the assignment targets (or "All paths")
- At least one assignment per unit should involve **file I/O** or **real data**

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

---

## Admonition Usage

```markdown
!!! tip "Research Question 🔍"
    Bounded optional exploration question.

!!! note "Key Insight"
    Important concept that clarifies a common confusion.

!!! warning "Common Mistake"
    Something beginners consistently get wrong.

!!! danger "Do Not..."
    Anti-patterns that cause bugs or security issues.

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
```

Prefixes: `feat`, `fix`, `content`, `style`, `chore`, `meta`
