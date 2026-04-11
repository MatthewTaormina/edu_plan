# AGENTS.md — Rules for AI Assistants

This file is read by AI coding assistants (Antigravity, Cursor, etc.) at the start of every session.
It defines the working conventions for this repository. Follow these exactly.

---

## Project Context

This is the **Open Learner's Guide** — an open-source, neurodivergent-friendly IT/DevOps learning repository.
It is rendered as a static documentation site using **MkDocs Material**.

- **Audience:** Self-taught learners, career-changers, neurodivergent learners
- **Teaching philosophy:** Pseudocode-first, multi-language tabbed examples, modern-first with legacy acknowledged
- **Platform scope:** Linux + Windows only for OS/hardware content
- **Language coverage:** Python, TypeScript, Rust, C (in that tab order)

---

## Git Workflow — Atomic Commits

> **One logical change = one commit. Never batch unrelated changes.**

### Commit Scope Rules

| Change type | Scope of one commit |
|-------------|-------------------|
| New content unit | Exactly one `.md` file + its `mkdocs.yml` nav entry |
| Style guide update | `meta/style_guide.md` only |
| Nav-only change | `mkdocs.yml` only |
| Bug fix / typo | The specific file(s), no extras |
| New stub files | All stubs in one commit (they have no content) |

### Commit Message Format

Use **Conventional Commits** with these custom prefixes:

```
content(<domain>/<unit>): <what was added>
meta(<filename>): <what policy was added/changed>
chore(nav): <what nav entry was added>
chore(stubs): add stub files for <domain> domain
fix(<domain>/<unit>): <what was corrected>
style(<domain>/<unit>): apply pseudocode/legacy-modern standard
```

Examples:
```
content(foundations/concurrency): add concurrency unit
content(devops/docker): add docker unit with multi-stage builds and compose v2
meta(style_guide): add Introduced/Deprecated fields to tool metadata block
chore(nav): add hardware_fundamentals to foundations navigation
fix(devops/linux_cli): fix broken SSH config example
style(foundations/algorithms): apply legacy/modern labels to sorting libraries
```

### What NOT to Do

```
# ❌ Bad — batches 4 unrelated units
git commit -m "content: add 4 new units"

# ❌ Bad — mixes content and meta
git commit -m "add style guide update and docker unit"

# ❌ Bad — no scope
git commit -m "content: docker"

# ✅ Good — one unit, clear scope
git commit -m "content(devops/docker): add docker unit with multi-stage builds and compose v2"
```

### Branch Strategy (for large additions)

For adding an entire new domain (4+ units):
```
git switch -c content/devops-domain
# write each unit as a separate commit
git switch main && git merge --no-ff content/devops-domain
git branch -d content/devops-domain
```

For single units or meta changes: commit directly to `main`.

---

## Content Standards

### Unit Structure (required sections, in order)

1. `# Title` with domain/time/platform metadata
2. Tool metadata block (if introducing tools)
3. Prerequisites + Who needs this (blockquote)
4. `## 🎯 Learning Objectives` (5–8 checkboxes)
5. `## 📖 Concepts` (grouped, pseudocode-first + tabbed code)
6. `## 📚 Resources` (tabbed: Primary / Supplemental / Practice)
7. `## 🏗️ Assignments` (2–4, multi-concept)
8. `## ✅ Milestone Checklist` (binary, action-verbs only)
9. `## 🏆 Milestone Complete!` (reward message)
10. `## ➡️ Next Unit` (link)

### Tool Metadata Block (required for every new tool introduced)

```
> **Tool:** <name> · **Introduced:** <year> · **Latest:** <version> (<year>) · **Deprecated:** <year or "N/A"> · **Status:** <icon + label>
```

Status icons: 🟢 Modern | 🟡 Legacy | 🔴 Deprecated | 🔵 Foundation

### Legacy/Modern Policy

- **Modern = actively maintained + dominant, regardless of age.** SSH (1995), Bash (1989), SQL (1974), C — all are 🟢 current because nothing has replaced them.
- **Legacy = has a widely-adopted modern alternative.** Age alone is not sufficient. Webpack is legacy because Vite exists. jQuery is legacy because the platform caught up.
- **Foundation = core primitives modern tooling wraps.** Teach them in full so learners understand what the abstraction hides.
- **Legacy Specialisation = historically significant but not widely encountered in new work.** COBOL, FORTRAN, AS/400, SOAP/WSDL, VB6, mainframe JCL. These belong ONLY in `docs/specialisations/legacy_systems/` — never in domain or foundation content.
- **Tab order:** `Modern (Recommended)` first, then `Legacy (Common)`, then `Foundation`
- **Inline feature notes:** `` `XMLHttpRequest` (introduced 1999, superseded by `fetch` 2015) ``

### Four-Tier Content Model

```
[Foundation]          Core primitives — always teach, regardless of modern shortcuts
     ↓
[Domain Units]        Current best-practice content — the main body of the guide
     ↓
[Paths]               Curated sequences through Domain Units for a role
     ↓
[Specialisations]     Optional deep-dives for specific career contexts
  ├── advanced/       (e.g. distributed systems, compilers, OS internals)
  └── legacy_systems/ (e.g. COBOL, FORTRAN, mainframes — encountered, not started from)
```

Legacy specialisations must:
- State explicitly **why** someone would learn this: "You may encounter this in regulated industries (banking, insurance, government)"
- Be marked **🟡 Legacy Specialisation** in their heading
- Link back to the modern alternative at the top
- Never be linked from the Beginner or standard domain paths

### Language Domain Philosophy

> **Minimal redundancy. Cross-link rather than repeat.**

Foundation units already teach concepts in multi-language tabs (Python, TypeScript, Rust, C).
Language-specific domain units must **not** re-teach those concepts.

**Language units cover only what is unique to that language:**

| Language | Unique content (not in foundations) |
|----------|-------------------------------------|
| Python | Environments (`venv`/`uv`), `pip`, decorators, `__dunder__` methods, type hints + mypy, asyncio specifics, Python packaging |
| TypeScript | Type system (generics, utility types, discriminated unions), `tsconfig`, declaration files, module resolution |
| Rust | Traits, `impl`, crates ecosystem, `unsafe`, error handling (`?`, `Result`) |
| C | Pointers/pointer arithmetic, header files, undefined behaviour, make/cmake, ABI, linking |

**Reference sheets** (syntax cheat-sheet pages, not tutorials) live at `docs/reference/<language>.md`.
They show syntax only — no concept explanation. Learners bookmark them for quick lookup.

**Navigation model:**
```
Concept → Foundation unit (learns the concept, sees multiple languages)
        → Language unit (learns idiomatic usage in that language)
        → Reference sheet (quick syntax lookup, no learning content)
```

If a concept is already in a foundation unit, **do not re-explain it** in a language unit.
Use a cross-link: "For the concept behind this, see [Concurrency](../foundations/concurrency.md)."

### Pseudocode

- Always shown first for any language-agnostic concept
- Uses the syntax defined in `docs/meta/pseudocode_standard.md`
- Never skip pseudocode in favor of going straight to code

### Language Tab Order

```
Pseudocode → Python → TypeScript → Rust → C
```
Include only the tabs that add distinct value. Do not include a tab that is identical in concept to another.

---

## MkDocs Nav Convention

Every new unit file must be registered in `mkdocs.yml` in the same commit as the file.
Nav entries use Title Case for display names:

```yaml
- "Memory Management": domains/foundations/memory_management.md
```

---

## Resource Link Rules

Resources listed in unit `## 📚 Resources` sections must be **specific, linkable items** — not course platforms in general.

| ✅ Acceptable resource | ❌ Not acceptable |
|----------------------|-----------------|
| A specific YouTube video (with URL) | "Check out KodeKloud" (no specific content) |
| A specific docs page or guide | An entire course platform |
| A specific article or blog post | A tool's homepage |
| A book (with edition + year) | A YouTube channel (link specific videos) |

**Paid courses** (Udemy, KodeKloud, Pluralsight, Frontend Masters, etc.) are listed in a separate
**"External Courses"** tab within the `## 📚 Resources` section — never in Primary or Supplemental:

```markdown
=== "External Courses"
    - 🎓 **[KodeKloud — CKA Practice](https://kodekloud.com/)** — Best prep for the CKA exam (PAID)
    - 🎓 **[Frontend Masters — Complete Intro to React](https://frontendmasters.com/...)** — (PAID)
```

Do **not** embed or replicate third-party course content. Reference it, link it, move on.

---

## Courses vs Domain Units

This repository contains **two types of learning content:**

| Type | Location | Purpose | Structure |
|------|----------|---------|-----------|
| **Domain Units** | `docs/domains/` | Topic reference + teaching — used as needed | Concept-first, not necessarily linear |
| **Courses** | `docs/courses/` | Linear, lesson-by-lesson learning experience | Lesson 1 → 2 → 3 → Project → Certificate |

**Courses** are self-contained in this repo. They sequence domain concepts into a taught experience
with inline exercises between lessons (not just at the end). A course:
- Has a defined syllabus and time estimate at the top
- Is split into numbered lessons, each building on the last
- Has inline "Try it" exercises after each concept block
- Ends with a capstone project and a milestone checklist
- Cross-links to domain units for deeper reading, but does not duplicate them

Example: `docs/courses/python_zero_to_hero/` contains lessons 01–12 with exercises, not the
Python domain unit content repeated.

---

## Cross-Platform Policy (Windows + Linux)

All tools, commands, and examples must work on **both Windows and Linux**.

- Prefer tools with native Windows support — not "use WSL" as the workaround
- When a tool is Linux-only (or Linux-primary), state that explicitly with a `!!! warning`
- Shell examples: provide both PowerShell and Bash/zsh variants where they differ
- **Do not recommend** Linux container-first tools (e.g. Dagger) for general use — they require WSL2 on Windows and are not cross-platform in practice
- Docker Desktop provides cross-platform container support and is the safe default

## Things to Check at Session Start

1. Run `git log --oneline -10` to see what was last committed
2. Check `mkdocs.yml` nav to see which files are stubs vs. complete
3. Read `docs/meta/style_guide.md` for current content standards
4. Check if `mkdocs serve` is running (port 8001) — if not, user may need to start it

---

## Out of Scope

- Do not add content for macOS (all OS/hardware content is Windows + Linux only)
- Do not recommend paid-only resources as primary references
- Do not write units for technologies that are **deprecated with no active use** — label them deprecated and note the replacement
- Do not skip the pseudocode step even if the concept seems simple
