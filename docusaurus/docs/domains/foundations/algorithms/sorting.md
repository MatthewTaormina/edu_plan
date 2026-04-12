import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Sorting Algorithms

**Section:** Algorithms ΓÇ║ Sorting ┬╖ **Prerequisite:** [Search Algorithms](./search.md)

> **Who needs this:** Every developer. Even if you never write a sort yourself, understanding how they differ ΓÇö stability, in-place vs auxiliary space, worst-case guarantees ΓÇö lets you choose the right tool and understand why your language's built-in sort behaves the way it does.

---

## ≡ƒÄ» Learning Objectives

- [ ] Implement bubble sort, merge sort, and quicksort from scratch
- [ ] Explain why merge sort is always O(n log n) but quicksort can degrade
- [ ] Know which sorts are stable and why it matters
- [ ] Choose the right sort for a given problem (size, existing sortedness, key type)
- [ ] Know what Timsort and counting sort do without implementing them

---

## ≡ƒôû Concepts

### Quick Comparison

| Algorithm | Best | Average | Worst | Space | Stable? | Notes |
|-----------|------|---------|-------|-------|---------|-------|
| **Bubble Sort** | O(n) | O(n┬▓) | O(n┬▓) | O(1) | Γ£à | Teaching only ΓÇö never use on large data |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | Γ£à | Preferred for linked lists; guaranteed worst case |
| **Quicksort** | O(n log n) | O(n log n) | O(n┬▓) | O(log n) | Γ¥î | Fastest in practice due to cache efficiency |
| **Heapsort** | O(n log n) | O(n log n) | O(n log n) | O(1) | Γ¥î | Guaranteed O(n log n) with O(1) space |
| **Timsort** | O(n) | O(n log n) | O(n log n) | O(n) | Γ£à | Python `sorted()`, Java `Arrays.sort()` ΓÇö best for real data |
| **Counting Sort** | O(n+k) | O(n+k) | O(n+k) | O(k) | Γ£à | Integer keys only; beats O(n log n) when k is small |

*k = range of key values*

**Stability** means equal elements preserve their original relative order. This matters when sorting by multiple criteria (e.g., sort by last name, then separately by first name ΓÇö the first sort's order must survive the second).

---

### 1. Bubble Sort ΓÇö O(n┬▓)

The simplest sort. Repeatedly swap adjacent out-of-order elements. Each pass "bubbles" the largest remaining element to its correct position.

```
Pass 1: [5, 3, 8, 1] ΓåÆ [3, 5, 1, 8]  (8 bubbles to end)
Pass 2: [3, 5, 1, 8] ΓåÆ [3, 1, 5, 8]  (5 bubbles to position)
Pass 3: [3, 1, 5, 8] ΓåÆ [1, 3, 5, 8]  Γ£ô
```

Use bubble sort to **understand** sorting. Never use it in production on large inputs.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION bubble_sort(arr: List<Int>) -> Void
    n ΓåÉ length(arr)
    FOR i FROM 0 TO n - 2 DO
        swapped ΓåÉ FALSE
        FOR j FROM 0 TO n - i - 2 DO
            IF arr[j] > arr[j + 1] THEN
                swap(arr[j], arr[j + 1])
                swapped ΓåÉ TRUE
            END IF
        END FOR
        IF NOT swapped THEN BREAK    // Already sorted ΓÇö early exit
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
            break  # Already sorted ΓÇö best case O(n)
    return arr

# Production: always use sorted() or list.sort() (Timsort ΓÇö O(n log n))
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
[5, 3, 8, 1].sort((a, b) => a - b);  // ΓåÆ [1, 3, 5, 8]
```

</TabItem>
</Tabs>

---

### 2. Merge Sort ΓÇö O(n log n), O(n) space

Divide and conquer: split the array in half recursively until single elements, then merge sorted halves back up. **Guaranteed O(n log n)** ΓÇö no bad cases.

```
[5, 3, 8, 1]
  ΓåÆ [5, 3]      [8, 1]
  ΓåÆ [5] [3]    [8] [1]
  ΓåÉ [3, 5]    [1, 8]
  ΓåÉ [1, 3, 5, 8]
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION merge_sort(arr: List<T>) -> List<T>
    IF length(arr) <= 1 THEN
        RETURN arr    // Base case: already sorted
    END IF

    mid   ΓåÉ length(arr) / 2
    left  ΓåÉ merge_sort(arr[0..mid])
    right ΓåÉ merge_sort(arr[mid..end])

    RETURN merge(left, right)
END FUNCTION

FUNCTION merge(left: List<T>, right: List<T>) -> List<T>
    result ΓåÉ NEW List<T>
    i ΓåÉ 0
    j ΓåÉ 0

    WHILE i < length(left) AND j < length(right) DO
        IF left[i] <= right[j] THEN
            append(result, left[i]);  i ΓåÉ i + 1
        ELSE
            append(result, right[j]); j ΓåÉ j + 1
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

**Best for:** Linked lists (no random access needed for merge), external sort (data doesn't fit in RAM ΓÇö merge from disk), when you need a **stable, guaranteed O(n log n)** sort.

---

### 3. Quicksort ΓÇö O(n log n) average, O(n┬▓) worst

Pick a **pivot**, partition elements: smaller left, larger right. Recurse on each side. In practice **faster than merge sort** due to cache locality and in-place nature ΓÇö but can degrade to O(n┬▓) on already-sorted data with a bad pivot choice.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION quicksort(arr: List<T>, low: Int, high: Int) -> Void
    IF low < high THEN
        pivot_idx ΓåÉ partition(arr, low, high)
        quicksort(arr, low, pivot_idx - 1)
        quicksort(arr, pivot_idx + 1, high)
    END IF
END FUNCTION

FUNCTION partition(arr: List<T>, low: Int, high: Int) -> Int
    pivot ΓåÉ arr[high]    // Last element as pivot
    i     ΓåÉ low - 1     // Index of last element <= pivot

    FOR j FROM low TO high - 1 DO
        IF arr[j] <= pivot THEN
            i ΓåÉ i + 1
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
The classic textbook implementation uses the last element as a pivot. Real quicksort implementations use **random pivot** or **median-of-three** (median of first, middle, last) to avoid the O(n┬▓) worst case on sorted input. Python's `sorted()` uses Timsort, not quicksort, specifically to avoid this.
:::

---

### 4. Heapsort ΓÇö O(n log n), O(1) space

Build a max-heap from the array, then repeatedly extract the maximum. **Guaranteed O(n log n)** with **O(1) auxiliary space** (in-place). Not stable.

```
// Heapsort is useful when you need:
// - Guaranteed O(n log n) worst case (no quicksort degradation)
// - O(1) extra space (no merge sort's O(n) aux array)
// Downside: worse cache performance than quicksort in practice
```

You won't usually implement heapsort from scratch. The key insight: **heaps give you a sorted output as a side effect of repeatedly extracting the min/max.** See [Data Structures](../data_structures.mdx) for how heaps work.

---

### 5. Timsort ΓÇö The Real-World Champion

**Timsort** is a hybrid of merge sort and insertion sort, developed by Tim Peters for Python (2002) and now used in Java, Android, and Swift. It's O(n log n) worst case, O(n) best case (nearly sorted data), and stable.

```
// How Timsort works (awareness level):
// 1. Split input into "runs" ΓÇö already-sorted subsequences
// 2. Sort short runs with insertion sort (fast for small n)
// 3. Merge runs using merge sort

// Why it wins on real data: most real-world data has pre-existing order.
// Already-sorted input completes in O(n) ΓÇö zero comparisons needed.
```

**When you call `sorted()` in Python, `Array.sort()` in modern JS (V8 Timsort since Node 11), or `Arrays.sort()` for objects in Java ΓÇö you're using Timsort.** You don't implement it; you use it.

---

### 6. Counting Sort ΓÇö O(n+k)

Counting sort beats the O(n log n) comparison-sort lower bound ΓÇö **but only for integers in a small range**.

```
Array:  [4, 2, 2, 8, 3, 3, 1]
Range:  0ΓÇô8 (k=9)

1. Count occurrences: counts[1]=1, counts[2]=2, counts[3]=2, counts[4]=1, counts[8]=1
2. Reconstruct: [1, 2, 2, 3, 3, 4, 8]
```

**When to use:** Sorting integers, characters, or enum values with a bounded range (e.g., sort exam scores 0ΓÇô100, sort ASCII characters, sort playing cards). Not useful for floats or strings.

---

## ≡ƒôÜ Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- ≡ƒô║ **[Visualgo ΓÇö Sorting Animations (FREE)](https://visualgo.net/en/sorting)** ΓÇö Watch every sort animate in real time with step-by-step explanation
- ≡ƒô║ **[Abdul Bari ΓÇö Merge Sort (YouTube, FREE)](https://www.youtube.com/watch?v=mB5HXBb_HY8)** ΓÇö Best derivation of the O(n log n) recurrence

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- ≡ƒô║ **[Quicksort in 4 minutes (YouTube, FREE)](https://www.youtube.com/watch?v=Hoixgm4-P4M)** ΓÇö Clean visual of partitioning
- ≡ƒô║ **[Tim Peters explains Timsort (PyCon 2016, YouTube, FREE)](https://www.youtube.com/watch?v=1wAOy88WxmY)** ΓÇö The author explains why Timsort was designed the way it was

</TabItem>
<TabItem value="practice" label="Practice">

- ≡ƒÄ« **[LeetCode #912 ΓÇö Sort an Array (FREE)](https://leetcode.com/problems/sort-an-array/)** ΓÇö Implement merge sort or quicksort from scratch
- ≡ƒÄ« **[LeetCode #75 ΓÇö Sort Colors (FREE)](https://leetcode.com/problems/sort-colors/)** ΓÇö Dutch National Flag / 3-way partition problem
- ≡ƒÄ« **[LeetCode #315 ΓÇö Count of Smaller Numbers After Self (FREE)](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)** ΓÇö Merge sort application

</TabItem>
</Tabs>
