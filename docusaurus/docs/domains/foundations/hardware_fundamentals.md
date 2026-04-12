# Hardware Fundamentals

**Domain:** Foundations · **Time Estimate:** 1–2 weeks · **Relevant to:** Systems Programming, DevOps, Cloud, Performance

> **Prerequisites:** [OS Concepts](os_concepts.md) is recommended but you can read this independently.
>
> **Who needs this:** Systems programmers, DevOps engineers, anyone doing performance tuning, and anyone choosing cloud instance types. You don't need to build hardware — but knowing how it works explains *why* your software behaves the way it does.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain the CPU execution pipeline and why instruction order matters
- [ ] Describe the memory hierarchy (registers → L1 → L2 → L3 → RAM → disk)
- [ ] Explain what a cache line is and write cache-friendly code
- [ ] Describe what SIMD is and why it makes math fast
- [ ] Explain NUMA and why it matters for multi-socket servers
- [ ] Choose an appropriate cloud instance type based on workload characteristics
- [ ] Use OS tools to measure CPU, memory, and I/O performance

---

## 📖 Concepts

### 1. The CPU

A **CPU (Central Processing Unit)** executes instructions — one at a time per core, billions of times per second.

```
Anatomy of a modern CPU die:
┌─────────────────────────────────────────────┐
│  Core 0          Core 1          Core 2     │
│  ┌───────┐       ┌───────┐       ┌──────┐  │
│  │Fetch  │       │Fetch  │       │Fetch │  │
│  │Decode │       │Decode │       │Decode│  │
│  │Execute│       │Execute│       │Execut│  │
│  │  L1$  │       │  L1$  │       │  L1$ │  │
│  │  L2$  │       │  L2$  │       │  L2$ │  │
│  └───────┘       └───────┘       └──────┘  │
│              Shared L3 Cache                 │
│              Memory Controller               │
└─────────────────────────────────────────────┘
                    ↕
                   RAM
```

**Key terms:**

| Term | Meaning |
|------|---------|
| **Core** | An independent execution unit. 8-core CPU = 8 parallel instruction streams |
| **Thread (HW)** | Hyperthreading: 2 hardware threads share 1 core's execution units, improving utilization |
| **Clock speed** | GHz = billion cycles/second. Higher = faster single-threaded work |
| **IPC** | Instructions Per Cycle — architecture efficiency matters as much as clock speed |
| **TDP** | Thermal Design Power — max heat (watts) a CPU generates under load |

**Multi-core vs. single-threaded performance:**
- A 4GHz 4-core CPU can run 4 independent tasks at full speed, but a single-threaded task only uses 1 core
- Most programs are not fully parallelized — clock speed still matters for web servers, games, compilers

---

### 2. The Memory Hierarchy

Memory comes in layers. Faster = more expensive = smaller = closer to the CPU.

```
                    Size        Latency      Bandwidth
┌──────────────┐
│  Registers   │  ~1KB/core    ~0.3ns       Fastest
├──────────────┤
│  L1 Cache    │  32–64KB/core  ~1-4ns       ~TB/s
├──────────────┤
│  L2 Cache    │  256KB–4MB    ~4-12ns      ~hundreds GB/s
├──────────────┤
│  L3 Cache    │  8MB–64MB     ~30-40ns     ~hundreds GB/s
│  (shared)    │  (whole CPU)               
├──────────────┤
│  RAM (DRAM)  │  GBs          ~60-100ns    ~50-100 GB/s
├──────────────┤
│  NVMe SSD    │  TBs          ~50-100μs    ~5-7 GB/s
├──────────────┤
│  SATA SSD    │  TBs          ~100-200μs   ~500 MB/s
├──────────────┤
│  HDD         │  TBs          ~5-15ms      ~150 MB/s
└──────────────┘
```

**The key insight:** L1 cache is **~100x faster than RAM**. A program that fits its working data in cache can be orders of magnitude faster than one that constantly goes to RAM.

---

### 3. Cache Lines — The Most Practical Hardware Concept

Data is moved between cache levels in **cache lines** — fixed-size blocks (typically 64 bytes). When you read one byte, the CPU fetches the entire 64-byte line containing it.

**Why this matters for programmers:**

=== "Cache-Friendly (Fast)"
    ```
    // Reading array elements sequentially — same cache lines
    int sum = 0;
    for (int i = 0; i < 1000000; i++) {
        sum += arr[i];    // Each element is adjacent — prefetcher works great
    }
    // Access pattern: arr[0], arr[1], arr[2] — same cache line hit repeatedly
    ```

=== "Cache-Hostile (Slow)"
    ```
    // Reading a 2D array column-first in C (row-major storage)
    int sum = 0;
    for (int col = 0; col < 1000; col++) {
        for (int row = 0; row < 1000; row++) {
            sum += matrix[row][col];  // Jumping 1000 elements each time!
        }
    }
    // Each access is ~4KB apart — thrashes the cache
    // The row-first version of this loop can be 5-10x faster
    ```

=== "Struct Layout (Rust/C)"
    ```rust
    // Bad: interleaved fields, some rarely used
    struct Entity {
        id: u64,       // 8 bytes
        x: f32,        // 4 bytes — used every frame
        y: f32,        // 4 bytes — used every frame
        name: String,  // 24 bytes — rarely used
        active: bool,  // 1 byte — checked every frame
    }
    // When iterating 10,000 entities to update position,
    // you drag all the name data into cache unnecessarily.

    // Better: Data-Oriented Design — separate hot and cold data
    struct Positions { x: Vec<f32>, y: Vec<f32> }       // Hot — updated every frame
    struct Metadata  { names: Vec<String>, ... }         // Cold — rarely accessed
    ```

**Rule of thumb:** Process data sequentially, keep related hot data together, avoid pointer-chasing (linked lists in hot loops are cache killers).

---

### 4. Branch Prediction

Modern CPUs speculatively execute code along a predicted branch before they know which branch will be taken. A **misprediction** incurs a ~15-20 cycle penalty.

```
// This loop is predictable — CPU learns the pattern quickly
for i in 0..1000 {
    if i < 900 {       // Taken 900 times, not taken 100 — easy to predict
        do_work();
    }
}

// This is unpredictable — random data = 50% mispredict rate
for value in random_data {
    if value > 128 {   // Random — CPU can't predict it
        do_work();
    }
}
```

**Practical implication:** Sorting data before processing it can make code faster even though sorting has O(n log n) cost — a sorted array is more predictable for branches.

---

### 5. SIMD — Single Instruction Multiple Data

SIMD allows one CPU instruction to operate on **multiple values simultaneously**.

```
Normal (scalar):
  a[0] + b[0] → result[0]   (1 add instruction)
  a[1] + b[1] → result[1]   (1 add instruction)
  a[2] + b[2] → result[2]   (1 add instruction)
  a[3] + b[3] → result[3]   (1 add instruction)
  = 4 instructions for 4 additions

SIMD (AVX2 — 256-bit register):
  [a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7]] + [b[0]...b[7]]
  → [result[0]...result[7]]
  = 1 instruction for 8 additions (8x throughput!)
```

**SIMD instruction sets:** SSE2 (128-bit), AVX/AVX2 (256-bit), AVX-512 (512-bit) — each newer generation doubles width.

**You usually don't write SIMD directly.** Instead:
- Compilers auto-vectorize with `-O2`/`-O3` optimization flags when code is structured simply
- NumPy, BLAS, etc. use SIMD internally — this is why vectorized Python math is fast
- Rust's `std::simd` (nightly) and the `packed_simd` crate for explicit control

!!! tip "Research Question 🔍"
    What is the difference between Intel and AMD CPU architectures? Does the same software run the same speed on both? Look up "x86-64" — what does it mean that both are compatible?

---

### 6. NUMA — Non-Uniform Memory Access

In multi-socket servers (two physical CPUs on one motherboard), each CPU has memory directly attached to it. Accessing memory attached to the *other* CPU is slower.

```
Socket 0                    Socket 1
┌───────────┐    QPI/UPI    ┌───────────┐
│   CPU 0   │◄─────────────►│   CPU 1   │
│  cores    │               │  cores    │
├───────────┤               ├───────────┤
│  Memory 0 │               │  Memory 1 │
│  (local)  │               │  (local)  │
└───────────┘               └───────────┘

CPU 0 accessing Memory 0: ~60-100ns (local)
CPU 0 accessing Memory 1: ~120-200ns (remote — 2x slower)
```

**Why you care:** cloud VMs on large hosts, database servers, and HPC workloads can degrade severely if OS scheduling ignores NUMA. Tools like `numactl` (Linux) let you pin processes to specific NUMA nodes.

---

### 7. Storage: Latency Matters

```
Operation                      Time
──────────────────────────     ─────────────────────
L1 cache reference             0.5 ns
L2 cache reference             7 ns
RAM access                     100 ns
NVMe SSD random read           ~100 μs  (100,000 ns)
Network packet (same datacenter) ~500 μs
SATA SSD random read           ~150 μs
HDD seek + read                ~10 ms   (10,000,000 ns)
```

**Implication:** A database query that causes a single HDD seek is 20,000x slower than reading from RAM. This is why database buffer pools, Redis caches, and read replicas exist — keeping hot data in memory avoids disk I/O entirely.

---

### 8. Hardware and Cloud Instance Types

Cloud providers offer different instance families optimized for different workloads. Knowing the hardware helps you choose (and saves money).

**AWS instance families (same pattern on Azure/GCP):**

| Instance Family | Optimized For | Hardware Characteristic |
|----------------|--------------|------------------------|
| `t3`, `t4g` | Burstable general | CPU credits — bursty workloads only |
| `m7i`, `m7g` | Balanced (web servers) | Balanced CPU + RAM |
| `c7i`, `c7g` | Compute-intensive | High CPU-to-RAM ratio, fast CPUs |
| `r7i`, `r7g` | Memory-intensive | High RAM-to-CPU ratio (databases, in-memory caches) |
| `i3en`, `i4i` | Storage I/O | NVMe local disks, massive I/O throughput |
| `p3`, `p4`, `g5` | GPU workloads | NVIDIA GPUs for ML/rendering |
| `inf2`, `trn1` | ML inference/training | Custom ML silicon (Inferentia/Trainium) |

The `g` suffix (e.g., `m7g`) = **Graviton** (AWS's ARM-based CPU). Often 20-40% cheaper for the same performance on suitable workloads.

**Decision framework:**
```
What is my bottleneck?
├── Need more raw compute → c-series (CPU-optimized)
├── Running out of RAM → r-series (memory-optimized)
├── Database with lots of I/O → i-series (storage-optimized)
├── ML training/inference → GPU or dedicated ML instances
├── Inconsistent load (web apps) → t-series with auto-scaling
└── Steady predictable load → m-series (baseline)
```

**CPU credit trap:** `t3` instances "burst" above their baseline using CPU credits. If your workload is constantly busy, you'll exhaust credits and throttle to a fraction of the labeled CPU. Monitor `CPUCreditBalance` in CloudWatch.

---

### 9. Measuring Hardware Performance

=== "Linux"
    ```bash
    # CPU info
    lscpu                      # CPU topology, cores, threads, cache sizes
    cat /proc/cpuinfo          # Detailed per-core info
    nproc                      # Number of available processors

    # Real-time CPU usage
    top                        # Traditional — press 1 to show per-core
    htop                       # Better UI (install if not present)
    mpstat -P ALL 1            # Per-core stats every 1 second

    # Memory
    free -h                    # RAM usage (human readable)
    cat /proc/meminfo          # Detailed memory stats
    vmstat 1                   # Virtual memory stats per second

    # NUMA topology
    numactl --hardware         # NUMA nodes and distances
    lstopo                     # Visual CPU topology (from hwloc package)

    # Storage I/O
    iostat -x 1                # Per-device I/O stats
    iotop                      # Per-process I/O (like top for disk)
    hdparm -Tt /dev/nvme0n1   # Raw disk sequential speed test

    # CPU cache benchmarking
    lscpu | grep cache         # Cache sizes
    perf stat ./my_program     # Hardware performance counters
    perf stat -e cache-misses,cache-references ./my_program  # Cache miss rate
    ```

=== "Windows"
    ```powershell
    # CPU info
    Get-ComputerInfo -Property *processor*
    wmic cpu get Name,NumberOfCores,NumberOfLogicalProcessors /format:list
    (Get-CimInstance Win32_Processor).NumberOfCores

    # Real-time performance
    # Task Manager → Performance tab (GUI)
    # Resource Monitor → CPU/Memory/Disk tabs (GUI)
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

    # Memory
    Get-CimInstance Win32_PhysicalMemory | Select-Object Capacity,Speed,Manufacturer
    [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
    # Task Manager → Performance → Memory (shows cache, available, in use)

    # Storage
    winsat disk                # Windows built-in disk benchmark
    Get-PhysicalDisk | Select-Object FriendlyName,MediaType,BusType,Size
    # CrystalDiskMark (free GUI) for detailed I/O benchmarks

    # Performance counters (like Linux perf)
    typeperf "\Processor(_Total)\% Processor Time" -si 1  # CPU every 1 sec
    typeperf "\Memory\Available MBytes" -si 1
    typeperf "\PhysicalDisk(_Total)\Disk Read Bytes/sec" -si 1
    ```

---

## 📚 Resources

=== "Primary"
    - 📺 **[Computerphile — How CPUs Work (YouTube, FREE)](https://www.youtube.com/c/Computerphile)** — Approachable videos on CPU internals
    - 📖 **[What Every Programmer Should Know About Memory — Ulrich Drepper (FREE PDF)](https://people.freebsd.org/~lstewart/articles/cpumemory.pdf)** — The definitive guide. Dense but worth reading chapter by chapter.

=== "Cloud-Specific"
    - 📖 **[AWS Instance Types (FREE)](https://aws.amazon.com/ec2/instance-types/)** — Official reference with all specs
    - 📖 **[Cloud computing hardware - The Register (FREE)](https://www.theregister.com/data_centre/)** — Industry news about hardware in the cloud

=== "Tools"
    - 🔧 **[Geekbench (Free tier)](https://www.geekbench.com/)** — Cross-platform CPU/memory benchmarks
    - 🔧 **[hwloc / lstopo (FREE)](https://www.open-mpi.org/projects/hwloc/)** — Visualize CPU and NUMA topology

---

## 🏗️ Assignments

### Assignment 1 — Cache Line Experiment
Demonstrate the cache effect with measurement:

- [ ] Write two versions of a 2D array sum: row-major vs column-major access
- [ ] Time both versions for a 2000x2000 matrix (try `int` and `double`)
- [ ] Record results in a table: size, row-first time, col-first time, ratio
- [ ] Write a paragraph explaining *why* the results are different
- [ ] ⭐ Stretch: vary the matrix size and plot the crossover point where the matrix exceeds L3 cache

---

### Assignment 2 — Cloud Instance Chooser
Design an instance selection tool:

- [ ] Read a YAML config describing a workload: `type` (web/db/ml/batch), `cpu_intensive`, `memory_gb_needed`, `io_heavy`, `budget_per_month`
- [ ] Output a ranked recommendation of 3 AWS instance types with reasoning
- [ ] Hardcode a lookup table of common instances with their specs and on-demand pricing
- [ ] Justify each recommendation with specific hardware reasoning

---

## ✅ Milestone Checklist

- [ ] Can explain the memory hierarchy from registers to HDD without notes
- [ ] Can explain what a cache line is and write one example of cache-friendly vs cache-hostile code
- [ ] Can run `lscpu` (Linux) or Get-CimInstance (Windows) and explain the output
- [ ] Can choose between a c5, m5, and r5 AWS instance for a given workload with justification
- [ ] Assignment 1 completed with timing results showing measurable cache effect

---

## 🏆 Milestone Complete!

> **You now understand the machine under your code.**
>
> This knowledge makes you dangerous in performance conversations, cloud cost reviews,
> and architecture discussions. Most developers treat hardware as a black box — you don't.

**Log this in your kanban:** Move `foundations/hardware_fundamentals` to ✅ Done.
