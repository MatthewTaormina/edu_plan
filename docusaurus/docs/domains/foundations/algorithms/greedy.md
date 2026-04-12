import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Greedy Algorithms

**Section:** Algorithms › Greedy · **Prerequisite:** [Pathfinding](./pathfinding.md)

> **Who needs this:** Anyone who needs to make a sequence of decisions where a locally optimal choice leads to a globally optimal solution. Greedy algorithms appear in compression (Huffman), scheduling, networking (minimum spanning trees), and many interview problems.

---

## 🎯 Learning Objectives

- [ ] State what makes an algorithm "greedy" and when greedy works
- [ ] Solve the activity selection problem with a greedy approach
- [ ] Explain when greedy fails for coin change and when it succeeds
- [ ] Understand Huffman encoding at a conceptual level
- [ ] Distinguish greedy from dynamic programming

---

## 📖 Concepts

### 1. The Greedy Paradigm

A **greedy algorithm** makes the **locally optimal choice at each step** without reconsidering past decisions, hoping to reach a globally optimal solution.

```
Greedy property requirements:
1. Greedy choice property — a locally optimal choice leads to a global optimum
2. Optimal substructure — optimal solution contains optimal solutions to subproblems

If BOTH hold → greedy works and is faster than DP.
If ONLY optimal substructure → use DP (greedy would fail).
```

**Key question:** "If I always take the best-looking option right now, am I guaranteed to be optimal overall?" Sometimes yes, sometimes no.

---

### 2. Activity Selection Problem

**Problem:** Given n activities with start and end times, select the maximum number of non-overlapping activities.

```
Activities (start, end):
  A: (1, 4)
  B: (3, 5)
  C: (0, 6)
  D: (5, 7)
  E: (3, 9)
  F: (6, 10)
  G: (8, 11)

Greedy strategy: always pick the activity that finishes earliest.
1. Sort by end time: A(4), B(5), C(6), D(7), E(9), F(10), G(11)
2. Pick A (ends first)
3. Pick D (starts after A ends: 5 ≥ 4) ✓
4. Pick G (starts after D ends: 8 ≥ 7) ✓

Result: {A, D, G} — 3 activities (maximum possible)
```

**Why "earliest finish" works:** An activity that finishes earliest leaves the most remaining time for future activities. Any other selection can only do worse or equal.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION activity_selection(activities: List<(start, end)>) -> List<(start, end)>
    // Sort by end time
    sorted ← SORT activities BY end time ascending

    selected ← [sorted[0]]       // Always take the first (earliest finish)
    last_end ← sorted[0].end

    FOR i FROM 1 TO length(sorted) - 1 DO
        IF sorted[i].start >= last_end THEN    // No overlap
            APPEND sorted[i] TO selected
            last_end ← sorted[i].end
        END IF
    END FOR

    RETURN selected
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def activity_selection(activities: list[tuple]) -> list[tuple]:
    """activities: list of (start, end) tuples"""
    sorted_acts = sorted(activities, key=lambda x: x[1])  # Sort by end time

    selected = [sorted_acts[0]]
    last_end = sorted_acts[0][1]

    for start, end in sorted_acts[1:]:
        if start >= last_end:
            selected.append((start, end))
            last_end = end

    return selected

activities = [(1,4), (3,5), (0,6), (5,7), (3,9), (6,10), (8,11)]
print(activity_selection(activities))  # [(1, 4), (5, 7), (8, 11)]
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
type Activity = [number, number]; // [start, end]

function activitySelection(activities: Activity[]): Activity[] {
    const sorted = [...activities].sort(([, a], [, b]) => a - b);
    const selected: Activity[] = [sorted[0]];
    let lastEnd = sorted[0][1];

    for (let i = 1; i < sorted.length; i++) {
        const [start, end] = sorted[i];
        if (start >= lastEnd) {
            selected.push(sorted[i]);
            lastEnd = end;
        }
    }
    return selected;
}
```

</TabItem>
</Tabs>

---

### 3. Coin Change — When Greedy Works and When It Fails

**Greedy coin change:** Always use the largest coin that fits.

```
US coins: [25, 10, 5, 1] cents

Make change for 41¢:
  25¢ × 1 = 25   (remaining: 16)
  10¢ × 1 = 10   (remaining: 6)
   5¢ × 1 = 5    (remaining: 1)
   1¢ × 1 = 1    (remaining: 0)
  → 4 coins ✓ OPTIMAL for US coins!
```

But with arbitrary coin denominations, greedy fails:

```
Coins: [1, 3, 4]
Make change for 6:

Greedy: 4 + 1 + 1 = 3 coins
Optimal: 3 + 3 = 2 coins  ← greedy missed this!
```

**Lesson:** Greedy works for coin change only with specific coin systems (like US coins) that have the greedy property. For arbitrary denominations, use **dynamic programming** ([Recursion & DP](./recursion.md) — coin change is a classic DP problem).

:::tip Greedy vs DP Rule of Thumb
If the problem involves **making a globally optimal sequence of choices** and you can **prove a greedy selection never forecloses a better future option**, use greedy (fast). If optimal future choices depend on past decisions in a complex way, use DP.
:::

---

### 4. Interval Scheduling Variants

**Meeting rooms problem:** Given meeting intervals, find the minimum number of rooms needed.

```
Meetings: [(0,30), (5,10), (15,20)]

Timeline:
  t=0:  (0,30) starts  → 1 room
  t=5:  (5,10) starts → overlap with (0,30) → 2 rooms needed
  t=10: (5,10) ends   → 1 room
  t=15: (15,20) starts→ overlap with (0,30) → 2 rooms again
  t=20: (15,20) ends  → 1 room
  t=30: (0,30) ends   → 0 rooms

Answer: 2 rooms minimum
```

<Tabs>
<TabItem value="python" label="Python">

```python
import heapq

def min_meeting_rooms(intervals: list[tuple]) -> int:
    if not intervals:
        return 0

    sorted_intervals = sorted(intervals, key=lambda x: x[0])
    heap = []  # Min-heap of end times of active meetings

    for start, end in sorted_intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)  # Recycle finished room
        else:
            heapq.heappush(heap, end)     # Need new room

    return len(heap)

print(min_meeting_rooms([(0,30),(5,10),(15,20)]))  # → 2
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function minMeetingRooms(intervals: [number, number][]): number {
    const starts = intervals.map(([s]) => s).sort((a, b) => a - b);
    const ends   = intervals.map(([, e]) => e).sort((a, b) => a - b);

    let rooms = 0, endPtr = 0;
    for (let i = 0; i < starts.length; i++) {
        if (starts[i] < ends[endPtr]) {
            rooms++;
        } else {
            endPtr++;
        }
    }
    return rooms;
}
```

</TabItem>
</Tabs>

---

### 5. Huffman Encoding (Awareness)

**Huffman encoding** is a greedy algorithm for lossless data compression. It assigns shorter binary codes to more frequent characters and longer codes to rarer ones, minimizing total encoded length.

```
Text: "abracadabra" — character frequencies:
  a: 5, b: 2, r: 2, c: 1, d: 1

Huffman codes (one possible assignment):
  a → 0       (most frequent → shortest)
  b → 10
  r → 110
  c → 1110
  d → 1111

Encoded length: 5×1 + 2×2 + 2×3 + 1×4 + 1×4 = 25 bits
vs. fixed 3-bit: 11 chars × 3 bits = 33 bits   → 24% smaller
```

**Algorithm:** Build a binary tree bottom-up. Use a min-heap; always merge the two lowest-frequency nodes into a new parent node with combined frequency. Repeat until one root remains.

This is used in ZIP, PNG, JPEG, MP3, and HTTP/2 header compression (HPACK).

You won't typically implement Huffman from scratch in production — compression libraries handle it. The value here is understanding **why greedy works** (merging the two cheapest items first is provably optimal by an exchange argument) and **where it's deployed**.

---

### 6. Greedy vs Dynamic Programming Summary

| Property | Greedy | Dynamic Programming |
|---------|--------|---------------------|
| Speed | O(n log n) typically | O(n²) or O(nm) typically |
| Reconsiders past choices | ❌ Never | ✅ Via memoization |
| Requires greedy choice property | ✅ Must hold | ❌ Not required |
| Proof needed | Correctness must be proven | Correctness follows from structure |
| Examples | Activity selection, Huffman, Dijkstra | Knapsack, LCS, coin change (arbitrary) |

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- 📺 **[Abdul Bari — Greedy Algorithms (YouTube, FREE)](https://www.youtube.com/watch?v=ARvQcqJ_-NY)** — Covers activity selection and Huffman with proofs
- 📺 **[NeetCode — Interval Problems (YouTube, FREE)](https://www.youtube.com/watch?v=IexN60k62jo)** — Practical LeetCode-style greedy interval problems

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📺 **[Huffman Coding — Computerphile (YouTube, FREE)](https://www.youtube.com/watch?v=umTbivyJoiI)** — Great conceptual explanation of Huffman trees
- 📺 **[MIT 6.006 — Greedy Algorithms (YouTube, FREE)](https://www.youtube.com/watch?v=tKwnms5iRBU)** — Academic treatment with exchange argument proofs

</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[LeetCode #455 — Assign Cookies (FREE)](https://leetcode.com/problems/assign-cookies/)** — Simple greedy intro
- 🎮 **[LeetCode #435 — Non-overlapping Intervals (FREE)](https://leetcode.com/problems/non-overlapping-intervals/)** — Activity selection variant
- 🎮 **[LeetCode #253 — Meeting Rooms II (FREE)](https://leetcode.com/problems/meeting-rooms-ii/)** — Min rooms / interval greedy
- 🎮 **[LeetCode #134 — Gas Station (FREE)](https://leetcode.com/problems/gas-station/)** — Greedy with circular reasoning

</TabItem>
</Tabs>
