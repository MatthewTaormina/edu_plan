# Concurrency

**Domain:** Foundations · **Time Estimate:** 2–3 weeks · **Relevant to:** All domains

> **Prerequisites:** [OS Concepts](os_concepts.md) — understand processes and threads first. [Memory Management](memory_management.md) helps with shared-memory hazards.
>
> **Who needs this:** Every developer. Web servers handle concurrent requests. GUIs use background threads. Databases manage concurrent transactions. Cloud functions scale horizontally. Concurrency is not advanced — it's everywhere.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain the difference between concurrency and parallelism
- [ ] Identify and reproduce a race condition
- [ ] Use mutexes and locks correctly without causing deadlocks
- [ ] Write async/await code in Python and TypeScript
- [ ] Explain the difference between threads, async I/O, and multiprocessing
- [ ] Choose the right concurrency model for a given problem
- [ ] Use channels/queues for safe inter-thread communication
- [ ] Apply Rust's concurrency guarantees ("fearless concurrency")

---

## 📖 Concepts

### 1. Concurrency vs. Parallelism

These are often used interchangeably but mean different things:

```
Concurrency: Dealing with multiple things AT ONCE (may interleave on 1 CPU)
Parallelism: Doing multiple things SIMULTANEOUSLY (requires multiple CPUs)

Concurrency (1 core, context switching):
Time:  ─────────────────────────────────────────►
Task A: ████░░░░████░░░░████░░░░
Task B: ░░░░████░░░░████░░░░████
       (only one runs at a time, but both make progress)

Parallelism (2 cores):
Core 0: ████████████████████████
Core 1: ████████████████████████
       (both run simultaneously — true parallel execution)
```

**Why concurrency without parallelism is useful:** A web server waiting for a database to respond isn't using the CPU — it can handle other requests in the meantime. This is **I/O-bound** concurrency.

**I/O-bound vs CPU-bound:**

| Type | Bottleneck | Best solution |
|------|-----------|---------------|
| I/O-bound | Waiting on disk, network, DB | Async I/O (one thread, many tasks) |
| CPU-bound | Computation itself | Parallel threads / multiprocessing |
| Mixed | Both | Thread pool + async I/O |

---

### 2. Race Conditions

A **race condition** occurs when multiple concurrent threads access shared data and the result depends on the order of execution.

```
Thread 1                    Thread 2
read counter → 0            read counter → 0
add 1         → 1           add 1         → 1
write 1                     write 1
                            ← expected: 2, actual: 1
```

This is a **race** — the increment is not atomic. The CPU instruction sequence for `counter++` is actually three instructions: LOAD, ADD, STORE. Two threads can interleave these.

=== "Python (demonstrating a race)"
    ```python
    import threading

    counter = 0

    def increment(n: int):
        global counter
        for _ in range(n):
            counter += 1   # NOT thread-safe: load, add, store

    threads = [threading.Thread(target=increment, args=(100_000,)) for _ in range(10)]
    for t in threads: t.start()
    for t in threads: t.join()

    print(counter)  # Should be 1,000,000 — but is often less!
    # e.g., 847,293 — different every run
    ```

=== "Rust (shows compile-time prevention)"
    ```rust
    use std::thread;

    fn main() {
        let counter = 0; // This even won't compile if shared across threads naively
        // Rust prevents this:
        // thread::spawn(move || { counter += 1; }); // ERROR: can't share &mut i32

        // Correct: use Arc<Mutex<T>>
        use std::sync::{Arc, Mutex};
        let counter = Arc::new(Mutex::new(0));
        let mut handles = vec![];

        for _ in 0..10 {
            let c = Arc::clone(&counter);
            handles.push(thread::spawn(move || {
                let mut num = c.lock().unwrap();
                *num += 100_000_i64; // simplified
            }));
        }
        for h in handles { h.join().unwrap(); }
        println!("{}", counter.lock().unwrap()); // Always exactly 1,000,000
    }
    ```

---

### 3. Mutexes and Locks

A **mutex** (mutual exclusion) ensures only one thread can access the protected data at a time.

```
Thread 1: lock() → ✓ acquired → access data → unlock()
Thread 2: lock() → ✗ blocked... waiting... → lock() → ✓ acquired → access data → unlock()
```

=== "Python"
    ```python
    import threading

    counter = 0
    lock = threading.Lock()

    def safe_increment(n: int):
        global counter
        for _ in range(n):
            with lock:          # Acquire lock; release when block exits (RAII)
                counter += 1   # Only one thread here at a time

    threads = [threading.Thread(target=safe_increment, args=(100_000,)) for _ in range(10)]
    for t in threads: t.start()
    for t in threads: t.join()
    print(counter)  # Always 1,000,000

    # RLock: reentrant lock (same thread can acquire multiple times)
    rlock = threading.RLock()

    # Condition: wait for a condition to be true
    condition = threading.Condition()
    with condition:
        condition.wait()           # Release lock and sleep until notified
        condition.notify_all()     # Wake all waiting threads
    ```

=== "TypeScript"
    ```typescript
    // JavaScript/TypeScript is single-threaded (per Worker) — no mutex needed in normal code
    // BUT: Workers can share memory, requiring atomics

    // SharedArrayBuffer + Atomics for true shared memory between Workers
    const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
    const counter = new Int32Array(sab);

    // In each worker:
    Atomics.add(counter, 0, 1);        // Atomic increment — thread-safe
    const val = Atomics.load(counter, 0);  // Atomic read

    // Atomics.wait / Atomics.notify implement mutex-like patterns
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics
    ```

=== "Rust"
    ```rust
    use std::sync::{Arc, Mutex, RwLock};
    use std::thread;

    // Mutex<T>: exclusive access
    let data = Arc::new(Mutex::new(vec![1, 2, 3]));
    let clone = Arc::clone(&data);
    thread::spawn(move || {
        let mut v = clone.lock().unwrap();  // Blocks until lock acquired
        v.push(4);
    });                                      // Lock released when guard drops

    // RwLock<T>: many readers OR one writer
    let rwlock = Arc::new(RwLock::new(0));
    let r = rwlock.read().unwrap();     // Multiple readers OK simultaneously
    drop(r);
    let mut w = rwlock.write().unwrap(); // Exclusive writer — waits for readers
    *w = 42;
    ```

---

### 4. Deadlocks

A **deadlock** occurs when two or more threads each wait for the other to release a lock — forever.

```
Thread 1 holds lock A, wants lock B → waiting...
Thread 2 holds lock B, wants lock A → waiting...

Both wait forever — the program hangs.
```

**Classic four conditions for deadlock (Coffee Tables rules):**
1. **Mutual exclusion** — resources can't be shared
2. **Hold and wait** — thread holds one resource while waiting for another
3. **No preemption** — OS can't forcibly take resources back
4. **Circular wait** — Thread 1 waits for Thread 2 waits for Thread 1

**Prevention strategies:**
- **Lock ordering** — always acquire locks in the same global order
- **Timeout** — use `try_lock()` with a timeout, retry or fail
- **Use a single lock** — simpler is better
- **Avoid nested locks** — design to never need two locks at once

```python
# DEADLOCK example
import threading
lock_a = threading.Lock()
lock_b = threading.Lock()

def thread1():
    lock_a.acquire()        # Gets A
    time.sleep(0.1)
    lock_b.acquire()        # Waits for B — which thread2 holds
    # ...

def thread2():
    lock_b.acquire()        # Gets B
    lock_a.acquire()        # Waits for A — which thread1 holds
    # ...
    # DEADLOCK!

# FIX: always acquire in same order
def thread1_fixed():
    with lock_a:
        with lock_b:        # Both threads always: lock_a first, then lock_b
            pass

def thread2_fixed():
    with lock_a:
        with lock_b:
            pass
```

---

### 5. Async / Await — Cooperative Multitasking

Instead of multiple threads, **async I/O** uses a single thread with an **event loop** that switches between tasks whenever one is waiting for I/O.

```
Single-threaded async (non-blocking I/O):

Event Loop:
  Task A: send request → await response...
          (suspended — give CPU to someone else)
  Task B: send request → await response...
          (suspended — give CPU to someone else)
  Task C: doing CPU work → running...
  ← Task A's response arrived! Resume Task A.
  ← Task B's response arrived! Resume Task B.

All three tasks interleave on ONE thread — no mutex needed
(there's only one thread, so no concurrent memory access)
```

=== "Python (asyncio)"
    ```python
    import asyncio
    import aiohttp   # pip install aiohttp

    async def fetch(session, url: str) -> str:
        async with session.get(url) as resp:
            return await resp.text()

    async def main():
        urls = [
            "https://httpbin.org/delay/1",
            "https://httpbin.org/delay/1",
            "https://httpbin.org/delay/1",
        ]
        async with aiohttp.ClientSession() as session:
            # All three requests run concurrently — total time ~1s, not 3s
            results = await asyncio.gather(*[fetch(session, url) for url in urls])
        print(f"Got {len(results)} responses")

    asyncio.run(main())

    # Async generator
    async def countdown(n: int):
        while n > 0:
            yield n
            await asyncio.sleep(1)
            n -= 1

    async def use_countdown():
        async for value in countdown(5):
            print(value)
    ```

=== "TypeScript"
    ```typescript
    // JS/TS async/await is built on Promises — always async-first
    async function fetchAll(urls: string[]): Promise<string[]> {
        // Sequential — waits for each before starting next (slow)
        const results = [];
        for (const url of urls) {
            const res = await fetch(url);
            results.push(await res.text());
        }
        return results;
    }

    // Concurrent — all start at the same time (fast)
    async function fetchAllConcurrent(urls: string[]): Promise<string[]> {
        const promises = urls.map(url => fetch(url).then(r => r.text()));
        return Promise.all(promises);  // Start all, wait for all to complete
    }

    // With timeout
    async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
        const timeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), ms));
        return Promise.race([fetch(url), timeout]);
    }

    // Error handling in concurrent tasks
    const results = await Promise.allSettled(urls.map(url => fetch(url)));
    for (const result of results) {
        if (result.status === 'fulfilled') console.log('OK', result.value.status);
        else console.error('FAILED', result.reason.message);
    }
    ```

=== "Rust (tokio)"
    ```rust
    // Add to Cargo.toml: tokio = { version = "1", features = ["full"] }
    use tokio;

    #[tokio::main]
    async fn main() {
        // spawn concurrent tasks
        let task1 = tokio::spawn(fetch("http://example.com/1"));
        let task2 = tokio::spawn(fetch("http://example.com/2"));
        let task3 = tokio::spawn(fetch("http://example.com/3"));

        // await all tasks concurrently
        let (r1, r2, r3) = tokio::join!(task1, task2, task3);
        println!("{:?} {:?} {:?}", r1, r2, r3);
    }

    async fn fetch(url: &str) -> String {
        // async HTTP with reqwest
        reqwest::get(url).await.unwrap().text().await.unwrap()
    }
    ```

---

### 6. Channels — Safe Message Passing

Instead of sharing memory, threads can **send messages** to each other via channels. This avoids mutexes entirely for many patterns.

```
Producer thread ──[channel]──► Consumer thread
                   message queue
```

=== "Python"
    ```python
    import threading, queue

    work_queue: queue.Queue = queue.Queue(maxsize=100)

    def producer():
        for i in range(50):
            work_queue.put(i)         # Blocks if queue is full
        work_queue.put(None)          # Sentinel: tell consumer we're done

    def consumer():
        while True:
            item = work_queue.get()   # Blocks until item available
            if item is None:
                break
            print(f"Processing {item}")
            work_queue.task_done()

    t_prod = threading.Thread(target=producer)
    t_cons = threading.Thread(target=consumer)
    t_prod.start(); t_cons.start()
    t_prod.join(); t_cons.join()
    ```

=== "TypeScript (Node.js worker_threads)"
    ```typescript
    import { Worker, parentPort, workerData, isMainThread, MessageChannel } from 'worker_threads';

    if (isMainThread) {
        const worker = new Worker(__filename, { workerData: { start: 0 } });
        worker.on('message', (result) => console.log('Result:', result));
        worker.postMessage({ type: 'work', payload: [1, 2, 3, 4, 5] });
    } else {
        parentPort!.on('message', ({ type, payload }) => {
            if (type === 'work') {
                const sum = payload.reduce((a: number, b: number) => a + b, 0);
                parentPort!.postMessage(sum);
            }
        });
    }
    ```

=== "Rust"
    ```rust
    use std::sync::mpsc;  // Multiple Producer, Single Consumer channel
    use std::thread;

    fn main() {
        let (tx, rx) = mpsc::channel();
        let tx2 = tx.clone();  // Clone sender for second producer

        // Producer 1
        thread::spawn(move || {
            for i in 0..10 { tx.send(i).unwrap(); }
        });

        // Producer 2
        thread::spawn(move || {
            for i in 100..110 { tx2.send(i).unwrap(); }
        });

        // Consumer (main thread)
        for value in rx {   // Iterates until all Senders are dropped
            println!("Received: {}", value);
        }
    }
    ```

---

### 7. Thread Pools

Creating a new thread for every task is expensive (~1MB stack, kernel overhead). A **thread pool** pre-creates a fixed number of threads that pick up work from a queue.

=== "Python"
    ```python
    from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
    import time

    # I/O-bound: ThreadPoolExecutor (threads share GIL but release it for I/O)
    with ThreadPoolExecutor(max_workers=10) as executor:
        urls = ["http://example.com"] * 20
        futures = [executor.submit(fetch_url, url) for url in urls]
        results = [f.result() for f in futures]

    # CPU-bound: ProcessPoolExecutor (bypasses GIL with separate processes)
    def compute(n):
        return sum(range(n))

    with ProcessPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(compute, [10**7] * 8))
        # Actually uses all 4 cores simultaneously

    # Also: asyncio.gather() for async I/O tasks (best for network I/O)
    ```

=== "TypeScript"
    ```typescript
    // In Node.js, worker_threads + a pool pattern
    // Recommended library: piscina (thread pool for Node.js)
    import Piscina from 'piscina';

    const pool = new Piscina({ filename: './worker.js', maxThreads: 4 });

    const results = await Promise.all([
        pool.run({ n: 1_000_000 }),
        pool.run({ n: 2_000_000 }),
        pool.run({ n: 3_000_000 }),
    ]);
    ```

=== "Rust"
    ```rust
    // rayon: data parallelism made easy
    // Cargo.toml: rayon = "1"
    use rayon::prelude::*;

    fn main() {
        let data: Vec<i64> = (1..=1_000_000).collect();

        // Parallel map + sum — automatically uses all CPU cores
        let sum: i64 = data.par_iter().map(|&x| x * x).sum();
        println!("Sum of squares: {}", sum);

        // Parallel sort
        let mut data = data.clone();
        data.par_sort();

        // tokio::task::spawn_blocking for CPU work in async context
        let handle = tokio::task::spawn_blocking(|| heavy_computation());
        let result = handle.await.unwrap();
    }
    ```

---

### 8. Choosing the Right Model

| Scenario | Best Model | Why |
|---------|-----------|-----|
| Web server handling many slow requests (DB, APIs) | Async I/O | Low overhead, many concurrent tasks |
| Download 100 files concurrently | Async I/O | Network is the bottleneck, not CPU |
| Image resizing 1000 images | Thread pool / multiprocessing | CPU-bound, needs real parallelism |
| Python CPU-intensive work | `ProcessPoolExecutor` | Python's GIL blocks threads for CPU work |
| Rust CPU-intensive work | `rayon` or `tokio::spawn_blocking` | No GIL — raw parallelism |
| Producer/consumer pipeline | Channels + thread pool | Natural fit for the pattern |
| Shared state with low contention | `Arc<Mutex<T>>` / `threading.Lock()` | Simple, correct |
| Shared state with high read ratio | `RwLock` | Allows many concurrent readers |
| Real-time system, no GC pauses | Rust or C++ | Deterministic timing |

!!! warning "Python's GIL"
    The **Global Interpreter Lock** means only one Python thread executes Python bytecode at a time. `ThreadPoolExecutor` helps for I/O-bound tasks (threads release GIL while waiting for I/O) but NOT for CPU-bound work. Use `ProcessPoolExecutor` or libraries like NumPy that release the GIL internally.

---

## 📚 Resources

=== "Primary"
    - 📖 **[The Rust Book — Ch. 16: Fearless Concurrency (FREE)](https://doc.rust-lang.org/book/ch16-00-concurrency.html)** — Best intro to thread-safe concurrency
    - 📺 **[Arjan Codes — Python asyncio (YouTube, FREE)](https://www.youtube.com/@ArjanCodes)** — Clear, modern Python async explanations

=== "Supplemental"
    - 📖 **[asyncio Docs (Python official)](https://docs.python.org/3/library/asyncio.html)** — Complete reference
    - 📖 **[MDN — Using Web Workers (FREE)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)** — JS concurrency in the browser context
    - 📺 **[Jon Gjengset — Tokio Deep Dive (YouTube, FREE)](https://www.youtube.com/c/JonGjengset)** — Rust async runtime internals

---

## 🏗️ Assignments

### Assignment 1 — Race Condition Lab
Demonstrate and fix a race condition:

- [ ] Write a program with 10 threads all incrementing a shared counter 100,000 times
- [ ] Run it 5 times and record the output — prove it's non-deterministic
- [ ] Add a mutex — prove the result is now always exactly 1,000,000
- [ ] Add a `RwLock` alternative — benchmark: does it improve read-heavy workloads?
- [ ] Write a deadlock example and verify it hangs — then fix it

---

### Assignment 2 — Async Web Scraper
**Language:** Python (asyncio) or TypeScript

Build a concurrent link checker:

- [ ] Accept a list of URLs (file or CLI args)
- [ ] Check all URLs concurrently (limit: max 20 at once — use a semaphore)
- [ ] For each: record status code, response time, redirects
- [ ] Print a summary: total, OK (2xx), redirect (3xx), broken (4xx/5xx), timeout
- [ ] Set a 10-second timeout per URL
- [ ] Write total wall-clock time — compare to sequential version

---

### Assignment 3 — Work Queue Pipeline
**Language:** Your choice

Implement a producer-consumer pipeline with three stages:

```
[File Reader] → [Processor Queue] → [Transformer] → [Output Queue] → [Writer]
  (producer)                          (workers x4)                   (consumer)
```

- [ ] File reader reads lines from a large file and puts them on queue
- [ ] 4 worker threads each take a line, do a CPU-heavy operation (e.g. compute hash, encrypt)
- [ ] Writer thread takes results and writes to output file
- [ ] Track: throughput (lines/sec), queue depth over time, worker utilization
- [ ] Graceful shutdown: workers finish current tasks before stopping

---

## ✅ Milestone Checklist

- [ ] Can explain concurrency vs parallelism with a concrete example
- [ ] Can write a race condition and explain why it happens at the instruction level
- [ ] Can fix a race condition using a mutex in your primary language
- [ ] Can write async/await code that runs multiple I/O tasks concurrently
- [ ] Know when to use threads vs async vs multiprocessing for a given problem
- [ ] Can explain why Python's GIL matters and how to work around it
- [ ] All 3 assignments committed to GitHub

---

## 🏆 Milestone Complete!

> **Concurrency is now in your toolkit.**
>
> You can make slow programs fast (parallelize CPU work), handle many users at once
> (async I/O), and do it safely (without races or deadlocks). This unlocks web server
> design, distributed systems, and systems programming at a professional level.

**Log this in your kanban:** Move `foundations/concurrency` to ✅ Done.

## ➡️ Next Steps

The Foundations domain is now complete. Choose your path:
- → [🟢 Beginner Path](../../paths/beginner.md) — continue the guided sequence
- → [Linux CLI](../devops/linux_cli.md) — essential for any server work
- → [Git Workflow](../devops/git_workflow.md) — version control for every project
