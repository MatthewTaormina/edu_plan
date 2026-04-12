import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Pathfinding Algorithms

**Section:** Algorithms ΓÇ║ Pathfinding ┬╖ **Prerequisite:** [Graph Traversal](./graph.md)

> **Who needs this:** Game developers, mapping apps, network routing, logistics systems ΓÇö any domain where you need to find the optimal route between two points in a weighted graph. Dijkstra's algorithm in particular is one of the most deployed algorithms in the world (it powers GPS, network routing protocols like OSPF, and countless games).

---

## ≡ƒÄ» Learning Objectives

- [ ] Explain why BFS fails for weighted graphs and Dijkstra is needed
- [ ] Implement Dijkstra's algorithm using a priority queue
- [ ] Understand when A* improves on Dijkstra with a heuristic function
- [ ] Know when Bellman-Ford is required (negative edge weights)
- [ ] Choose the right pathfinding algorithm for a given problem

---

## ≡ƒôû Concepts

### Why BFS Isn't Enough for Weighted Graphs

BFS finds the path with the **fewest hops** in an unweighted graph. In a weighted graph, the shortest-hop path is not necessarily the lowest-cost path:

```
A ΓÇö(1)ΓÇö B ΓÇö(1)ΓÇö D
|               Γåæ
+ΓÇö(10)ΓÇö C ΓÇö(1)ΓÇö+

BFS finds: A ΓåÆ B ΓåÆ D (2 hops, cost 2)   Γ£ô correct here

But consider:
A ΓÇö(1)ΓÇö B ΓÇö(100)ΓÇö D
|                 Γåæ
+ΓÇö(2)ΓÇö C ΓÇö(2)ΓÇöΓÇö+

BFS finds: A ΓåÆ B ΓåÆ D (2 hops, cost 101)
Optimal:   A ΓåÆ C ΓåÆ D (2 hops, cost 4)   ΓåÉ same hops, different cost!
```

BFS doesn't know about edge weights. You need Dijkstra's.

---

### 1. Dijkstra's Algorithm ΓÇö O(E log V)

Dijkstra finds the **shortest weighted path** from a source to all reachable nodes in a graph with **non-negative weights**. It uses a **min-heap (priority queue)** to always process the currently cheapest-to-reach node next.

**Algorithm intuition:** Start at source with cost 0. Greedily visit the cheapest unvisited node, relax (update) the cost of reaching its neighbors. Repeat.

```
Graph (weighted, undirected):
  A ΓÇö(4)ΓÇö B
  A ΓÇö(2)ΓÇö C
  C ΓÇö(1)ΓÇö B
  B ΓÇö(5)ΓÇö D
  C ΓÇö(8)ΓÇö D

Find shortest path from A to all nodes:

Step 1: dist = {A:0, B:Γê₧, C:Γê₧, D:Γê₧}; visit A
        ΓåÆ B via A: 0+4=4; C via A: 0+2=2
        dist = {A:0, B:4, C:2, D:Γê₧}

Step 2: visit C (cheapest unvisited, cost 2)
        ΓåÆ B via C: 2+1=3 < 4 ΓåÆ update!; D via C: 2+8=10
        dist = {A:0, B:3, C:2, D:10}

Step 3: visit B (cost 3)
        ΓåÆ D via B: 3+5=8 < 10 ΓåÆ update!
        dist = {A:0, B:3, C:2, D:8}

Step 4: visit D (cost 8) ΓÇö no improvements
Final: {A:0, B:3, C:2, D:8}
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION dijkstra(graph: WeightedAdjList, start: Vertex) -> Map<Vertex, Int>
    dist     ΓåÉ MAP { start: 0, all others: INFINITY }
    pq       ΓåÉ MIN_PRIORITY_QUEUE [(0, start)]   // (cost, node)
    visited  ΓåÉ SET {}

    WHILE pq is NOT EMPTY DO
        (cost, node) ΓåÉ EXTRACT_MIN from pq

        IF node IN visited THEN CONTINUE    // Already finalized
        ADD node TO visited

        FOR each (neighbor, weight) IN graph[node] DO
            new_cost ΓåÉ cost + weight
            IF new_cost < dist[neighbor] THEN
                dist[neighbor] ΓåÉ new_cost
                PUSH (new_cost, neighbor) INTO pq
            END IF
        END FOR
    END WHILE

    RETURN dist
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
import heapq

def dijkstra(graph: dict, start: str) -> dict:
    """
    graph = {"A": [("B", 4), ("C", 2)], "C": [("B", 1), ("D", 8)], ...}
    Returns dict of {node: shortest_distance_from_start}
    """
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]  # (cost, node) ΓÇö heapq is a min-heap

    while pq:
        cost, node = heapq.heappop(pq)
        if cost > dist[node]:
            continue  # Stale entry in heap ΓÇö skip

        for neighbor, weight in graph.get(node, []):
            new_cost = cost + weight
            if new_cost < dist[neighbor]:
                dist[neighbor] = new_cost
                heapq.heappush(pq, (new_cost, neighbor))

    return dist

graph = {
    "A": [("B", 4), ("C", 2)],
    "B": [("D", 5)],
    "C": [("B", 1), ("D", 8)],
    "D": [],
}
print(dijkstra(graph, "A"))  # {'A': 0, 'B': 3, 'C': 2, 'D': 8}
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
// Note: JavaScript has no built-in priority queue.
// This uses a simple sorted-array simulation; for production use a heap library.
type Edge = [string, number];   // [neighbor, weight]

function dijkstra(graph: Record<string, Edge[]>, start: string): Record<string, number> {
    const dist: Record<string, number> = {};
    for (const node of Object.keys(graph)) dist[node] = Infinity;
    dist[start] = 0;

    // Priority queue: [cost, node] sorted by cost ascending
    const pq: [number, string][] = [[0, start]];

    while (pq.length) {
        pq.sort((a, b) => a[0] - b[0]);
        const [cost, node] = pq.shift()!;

        if (cost > dist[node]) continue; // Stale

        for (const [neighbor, weight] of graph[node] ?? []) {
            const newCost = cost + weight;
            if (newCost < dist[neighbor]) {
                dist[neighbor] = newCost;
                pq.push([newCost, neighbor]);
            }
        }
    }
    return dist;
}
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use std::collections::{BinaryHeap, HashMap};
use std::cmp::Reverse;

fn dijkstra(graph: &HashMap<&str, Vec<(&str, u64)>>, start: &str) -> HashMap<String, u64> {
    let mut dist: HashMap<String, u64> = graph.keys().map(|&k| (k.to_string(), u64::MAX)).collect();
    dist.insert(start.to_string(), 0);

    // BinaryHeap is a max-heap; wrap in Reverse for min-heap behaviour
    let mut heap = BinaryHeap::from([Reverse((0u64, start.to_string()))]);

    while let Some(Reverse((cost, node))) = heap.pop() {
        if cost > dist[&node] { continue; }
        if let Some(neighbors) = graph.get(node.as_str()) {
            for &(neighbor, weight) in neighbors {
                let new_cost = cost + weight;
                if new_cost < *dist.get(neighbor).unwrap_or(&u64::MAX) {
                    dist.insert(neighbor.to_string(), new_cost);
                    heap.push(Reverse((new_cost, neighbor.to_string())));
                }
            }
        }
    }
    dist
}
```

</TabItem>
</Tabs>

:::warning Negative Weights
Dijkstra **does not work** with negative edge weights. If a neighbor has a negative weight, a later discovery could invalidate an already-finalized distance. Use Bellman-Ford instead.
:::

---

### 2. A* (A-Star) ΓÇö O(E log V) with good heuristic

A* extends Dijkstra with a **heuristic function** `h(node)` that estimates the remaining cost from a node to the goal. Instead of always visiting the cheapest-so-far node, A* visits the node with the lowest `f(n) = g(n) + h(n)`:

- `g(n)` = actual cost from start to n (same as Dijkstra's `dist[n]`)
- `h(n)` = **estimated** cost from n to goal (must never overestimate ΓÇö be *admissible*)

**Why it's faster than Dijkstra:** With a good heuristic, A* explores far fewer nodes. In grid pathfinding with Manhattan distance as the heuristic, it can be 10ΓÇô100├ù faster than Dijkstra.

```
Common heuristics:
- Grid with 4 directions:   Manhattan distance |dx| + |dy|
- Grid with 8 directions:   Chebyshev distance max(|dx|, |dy|)
- Any Euclidean space:      Euclidean distance ΓêÜ(dx┬▓ + dy┬▓)
- General graphs:           0 (degenerates to Dijkstra ΓÇö still correct)
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION a_star(graph: WeightedAdjList, start: Vertex, goal: Vertex,
                h: Function(Vertex) -> Int) -> List<Vertex>
    g_score  ΓåÉ MAP { start: 0, all others: INFINITY }
    f_score  ΓåÉ MAP { start: h(start) }
    came_from ΓåÉ MAP {}

    open_set ΓåÉ MIN_PRIORITY_QUEUE [(f_score[start], start)]

    WHILE open_set is NOT EMPTY DO
        (_, current) ΓåÉ EXTRACT_MIN from open_set

        IF current == goal THEN
            RETURN reconstruct_path(came_from, current)
        END IF

        FOR each (neighbor, weight) IN graph[current] DO
            tentative_g ΓåÉ g_score[current] + weight
            IF tentative_g < g_score[neighbor] THEN
                came_from[neighbor] ΓåÉ current
                g_score[neighbor]   ΓåÉ tentative_g
                f_score[neighbor]   ΓåÉ tentative_g + h(neighbor)
                PUSH (f_score[neighbor], neighbor) INTO open_set
            END IF
        END FOR
    END WHILE

    RETURN []    // No path found
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
import heapq
from typing import Callable

def a_star(graph: dict, start: str, goal: str, h: Callable[[str], float]) -> list:
    g = {start: 0}
    f = {start: h(start)}
    came_from = {}
    pq = [(f[start], start)]

    while pq:
        _, current = heapq.heappop(pq)
        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            return [start] + list(reversed(path))

        for neighbor, weight in graph.get(current, []):
            tentative_g = g[current] + weight
            if tentative_g < g.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g[neighbor] = tentative_g
                f[neighbor] = tentative_g + h(neighbor)
                heapq.heappush(pq, (f[neighbor], neighbor))

    return []  # No path found
```

</TabItem>
</Tabs>

**When to use A\*:** Point-to-point shortest path when you have a good heuristic (grid maps, geographic coordinates). Game pathfinding, GPS navigation, robot motion planning.

---

### 3. Bellman-Ford ΓÇö O(VE)

Bellman-Ford handles **negative edge weights** and detects **negative-weight cycles**. Slower than Dijkstra but correct in all cases.

**How it works:** Relax all edges V-1 times. If any distance can still be reduced on the V-th pass, a negative cycle exists.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION bellman_ford(vertices: List, edges: List<(u, v, w)>, start: Vertex)
    dist ΓåÉ MAP { start: 0, all others: INFINITY }

    // Relax all edges V-1 times
    FOR i FROM 1 TO length(vertices) - 1 DO
        FOR each (u, v, weight) IN edges DO
            IF dist[u] + weight < dist[v] THEN
                dist[v] ΓåÉ dist[u] + weight
            END IF
        END FOR
    END FOR

    // Check for negative cycles
    FOR each (u, v, weight) IN edges DO
        IF dist[u] + weight < dist[v] THEN
            RETURN ERROR("Negative weight cycle detected")
        END IF
    END FOR

    RETURN dist
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def bellman_ford(vertices: list, edges: list, start: str) -> dict:
    """
    edges = [(u, v, weight), ...]  ΓÇö directed edges
    """
    dist = {v: float('inf') for v in vertices}
    dist[start] = 0

    for _ in range(len(vertices) - 1):
        for u, v, weight in edges:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight

    # Negative cycle check
    for u, v, weight in edges:
        if dist[u] + weight < dist[v]:
            raise ValueError("Negative weight cycle detected")

    return dist

vertices = ["A", "B", "C", "D"]
edges = [("A", "B", 1), ("B", "C", -3), ("C", "D", 2), ("A", "D", 10)]
print(bellman_ford(vertices, edges, "A"))  # {'A': 0, 'B': 1, 'C': -2, 'D': 0}
```

</TabItem>
</Tabs>

---

### 4. Algorithm Selection Guide

| Situation | Use |
|-----------|-----|
| Unweighted graph, shortest path | BFS |
| Weighted graph, **non-negative** weights, single source | Dijkstra |
| Weighted graph, point-to-point, good heuristic available | A* |
| Weighted graph with **negative weights** | Bellman-Ford |
| All-pairs shortest path | Floyd-Warshall (not covered here) |
| Distributed routing (network protocols) | OSPF uses Dijkstra; BGP uses path vector |

---

## ≡ƒôÜ Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- ≡ƒô║ **[NeetCode ΓÇö Dijkstra's Algorithm (YouTube, FREE)](https://www.youtube.com/watch?v=XEb7_z5dG3c)** ΓÇö Step-by-step with code
- ≡ƒô║ **[Abdul Bari ΓÇö Dijkstra's Algorithm (YouTube, FREE)](https://www.youtube.com/watch?v=XB4MIexjvY0)** ΓÇö Clear hand-trace of the algorithm

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- ≡ƒô║ **[A* Pathfinding Visualization (YouTube, FREE)](https://www.youtube.com/watch?v=-L-WgKMFuhE)** ΓÇö Visual comparison of BFS, Dijkstra, and A*
- ≡ƒôû **[Red Blob Games ΓÇö A* Intro (FREE)](https://www.redblobgames.com/pathfinding/a-star/introduction.html)** ΓÇö Best interactive A* explanation on the internet

</TabItem>
<TabItem value="practice" label="Practice">

- ≡ƒÄ« **[LeetCode #743 ΓÇö Network Delay Time (FREE)](https://leetcode.com/problems/network-delay-time/)** ΓÇö Classic Dijkstra
- ≡ƒÄ« **[LeetCode #1631 ΓÇö Path With Minimum Effort (FREE)](https://leetcode.com/problems/path-with-minimum-effort/)** ΓÇö Dijkstra on a grid
- ≡ƒÄ« **[LeetCode #787 ΓÇö Cheapest Flights Within K Stops (FREE)](https://leetcode.com/problems/cheapest-flights-within-k-stops/)** ΓÇö Bellman-Ford variant

</TabItem>
</Tabs>
