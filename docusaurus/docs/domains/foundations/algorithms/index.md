import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Algorithms

**Domain:** Foundations · **Time Estimate:** 4–6 weeks · **Language:** Language-agnostic concepts; tabbed examples

> **Prerequisites:** [Data Structures](../data_structures.mdx) — you must understand arrays, linked lists, trees, and hash tables before algorithmic analysis makes sense.
>
> **Who needs this:** Everyone. Algorithms are the "how" behind every program that needs to be fast. Understanding complexity lets you pick the right tool, spot bottlenecks, and survive technical interviews.

---

## 🎯 Learning Objectives

By the end of this section, you will be able to:

- [ ] Read and write Big-O notation for any function or loop
- [ ] Choose the right search or sort algorithm for a given problem
- [ ] Implement recursive solutions and apply memoization / tabulation
- [ ] Traverse graphs with BFS and DFS
- [ ] Find shortest paths with Dijkstra and A*
- [ ] Apply greedy and backtracking strategies to constraint problems
- [ ] Use string matching algorithms efficiently
- [ ] Compute vector similarity and implement nearest-neighbour search and clustering

---

## 📐 Complexity Cheat Sheet

| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| **Linear Search** | O(1) | O(n) | O(n) | O(1) |
| **Binary Search** | O(1) | O(log n) | O(log n) | O(1) |
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) |
| **Quicksort** | O(n log n) | O(n log n) | O(n²) | O(log n) |
| **Heapsort** | O(n log n) | O(n log n) | O(n log n) | O(1) |
| **BFS** | O(V+E) | O(V+E) | O(V+E) | O(V) |
| **DFS** | O(V+E) | O(V+E) | O(V+E) | O(V) |
| **Dijkstra** | O(E log V) | O(E log V) | O(E log V) | O(V) |
| **Bellman-Ford** | O(VE) | O(VE) | O(VE) | O(V) |
| **KMP** | O(n) | O(n+m) | O(n+m) | O(m) |
| **Edit Distance** | O(nm) | O(nm) | O(nm) | O(nm) |

*V = vertices, E = edges, n = text length, m = pattern length*

---

## 📚 Subsections

| Page | Topics |
|------|--------|
| [Complexity Analysis](./complexity) | Big-O, Big-Θ, Big-Ω; time vs space tradeoffs; amortized analysis |
| [Search Algorithms](./search) | Linear search, binary search, jump search, hash lookups |
| [Sorting Algorithms](./sorting) | Bubble, merge, quicksort, heapsort, timsort, counting sort |
| [Recursion & Dynamic Programming](./recursion) | Recursion, memoization, tabulation, knapsack, LCS |
| [Graph Traversal](./graph) | BFS, DFS, topological sort, cycle detection |
| [Pathfinding](./pathfinding) | Dijkstra, A*, Bellman-Ford |
| [Greedy Algorithms](./greedy) | Activity selection, coin change, Huffman encoding |
| [Backtracking](./backtracking) | N-Queens, sudoku solver, subset sum |
| [String Algorithms](./string) | KMP, Rabin-Karp, edit distance (Levenshtein) |
| [Vector Algorithms](./vectors) | Cosine similarity, kNN search, ANN indexes, k-Means, DBSCAN |

---

## 🏆 Milestone Complete!

> **You now understand why fast code is fast and slow code is slow.**
>
> Every technical interview tests algorithms and complexity. More importantly,
> these tools let you make informed decisions in real systems — when to optimize,
> and when O(n²) is perfectly fine.

**Log this in your kanban:** Move `foundations/algorithms` to ✅ Done.
