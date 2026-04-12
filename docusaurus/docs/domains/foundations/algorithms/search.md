import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Search Algorithms

**Section:** Algorithms ΓÇ║ Search ┬╖ **Prerequisite:** [Complexity Analysis](./complexity.md)

> **Who needs this:** Every program that needs to find something. The right search strategy can be the difference between an instant response and a query that never completes.

---

## ≡ƒÄ» Learning Objectives

- [ ] Implement linear search and binary search from scratch
- [ ] Explain why binary search requires sorted data
- [ ] Explain why binary search is O(log n) using the halving argument
- [ ] Know when to use each search strategy based on data characteristics
- [ ] Understand how hash table lookups achieve O(1) average search

---

## ≡ƒôû Concepts

### 1. Linear Search ΓÇö O(n)

The simplest search: check every element until you find the target. Works on **unsorted** data.

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
# and O(1) lookup on sets/dicts
nums = [3, 7, 1, 9, 4]
print(linear_search(nums, 9))  # ΓåÆ 3
print(9 in nums)               # ΓåÆ True (same cost, cleaner)
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
nums.indexOf(9);             // ΓåÆ 3
nums.findIndex(x => x > 8); // ΓåÆ 3 (first element > 8)
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
nums.iter().position(|&x| x == 9);  // ΓåÆ Some(3)
nums.contains(&9);                   // ΓåÆ true
```

</TabItem>
</Tabs>

**When to use:** Small collections, unsorted data, searching by a computed property (not just equality), one-off lookups where maintaining sorted order is not worth it.

---

### 2. Binary Search ΓÇö O(log n)

Binary search works on **sorted** data. Each step eliminates **half** the remaining candidates.

```
Find 11 in: [1, 3, 5, 7, 9, 11, 13]
                        Γåæ
             mid = index 3 ΓåÆ value 7 < 11 ΓåÆ search RIGHT half
             [9, 11, 13]
              Γåæ
             mid = index 1 ΓåÆ value 11 ΓåÆ FOUND! (2 steps vs 6 for linear)
```

**Why O(log n)?** Each iteration halves the search space. Starting from n elements:
```
n ΓåÆ n/2 ΓåÆ n/4 ΓåÆ n/8 ΓåÆ ... ΓåÆ 1
```
After k steps: n / 2^k = 1 ΓåÆ k = logΓéé(n). So logΓéé(1,000,000) Γëê 20 steps maximum.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION binary_search(sorted_list: List<T>, target: T) -> Int
    left  ΓåÉ 0
    right ΓåÉ length(sorted_list) - 1

    WHILE left <= right DO
        mid ΓåÉ left + (right - left) / 2   // Avoids integer overflow

        IF sorted_list[mid] == target THEN
            RETURN mid                     // Found!
        ELSE IF sorted_list[mid] < target THEN
            left ΓåÉ mid + 1                // Target is in right half
        ELSE
            right ΓåÉ mid - 1              // Target is in left half
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

# Python's bisect module is the production tool
import bisect
nums = [1, 3, 5, 7, 9, 11, 13]
idx = bisect.bisect_left(nums, 11)  # ΓåÆ 5
print(nums[idx] == 11)              # ΓåÆ True
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
            std::cmp::Ordering::Equal   => return Some(mid),
            std::cmp::Ordering::Less    => left = mid + 1,
            std::cmp::Ordering::Greater => right = mid,
        }
    }
    None
}

// Built-in ΓÇö Vec and slices have binary_search()
let nums = vec![1, 3, 5, 7, 9, 11, 13];
nums.binary_search(&11);  // ΓåÆ Ok(5)
```

</TabItem>
</Tabs>

:::warning Common Mistake
Using `mid = (left + right) / 2` can cause **integer overflow** in languages with fixed-size integers (C, Rust, Java) when `left` and `right` are large numbers. Always use `left + (right - left) / 2`.
:::

**When to use:** The data is sorted (or can be sorted once and searched many times). Binary search is the default for sorted collections. If you need frequent lookups on unsorted data, consider a hash table instead.

---

### 3. Hash Table Lookups ΓÇö O(1) Average

A **hash table** (Python `dict`, JS `Map`/object, Rust `HashMap`) maps keys to values using a hash function. Lookup, insert, and delete are all **O(1) average**.

```
// Under the hood:
// 1. hash("username") ΓåÆ integer index
// 2. Go directly to that bucket ΓÇö no iteration

// This is why Python's 'in' on a dict is O(1) but on a list is O(n)
d = {"alice": 42, "bob": 7}
"alice" in d       # O(1) ΓÇö hash lookup
"alice" in list(d) # O(n) ΓÇö linear scan of converted list
```

**When to use:** When you need fast lookup and the data isn't sorted (or sorted order doesn't matter). Hash tables trade space (O(n)) for speed (O(1) lookups). They're the most common "make it fast" tool in practice.

:::note Cross-link
See [Data Structures ΓÇö Hash Tables](../data_structures.mdx) for a full explanation of how hash functions, collision resolution, and load factors work.
:::

---

### 4. Search Strategy Comparison

| Scenario | Best Strategy |
|----------|--------------|
| Small list (< ~50 elements) | Linear ΓÇö overhead of sorting/hashing isn't worth it |
| Large sorted list, searched many times | Binary search |
| Large unsorted collection, searched many times | Hash table |
| Sorted list, find *closest* match | Binary search (with bisect / lower_bound) |
| Database index with range queries | B-Tree (see [Data Structures](../data_structures.mdx)) |
| Text substring search | KMP or Rabin-Karp (see [String Algorithms](./string.md)) |

#### Awareness: Other Search Algorithms

| Algorithm | Complexity | Use When |
|-----------|-----------|---------|
| **Jump Search** | O(ΓêÜn) | Sorted list, random access is expensive (e.g., tape media) |
| **Interpolation Search** | O(log log n) avg | Sorted, *uniformly distributed* numeric data |
| **Exponential Search** | O(log n) | Unbounded/infinite sorted lists |
| **Ternary Search** | O(log n) | Finding max/min of a unimodal function |

You will very rarely implement these from scratch ΓÇö they're good to know exist.

---

## ≡ƒôÜ Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- ≡ƒô║ **[CS50x Week 3 ΓÇö Search (FREE)](https://cs50.harvard.edu/x/)** ΓÇö Visual walkthrough of linear and binary search
- ≡ƒô║ **[NeetCode ΓÇö Binary Search (YouTube, FREE)](https://www.youtube.com/watch?v=s4DPM8ct1pI)** ΓÇö Practical patterns for applying binary search on LeetCode-style problems

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- ≡ƒôû **[Visualgo ΓÇö Binary Search animation (FREE)](https://visualgo.net/en/bst)** ΓÇö Watch the algorithm eliminate halves in real time
- ≡ƒô║ **[Abdul Bari ΓÇö Binary Search (YouTube, FREE)](https://www.youtube.com/watch?v=C2apEw9pgtw)** ΓÇö Full derivation and analysis

</TabItem>
<TabItem value="practice" label="Practice">

- ≡ƒÄ« **[LeetCode #704 ΓÇö Binary Search (FREE)](https://leetcode.com/problems/binary-search/)** ΓÇö Classic baseline
- ≡ƒÄ« **[LeetCode #35 ΓÇö Search Insert Position (FREE)](https://leetcode.com/problems/search-insert-position/)** ΓÇö Binary search variant
- ≡ƒÄ« **[LeetCode #33 ΓÇö Search in Rotated Sorted Array (FREE)](https://leetcode.com/problems/search-in-rotated-sorted-array/)** ΓÇö Common interview twist

</TabItem>
</Tabs>
