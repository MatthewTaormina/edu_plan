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

- **2020+ default:** Primary content is modern (2020+). Legacy tools acknowledged, not excluded.
- **Three categories:** Modern (primary), Legacy (labeled, taught), Foundation (always taught in full)
- **Tab order:** `Modern (Recommended)` tab first, then `Legacy (Common)`, then `Foundation`
- **Inline feature notes:** `` `XMLHttpRequest` (introduced 1999, superseded by `fetch` 2015) ``

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

## Things to Check at Session Start

1. Run `git log --oneline -10` to see what was last committed
2. Check `mkdocs.yml` nav to see which files are stubs vs. complete
3. Read `docs/meta/style_guide.md` for current content standards
4. Check if `mkdocs serve` is running (port 8001) — if not, user may need to start it

---

## Out of Scope

- Do not add content for macOS (all OS/hardware content is Windows + Linux only)
- Do not recommend paid-only resources as primary references
- Do not write units for technologies that are pre-2020 only — label them legacy and pair with a modern alternative
- Do not skip the pseudocode step even if the concept seems simple
