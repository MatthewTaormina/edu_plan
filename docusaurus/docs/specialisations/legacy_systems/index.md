# Legacy Systems Specialisation

> 🟡 **This is a specialisation track — not foundation content.**
>
> If you are new to programming or DevOps, start with the [Foundations domain](../../domains/foundations/index.md)
> or a [learning path](../../paths/beginner.md) instead. Return here when you need to understand
> systems you have encountered on the job.

---

## What This Track Is For

Some industries — **banking, insurance, government, manufacturing, aerospace** — run on software
written decades ago and still in active production. Engineers in these fields routinely encounter:

- **COBOL** mainframe applications processing billions of transactions daily
- **FORTRAN** scientific and engineering computation codebases
- **RPG / AS/400** (IBM iSeries) business applications
- **SOAP/WSDL/XML-RPC** enterprise integration layers (pre-REST era)
- **VB6 / Classic ASP** Windows application stacks from the late 1990s
- **Mainframe JCL** (IBM Job Control Language) batch job systems

This track teaches you to **read, understand, navigate, and incrementally modernise** these systems —
not to build new things in them.

!!! warning "🟡 Legacy Specialisation"
    Technologies in this track are taught because you may **encounter** them, not because you should start new projects in them. Every unit explains: what the modern equivalent is, why the legacy system is still running, and how to interface it with modern tooling.

---

## Units

| Unit | What you'll learn | Who needs it |
|------|-------------------|-------------|
| [COBOL Fundamentals](cobol.md) | Data division, procedure division, working with copybooks | Banking/insurance engineers, mainframe ops |
| [FORTRAN Essentials](fortran.md) | Array operations, subroutines, interfacing with C/Python | Scientific computing, legacy HPC |
| [SOAP & WSDL](soap_wsdl.md) | Reading WSDLs, writing SOAP clients, wrapping with REST | Enterprise integration, ESBs |
| [AS/400 / IBM iSeries](as400.md) | RPG IV basics, CL commands, DB2 for i | IBM shops, finance, distribution |
| [VB6 / COM / ActiveX](vb6.md) | Navigating VB6 codebases, COM interop, migration paths | Windows enterprise, manufacturing |
| [Mainframe JCL](jcl.md) | Job cards, DD statements, PROC libraries, output | z/OS batch operations |

*Units are added as demand warrants. Stubs are placeholders.*

---

## Common Pattern: Modernisation Without Rewrite

The most practical skill in this track is **strangler fig modernisation** — wrapping legacy systems
with modern APIs while leaving their internals intact.

```
Legacy COBOL program             Modern REST API
┌───────────────────┐            ┌──────────────────┐
│  WORKING-STORAGE  │            │  POST /calculate  │
│  PROCEDURE DIVISION│◄──────────│  → calls COBOL    │
│  (runs on z/OS)   │            │     batch job     │
└───────────────────┘            └──────────────────┘

Pattern: modern frontend → API gateway → legacy backend
Neither side needs to know about the other's internals.
```

---

## How to Use This Track

1. Identify the specific technology you have encountered
2. Read the unit for that technology — understand the core concepts
3. Use the "Interfacing with Modern Systems" section of each unit to bridge the gap
4. Work toward the modernisation strategies at the end of each unit
5. The [Resources section](#resources) of each unit lists the best paid/free materials

---

## Resources

- 📖 **[IBM COBOL Reference (FREE)](https://www.ibm.com/docs/en/cobol-zos)** — Authoritative reference for enterprise COBOL
- 📺 **[Derek Banas — COBOL Tutorial (YouTube, FREE)](https://www.youtube.com/watch?v=TBs7HmW9EME)** — Best free intro to COBOL concepts
- 📖 **[Micro Focus COBOL Documentation (FREE)](https://www.microfocus.com/documentation/visual-cobol/)** — For COBOL outside of z/OS
