---
title: Open Learner's Guide
description: A neurodivergent-friendly, open-source guide to IT, Programming, and DevOps.
slug: /
---

import Link from '@docusaurus/Link';

<div style={{background: 'linear-gradient(135deg, #1e0a3c 0%, #0d1b3e 60%, #061d35 100%)', borderRadius: '12px', padding: '3rem 2.5rem', marginBottom: '2rem', textAlign: 'center', border: '1px solid rgba(124,58,237,0.3)'}}>
<h2 style={{color: '#e2d9f3', fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.03em'}}>🚀 Open Learner's Guide</h2>
<p style={{color: '#a78bfa', fontSize: '1.1rem', margin: '0 0 1rem'}}>IT · Programming · DevOps — Self-paced, open-source, neurodivergent-friendly</p>
<p style={{color: '#94a3b8', fontSize: '0.95rem', margin: 0}}>Multiple entry points · Clear milestones · Real projects · Free resources</p>
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

:::tip
Think of it as a **navigation system** — it connects free resources, targeted research questions, and hands-on projects into coherent learning paths. You do the work; this tells you what to do next.
:::

---

## ⚡ Designed for Neurodivergent Learners

| Principle | How It's Applied |
|-----------|-----------------|
| **Clear milestones** | Every unit ends with a `✅ Done` state |
| **Reward loops** | Achievements unlock at each milestone |
| **Chunked content** | Units are ≤4 hours. No marathon sessions. |
| **Multiple entry points** | Start anywhere. No forced linear order. |
| **Bounded rabbit holes** | Exploration topics are marked 🔍 and optional |
| **Visual progress** | Per-lesson milestone checklists with localStorage |

---

## 🗺️ Choose Your Path

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>

{[
  { emoji: '🐣', label: 'Beginner', desc: 'Never coded before? Start here.', to: '/learn/paths/beginner' },
  { emoji: '🌐', label: 'Web Developer', desc: 'HTML → React → APIs → Full-stack', to: '/learn/paths/frontend_developer' },
  { emoji: '⚙️', label: 'Backend Developer', desc: 'APIs, databases, auth', to: '/learn/paths/backend_developer' },
  { emoji: '🖥️', label: 'Full Stack', desc: 'End-to-end product development', to: '/learn/paths/fullstack' },
  { emoji: '🔧', label: 'Systems Programmer', desc: 'C, Rust, assembly, OS internals', to: '/learn/paths/systems' },
  { emoji: '🚀', label: 'DevOps Engineer', desc: 'Docker, K8s, CI/CD, Terraform', to: '/learn/paths/devops' },
  { emoji: '🤖', label: 'AI Engineer', desc: 'ML, LLMs, prompt engineering, agents', to: '/learn/paths/ai_engineer' },
].map(p => (
  <Link key={p.label} to={p.to} style={{textDecoration: 'none'}}>
    <div style={{padding: '1.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(156,77,204,0.2)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
      <span style={{fontSize: '2rem'}}>{p.emoji}</span>
      <strong style={{color: 'var(--ifm-font-color-base)'}}>{p.label}</strong>
      <span style={{fontSize: '0.85rem', opacity: 0.65}}>{p.desc}</span>
    </div>
  </Link>
))}

</div>

---

## 🏁 How to Start (3 Steps)

1. **Read** [Orientation](start/orientation) — understand how the system works *(10 min)*
2. **Take** the [Self-Assessment](start/self_assessment) — find your level *(5 min)*
3. **Pick a path** above and follow it

---

## 📊 Repo Status

| Iteration | Focus | Status |
|-----------|-------|--------|
| **v0.1** | Repo structure + learning paths | ✅ Complete |
| **v0.2** | Domain indexes + course recommendations | 🔄 In Progress |
| **v0.3** | Atomic concept units — Foundations | 📋 Planned |
| **v0.4** | Atomic concept units — Web/Systems/DevOps | 📋 Planned |
| **v0.5** | Projects + capstones | 📋 Planned |

---

*Built with [Docusaurus](https://docusaurus.io/) · Open source · Community contributions welcome*
