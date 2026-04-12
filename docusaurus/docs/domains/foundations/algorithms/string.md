import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# String Algorithms

**Section:** Algorithms › String Algorithms · **Prerequisite:** [Backtracking](./backtracking.md)

> **Who needs this:** Text processing, search engines, DNA sequence analysis, spell checkers, diff tools (git diff), and any system that compares or searches strings. Naive string matching is a common performance bottleneck that KMP or hashing eliminates.

---

## 🎯 Learning Objectives

- [ ] Implement naive pattern matching and explain its O(n×m) cost
- [ ] Understand how KMP avoids redundant comparisons using the failure function
- [ ] Understand rolling hash and how Rabin-Karp achieves O(n+m) average
- [ ] Implement edit distance (Levenshtein) with DP
- [ ] Apply the right string algorithm to a given problem

---

## 📖 Concepts

### 1. Naive Pattern Matching — O(n × m)

The brute-force approach: for every position in the text, try to match the full pattern.

```
Text:    "AABAACAADAABAABA"  (n=16)
Pattern: "AABA"              (m=4)

Position 0: AABA == AABA ✓ (match!)
Position 1: ABAA != AABA (mismatch at index 2)
Position 2: BAAC != AABA (mismatch at index 0)
...
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION naive_search(text: String, pattern: String) -> List<Int>
    n ← length(text)
    m ← length(pattern)
    matches ← []

    FOR i FROM 0 TO n - m DO
        j ← 0
        WHILE j < m AND text[i + j] == pattern[j] DO
            j ← j + 1
        END WHILE
        IF j == m THEN
            APPEND i TO matches    // Full match found at position i
        END IF
    END FOR

    RETURN matches
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def naive_search(text: str, pattern: str) -> list[int]:
    n, m = len(text), len(pattern)
    matches = []
    for i in range(n - m + 1):
        if text[i:i+m] == pattern:
            matches.append(i)
    return matches

# Python's built-in str.find() and 'in' operator use optimized C
# implementations — always prefer those in production.
text = "AABAACAADAABAABA"
print("AABA" in text)             # True
print(text.find("AABA"))          # 0 (first occurrence)

# For all occurrences:
import re
positions = [m.start() for m in re.finditer("AABA", text)]
print(positions)  # [0, 9, 12]
```

</TabItem>
</Tabs>

**Worst case:** Pattern is "AAAB" and text is "AAAA...A". Every position tries m-1 characters before failing. O(n × m) total — for n=10,000 and m=1,000 that's 10 million comparisons.

---

### 2. KMP Algorithm — O(n + m)

**Knuth-Morris-Pratt** avoids re-examining characters already matched. When a mismatch occurs, it uses a precomputed **failure function** (also called LPS — Longest Proper Prefix which is also Suffix) to skip ahead without losing progress.

**Core insight:** If we've matched `pattern[0..j-1]` but `text[i] != pattern[j]`, we don't need to start over. The failure function tells us the longest prefix of `pattern[0..j-1]` that is also its suffix — we can restart matching from there.

```
Pattern: "AABAAB"
         A A B A A B
LPS:   [ 0 1 0 1 2 3 ]

LPS[5]=3 means: after matching 6 chars and hitting a mismatch,
jump back to pattern[3] (not pattern[0]) — we already know "AAB" at the end
matches "AAB" at the start.
```

<Tabs>
<Tabtml value="pseudo" label="Pseudocode">

```pseudocode
// Build failure function (LPS array)
FUNCTION build_lps(pattern: String) -> List<Int>
    m   ← length(pattern)
    lps ← array of m zeros
    len ← 0    // Length of previous longest prefix-suffix
    i   ← 1

    WHILE i < m DO
        IF pattern[i] == pattern[len] THEN
            len     ← len + 1
            lps[i]  ← len
            i       ← i + 1
        ELSE
            IF len != 0 THEN
                len ← lps[len - 1]    // Use previous LPS value
            ELSE
                lps[i] ← 0
                i ← i + 1
            END IF
        END IF
    END WHILE

    RETURN lps
END FUNCTION

// KMP search
FUNCTION kmp_search(text: String, pattern: String) -> List<Int>
    n   ← length(text)
    m   ← length(pattern)
    lps ← build_lps(pattern)
    matches ← []
    i ← 0    // text index
    j ← 0    // pattern index

    WHILE i < n DO
        IF text[i] == pattern[j] THEN
            i ← i + 1
            j ← j + 1
        END IF

        IF j == m THEN
            APPEND (i - j) TO matches
            j ← lps[j - 1]    // Continue searching for overlapping matches
        ELSE IF i < n AND text[i] != pattern[j] THEN
            IF j != 0 THEN
                j ← lps[j - 1]    // Skip — don't reset to 0!
            ELSE
                i ← i + 1
            END IF
        END IF
    END WHILE

    RETURN matches
END FUNCTION
```

</Tabtml>
<TabItem value="python" label="Python">

```python
def build_lps(pattern: str) -> list[int]:
    m = len(pattern)
    lps = [0] * m
    length = 0
    i = 1

    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1

    return lps

def kmp_search(text: str, pattern: str) -> list[int]:
    n, m = len(text), len(pattern)
    lps = build_lps(pattern)
    matches = []
    i = j = 0

    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
        if j == m:
            matches.append(i - j)
            j = lps[j - 1]
        elif i < n and text[i] != pattern[j]:
            if j:
                j = lps[j - 1]
            else:
                i += 1

    return matches

text = "AABAACAADAABAABA"
pattern = "AABA"
print(kmp_search(text, pattern))  # [0, 9, 12]
print(build_lps(pattern))         # [0, 1, 0, 1]
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function buildLps(pattern: string): number[] {
    const m = pattern.length;
    const lps = new Array(m).fill(0);
    let length = 0, i = 1;

    while (i < m) {
        if (pattern[i] === pattern[length]) {
            lps[i++] = ++length;
        } else if (length) {
            length = lps[length - 1];
        } else {
            lps[i++] = 0;
        }
    }
    return lps;
}

function kmpSearch(text: string, pattern: string): number[] {
    const n = text.length, m = pattern.length;
    const lps = buildLps(pattern);
    const matches: number[] = [];
    let i = 0, j = 0;

    while (i < n) {
        if (text[i] === pattern[j]) { i++; j++; }
        if (j === m) { matches.push(i - j); j = lps[j - 1]; }
        else if (i < n && text[i] !== pattern[j]) {
            j ? (j = lps[j - 1]) : i++;
        }
    }
    return matches;
}
```

</TabItem>
</Tabs>

**When to use KMP:** When you need guaranteed linear-time pattern matching — DNA sequence search, log file scanning, any application doing many pattern searches on large texts.

---

### 3. Rabin-Karp — O(n + m) Average

Rabin-Karp uses a **rolling hash** to compare pattern and text windows efficiently. Instead of comparing character-by-character for every position, it computes a hash of each window and only does a full string comparison on hash matches.

```
pattern = "AABA"   hash(pattern) = 3
text    = "AABAACAADAABAABA"

Window 0: "AABA" → hash=3 → matches! → full compare → match ✓
Window 1: "ABAA" → hash=2 → no match, skip
Window 2: "BAAC" → hash=1 → no match, skip
...

Rolling hash: when the window slides right by 1:
  new_hash = (old_hash - value_of_leftmost_char) * base + value_of_new_char
  → O(1) per slide
```

<Tabs>
<TabItem value="python" label="Python">

```python
def rabin_karp(text: str, pattern: str) -> list[int]:
    n, m = len(text), len(pattern)
    BASE  = 256           # Number of characters (ASCII)
    MOD   = 101           # Prime modulus (reduces hash collisions)
    h_val = pow(BASE, m - 1, MOD)  # BASE^(m-1) mod MOD

    p_hash = 0  # Pattern hash
    t_hash = 0  # Current window hash
    matches = []

    # Initial hash
    for i in range(m):
        p_hash = (BASE * p_hash + ord(pattern[i])) % MOD
        t_hash = (BASE * t_hash + ord(text[i])) % MOD

    for i in range(n - m + 1):
        if p_hash == t_hash:
            if text[i:i+m] == pattern:  # Full compare on hash match
                matches.append(i)

        if i < n - m:
            # Roll the hash: remove leftmost, add rightmost
            t_hash = (BASE * (t_hash - ord(text[i]) * h_val) + ord(text[i + m])) % MOD
            if t_hash < 0:
                t_hash += MOD

    return matches

print(rabin_karp("AABAACAADAABAABA", "AABA"))  # [0, 9, 12]
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function rabinKarp(text: string, pattern: string): number[] {
    const n = text.length, m = pattern.length;
    const BASE = 256, MOD = 101;
    const hVal = Array.from({length: m - 1}).reduce((acc) => (acc * BASE) % MOD, 1);

    let pHash = 0, tHash = 0;
    const matches: number[] = [];

    for (let i = 0; i < m; i++) {
        pHash = (BASE * pHash + pattern.charCodeAt(i)) % MOD;
        tHash = (BASE * tHash + text.charCodeAt(i)) % MOD;
    }

    for (let i = 0; i <= n - m; i++) {
        if (pHash === tHash && text.slice(i, i + m) === pattern) matches.push(i);
        if (i < n - m) {
            tHash = (BASE * (tHash - text.charCodeAt(i) * hVal) + text.charCodeAt(i + m)) % MOD;
            if (tHash < 0) tHash += MOD;
        }
    }
    return matches;
}
```

</TabItem>
</Tabs>

**When to use Rabin-Karp:** Multi-pattern search (same text, many patterns — compute one rolling hash, compare against all pattern hashes). Plagiarism detection. Document fingerprinting. Substring duplicate detection (with a rolling hash over substrings).

---

### 4. Edit Distance (Levenshtein) — O(n × m)

**Problem:** Given two strings, find the minimum number of single-character edits (insertions, deletions, substitutions) needed to transform one into the other.

```
"kitten" → "sitting"  (edit distance = 3)

kitten → sitten  (substitute k→s)
sitten → sittin  (substitute e→i)
sittin → sitting (insert g)
```

This is a classic DP problem. `dp[i][j]` = edit distance between `s1[0..i]` and `s2[0..j]`.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION edit_distance(s1: String, s2: String) -> Int
    m ← length(s1)
    n ← length(s2)
    dp ← (m+1) × (n+1) table

    // Base cases: transforming empty string
    FOR i FROM 0 TO m DO: dp[i][0] ← i   // Delete all i chars
    FOR j FROM 0 TO n DO: dp[0][j] ← j   // Insert all j chars

    FOR i FROM 1 TO m DO
        FOR j FROM 1 TO n DO
            IF s1[i-1] == s2[j-1] THEN
                dp[i][j] ← dp[i-1][j-1]          // No edit needed
            ELSE
                dp[i][j] ← 1 + MIN(
                    dp[i-1][j],    // Delete from s1
                    dp[i][j-1],    // Insert into s1
                    dp[i-1][j-1]   // Substitute
                )
            END IF
        END FOR
    END FOR

    RETURN dp[m][n]
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def edit_distance(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = list(range(n + 1))  # Space-optimized: only keep 2 rows

    for i in range(1, m + 1):
        prev = dp[:]
        dp[0] = i
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[j] = prev[j-1]
            else:
                dp[j] = 1 + min(prev[j], dp[j-1], prev[j-1])

    return dp[n]

print(edit_distance("kitten", "sitting"))  # → 3
print(edit_distance("sunday", "saturday")) # → 3

# Python's difflib uses an LCS-based approach — similar concept
import difflib
print(difflib.SequenceMatcher(None, "kitten", "sitting").ratio())
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function editDistance(s1: string, s2: string): number {
    const m = s1.length, n = s2.length;
    let dp = Array.from({length: n + 1}, (_, i) => i);

    for (let i = 1; i <= m; i++) {
        const prev = [...dp];
        dp[0] = i;
        for (let j = 1; j <= n; j++) {
            dp[j] = s1[i-1] === s2[j-1]
                ? prev[j-1]
                : 1 + Math.min(prev[j], dp[j-1], prev[j-1]);
        }
    }
    return dp[n];
}
```

</TabItem>
</Tabs>

**Real-world uses:** Spell checking (find closest word), DNA alignment, fuzzy search, git diff, autocorrect.

---

### 5. Algorithm Selection Guide

| Scenario | Algorithm | Complexity |
|----------|-----------|-----------|
| One-off search in small text | Naive / built-in `find` | O(n×m) — fine for small n,m |
| Repeated pattern search in large text | KMP | O(n+m) |
| Multi-pattern search in large text | Rabin-Karp | O(n+m) avg |
| Approx matching / similarity | Edit distance | O(n×m) |
| String similarity ratio | LCS / difflib | O(n×m) |
| Text suffix queries | Suffix Array / Suffix Tree | O(n log n) build — not covered here |

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- 📺 **[KMP Algorithm — Back to Back SWE (YouTube, FREE)](https://www.youtube.com/watch?v=BXCEFAzhxji)** — Best explanation of the failure function with animation
- 📺 **[Edit Distance — NeetCode (YouTube, FREE)](https://www.youtube.com/watch?v=XYi2-LPrwm4)** — Step-by-step DP table construction

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📺 **[Rabin-Karp — Abdul Bari (YouTube, FREE)](https://www.youtube.com/watch?v=qQ8vS2btsxI)** — Rolling hash explained with examples
- 📺 **[MIT 6.006 — String Matching (YouTube, FREE)](https://www.youtube.com/watch?v=NinWEPPrkDQ)** — Academic foundation for KMP and Rabin-Karp

</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[LeetCode #28 — Find the Index of the First Occurrence (FREE)](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)** — Implement KMP or naive
- 🎮 **[LeetCode #72 — Edit Distance (FREE)](https://leetcode.com/problems/edit-distance/)** — Classic DP on strings
- 🎮 **[LeetCode #1143 — Longest Common Subsequence (FREE)](https://leetcode.com/problems/longest-common-subsequence/)** — Related DP (also in Recursion page)
- 🎮 **[LeetCode #459 — Repeated Substring Pattern (FREE)](https://leetcode.com/problems/repeated-substring-pattern/)** — KMP failure function application

</TabItem>
</Tabs>

---

## ✅ Section Complete

You've worked through all nine algorithm categories. Return to the [Algorithms Overview](./index.md) to review the full complexity cheat sheet.

**Log this in your kanban:** Move `foundations/algorithms` to ✅ Done.

→ [Memory Management](../memory_management.md)
