import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Algorithms

**Domain:** Foundations · **Time Estimate:** 3–4 weeks · **Language:** Language-agnostic concepts; tabbed examples

> **Prerequisites:** [Data Structures](data_structures.mdx) — you must understand arrays, linked lists, and hash tables before algorithmic analysis makes sense.
>
> **Who needs this:** Everyone. Algorithms are the "how" behind every program that needs to be fast. Even if you never implement a sort yourself, understanding complexity lets you pick the right tool.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Read and write Big-O notation for any function or loop
- [ ] Explain the difference between O(1), O(log n), O(n), O(n log n), and O(n²)
- [ ] Implement linear search and binary search from scratch
- [ ] Implement bubble sort, merge sort, and quicksort
- [ ] Write recursive functions and convert them to iterative when needed
- [ ] Solve problems using dynamic programming (memoization and tabulation)
- [ ] Choose the right algorithm based on input size and constraints

---

## 📖 Concepts

### 1. Big-O Notation

**Big-O notation** describes how the runtime (or memory usage) of an algorithm *scales* as the input grows. It answers: **"If I double the input size, what happens to the time?"**

It's not about measuring exact milliseconds — it's about the *shape* of growth.

```
n = input size

O(1)        Constant   — doesn't matter how big n is, same time
O(log n)    Logarithmic — doubles input → 1 more step (binary search)
O(n)        Linear     — doubles input → doubles time (one loop)
O(n log n)  Linearithmic — typical good sorting (merge sort, quicksort)
O(n²)       Quadratic  — doubles input → quadruples time (nested loops)
O(2ⁿ)       Exponential — avoid at all costs (recursive fibonacci naive)
O(n!)       Factorial  — only for tiny n (brute-force permutations)
```

**Visualizing growth:**

| n (input) | O(1) | O(log n) | O(n) | O(n log n) | O(n²) |
|-----------|------|----------|------|------------|-------|
| 10 | 1 | 3 | 10 | 33 | 100 |
| 100 | 1 | 7 | 100 | 664 | 10,000 |
| 1,000 | 1 | 10 | 1,000 | 10,000 | 1,000,000 |
| 1,000,000 | 1 | 20 | 1M | 20M | **1 trillion** |

At n=1,000,000 — an O(n²) algorithm would take **1 trillion operations**. At 1 billion operations/second that's 16 minutes. An O(n log n) algorithm takes 20M operations — 20 milliseconds.

---

**How to calculate Big-O:**

```
// Rule 1: Drop constants
// O(2n) → O(n)    ← constants don't matter for growth shape
// O(500) → O(1)

// Rule 2: Drop non-dominant terms
// O(n² + n) → O(n²)    ← n² dominates as n grows
// O(n + log n) → O(n)

// Rule 3: Addition — sequential steps add
FUNCTION example(n):
    FOR i FROM 0 TO n:        // O(n)
        DO_SOMETHING()
    FOR j FROM 0 TO n:        // O(n)
        DO_SOMETHING_ELSE()
// Total: O(n) + O(n) = O(2n) → O(n)

// Rule 4: Multiplication — nested steps multiply
FUNCTION example(n):
    FOR i FROM 0 TO n:        // O(n)
        FOR j FROM 0 TO n:    // O(n)
            DO_SOMETHING()    //   ↑ this inner loop runs n times for EACH outer i
// Total: O(n × n) = O(n²)

// Rule 5: Halving the problem → O(log n)
WHILE n > 1 DO
    n ← n / 2    // Each step halves the problem
// If n=1000: 1000→500→250→125→... ≈ 10 steps → O(log n)
```

**Common Big-O patterns to recognize:**

| Pattern | Complexity |
|---------|-----------|
| Single loop over n | O(n) |
| Two nested loops over n | O(n²) |
| Loop that halves n each iteration | O(log n) |
| Loop over n, inner loop halves | O(n log n) |
| Recursive call on each half | O(log n) |
| Recursive call on all-but-one | O(n) |
| Two recursive calls | O(2ⁿ) often |
| Hash table lookup | O(1) average |

:::tip Research Question 🔍
What is the difference between **best case**, **worst case**, and **average case** complexity? Why do we usually care about worst case? Look up "Quicksort worst case" — when does it degrade from O(n log n) to O(n²)?
:::


:::note Space Complexity
Big-O also applies to **memory**. An algorithm that creates a copy of the input is O(n) space. One that sorts in-place might be O(1) space (no extra memory). Always consider both time and space.
:::


---

### 2. Linear Search

The simplest search: check every element until you find the target. Works on **unsorted** data. O(n) time.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION linear_search(collection: List<T>, target: T) -> Int
    // Returns index of target, or -1 if not found
    FOR i FROM 0 TO length(collection) - 1 DO
        IF collection[i] == target THEN
            RETURN i
        END IF
    END FOR
    RETURN -1
END FUNCTION
```


</TabItem>
<TabItem value="python" label="Python">

```python
def linear_search(collection: list, target) -> int:
    for i, item in enumerate(collection):
        if item == target:
            return i
    return -1

# Python's built-in 'in' operator uses linear search on lists
# and O(1) on sets/dicts
nums = [3, 7, 1, 9, 4]
print(linear_search(nums, 9))  # → 3
print(9 in nums)               # → True (same cost, cleaner)
```


</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function linearSearch<T>(collection: T[], target: T): number {
    for (let i = 0; i < collection.length; i++) {
        if (collection[i] === target) return i;
    }
    return -1;
}

// Built-in equivalents
const nums = [3, 7, 1, 9, 4];
nums.indexOf(9);            // → 3
nums.findIndex(x => x > 8);// → 3 (first element > 8)
```


</TabItem>
<TabItem value="rust" label="Rust">

```rust
fn linear_search<T: PartialEq>(collection: &[T], target: &T) -> Option<usize> {
    for (i, item) in collection.iter().enumerate() {
        if item == target {
            return Some(i);
        }
    }
    None
}

// Built-in equivalents
let nums = vec![3, 7, 1, 9, 4];
nums.iter().position(|&x| x == 9);  // → Some(3)
nums.contains(&9);                   // → true
```


</TabItem>
</Tabs>

---

### 3. Binary Search

Binary search works on **sorted** data. Each step eliminates **half** the remaining candidates. O(log n) time.

```
Find 7 in: [1, 3, 5, 7, 9, 11, 13]
                        ↑
             mid = index 3 → value 7 → FOUND!

Find 11 in: [1, 3, 5, 7, 9, 11, 13]
                        ↑
             mid = index 3 → value 7 < 11 → search RIGHT half
             [9, 11, 13]
              ↑
             mid = index 1 → value 11 → FOUND!
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION binary_search(sorted_list: List<T>, target: T) -> Int
    left ← 0
    right ← length(sorted_list) - 1

    WHILE left <= right DO
        mid ← left + (right - left) / 2   // Avoids integer overflow

        IF sorted_list[mid] == target THEN
            RETURN mid                     // Found!
        ELSE IF sorted_list[mid] < target THEN
            left ← mid + 1                // Target is in right half
        ELSE
            right ← mid - 1              // Target is in left half
        END IF
    END WHILE

    RETURN -1    // Not found
END FUNCTION
```


</TabItem>
<TabItem value="python" label="Python">

```python
def binary_search(sorted_list: list, target) -> int:
    left, right = 0, len(sorted_list) - 1

    while left <= right:
        mid = left + (right - left) // 2
        if sorted_list[mid] == target:
            return mid
        elif sorted_list[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Python's built-in bisect module does this efficiently
import bisect
nums = [1, 3, 5, 7, 9, 11, 13]
idx = bisect.bisect_left(nums, 7)   # → 3
print(nums[idx] == 7)               # → True (found)
```


</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function binarySearch(sortedList: number[], target: number): number {
    let left = 0, right = sortedList.length - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        if (sortedList[mid] === target) return mid;
        else if (sortedList[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```


</TabItem>
<TabItem value="rust" label="Rust">

```rust
fn binary_search<T: Ord>(sorted_list: &[T], target: &T) -> Option<usize> {
    let mut left = 0;
    let mut right = sorted_list.len();

    while left < right {
        let mid = left + (right - left) / 2;
        match sorted_list[mid].cmp(target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => left = mid + 1,
            std::cmp::Ordering::Greater => right = mid,
        }
    }
    None
}

// Built-in: Vec and slices have binary_search()
let nums = vec![1, 3, 5, 7, 9, 11, 13];
nums.binary_search(&7);  // → Ok(3)
```


</TabItem>
</Tabs>

:::warning Common Mistake
Using `mid = (left + right) / 2` can cause **integer overflow** in languages with fixed-size integers (C, Rust, Java) when left and right are large numbers. Always use `left + (right - left) / 2`.
:::


---

### 4. Sorting Algorithms

Sorting is one of the most studied problems in CS. Understanding *why* different sorts work differently builds intuition for algorithm design.

#### Bubble Sort — O(n²)

The simplest sort. Repeatedly swap adjacent elements that are out of order. Each pass "bubbles" the largest unsorted element to its correct position.

```
Pass 1: [5, 3, 8, 1, 9, 2] → [3, 5, 1, 8, 2, 9]
Pass 2: [3, 5, 1, 8, 2, 9] → [3, 1, 5, 2, 8, 9]
...
```

Use bubble sort to **understand** sorting. Never use it in production on large inputs.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION bubble_sort(arr: List<Int>) -> Void
    n ← length(arr)
    FOR i FROM 0 TO n - 2 DO
        swapped ← FALSE
        FOR j FROM 0 TO n - i - 2 DO
            IF arr[j] > arr[j + 1] THEN
                swap(arr[j], arr[j + 1])
                swapped ← TRUE
            END IF
        END FOR
        IF NOT swapped THEN BREAK    // Already sorted — early exit
    END FOR
END FUNCTION
```


</TabItem>
<TabItem value="python" label="Python">

```python
def bubble_sort(arr: list) -> list:
    arr = arr.copy()  # Don't mutate original
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break  # Already sorted
    return arr

# Never use bubble_sort in production — use sorted() or list.sort()
# Python's sort uses Timsort: O(n log n)
nums = [5, 3, 8, 1, 9, 2]
print(sorted(nums))       # → [1, 2, 3, 5, 8, 9]
```


</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function bubbleSort(arr: number[]): number[] {
    const a = [...arr];
    for (let i = 0; i < a.length - 1; i++) {
        let swapped = false;
        for (let j = 0; j < a.length - i - 1; j++) {
            if (a[j] > a[j + 1]) {
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return a;
}

// Production: use Array.sort() with a comparator
[5, 3, 8, 1].sort((a, b) => a - b);  // → [1, 3, 5, 8]
```


</TabItem>
</Tabs>

---

#### Merge Sort — O(n log n)

Divide and conquer: split the array in half, sort each half recursively, merge the sorted halves. Guaranteed O(n log n) always — no bad cases.

```
[5, 3, 8, 1, 9, 2, 7, 4]
→ split: [5, 3, 8, 1]  [9, 2, 7, 4]
→ split: [5, 3] [8, 1]  [9, 2] [7, 4]
→ split: [5][3] [8][1]  [9][2] [7][4]
→ merge: [3,5] [1,8]    [2,9] [4,7]
→ merge: [1,3,5,8]      [2,4,7,9]
→ merge: [1,2,3,4,5,7,8,9]
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION merge_sort(arr: List<T>) -> List<T>
    IF length(arr) <= 1 THEN
        RETURN arr    // Base case: already sorted
    END IF

    mid ← length(arr) / 2
    left  ← merge_sort(arr[0..mid])
    right ← merge_sort(arr[mid..end])

    RETURN merge(left, right)
END FUNCTION

FUNCTION merge(left: List<T>, right: List<T>) -> List<T>
    result ← NEW List<T>
    i ← 0
    j ← 0

    WHILE i < length(left) AND j < length(right) DO
        IF left[i] <= right[j] THEN
            append(result, left[i])
            i ← i + 1
        ELSE
            append(result, right[j])
            j ← j + 1
        END IF
    END WHILE

    // Append any remaining elements
    WHILE i < length(left) DO
        append(result, left[i])
        i ← i + 1
    END WHILE
    WHILE j < length(right) DO
        append(result, right[j])
        j ← j + 1
    END WHILE

    RETURN result
END FUNCTION
```


</TabItem>
<TabItem value="python" label="Python">

```python
def merge_sort(arr: list) -> list:
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left: list, right: list) -> list:
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```


</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        result.push(left[i] <= right[j] ? left[i++] : right[j++]);
    }
    return [...result, ...left.slice(i), ...right.slice(j)];
}
```


</TabItem>
</Tabs>

---

#### Quicksort — O(n log n) average, O(n²) worst

Pick a **pivot**, partition: everything smaller goes left, everything larger goes right. Recurse on each partition. In practice faster than merge sort due to cache efficiency — but has a bad worst case if the pivot is always the smallest/largest.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION quicksort(arr: List<T>, low: Int, high: Int) -> Void
    IF low < high THEN
        pivot_idx ← partition(arr, low, high)
        quicksort(arr, low, pivot_idx - 1)
        quicksort(arr, pivot_idx + 1, high)
    END IF
END FUNCTION

FUNCTION partition(arr: List<T>, low: Int, high: Int) -> Int
    pivot ← arr[high]    // Choose last element as pivot
    i ← low - 1          // Index of smaller element

    FOR j FROM low TO high - 1 DO
        IF arr[j] <= pivot THEN
            i ← i + 1
            swap(arr[i], arr[j])
        END IF
    END FOR

    swap(arr[i + 1], arr[high])    // Place pivot in correct position
    RETURN i + 1
END FUNCTION
```


</TabItem>
<TabItem value="python" label="Python">

```python
def quicksort(arr: list, low: int = 0, high: int = None) -> list:
    if high is None:
        arr = arr.copy()
        high = len(arr) - 1
    if low < high:
        pivot_idx = partition(arr, low, high)
        quicksort(arr, low, pivot_idx - 1)
        quicksort(arr, pivot_idx + 1, high)
    return arr

def partition(arr: list, low: int, high: int) -> int:
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```


</TabItem>
</Tabs>

---

### 5. Recursion

A function is **recursive** when it calls itself. Every recursive solution has:
1. **Base case** — the termination condition (no more recursion)
2. **Recursive case** — calls itself with a smaller problem

```
factorial(n):
  base case:    n == 0 → return 1
  recursive:    n > 0  → return n * factorial(n-1)

factorial(4):
  4 * factorial(3)
    3 * factorial(2)
      2 * factorial(1)
        1 * factorial(0)
          → 1   (base case)
        → 1 * 1 = 1
      → 2 * 1 = 2
    → 3 * 2 = 6
  → 4 * 6 = 24
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
// Classic recursion: factorial
FUNCTION factorial(n: Int) -> Int
    IF n == 0 THEN RETURN 1          // Base case
    RETURN n * factorial(n - 1)      // Recursive case
END FUNCTION

// Classic recursion: fibonacci
FUNCTION fibonacci(n: Int) -> Int
    IF n <= 1 THEN RETURN n          // Base cases: fib(0)=0, fib(1)=1
    RETURN fibonacci(n - 1) + fibonacci(n - 2)
END FUNCTION
// WARNING: naive fibonacci is O(2^n) — exponential!
// See Dynamic Programming section for the O(n) solution.

// Recursion: sum of a list
FUNCTION sum_list(arr: List<Int>, index: Int = 0) -> Int
    IF index == length(arr) THEN RETURN 0    // Base case: empty
    RETURN arr[index] + sum_list(arr, index + 1)
END FUNCTION
```


</TabItem>
<TabItem value="python" label="Python">

```python
import sys
sys.setrecursionlimit(10000)  # Python's default limit is 1000

def factorial(n: int) -> int:
    if n == 0:
        return 1
    return n * factorial(n - 1)

def fibonacci_naive(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)
# fibonacci_naive(40) is noticeably slow — O(2^n)

# Tail-call equivalent using accumulator pattern
def factorial_iter(n: int, acc: int = 1) -> int:
    if n == 0:
        return acc
    return factorial_iter(n - 1, acc * n)
```


</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function factorial(n: number): number {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```


</TabItem>
</Tabs>

:::warning Stack Overflow
Deep recursion uses the **call stack** — each call adds a frame. If you recurse too deeply without hitting a base case, you get a Stack Overflow. Most languages have a recursion depth limit (Python: ~1000, JS: ~10,000). Iterative solutions avoid this.
:::


---

### 6. Dynamic Programming

**Dynamic programming (DP)** solves problems by breaking them into overlapping subproblems and storing the results so you never compute the same thing twice.

The naive fibonacci computes `fib(3)` many times:
```
fib(5)
├── fib(4)
│   ├── fib(3)      ← computed again
│   │   ├── fib(2)
│   │   └── fib(1)
│   └── fib(2)      ← computed again
└── fib(3)          ← computed again
    ├── fib(2)      ← computed again
    └── fib(1)
```

DP fixes this: compute each value once and store it.

**Two approaches:**

**Memoization (top-down):** Recurse normally, cache results.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
// Memoization: top-down DP
FUNCTION fib_memo(n: Int, cache: Map<Int, Int> = {}) -> Int
    IF n <= 1 THEN RETURN n
    IF n IN cache THEN RETURN cache[n]    // Already computed!

    result ← fib_memo(n - 1, cache) + fib_memo(n - 2, cache)
    cache[n] ← result
    RETURN result
END FUNCTION

// Tabulation: bottom-up DP
FUNCTION fib_tab(n: Int) -> Int
    IF n <= 1 THEN RETURN n

    table ← array of size n+1, filled with 0
    table[1] ← 1

    FOR i FROM 2 TO n DO
        table[i] ← table[i-1] + table[i-2]
    END FOR

    RETURN table[n]
END FUNCTION

// Space-optimized: only keep last 2 values
FUNCTION fib_optimal(n: Int) -> Int
    IF n <= 1 THEN RETURN n
    prev, curr ← 0, 1
    FOR i FROM 2 TO n DO
        prev, curr ← curr, prev + curr
    END FOR
    RETURN curr
END FUNCTION
```


</TabItem>
<TabItem value="python" label="Python">

```python
from functools import lru_cache

# Memoization with Python's built-in cache decorator
@lru_cache(maxsize=None)
def fib_memo(n: int) -> int:
    if n <= 1:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)
# fib_memo(1000) works instantly now — O(n)

# Tabulation: bottom-up
def fib_tab(n: int) -> int:
    if n <= 1:
        return n
    table = [0] * (n + 1)
    table[1] = 1
    for i in range(2, n + 1):
        table[i] = table[i-1] + table[i-2]
    return table[n]

# Space-optimized — O(1) space
def fib(n: int) -> int:
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr
```


</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// Memoization
function fibMemo(n: number, cache: Map<number, number> = new Map()): number {
    if (n <= 1) return n;
    if (cache.has(n)) return cache.get(n)!;
    const result = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);
    cache.set(n, result);
    return result;
}

// Space-optimized tabulation
function fib(n: number): number {
    if (n <= 1) return n;
    let [prev, curr] = [0, 1];
    for (let i = 2; i <= n; i++) [prev, curr] = [curr, prev + curr];
    return curr;
}
```


</TabItem>
</Tabs>

:::tip Research Question 🔍
What is the **0/1 Knapsack problem**? It's the canonical DP problem. Can you solve it? (Search "knapsack problem dynamic programming" and try to implement it before looking at the solution.)
:::


---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- 📺 **[CS50x Week 3 — Algorithms (FREE)](https://cs50.harvard.edu/x/)** — Search, sort, and Big-O with visual demos
- 📺 **[Abdul Bari — Algorithms Playlist (YouTube, FREE)](https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O)** — Deep dives with clear Big-O derivations


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📺 **[NeetCode — Dynamic Programming playlist (YouTube, FREE)](https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf)** — Best intro to DP patterns
- 📖 **[Visualgo — Sorting (FREE)](https://visualgo.net/en/sorting)** — Watch sorts animate in real time


</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[LeetCode — Easy + Medium (FREE)](https://leetcode.com/problemset/)** — Filter: Arrays, Sorting, Dynamic Programming
- 🎮 **[Advent of Code (FREE)](https://adventofcode.com/)** — Annual puzzle set, great for algorithm practice in any language


</TabItem>
</Tabs>

---

## 🏗️ Assignments

### Assignment 1 — Sort & Search Visualizer
**Combines:** Sorting, searching, Big-O measurement, file I/O

Build a CLI tool that:
- [ ] Generates random arrays of size N (accept N as argument)
- [ ] Runs bubble sort, merge sort, and quicksort on the data
- [ ] **Times** each sort and prints the result
- [ ] Runs linear search and binary search (on sorted result) for a target
- [ ] Writes a report to a CSV: `n, bubble_ms, merge_ms, quick_ms, linear_us, binary_us`
- [ ] Run it for N = 100, 1000, 10000, 100000 and observe how times scale

```
$ python sort_bench.py --n 10000
Sorting 10,000 elements...
  Bubble sort:  4821.3ms
  Merge sort:     8.2ms
  Quicksort:      5.9ms

Searching for 7234...
  Linear search:  0.9ms (idx 7233)
  Binary search:  0.001ms (idx 7233)

Report written to sort_report.csv
```

---

### Assignment 2 — Climbing Stairs (DP Classic)
**Language:** Your choice

Given n stairs, you can climb 1 or 2 steps at a time. How many distinct ways can you reach the top?

- [ ] Solve it recursively first (observe it's slow for n > 35)
- [ ] Add memoization (observe it's now instant for n = 1000)
- [ ] Implement the bottom-up tabulation version
- [ ] Implement the O(1) space version
- [ ] Explain why this is essentially the Fibonacci sequence

⭐ **Stretch:** Extend to allow 1, 2, or 3 steps. How does the DP table change?

---

### Assignment 3 — Anagram Detector (Hashing + Sorting)
**Combines:** Sorting, hash maps, Big-O analysis, multi-approach comparison

Write a function that checks if two strings are anagrams (same letters, different order):

- [ ] Approach 1: Sort both strings, compare — O(n log n)
- [ ] Approach 2: Count character frequencies with a hash map — O(n)
- [ ] Write **both** and benchmark them on strings of length 100, 10000, 1,000,000
- [ ] Write a comment in the code explaining which is better and why

⭐ **Stretch:** Find all groups of anagrams in a list of words (classic interview problem).

---

## ✅ Milestone Checklist

- [ ] Can calculate Big-O for any function with loops (without help)
- [ ] Can explain why binary search is O(log n) using the halving argument
- [ ] Can implement merge sort from memory
- [ ] Can identify when a recursive solution has overlapping subproblems
- [ ] Can solve the Fibonacci problem in O(n) time and O(1) space
- [ ] All 3 assignments committed to GitHub with timing results in the README

---

## 🏆 Milestone Complete!

> **You now understand why fast code is fast and slow code is slow.**
>
> Every technical interview tests algorithms and complexity. More importantly,
> these tools let you make informed decisions in real systems — when to optimize,
> and when O(n²) is perfectly fine.

**Log this in your kanban:** Move `foundations/algorithms` to ✅ Done.

---

## ➡️ Next Unit

→ [Memory Management](memory_management.md)
