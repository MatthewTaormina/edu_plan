import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Recursion & Dynamic Programming

**Section:** Algorithms › Recursion · **Prerequisite:** [Sorting Algorithms](./sorting.md)

> **Who needs this:** Anyone solving problems with repeated substructure — tree traversal, graph search, combinatorics, optimization. DP is one of the most tested topics in technical interviews and one of the most powerful in production systems.

---

## 🎯 Learning Objectives

- [ ] Write recursive functions with correct base cases and recursive cases
- [ ] Recognize when naive recursion has overlapping subproblems (O(2ⁿ) → fixable)
- [ ] Apply memoization (top-down DP) to a recursive solution
- [ ] Implement tabulation (bottom-up DP) for the same problem
- [ ] Solve the 0/1 knapsack problem with DP
- [ ] Find the longest common subsequence with DP

---

## 📖 Concepts

### 1. Recursion

A function is **recursive** when it calls itself. Every recursive solution needs:

1. **Base case** — terminates the recursion (no more calls)
2. **Recursive case** — calls itself with a *strictly smaller* problem

```
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

// Classic recursion: fibonacci (naive — watch for exponential blowup)
FUNCTION fibonacci(n: Int) -> Int
    IF n <= 1 THEN RETURN n          // Base cases: fib(0)=0, fib(1)=1
    RETURN fibonacci(n - 1) + fibonacci(n - 2)
END FUNCTION
// WARNING: naive fibonacci is O(2^n) — see DP section for the fix.

// Recursion: sum of a list
FUNCTION sum_list(arr: List<Int>, index: Int = 0) -> Int
    IF index == length(arr) THEN RETURN 0    // Base case: past the end
    RETURN arr[index] + sum_list(arr, index + 1)
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
import sys
sys.setrecursionlimit(10000)  # Python default limit is 1000

def factorial(n: int) -> int:
    if n == 0:
        return 1
    return n * factorial(n - 1)

def fibonacci_naive(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)
# fibonacci_naive(40) is noticeably slow — O(2^n)
# fibonacci_naive(100) would take longer than the universe's age
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function factorial(n: number): number {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

function fibonacciNaive(n: number): number {
    if (n <= 1) return n;
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}
// fibonacciNaive(45) takes seconds. fibonacciNaive(60) hangs.
```

</TabItem>
</Tabs>

:::warning Stack Overflow
Every recursive call adds a frame to the **call stack**. Recurse too deeply without hitting a base case and you get a stack overflow. Python crashes around depth 1000; JS around 10,000–15,000. Iterative solutions use O(1) stack space and avoid this entirely.
:::

---

### 2. Why Naive Fibonacci Is Slow

Naive fibonacci computes the same values over and over:

```
fib(5)
├── fib(4)
│   ├── fib(3)       ← computed AGAIN below
│   │   ├── fib(2)
│   │   └── fib(1)
│   └── fib(2)       ← computed AGAIN
└── fib(3)           ← duplicate of fib(3) above
    ├── fib(2)       ← computed yet again
    └── fib(1)
```

`fib(3)` alone is computed twice. `fib(2)` is computed three times. As n grows, the duplication explodes exponentially. **This is the overlapping subproblems pattern — the trigger for dynamic programming.**

---

### 3. Dynamic Programming — Memoization (Top-Down)

**Memoization:** solve recursively, but cache each result the first time you compute it. On repeat calls, return the cached value instantly.

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
```

</TabItem>
<TabItem value="python" label="Python">

```python
from functools import lru_cache

# Option 1: Python's built-in decorator handles caching automatically
@lru_cache(maxsize=None)
def fib_memo(n: int) -> int:
    if n <= 1:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)
# fib_memo(1000) is now instant — O(n) time, O(n) space

# Option 2: Manual cache dict
def fib_memo_manual(n: int, cache: dict = {}) -> int:
    if n <= 1:
        return n
    if n in cache:
        return cache[n]
    cache[n] = fib_memo_manual(n - 1, cache) + fib_memo_manual(n - 2, cache)
    return cache[n]
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function fibMemo(n: number, cache: Map<number, number> = new Map()): number {
    if (n <= 1) return n;
    if (cache.has(n)) return cache.get(n)!;
    const result = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);
    cache.set(n, result);
    return result;
}
// fibMemo(1000) completes instantly
```

</TabItem>
</Tabs>

---

### 4. Dynamic Programming — Tabulation (Bottom-Up)

**Tabulation:** fill a table iteratively from the smallest subproblems up to the answer. No recursion — no stack overflow risk.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
// Tabulation: bottom-up DP
FUNCTION fib_tab(n: Int) -> Int
    IF n <= 1 THEN RETURN n

    table ← array of size n+1, all zeros
    table[1] ← 1

    FOR i FROM 2 TO n DO
        table[i] ← table[i-1] + table[i-2]
    END FOR

    RETURN table[n]
END FUNCTION

// Space-optimized: only keep last 2 values — O(1) space
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
def fib_tab(n: int) -> int:
    if n <= 1:
        return n
    table = [0] * (n + 1)
    table[1] = 1
    for i in range(2, n + 1):
        table[i] = table[i-1] + table[i-2]
    return table[n]

# Space-optimized — O(1) space, O(n) time
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
function fib(n: number): number {
    if (n <= 1) return n;
    let [prev, curr] = [0, 1];
    for (let i = 2; i <= n; i++) [prev, curr] = [curr, prev + curr];
    return curr;
}
```

</TabItem>
</Tabs>

---

### 5. DP Pattern: 0/1 Knapsack

**Problem:** Given n items each with a weight and value, and a bag with capacity W, choose items to maximize total value without exceeding W. You can take each item at most once (0 = skip, 1 = take).

```
Items: [(weight=2, value=3), (weight=3, value=4), (weight=4, value=5)]
Capacity: 5

Best choice: item 0 (w=2, v=3) + item 1 (w=3, v=4) = weight 5, value 7
```

**DP table approach:** `dp[i][w]` = max value using first `i` items with capacity `w`.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION knapsack(weights: List<Int>, values: List<Int>, capacity: Int) -> Int
    n ← length(weights)
    dp ← 2D array of size (n+1) × (capacity+1), all zeros

    FOR i FROM 1 TO n DO
        FOR w FROM 0 TO capacity DO
            // Option 1: skip item i
            dp[i][w] ← dp[i-1][w]

            // Option 2: take item i (only if it fits)
            IF weights[i-1] <= w THEN
                WITH_ITEM ← values[i-1] + dp[i-1][w - weights[i-1]]
                dp[i][w] ← max(dp[i][w], WITH_ITEM)
            END IF
        END FOR
    END FOR

    RETURN dp[n][capacity]
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i-1][w]  # Skip item i
            if weights[i-1] <= w:
                with_item = values[i-1] + dp[i-1][w - weights[i-1]]
                dp[i][w] = max(dp[i][w], with_item)

    return dp[n][capacity]

items_w = [2, 3, 4]
items_v = [3, 4, 5]
print(knapsack(items_w, items_v, 5))  # → 7
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function knapsack(weights: number[], values: number[], capacity: number): number {
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i-1][w];
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(dp[i][w], values[i-1] + dp[i-1][w - weights[i-1]]);
            }
        }
    }
    return dp[n][capacity];
}
```

</TabItem>
</Tabs>

---

### 6. DP Pattern: Longest Common Subsequence (LCS)

**Problem:** Given two strings, find the length of their longest common subsequence (not necessarily contiguous).

```
s1 = "ABCBDAB"
s2 = "BDCAB"
LCS = "BCAB" or "BDAB" — length 4
```

`dp[i][j]` = LCS length of `s1[0..i]` and `s2[0..j]`.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION lcs(s1: String, s2: String) -> Int
    m ← length(s1)
    n ← length(s2)
    dp ← 2D array (m+1) × (n+1), all zeros

    FOR i FROM 1 TO m DO
        FOR j FROM 1 TO n DO
            IF s1[i-1] == s2[j-1] THEN
                dp[i][j] ← dp[i-1][j-1] + 1    // Characters match
            ELSE
                dp[i][j] ← max(dp[i-1][j], dp[i][j-1])  // Take better of skip-left or skip-up
            END IF
        END FOR
    END FOR

    RETURN dp[m][n]
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def lcs(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]

print(lcs("ABCBDAB", "BDCAB"))  # → 4
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function lcs(s1: string, s2: string): number {
    const m = s1.length, n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = s1[i-1] === s2[j-1]
                ? dp[i-1][j-1] + 1
                : Math.max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}
```

</TabItem>
</Tabs>

:::tip Research Question 🔍
The **0/1 Knapsack** and **LCS** are two of the "template" DP patterns. Most DP problems are variations of one of ~6 patterns. Search "DP patterns NeetCode" to see the full taxonomy — recognizing the pattern is 80% of solving any DP problem.
:::

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- 📺 **[NeetCode — Dynamic Programming playlist (YouTube, FREE)](https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf)** — Best practical intro to DP patterns
- 📺 **[CS50x Week 3 (FREE)](https://cs50.harvard.edu/x/)** — Covers recursion visually with call stacks

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📺 **[Abdul Bari — Dynamic Programming (YouTube, FREE)](https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O)** — Deep, methodical DP derivations
- 📺 **[MIT 6.006 — DP (YouTube, FREE)](https://www.youtube.com/watch?v=OQ5jsbhAv_M)** — Rigorous academic treatment

</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[LeetCode #70 — Climbing Stairs (FREE)](https://leetcode.com/problems/climbing-stairs/)** — Classic DP intro (fibonacci variant)
- 🎮 **[LeetCode #322 — Coin Change (FREE)](https://leetcode.com/problems/coin-change/)** — Classic bottom-up DP
- 🎮 **[LeetCode #1143 — Longest Common Subsequence (FREE)](https://leetcode.com/problems/longest-common-subsequence/)** — Apply the LCS template
- 🎮 **[LeetCode #416 — Partition Equal Subset Sum (FREE)](https://leetcode.com/problems/partition-equal-subset-sum/)** — Knapsack variant

</TabItem>
</Tabs>

---

## ➡️ Next

→ [Graph Traversal](./graph.md)
