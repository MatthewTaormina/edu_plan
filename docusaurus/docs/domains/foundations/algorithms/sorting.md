import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Sorting Algorithms

**Section:** Algorithms â€º Sorting Â· **Prerequisite:** [Search Algorithms](./search.md)

> **Who needs this:** Every developer. Even if you never write a sort yourself, understanding how they differ â€” stability, in-place vs auxiliary space, worst-case guarantees â€” lets you choose the right tool and understand why your language's built-in sort behaves the way it does.

---

## ðŸŽ¯ Learning Objectives

- [ ] Implement bubble sort, merge sort, and quicksort from scratch
- [ ] Explain why merge sort is always O(n log n) but quicksort can degrade
- [ ] Know which sorts are stable and why it matters
- [ ] Choose the right sort for a given problem (size, existing sortedness, key type)
- [ ] Know what Timsort and counting sort do without implementing them

---

## ðŸ“– Concepts

### Quick Comparison

| Algorithm | Best | Average | Worst | Space | Stable? | Notes |
|-----------|------|---------|-------|-------|---------|-------|
| **Bubble Sort** | O(n) | O(nÂ²) | O(nÂ²) | O(1) | âœ… | Teaching only â€” never use on large data |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | âœ… | Preferred for linked lists; guaranteed worst case |
| **Quicksort** | O(n log n) | O(n log n) | O(nÂ²) | O(log n) | âŒ | Fastest in practice due to cache efficiency |
| **Heapsort** | O(n log n) | O(n log n) | O(n log n) | O(1) | âŒ | Guaranteed O(n log n) with O(1) space |
| **Timsort** | O(n) | O(n log n) | O(n log n) | O(n) | âœ… | Python `sorted()`, Java `Arrays.sort()` â€” best for real data |
| **Counting Sort** | O(n+k) | O(n+k) | O(n+k) | O(k) | âœ… | Integer keys only; beats O(n log n) when k is small |

*k = range of key values*

**Stability** means equal elements preserve their original relative order. This matters when sorting by multiple criteria (e.g., sort by last name, then separately by first name â€” the first sort's order must survive the second).

---

### 1. Bubble Sort â€” O(nÂ²)

The simplest sort. Repeatedly swap adjacent out-of-order elements. Each pass "bubbles" the largest remaining element to its correct position.

```
Pass 1: [5, 3, 8, 1] â†’ [3, 5, 1, 8]  (8 bubbles to end)
Pass 2: [3, 5, 1, 8] â†’ [3, 1, 5, 8]  (5 bubbles to position)
Pass 3: [3, 1, 5, 8] â†’ [1, 3, 5, 8]  âœ“
```

Use bubble sort to **understand** sorting. Never use it in production on large inputs.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION bubble_sort(arr: List<Int>) -> Void
    n â† length(arr)
    FOR i FROM 0 TO n - 2 DO
        swapped â† FALSE
        FOR j FROM 0 TO n - i - 2 DO
            IF arr[j] > arr[j + 1] THEN
                swap(arr[j], arr[j + 1])
                swapped â† TRUE
            END IF
        END FOR
        IF NOT swapped THEN BREAK    // Already sorted â€” early exit
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
            break  # Already sorted â€” best case O(n)
    return arr

# Production: always use sorted() or list.sort() (Timsort â€” O(n log n))
nums = [5, 3, 8, 1]
print(sorted(nums))    # [1, 3, 5, 8]
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
[5, 3, 8, 1].sort((a, b) => a - b);  // â†’ [1, 3, 5, 8]
```

</TabItem>
</Tabs>

---

### 2. Merge Sort â€” O(n log n), O(n) space

Divide and conquer: split the array in half recursively until single elements, then merge sorted halves back up. **Guaranteed O(n log n)** â€” no bad cases.

```
[5, 3, 8, 1]
  â†’ [5, 3]      [8, 1]
  â†’ [5] [3]    [8] [1]
  â† [3, 5]    [1, 8]
  â† [1, 3, 5, 8]
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION merge_sort(arr: List<T>) -> List<T>
    IF length(arr) <= 1 THEN
        RETURN arr    // Base case: already sorted
    END IF

    mid   â† length(arr) / 2
    left  â† merge_sort(arr[0..mid])
    right â† merge_sort(arr[mid..end])

    RETURN merge(left, right)
END FUNCTION

FUNCTION merge(left: List<T>, right: List<T>) -> List<T>
    result â† NEW List<T>
    i â† 0
    j â† 0

    WHILE i < length(left) AND j < length(right) DO
        IF left[i] <= right[j] THEN
            append(result, left[i]);  i â† i + 1
        ELSE
            append(result, right[j]); j â† j + 1
        END IF
    END WHILE

    // Append remaining elements from whichever side has leftovers
    APPEND remaining left[i..] to result
    APPEND remaining right[j..] to result

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
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return _merge(left, right)

def _merge(left: list, right: list) -> list:
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
    return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
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
<TabItem value="rust" label="Rust">

```rust
fn merge_sort(arr: &[i64]) -> Vec<i64> {
    if arr.len() <= 1 { return arr.to_vec(); }
    let mid = arr.len() / 2;
    let left  = merge_sort(&arr[..mid]);
    let right = merge_sort(&arr[mid..]);
    merge(&left, &right)
}

fn merge(left: &[i64], right: &[i64]) -> Vec<i64> {
    let mut result = Vec::with_capacity(left.len() + right.len());
    let (mut i, mut j) = (0, 0);
    while i < left.len() && j < right.len() {
        if left[i] <= right[j] { result.push(left[i]);  i += 1; }
        else                   { result.push(right[j]); j += 1; }
    }
    result.extend_from_slice(&left[i..]);
    result.extend_from_slice(&right[j..]);
    result
}
```

</TabItem>
</Tabs>

**Best for:** Linked lists (no random access needed for merge), external sort (data doesn't fit in RAM â€” merge from disk), when you need a **stable, guaranteed O(n log n)** sort.

---

### 3. Quicksort â€” O(n log n) average, O(nÂ²) worst

Pick a **pivot**, partition elements: smaller left, larger right. Recurse on each side. In practice **faster than merge sort** due to cache locality and in-place nature â€” but can degrade to O(nÂ²) on already-sorted data with a bad pivot choice.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION quicksort(arr: List<T>, low: Int, high: Int) -> Void
    IF low < high THEN
        pivot_idx â† partition(arr, low, high)
        quicksort(arr, low, pivot_idx - 1)
        quicksort(arr, pivot_idx + 1, high)
    END IF
END FUNCTION

FUNCTION partition(arr: List<T>, low: Int, high: Int) -> Int
    pivot â† arr[high]    // Last element as pivot
    i     â† low - 1     // Index of last element <= pivot

    FOR j FROM low TO high - 1 DO
        IF arr[j] <= pivot THEN
            i â† i + 1
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
        pivot_idx = _partition(arr, low, high)
        quicksort(arr, low, pivot_idx - 1)
        quicksort(arr, pivot_idx + 1, high)
    return arr

def _partition(arr: list, low: int, high: int) -> int:
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
<TabItem value="typescript" label="TypeScript">

```typescript
function quicksort(arr: number[], low = 0, high = arr.length - 1): number[] {
    if (low < high) {
        const pivotIdx = partition(arr, low, high);
        quicksort(arr, low, pivotIdx - 1);
        quicksort(arr, pivotIdx + 1, high);
    }
    return arr;
}

function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}
```

</TabItem>
</Tabs>

:::tip Pivot Selection
The classic textbook implementation uses the last element as a pivot. Real quicksort implementations use **random pivot** or **median-of-three** (median of first, middle, last) to avoid the O(nÂ²) worst case on sorted input. Python's `sorted()` uses Timsort, not quicksort, specifically to avoid this.
:::

---

### 4. Heapsort â€” O(n log n), O(1) space

Build a max-heap from the array, then repeatedly extract the maximum. **Guaranteed O(n log n)** with **O(1) auxiliary space** (in-place). Not stable.

```
// Heapsort is useful when you need:
// - Guaranteed O(n log n) worst case (no quicksort degradation)
// - O(1) extra space (no merge sort's O(n) aux array)
// Downside: worse cache performance than quicksort in practice
```

You won't usually implement heapsort from scratch. The key insight: **heaps give you a sorted output as a side effect of repeatedly extracting the min/max.** See [Data Structures](../data_structures.mdx) for how heaps work.

---

### 5. Timsort â€” The Real-World Champion

**Timsort** is a hybrid of merge sort and insertion sort, developed by Tim Peters for Python (2002) and now used in Java, Android, and Swift. It's O(n log n) worst case, O(n) best case (nearly sorted data), and stable.

```
// How Timsort works (awareness level):
// 1. Split input into "runs" â€” already-sorted subsequences
// 2. Sort short runs with insertion sort (fast for small n)
// 3. Merge runs using merge sort

// Why it wins on real data: most real-world data has pre-existing order.
// Already-sorted input completes in O(n) â€” zero comparisons needed.
```

**When you call `sorted()` in Python, `Array.sort()` in modern JS (V8 Timsort since Node 11), or `Arrays.sort()` for objects in Java â€” you're using Timsort.** You don't implement it; you use it.

---

### 6. Counting Sort â€” O(n+k)

Counting sort beats the O(n log n) comparison-sort lower bound â€” **but only for integers in a small range**.

```
Array:  [4, 2, 2, 8, 3, 3, 1]
Range:  0â€“8 (k=9)

1. Count occurrences: counts[1]=1, counts[2]=2, counts[3]=2, counts[4]=1, counts[8]=1
2. Reconstruct: [1, 2, 2, 3, 3, 4, 8]
```

**When to use:** Sorting integers, characters, or enum values with a bounded range (e.g., sort exam scores 0â€“100, sort ASCII characters, sort playing cards). Not useful for floats or strings.

---

## ðŸ“š Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- ðŸ“º **[Visualgo â€” Sorting Animations (FREE)](https://visualgo.net/en/sorting)** â€” Watch every sort animate in real time with step-by-step explanation
- ðŸ“º **[Abdul Bari â€” Merge Sort (YouTube, FREE)](https://www.youtube.com/watch?v=mB5HXBb_HY8)** â€” Best derivation of the O(n log n) recurrence

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- ðŸ“º **[Quicksort in 4 minutes (YouTube, FREE)](https://www.youtube.com/watch?v=Hoixgm4-P4M)** â€” Clean visual of partitioning
- ðŸ“º **[Tim Peters explains Timsort (PyCon 2016, YouTube, FREE)](https://www.youtube.com/watch?v=1wAOy88WxmY)** â€” The author explains why Timsort was designed the way it was

</TabItem>
<TabItem value="practice" label="Practice">

- ðŸŽ® **[LeetCode #912 â€” Sort an Array (FREE)](https://leetcode.com/problems/sort-an-array/)** â€” Implement merge sort or quicksort from scratch
- ðŸŽ® **[LeetCode #75 â€” Sort Colors (FREE)](https://leetcode.com/problems/sort-colors/)** â€” Dutch National Flag / 3-way partition problem
- ðŸŽ® **[LeetCode #315 â€” Count of Smaller Numbers After Self (FREE)](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)** â€” Merge sort application

</TabItem>
</Tabs>
