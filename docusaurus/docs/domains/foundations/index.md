# 🏛️ Foundations Domain Index

> Core computer science concepts that every programmer needs regardless of specialization.
> These are the fundamentals used in EVERY other domain.

---

## Units in This Domain

| Unit | Topic | Estimated Time | Status |
|------|-------|---------------|--------|
| [`programming_basics.md`](programming_basics.md) | Variables, control flow, functions | 4 weeks | 📋 Planned |
| [`data_structures.mdx`](data_structures.mdx) | Arrays, lists, trees, graphs, hash maps | 4 weeks | 📋 Planned |
| [`algorithms.md`](algorithms.md) | Sorting, searching, complexity analysis | 3 weeks | 📋 Planned |
| [`memory_management.md`](memory_management.md) | Stack, heap, GC, pointers, ownership | 3 weeks | 📋 Planned |
| [`concurrency.md`](concurrency.md) | Threads, async, parallelism, deadlocks | 3 weeks | 📋 Planned |
| [`networking.md`](networking.md) | TCP/IP, HTTP, DNS, TLS | 2 weeks | 📋 Planned |
| [`os_concepts.md`](os_concepts.md) | Processes, syscalls, files, virtual memory | 3 weeks | 📋 Planned |

---

## Dependency Order

```
programming_basics
       ↓
data_structures ←── algorithms
       ↓
memory_management ←── os_concepts
       ↓
   concurrency
       ↓
   networking  (can be done in parallel with concurrency)
```

---

## Which Paths Use These Units

| Unit | Beginner | Web Dev | Systems | DevOps | Full Stack | AI |
|------|----------|---------|---------|--------|------------|-----|
| programming_basics | ✅ Required | ✅ | ✅ | ✅ | ✅ | ✅ |
| data_structures | ✅ Required | Recommended | ✅ Required | Recommended | ✅ | Recommended |
| algorithms | Intro only | Intro only | ✅ Required | Intro only | Intro only | Recommended |
| memory_management | ❌ | ❌ | ✅ Required | ❌ | ❌ | ❌ |
| concurrency | ❌ | ✅ | ✅ Required | ✅ | ✅ | ✅ |
| networking | ❌ | Recommended | ✅ | ✅ Required | ✅ | Recommended |
| os_concepts | ❌ | ❌ | ✅ Required | Recommended | ❌ | ❌ |

---

## Key Concepts Summary

### What you learn here and why it matters

**Programming Basics** → The grammar of thought. Without this, nothing else works.

**Data Structures** → Every system is built from these. Arrays, hash maps, and trees appear everywhere from databases to compilers to game engines.

**Algorithms** → Not about memorizing — about *thinking* about efficiency. Why does this loop run 1000x instead of once?

**Memory Management** → The hidden layer. Every program uses memory. Most bugs are memory bugs. Understanding this separates good programmers from great ones.

**Concurrency** → Modern computers have multiple cores. The internet has multiple users. Writing correct concurrent code is the hardest thing in programming.

**Networking** → Every app talks to something. HTTP, TCP, DNS — these are the pipes your code runs through.

**OS Concepts** → Your code doesn't run in a vacuum. The OS is your execution environment. Understanding it makes you a better programmer at every layer.
