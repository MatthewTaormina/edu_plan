# 🟣 Systems Programmer Path

> **Who this is for:** You want to understand how computers *actually* work. You're drawn to performance, memory, and low-level control.
> **Goal:** Master systems programming in C and Rust, understand OS internals.
> **Time estimate:** 12–18 months at 1–2 hrs/day | **Dependencies:** Beginner Path complete

---

## Dependency Map

```
Beginner Foundations (Python)
          ↓
   C Fundamentals ────────────────────────────────┐
          ↓                                        ↓
   Memory Management ←── OS Concepts          Assembly Basics
          ↓                                        ↓
   Concurrency Basics                        (Optional deep dive)
          ↓
   Rust Fundamentals
          ↓
   Rust Advanced (async, unsafe, FFI)
          ↓
   Systems Projects (VM, runtime, etc.)
```

---

## 🏁 Milestones

### Milestone 1 — C Fundamentals 🔩
*~6 weeks*

**Why C?** C is the lingua franca of systems. Understanding C makes Rust, Go, and OS concepts click.

- [ ] [`domains/systems_programming/c_fundamentals.md`](../domains/systems_programming/c_fundamentals.md)
  - Compilation process (preprocessing, compiling, linking)
  - Pointers and pointer arithmetic
  - Stack vs heap allocation (malloc/free)
  - Arrays, strings (char arrays)
  - Structs and unions
  - Header files and linking
  - Common C patterns (error handling, NULL checks)

#### Course
- 📺 [CS50x — Weeks 1–6 (FREE)](https://cs50.harvard.edu/x/) — Best C intro in existence
- 📚 "The C Programming Language" (K&R) — Classic reference, worth owning

#### Assignment
- Write a dynamic array implementation from scratch (push, pop, resize)
- Write a basic linked list with insert/delete/search
- [ ] All in pure C, no libraries

**🏆 Reward:** You understand what higher-level languages are hiding from you.

---

### Milestone 2 — Memory Management Deep Dive 🧠
*~3 weeks*

- [ ] [`domains/foundations/memory_management.md`](../domains/foundations/memory_management.md)
  - Stack frames and the call stack
  - Heap allocation strategies
  - Memory leaks and dangling pointers
  - Buffer overflows (classic vulnerabilities)
  - Garbage collection concepts (tracing GC, reference counting)
  - Memory-mapped files

#### Research Questions 🔍
- What happens when malloc runs out of memory?
- How does a garbage collector decide what to collect?
- What is a use-after-free bug? Can you write one intentionally (safely)?

**🏆 Reward:** Memory is no longer magic. You understand ownership before even learning Rust.

---

### Milestone 3 — OS Concepts 🖥️
*~3 weeks*

- [ ] [`domains/foundations/os_concepts.md`](../domains/foundations/os_concepts.md)
  - Processes and threads
  - System calls
  - File descriptors and I/O
  - Signals
  - Virtual memory and address spaces
  - The kernel / user space boundary

#### Course
- 📺 [Operating Systems: Three Easy Pieces (FREE book)](https://pages.cs.wisc.edu/~remzi/OSTEP/) — Chapters 1–30 (virtualization + concurrency)

#### Research Questions 🔍
- What is a context switch? What does the CPU actually save?
- What's the difference between a process and a thread?
- What happens when your program crashes with a segfault?

**🏆 Reward:** You understand what the OS does for you and what you can do yourself.

---

### Milestone 4 — Rust Fundamentals 🦀
*~6 weeks*

- [ ] [`domains/systems_programming/rust_fundamentals.md`](../domains/systems_programming/rust_fundamentals.md)
  - Ownership, borrowing, lifetimes
  - Structs, enums, pattern matching
  - The Result and Option types
  - Traits and generics
  - Closures and iterators
  - Cargo and the ecosystem
  - Error handling idioms

#### Course
- 📚 [The Rust Book (FREE)](https://doc.rust-lang.org/book/) — Essential. Read chapters 1–15.
- 📺 [Rustlings (FREE, interactive)](https://github.com/rust-lang/rustlings) — Exercises alongside the book

#### Assignment
- Rewrite your C linked list in Rust (compare the experience)
- Build a CLI tool: a CSV file parser and analyzer
  - Read a CSV, compute min/max/average per column
  - Output formatted results
- [ ] No `unwrap()` — handle all errors with `?` and custom error types

**🏆 Reward:** You write memory-safe, high-performance code. You understand why Rust exists.

---

### Milestone 5 — Concurrency 🔀
*~3 weeks*

- [ ] [`domains/foundations/concurrency.md`](../domains/foundations/concurrency.md)
  - Threads and race conditions
  - Mutexes, semaphores, deadlocks
  - Async I/O and event loops
  - Rust's async/await + Tokio

#### Course
- 📺 [The Async Book (FREE)](https://rust-lang.github.io/async-book/) — Rust-specific
- 📺 [CS 140e — Stanford's OS Course (Free, lectures on YouTube)](https://cs140e.sergio.bz/)

**🏆 Reward:** You can write concurrent programs without fear of race conditions.

---

### Milestone 6 — Assembly Basics (Optional but recommended) ⚙️
*~3 weeks*

- [ ] [`domains/systems_programming/assembly_basics.md`](../domains/systems_programming/assembly_basics.md)
  - x86/x64 register model
  - Common instructions (mov, add, cmp, jmp, call)
  - The stack frame and calling conventions
  - Reading compiler output (`objdump`, Godbolt)

#### Resource
- 📺 [x86 Assembly Guide (Yale)](https://flint.cs.yale.edu/cs421/papers/x86-asm/asm.html)
- 🌐 [Compiler Explorer / Godbolt](https://godbolt.org/) — See what your C/Rust compiles to

**🏆 Reward:** No abstraction layer is opaque to you anymore.

---

### Milestone 7 — Systems Project 🏗️
*~6 weeks*

See [`projects/p01_cli_tool.md`](../projects/p01_cli_tool.md) (Rust version)

Or tackle one of:
- Build a simple HTTP server in Rust (from raw TCP sockets)
- Build a basic stack-based virtual machine in Rust
- Build a toy shell (REPL + basic command execution)

**🏆 Reward:** You have a systems-level project that impresses any interviewer.

---

## 🔍 Optional Advanced Topics

- OS kernel development (writing your own bootloader)
- LLVM and compiler backends
- WebAssembly (WASM) internals
- Lock-free data structures
