import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Memory Management

**Domain:** Foundations · **Time Estimate:** 1–2 weeks · **Relevant to:** Systems Programming, Rust, C, Performance

> **Prerequisites:** [Hardware Fundamentals](hardware_fundamentals.md) — understanding the memory hierarchy makes this unit click.
>
> **Who needs this:** Everyone beyond beginner level. Memory bugs are the #1 source of crashes, security vulnerabilities (buffer overflows, use-after-free), and latency spikes in production systems. Even if your language has garbage collection, understanding what happens underneath makes you a better engineer.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain the difference between stack and heap memory
- [ ] Describe how `malloc`/`free` work under the hood
- [ ] Identify common memory bugs: use-after-free, double-free, memory leaks, buffer overflows
- [ ] Explain how garbage collectors work (mark-and-sweep, reference counting)
- [ ] Describe Rust's ownership model and explain why it prevents memory bugs at compile time
- [ ] Use memory diagnostic tools (`valgrind`, Windows Application Verifier, AddressSanitizer)
- [ ] Understand RAII and smart pointers
- [ ] Explain how virtual memory, pages, and the MMU translate virtual addresses to physical RAM
- [ ] Describe how allocators subdivide OS memory into blocks and manage free lists

---

## 📖 Concepts

### 1. Stack vs. Heap

Every process has two main memory regions for runtime data:

```
Virtual address space:
┌─────────────────────┐
│       Stack         │ ← grows downward
│   ↓   ↓   ↓   ↓   │
│                     │
│   (unmapped gap)    │
│                     │
│   ↑   ↑   ↑   ↑   │
│       Heap          │ ← grows upward
├─────────────────────┤
│  Data / BSS         │
├─────────────────────┤
│  Text (code)        │
└─────────────────────┘
```

**Stack:**
- Automatically managed — allocated on function call, freed on return
- Fixed size (typically 1–8MB per thread)
- Extremely fast — just move a pointer
- Stores: local variables, function parameters, return addresses
- **Stack overflow:** recursion too deep, or giant local array

**Heap:**
- Explicitly managed (C/C++) or runtime-managed (GC/Rust)
- Theoretically limited only by available RAM + swap
- Slower — allocation involves the allocator finding a free block
- Stores: anything that needs to outlive a function call, dynamically sized data

```
void example() {
    int x = 42;           // Stack — gone when function returns
    int arr[100];         // Stack — 400 bytes allocated instantly

    int* ptr = malloc(sizeof(int) * 1000);  // Heap — 4KB allocated
    // ... use ptr ...
    free(ptr);            // Heap — must be explicitly freed in C
}
// Stack variables (x, arr) are freed automatically here
// If we forgot free(ptr), that's a memory leak
```

---

### 2. Virtual Memory & Paging

Modern OSes give each process its own **virtual address space** — a private, contiguous range of addresses (0 to 2⁴⁸ bytes on 64-bit Linux). Programs never address physical RAM directly. The CPU's **Memory Management Unit (MMU)** translates every virtual address to a physical one on the fly.

**Why virtual memory exists:**

| Benefit | What it enables |
|---------|----------------|
| **Isolation** | Process A cannot read Process B's memory — separate virtual spaces |
| **Overcommit** | `malloc(16GB)` succeeds on a 4GB machine — pages only consume RAM when touched |
| **Shared libraries** | `libc` is mapped once in physical RAM, reused across all processes |
| **`mmap`** | Files can be accessed as memory; the OS pages them in on demand |

**Pages: The unit of memory management**

Memory is allocated in fixed-size chunks called **pages** — 4 KB on x86-64, 16 KB on Apple Silicon. The OS never hands out individual bytes; it maps and unmaps entire pages.

**Page tables: How translation works**

Each process has a **page table** mapping virtual page numbers → physical frame numbers. On x86-64 this is a 4-level structure the MMU walks automatically:

```
Virtual address → [MMU walks 4-level page table] → Physical address
0x7FFE4000      →  virtual page 0x7FFE4            →  physical frame 0x3A8
                                                   →  physical address 0x3A8000
```

**TLB — Translation Lookaside Buffer**

Walking 4 levels of page table per memory access would be brutal. The CPU caches recent translations in the **TLB** (~1,500 entries on modern Intel). Code with random access patterns (hash tables, pointer-chasing linked lists) causes **TLB misses** — a real, measurable performance cost in hot loops.

**Page faults**

When you access a virtual address with no physical RAM mapped, the MMU triggers a **page fault** — a hardware interrupt handled by the kernel:

| Fault type | Cause | OS response |
|------------|-------|-------------|
| **Minor** | Page valid but not yet in RAM (e.g. first write to `malloc`'d memory) | Map a physical frame → resume — fast (~µs) |
| **Major** | Page was swapped out to disk | Read from swap → map → resume — slow (~ms) |
| **Invalid** | Unmapped address or permission violation | Send `SIGSEGV` → program crashes |

**Process address space layout**

| Region | Contents | Growth direction |
|--------|----------|-----------------|
| Text | Compiled machine code (read-only, shared between processes) | Fixed |
| Data | Initialised global/static variables | Fixed |
| BSS | Uninitialised global/static variables (zero-filled by OS) | Fixed |
| Heap | `malloc` allocations | Grows upward via `brk`/`mmap` |
| mmap region | Shared libraries, large `malloc`s (>128 KB), mapped files | Grows downward |
| Stack | Call frames, local variables | Grows downward (fixed max via `ulimit -s`) |

---

### 3. How Allocators Work

`malloc` doesn't ask the OS for memory on every call — syscalls cost microseconds. Instead, an **allocator** acts as an intermediary: it requests large memory slabs from the OS upfront, then subdivides and tracks them internally.

```
Your code  →  malloc(n)  →  Allocator (manages slabs)  →  OS (mmap / sbrk)
```

**Free lists**

The allocator maintains linked lists of available blocks. On `malloc(n)` it finds a suitable block; on `free(ptr)` it returns the block to the list:

```
Free list:  [32 B] → [64 B] → [128 B] → NULL

malloc(50): takes 64 B block → returns ptr
            14 B wasted  (internal fragmentation)

free(ptr):  block returned → adjacent free blocks merged (coalescing)
```

**Fragmentation**

| Type | What happens |
|------|--------------|
| **Internal** | Allocated block larger than requested — wasted bytes inside the block |
| **External** | Enough total free memory, but no single contiguous block large enough |

Allocators fight external fragmentation with **coalescing** — merging adjacent free blocks when `free()` is called.

**Size-class bins (how modern allocators stay fast)**

`glibc`'s `ptmalloc` (and alternatives like `jemalloc`, `mimalloc`) sort free blocks into **bins by size class** so finding a block is O(1):

| Bin type | Size range | Behaviour |
|----------|-----------|----------|
| Fastbins | ≤ 88 B | No coalescing — LIFO, ultra-fast |
| Small bins | 88–512 B | Doubly-linked FIFO list |
| Large bins | 512 B–128 KB | Sorted by size |
| `mmap` direct | > 128 KB | Bypasses bins; goes straight to OS per allocation |

**Practical consequences**

- Many small, frequent `malloc` calls have real overhead — list searching, bookkeeping, coalescing
- **Pool allocators** (Assignment 2 below) are dramatically faster for homogeneous data: allocation is just a pointer bump — no searching, no coalescing
- `jemalloc` and `mimalloc` use **per-thread arenas** to eliminate lock contention when multiple threads allocate simultaneously

---

### 4. Manual Memory Management (C)

In C, you manage memory yourself. The OS provides memory in large chunks via `mmap`/`sbrk`. The **allocator** (`malloc`/`free`) subdivides and tracks these chunks.

<Tabs>
<TabItem value="c-correct-usage" label="C — Correct Usage">

```c
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

// Allocate, use, free
int* create_array(int size) {
    int* arr = malloc(sizeof(int) * size);
    if (arr == NULL) {
        // malloc returns NULL on failure — always check!
        fprintf(stderr, "Out of memory\n");
        exit(1);
    }
    memset(arr, 0, sizeof(int) * size);  // Zero-initialize
    return arr;
}

int main() {
    int* data = create_array(100);
    data[0] = 42;

    // ... use data ...

    free(data);      // Must free what malloc gave us
    data = NULL;     // Best practice: null the pointer after freeing
    return 0;
}

// Dynamic string
char* copy_string(const char* src) {
    size_t len = strlen(src) + 1;       // +1 for null terminator
    char* copy = malloc(len);
    if (!copy) return NULL;
    memcpy(copy, src, len);
    return copy;                         // Caller must free this
}
```


</TabItem>
<TabItem value="c-common-bugs" label="C — Common Bugs">

```c
// BUG 1: Memory Leak — malloc without free
void leak() {
    int* ptr = malloc(100 * sizeof(int));
    // ... use ptr ...
    return;  // ptr goes out of scope, but memory is NOT freed
}   // Repeated calls accumulate unreachable memory → crash eventually

// BUG 2: Use-After-Free — accessing freed memory
int* ptr = malloc(sizeof(int));
*ptr = 42;
free(ptr);
printf("%d\n", *ptr);  // UNDEFINED BEHAVIOR — ptr is now "dangling"
// Could print 42, random garbage, or crash

// BUG 3: Double-Free — freeing the same pointer twice
free(ptr);
free(ptr);  // UNDEFINED BEHAVIOR — corrupts heap metadata → usually crashes

// BUG 4: Buffer Overflow — writing past allocated bounds
char* buf = malloc(10);
strcpy(buf, "this string is way too long");  // UNDEFINED BEHAVIOR
// Overwrites memory beyond buf — classic security vulnerability

// BUG 5: Using uninitialized memory
int* arr = malloc(10 * sizeof(int));
printf("%d\n", arr[0]);  // Could be anything — malloc does NOT zero memory
```


</TabItem>
</Tabs>

---

### 5. Common Memory Bugs and Their Consequences

| Bug | What Happens | Security Impact |
|-----|-------------|----------------|
| **Memory leak** | Process slowly grows in memory → OOM crash | Usually low (availability) |
| **Use-after-free** | Dangling pointer reads corrupt/random data | High — UAF is a common CVE class |
| **Double-free** | Heap corruption → crash or exploitation | High — can lead to code execution |
| **Buffer overflow** | Overwrite adjacent memory | Critical — classic exploit vector (shellcode) |
| **NULL deref** | Crash (segfault) | Low–Medium (crash = DoS) |
| **Stack overflow** | Crash — corrupts return address | High — stack smashing attacks |
| **Integer overflow** | Wrap-around leads to wrong allocation size | High — underpins many heap exploits |

---

### 6. Garbage Collection

Higher-level languages (Python, Java, Go, C#, JS) use a **garbage collector (GC)** to automatically reclaim memory that's no longer reachable.

**Mark-and-Sweep (used by: Go, Ruby, V8/JS engines):**
```
Phase 1 — Mark:
  Start from "root" pointers (globals, stack variables)
  Traverse all reachable objects and mark them ✓

Phase 2 — Sweep:
  Scan all allocated memory
  Any object NOT marked is unreachable → free it

Cost: GC pause — program stops while GC runs
      ("stop-the-world" pause, usually ms to hundreds of ms)
```

**Reference Counting (used by: Python, Swift):**
```
Each object maintains a count of references to it

x = [1, 2, 3]   # list refcount = 1
y = x            # list refcount = 2
del x            # list refcount = 1
del y            # list refcount = 0 → freed immediately

Problem: Circular references!
a.next = b
b.prev = a       # Both have refcount > 0 — neither is ever freed!
                 # Python's GC has a cycle detector to handle this
```

**Tradeoffs:**

| | Manual (C/C++) | GC (Go/Java/Python) | Rust Ownership |
|-|---------------|---------------------|---------------|
| Safety | No — bugs at runtime | Yes — no manual bugs | Yes — bugs at compile time |
| Performance | Highest — no GC pauses | Medium — GC pauses | Highest — no GC at all |
| Ergonomics | Hard | Easy | Medium — learning curve |
| Deterministic timing | Yes | No (GC can pause anytime) | Yes |

---

### 7. Rust Ownership Model

Rust eliminates entire classes of memory bugs **at compile time** — zero runtime cost. It does this through three rules:

1. **Each value has a single owner**
2. **When the owner goes out of scope, the value is dropped (freed)**
3. **There can be many immutable references OR one mutable reference — never both**

```rust
// Rule 1 & 2: Ownership and Drop
fn main() {
    let s = String::from("hello");  // s owns the string
    // When s goes out of scope at }, String::drop() is called automatically
}   // s is dropped here — memory freed, no GC, no manual free()

// Ownership transfer (move)
let s1 = String::from("hello");
let s2 = s1;      // s1 is MOVED to s2 — s1 is now invalid
// println!("{}", s1);  // COMPILE ERROR: s1 was moved

// Borrowing: temporary references
fn print_string(s: &String) {  // Takes a reference, doesn't own it
    println!("{}", s);
}   // s is not dropped here — we don't own it

let s = String::from("hello");
print_string(&s);  // Lend s — s still valid after
println!("{}", s); // Fine — s still owned by this scope

// Mutable borrow: only one at a time
let mut s = String::from("hello");
let r1 = &mut s;   // Mutable borrow
// let r2 = &mut s; // COMPILE ERROR: cannot borrow `s` as mutable more than once
r1.push_str(", world");
// r1's scope ends here (no more uses), so:
let r2 = &mut s;   // Now this is fine
```

**Why this matters: No use-after-free:**
```rust
let reference;
{
    let value = String::from("hello");
    reference = &value;  // COMPILE ERROR: `value` does not live long enough
}   // value dropped here
// Can't use reference after value is gone — compiler catches this!
```

---

### 8. RAII — Resource Acquisition Is Initialization

A pattern that ties resource lifetime to object scope. When the object is destroyed (goes out of scope), it releases the resource.

Used in: C++ (destructors), Rust (Drop trait), Python (`with` statement), C# (`using`), Java (`try-with-resources`)

<Tabs>
<TabItem value="rust-built-in" label="Rust (built-in)">

```rust
use std::fs::File;

fn read_file() -> std::io::Result<()> {
    let file = File::open("data.txt")?;
    // ... read from file ...
    // File is automatically closed when `file` goes out of scope
    // No need for file.close() — RAII handles it
    Ok(())
}  // file dropped here → OS file handle released

// Mutex guard (RAII for locking)
use std::sync::Mutex;
let lock = Mutex::new(0);
{
    let mut guard = lock.lock().unwrap();  // Acquire lock
    *guard += 1;
}   // guard dropped → mutex automatically unlocked
// Never forget to unlock — Rust physically cannot let you
```


</TabItem>
<TabItem value="python-context-managers" label="Python (context managers)">

```python
# Python's 'with' statement is RAII
with open("data.txt", "r") as f:
    content = f.read()
# File automatically closed when 'with' block exits
# Even if an exception is raised inside the block

# Implement RAII pattern for custom resources
class DatabaseConnection:
    def __enter__(self):
        self.conn = connect_to_db()
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()  # Always runs, even on exception
        return False

with DatabaseConnection() as conn:
    conn.query("SELECT * FROM users")
# conn.close() guaranteed to have been called
```


</TabItem>
<TabItem value="c-smart-pointers" label="C++ (smart pointers)">

```cpp
#include <memory>

// unique_ptr: single owner, freed when out of scope (like Rust Box<T>)
void example() {
    auto ptr = std::make_unique<int>(42);
    // ... use *ptr ...
}   // ptr goes out of scope → delete called automatically

// shared_ptr: reference counted (like Rust Rc<T>)
{
    auto shared1 = std::make_shared<int>(100);
    auto shared2 = shared1;  // refcount = 2
}   // both go out of scope → refcount = 0 → deleted

// weak_ptr: non-owning reference (breaks circular refs)
std::weak_ptr<int> weak = shared1;
if (auto locked = weak.lock()) {  // Check if still alive
    // use *locked
}
```


</TabItem>
</Tabs>

---

### 9. Memory Diagnostic Tools

<Tabs>
<TabItem value="linux-valgrind-asan" label="Linux (Valgrind + ASan)">

```bash
# Compile with debug info
gcc -g -O0 -o myapp myapp.c

# Valgrind — comprehensive memory checker
valgrind --leak-check=full ./myapp
# Reports: memory leaks, use-after-free, uninitialized reads, buffer overflows

# AddressSanitizer — faster, built into compiler (GCC/Clang)
gcc -g -fsanitize=address -fsanitize=undefined -o myapp myapp.c
./myapp  # Crashes immediately on any memory error with detailed report

# Valgrind output example:
# ==12345== Invalid write of size 4
# ==12345==    at 0x4005F0: main (myapp.c:13)
# ==12345==  Address 0x5204040 is 0 bytes after a block of size 40 alloc'd
# ==12345== LEAK SUMMARY: definitely lost: 4,096 bytes in 1 blocks

# Memory usage over time
/usr/bin/time -v ./myapp   # Peak memory usage
valgrind --tool=massif ./myapp  # Memory profiling (peak, over time)
ms_print massif.out.*      # Display massif results

# For Rust programs — use built-in AddressSanitizer
RUSTFLAGS="-Z sanitizer=address" cargo +nightly run
```


</TabItem>
<TabItem value="windows" label="Windows">

```powershell
# Application Verifier — Windows built-in memory checker
# Download: Windows SDK → AppVerif.exe
# Usage: GUI tool, enable "Heaps" checks, then run your app

# Dr. Memory — cross-platform variant of Valgrind
winget install DrMemory.DrMemory
drmemory.exe -- myapp.exe
# Reports leaks, use-after-free, uninitialized reads

# Visual Studio's built-in memory diagnostics
# Debug → Windows → Memory Usage
# Run with diagnostic → Take Snapshot → Compare snapshots

# LeakSanitizer (via MSVC with /fsanitize=address)
# In .vcxproj or CMakeLists.txt:
# add_compile_options(/fsanitize=address)
# Requires Visual Studio 2019 16.9+ and Windows SDK 10.0.22000+

# For Rust on Windows (nightly only with sanitizers):
# $env:RUSTFLAGS="-Z sanitizer=address"
# cargo +nightly test
```


</TabItem>
</Tabs>

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary">

- 📖 **[CS:APP (Computer Systems: A Programmer's Perspective) — Ch. 9 — Virtual Memory (FREE excerpts)](http://csapp.cs.cmu.edu/)** — The gold standard on how memory actually works
- 📖 **[The Rust Book — Ch. 4: Ownership (FREE)](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)** — Best explanation of Rust's ownership model


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📺 **[Low Level Learning — Manual Memory Management (YouTube, FREE)](https://www.youtube.com/@LowLevelLearning)** — Great visualizations of heap internals
- 📺 **[Jon Gjengset — Crust of Rust: Lifetime Annotations (YouTube, FREE)](https://www.youtube.com/c/JonGjengset)** — Rust lifetimes from first principles


</TabItem>
</Tabs>

---

## 🏗️ Assignments

### Assignment 1 — Leak Hunter (C)
Intentionally introduce and then find memory bugs:

- [ ] Write a C program that has: 1 memory leak, 1 use-after-free, 1 buffer overflow
- [ ] Run Valgrind (Linux) or Dr. Memory (Windows) and capture the output
- [ ] Fix each bug and verify the tool reports clean
- [ ] Write a comment above each original bug explaining what went wrong

---

### Assignment 2 — Implement a Memory Pool (C or Rust)
Pre-allocate a block of memory and manage sub-allocations yourself:

- [ ] Allocate a 1MB `char` buffer at startup
- [ ] Implement `pool_alloc(size) → *void` — returns pointer to next free block
- [ ] Implement `pool_reset()` — resets all allocations at once (free everything)
- [ ] Track: total allocated, number of allocations, peak usage
- [ ] Handle alignment (allocations should be 8-byte aligned)
- [ ] Write a benchmark comparing pool_alloc vs malloc for 100,000 small allocations

---

### Assignment 3 — GC Simulation (Python or TypeScript)
Implement a simple mark-and-sweep garbage collector:

- [ ] Objects have a list of references to other objects
- [ ] Roots are a fixed set of "live" objects
- [ ] Implement `mark()`: traverse from roots, mark all reachable
- [ ] Implement `sweep()`: collect all unmarked objects
- [ ] Implement reference counting as an alternative in the same codebase
- [ ] Demo circular reference failure in reference counting — then show cycle detector fix

---

## ✅ Milestone Checklist

- [ ] Can explain stack vs. heap with a diagram, including what happens on function call/return
- [ ] Can identify memory bugs in C code by inspection (leak, UAF, double-free, overflow)
- [ ] Can explain Rust's ownership rules and show why `let s2 = s1` invalidates `s1`
- [ ] Can run Valgrind (Linux) or Dr. Memory (Windows) on a C program and interpret output
- [ ] All 3 assignments committed to GitHub

---

## 🏆 Milestone Complete!

> **Memory is no longer magic.** You understand what's happening below `new`, `malloc`, and `let`.
> This makes you far better at debugging production crashes, writing performant code,
> and understanding why languages make the trade-offs they do.

**Log this in your kanban:** Move `foundations/memory_management` to ✅ Done.
