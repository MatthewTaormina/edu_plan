import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Complexity Analysis

**Section:** Algorithms â€º Complexity Â· **Prerequisite:** [Data Structures](../data_structures.mdx)

> **Who needs this:** Anyone writing code that has to scale. Complexity analysis is the vocabulary engineers use to talk about performance â€” you can't have a meaningful conversation about algorithms without it.

---

## ðŸŽ¯ Learning Objectives

- [ ] Read and write Big-O notation for any function or loop
- [ ] Explain the difference between O(1), O(log n), O(n), O(n log n), and O(nÂ²)
- [ ] Apply the four rules for calculating Big-O (drop constants, drop non-dominant terms, addition, multiplication)
- [ ] Distinguish between best, average, and worst case
- [ ] Understand the difference between time complexity and space complexity
- [ ] Reason about amortized cost for operations like dynamic array append

---

## ðŸ“– Concepts

### 1. What Is Big-O?

**Big-O notation** describes how the runtime (or memory usage) of an algorithm *scales* as the input grows. It answers: **"If I double the input size, what happens to the time?"**

It's not about measuring exact milliseconds â€” it's about the *shape* of growth.

```
n = input size

O(1)        Constant     â€” doesn't matter how big n is, same time
O(log n)    Logarithmic  â€” doubles input â†’ 1 more step (binary search)
O(n)        Linear       â€” doubles input â†’ doubles time (one loop)
O(n log n)  Linearithmic â€” typical good sorting (merge sort, quicksort)
O(nÂ²)       Quadratic    â€” doubles input â†’ quadruples time (nested loops)
O(2â¿)       Exponential  â€” avoid at all costs (naive recursive fibonacci)
O(n!)       Factorial    â€” only for tiny n (brute-force permutations)
```

**Visualizing growth:**

| n (input) | O(1) | O(log n) | O(n) | O(n log n) | O(nÂ²) |
|-----------|------|----------|------|------------|-------|
| 10 | 1 | 3 | 10 | 33 | 100 |
| 100 | 1 | 7 | 100 | 664 | 10,000 |
| 1,000 | 1 | 10 | 1,000 | 10,000 | 1,000,000 |
| 1,000,000 | 1 | 20 | 1M | 20M | **1 trillion** |

At n=1,000,000 â€” an O(nÂ²) algorithm takes **1 trillion operations**. At 1 billion ops/second that's ~16 minutes. An O(n log n) algorithm takes 20M operations â€” 20 milliseconds.

---

### 2. Calculating Big-O

**Four rules â€” apply in order:**

```
// Rule 1: Drop constants
// O(2n) â†’ O(n)    â† constants don't matter for growth shape
// O(500) â†’ O(1)

// Rule 2: Drop non-dominant terms
// O(nÂ² + n) â†’ O(nÂ²)    â† nÂ² dominates as n grows
// O(n + log n) â†’ O(n)

// Rule 3: Addition â€” sequential steps add
FUNCTION example(n):
    FOR i FROM 0 TO n:        // O(n)
        DO_SOMETHING()
    FOR j FROM 0 TO n:        // O(n)
        DO_SOMETHING_ELSE()
// Total: O(n) + O(n) = O(2n) â†’ O(n)

// Rule 4: Multiplication â€” nested steps multiply
FUNCTION example(n):
    FOR i FROM 0 TO n:        // O(n)
        FOR j FROM 0 TO n:    // O(n)
            DO_SOMETHING()    //   â†‘ this inner loop runs n times for EACH outer i
// Total: O(n Ã— n) = O(nÂ²)

// Rule 5: Halving the problem â†’ O(log n)
WHILE n > 1 DO
    n â† n / 2    // Each step halves the problem
// If n=1000: 1000â†’500â†’250â†’125â†’... â‰ˆ 10 steps â†’ O(log n)
```

**Common patterns to recognize:**

| Pattern | Complexity |
|---------|-----------|
| Single loop over n | O(n) |
| Two nested loops over n | O(nÂ²) |
| Loop that halves n each iteration | O(log n) |
| Loop over n, inner loop halves | O(n log n) |
| Recursive call on each half | O(log n) |
| Recursive call on all-but-one | O(n) |
| Two recursive calls | O(2â¿) often |
| Hash table lookup | O(1) average |

---

### 3. Best, Average, and Worst Case

Big-O is typically used for **worst case** â€” which gives you a guarantee.

| Case | Meaning | Notation |
|------|---------|---------|
| **Best case** | The luckiest possible input (e.g., target is the first element) | Big-Î© (Omega) |
| **Average case** | Expected cost over all possible inputs | Big-Î˜ (Theta) |
| **Worst case** | The most costly possible input (target is last, or absent) | Big-O |

:::tip Research Question ðŸ”
Look up "Quicksort worst case." When does it degrade from O(n log n) to O(nÂ²)? How does random pivot selection or median-of-three fix this?
:::

---

### 4. Space Complexity

Big-O also applies to **memory**. Every variable, data structure, or recursive call stack frame consumes space.

```
// O(1) space â€” only a few variables, no extra structures
FUNCTION sum(arr):
    total â† 0
    FOR each x IN arr:
        total â† total + x
    RETURN total

// O(n) space â€” creates a copy of the input
FUNCTION double_all(arr):
    result â† NEW Array of size length(arr)
    FOR i FROM 0 TO length(arr) - 1:
        result[i] â† arr[i] * 2
    RETURN result

// O(n) space (call stack) â€” each recursive call adds a frame
FUNCTION factorial(n):
    IF n == 0 THEN RETURN 1
    RETURN n * factorial(n - 1)
// n=1000 â†’ 1000 stack frames until base case
```

:::note Space vs Time Tradeoff
These often trade off. A hash table uses O(n) space to give you O(1) lookups instead of O(n) search. Memoization uses O(n) space to turn O(2â¿) recursion into O(n) time. This is one of the most common design decisions in algorithm engineering.
:::

---

### 5. Amortized Analysis

Some operations are *occasionally* expensive but *cheap on average* across many calls.

**Example: dynamic array append**

```
// A dynamic array (Python list, JS Array, Rust Vec) doubles in size when full.

// 90% of the time: append is O(1) â€” just write to the next slot
// 10% of the time: append triggers a resize â†’ O(n) copy

// But amortized across n appends, each element is copied at most once per doubling.
// Total work: O(n). Average per-append: O(1).

// This is why Python list.append() is described as O(1) amortized â€”
// even though individual appends can be O(n).
```

:::tip
You don't need to prove amortized bounds mathematically to use them well. The key insight: **a rare expensive operation can be "paid for" by many cheap ones.** Stack push/pop, hash table insert (without collision explosion), and array append are all O(1) amortized.
:::

---

## ðŸ“š Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- ðŸ“º **[CS50x Week 3 â€” Algorithms (FREE)](https://cs50.harvard.edu/x/)** â€” Big-O with visual demonstrations
- ðŸ“º **[Abdul Bari â€” Time Complexity (YouTube, FREE)](https://www.youtube.com/watch?v=9TlHvipP5yA)** â€” Clear derivation of common complexities

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- ðŸ“– **[Big-O Cheat Sheet (bigocheatsheet.com)](https://www.bigocheatsheet.com/)** â€” Quick visual for common algorithm and data structure costs
- ðŸ“º **[NeetCode â€” Big-O Notation (YouTube, FREE)](https://www.youtube.com/watch?v=BgLTDT03QtU)** â€” Short, practical intro

</TabItem>
<TabItem value="practice" label="Practice">

- ðŸŽ® **[LeetCode â€” Time Complexity tag (FREE)](https://leetcode.com/problemset/)** â€” Filter problems by complexity
- ðŸ“„ **[Explain complexity of your code (pen and paper)](#)** â€” Practice on any loop-containing function you write this week

</TabItem>
</Tabs>
