# Open Learner's Guide

<div style="background: linear-gradient(135deg, #1e0a3c 0%, #0d1b3e 60%, #061d35 100%); border-radius: 12px; padding: 3rem 2.5rem; margin-bottom: 2rem; text-align: center; border: 1px solid rgba(124,58,237,0.3);">
<h2 style="color: #e2d9f3; font-size: 2.2rem; font-weight: 800; margin: 0 0 0.5rem; letter-spacing: -0.03em;">🚀 Open Learner's Guide</h2>
<p style="color: #a78bfa; font-size: 1.1rem; margin: 0 0 1rem;">IT · Programming · DevOps — Self-paced, open-source, neurodivergent-friendly</p>
<p style="color: #94a3b8; font-size: 0.95rem; margin: 0;">Multiple entry points · Clear milestones · Real projects · Free resources</p>
</div>

## What Is This?

This is a **structured, self-paced learning system** for anyone who wants to go from zero to professional-level knowledge in:

- **Programming** (high-level and low-level)
- **Web Development** (frontend + backend)
- **Systems Programming** (C, Rust, OS, memory)
- **DevOps & Cloud** (containers, CI/CD, infrastructure)
- **Databases** (SQL, NoSQL, design, performance)
- **AI Engineering** (LLMs, agents, RAG, AI APIs)
- **Security** (AppSec, network, cryptography)

!!! tip "This is not a course"
    Think of it as a **navigation system** — it connects free resources, targeted research questions, and hands-on projects into coherent learning paths. You do the work; this tells you what to do next.

---

## ⚡ Designed for Neurodivergent Learners

| Principle | How It's Applied |
|-----------|-----------------|
| **Clear milestones** | Every unit ends with a `✅ Done` state |
| **Reward loops** | Achievements unlock at each milestone |
| **Chunked content** | Units are ≤4 hours. No marathon sessions. |
| **Multiple entry points** | Start anywhere. No forced linear order. |
| **Bounded rabbit holes** | Exploration topics are marked 🔍 and optional |
| **Visual progress** | Kanban in `.meta/kanban/board.md` |

---

## 🗺️ Choose Your Path

=== "🟢 Beginner"
    **Never coded before? Start here.**
    
    Learn Python basics, data structures, and version control.
    Build your first real project.
    
    **Time:** 3–6 months · **Prereqs:** None
    
    [Start the Beginner Path →](paths/beginner.md){ .md-button .md-button--primary }

=== "🔵 Web Developer"
    **Want to build websites and web apps.**
    
    HTML/CSS → JavaScript → TypeScript → React → REST APIs → Full-stack.
    
    **Time:** 6–12 months · **Prereqs:** Beginner Path or basic coding
    
    [Start the Web Dev Path →](paths/web_developer.md){ .md-button .md-button--primary }

=== "🟣 Systems Programmer"
    **Want to understand how computers really work.**
    
    C → Memory management → OS concepts → Rust → Assembly.
    
    **Time:** 12–18 months · **Prereqs:** Beginner Path
    
    [Start the Systems Path →](paths/systems.md){ .md-button .md-button--primary }

=== "🟠 DevOps Engineer"
    **Want to ship and operate software at scale.**
    
    Linux → Docker → Kubernetes → CI/CD → Terraform → Cloud.
    
    **Time:** 8–14 months · **Prereqs:** Beginner Path + any language
    
    [Start the DevOps Path →](paths/devops.md){ .md-button .md-button--primary }

=== "🔴 Full Stack"
    **Want to build complete products end-to-end.**
    
    Combines Web Dev + DevOps + Architecture + Databases.
    
    **Time:** 10–16 months · **Prereqs:** Beginner Path
    
    [Start the Full Stack Path →](paths/fullstack.md){ .md-button .md-button--primary }

=== "⚫ AI Engineer"
    **Want to build with LLMs and AI systems.**
    
    Python → LLM fundamentals → Prompt engineering → RAG → Agents.
    
    **Time:** 8–12 months · **Prereqs:** Beginner Path (Python focus)
    
    [Start the AI Engineer Path →](paths/ai_engineer.md){ .md-button .md-button--primary }

---

## 📁 Repository Structure

```
edu_plan/
├── docs/                      ← All learner content (this site!)
│   ├── index.md               ← You are here
│   ├── start/                 ← Orientation & self-assessment
│   ├── paths/                 ← Named learning paths (6 entry points)
│   ├── domains/               ← Atomic knowledge units by domain
│   │   ├── foundations/       ← CS fundamentals
│   │   ├── web_dev/           ← Frontend + backend
│   │   ├── systems_programming/
│   │   ├── devops/
│   │   ├── databases/
│   │   ├── cloud/
│   │   ├── ai_ml/
│   │   └── security/
│   ├── projects/              ← Cross-domain capstone projects
│   └── resources/             ← Curated course & reference lists
├── .meta/kanban/              ← Progress tracking (your board)
└── mkdocs.yml                 ← Site configuration
```

---

## 🏁 How to Start (3 Steps)

1. **Read** [Orientation](start/orientation.md) — understand how the system works *(10 min)*
2. **Take** the [Self-Assessment](start/self_assessment.md) — find your level *(5 min)*  
3. **Pick a path** from the tabs above and follow it

---

## 📊 Repo Status

| Iteration | Focus | Status |
|-----------|-------|--------|
| **v0.1** | Repo structure + learning paths | ✅ Complete |
| **v0.2** | Domain indexes + course recommendations | 🔄 In Progress |
| **v0.3** | Atomic concept units — Foundations | 📋 Planned |
| **v0.4** | Atomic concept units — Web/Systems/DevOps | 📋 Planned |
| **v0.5** | Projects + capstones | 📋 Planned |
| **v0.6** | AI/ML + Security domains | 📋 Planned |
| **v0.7** | Full review + gap fill | 📋 Planned |

---

!!! success "Run This Site Locally"
    ```bash
    # Install dependencies (one time)
    pip install mkdocs-material pymdown-extensions mkdocs-minify-plugin
    
    # Start local dev server
    mkdocs serve
    
    # Build standalone static site (open site/index.html offline)
    mkdocs build
    ```

*Built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) · Open source · Community contributions welcome*
