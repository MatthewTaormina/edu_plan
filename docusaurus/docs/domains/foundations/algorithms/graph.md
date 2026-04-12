import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Graph Traversal

**Section:** Algorithms › Graph Traversal · **Prerequisite:** [Recursion & Dynamic Programming](./recursion.md)

> **Who needs this:** Graphs model almost everything — networks, dependencies, social connections, maps, state machines. BFS and DFS are the two fundamental operations on graphs and appear constantly in real systems (dependency resolution, web crawlers, route planning, AI game trees).

---

## 🎯 Learning Objectives

- [ ] Represent a graph as an adjacency list and adjacency matrix
- [ ] Implement BFS and explain what it guarantees (shortest path in unweighted graphs)
- [ ] Implement DFS iteratively and recursively
- [ ] Detect cycles in a graph using DFS
- [ ] Perform topological sort using Kahn's algorithm (BFS-based)
- [ ] Know when to use BFS vs DFS for a given problem

---

## 📖 Concepts

### 1. Graph Representation

A graph has **vertices** (nodes) and **edges** (connections). Edges can be **directed** or **undirected**, and **weighted** or **unweighted**.

**Adjacency list** — most common for sparse graphs:

```
Graph:  A — B — D
        |   |
        C — E

adjacency_list = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "E"],
    "D": ["B"],
    "E": ["B", "C"],
}
```

**Adjacency matrix** — fast edge existence check, but O(V²) space:

```
     A  B  C  D  E
A  [ 0  1  1  0  0 ]
B  [ 1  0  0  1  1 ]
C  [ 1  0  0  0  1 ]
D  [ 0  1  0  0  0 ]
E  [ 0  1  1  0  0 ]
```

**When to use what:**
- **Adjacency list:** Most algorithms. O(V+E) space. Good for sparse graphs.
- **Adjacency matrix:** When you need O(1) "does edge exist?" checks. Only practical for dense graphs.

---

### 2. Breadth-First Search (BFS) — O(V+E)

BFS explores level by level — all neighbors of a node before moving deeper. Uses a **queue**. Key property: **BFS always finds the shortest path in an unweighted graph.**

```
Start at A:
Level 0: [A]
Level 1: [B, C]       (A's neighbors)
Level 2: [D, E]       (B and C's unvisited neighbors)

Shortest path A → D = A → B → D (2 hops)
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION bfs(graph: AdjacencyList, start: Vertex) -> List<Vertex>
    visited ← SET {}
    queue   ← QUEUE [start]
    order   ← []

    ADD start TO visited

    WHILE queue is NOT EMPTY DO
        node ← DEQUEUE from queue
        APPEND node TO order

        FOR each neighbor IN graph[node] DO
            IF neighbor NOT IN visited THEN
                ADD neighbor TO visited
                ENQUEUE neighbor INTO queue
            END IF
        END FOR
    END WHILE

    RETURN order
END FUNCTION

// BFS shortest path — returns distance from start to each node
FUNCTION bfs_distances(graph: AdjacencyList, start: Vertex) -> Map<Vertex, Int>
    dist  ← MAP { start: 0 }
    queue ← QUEUE [start]

    WHILE queue is NOT EMPTY DO
        node ← DEQUEUE from queue
        FOR each neighbor IN graph[node] DO
            IF neighbor NOT IN dist THEN
                dist[neighbor] ← dist[node] + 1
                ENQUEUE neighbor INTO queue
            END IF
        END FOR
    END WHILE

    RETURN dist
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
from collections import deque

def bfs(graph: dict, start: str) -> list:
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order

def bfs_distances(graph: dict, start: str) -> dict:
    dist = {start: 0}
    queue = deque([start])

    while queue:
        node = queue.popleft()
        for neighbor in graph.get(node, []):
            if neighbor not in dist:
                dist[neighbor] = dist[node] + 1
                queue.append(neighbor)

    return dist

graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "E"],
    "D": ["B"],
    "E": ["B", "C"],
}
print(bfs(graph, "A"))           # ['A', 'B', 'C', 'D', 'E']
print(bfs_distances(graph, "A")) # {'A': 0, 'B': 1, 'C': 1, 'D': 2, 'E': 2}
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function bfs(graph: Record<string, string[]>, start: string): string[] {
    const visited = new Set([start]);
    const queue = [start];
    const order: string[] = [];

    while (queue.length) {
        const node = queue.shift()!;
        order.push(node);
        for (const neighbor of graph[node] ?? []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    return order;
}

function bfsDistances(graph: Record<string, string[]>, start: string): Record<string, number> {
    const dist: Record<string, number> = { [start]: 0 };
    const queue = [start];

    while (queue.length) {
        const node = queue.shift()!;
        for (const neighbor of graph[node] ?? []) {
            if (!(neighbor in dist)) {
                dist[neighbor] = dist[node] + 1;
                queue.push(neighbor);
            }
        }
    }
    return dist;
}
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use std::collections::{HashMap, HashSet, VecDeque};

fn bfs(graph: &HashMap<&str, Vec<&str>>, start: &str) -> Vec<String> {
    let mut visited = HashSet::from([start]);
    let mut queue = VecDeque::from([start]);
    let mut order = vec![];

    while let Some(node) = queue.pop_front() {
        order.push(node.to_string());
        if let Some(neighbors) = graph.get(node) {
            for &neighbor in neighbors {
                if visited.insert(neighbor) {
                    queue.push_back(neighbor);
                }
            }
        }
    }
    order
}
```

</TabItem>
</Tabs>

**When to use BFS:**
- Shortest path in **unweighted** graphs (guaranteed)
- Level-order traversal of trees
- Web crawler (explore pages by link depth)
- Finding all nodes within k hops

---

### 3. Depth-First Search (DFS) — O(V+E)

DFS explores as deep as possible before backtracking. Can be implemented **recursively** (using the call stack) or **iteratively** (using an explicit stack). No shortest-path guarantee, but excellent for **cycle detection, reachability, and topological sort**.

```
Start at A (DFS):
Visit A → go deep to B → go deep to D → backtrack to B → go to E → backtrack...

One possible DFS order: A, B, D, E, C
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
// Recursive DFS
FUNCTION dfs(graph: AdjacencyList, node: Vertex, visited: Set) -> Void
    ADD node TO visited
    PROCESS(node)

    FOR each neighbor IN graph[node] DO
        IF neighbor NOT IN visited THEN
            dfs(graph, neighbor, visited)
        END IF
    END FOR
END FUNCTION

// Iterative DFS (explicit stack)
FUNCTION dfs_iterative(graph: AdjacencyList, start: Vertex) -> List<Vertex>
    visited ← SET {}
    stack   ← STACK [start]
    order   ← []

    WHILE stack is NOT EMPTY DO
        node ← POP from stack
        IF node NOT IN visited THEN
            ADD node TO visited
            APPEND node TO order
            FOR each neighbor IN graph[node] DO
                IF neighbor NOT IN visited THEN
                    PUSH neighbor ONTO stack
                END IF
            END FOR
        END IF
    END WHILE

    RETURN order
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def dfs_recursive(graph: dict, node: str, visited: set = None) -> list:
    if visited is None:
        visited = set()
    visited.add(node)
    order = [node]
    for neighbor in graph.get(node, []):
        if neighbor not in visited:
            order.extend(dfs_recursive(graph, neighbor, visited))
    return order

def dfs_iterative(graph: dict, start: str) -> list:
    visited = set()
    stack = [start]
    order = []

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            for neighbor in reversed(graph.get(node, [])):
                if neighbor not in visited:
                    stack.append(neighbor)

    return order
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function dfsRecursive(
    graph: Record<string, string[]>,
    node: string,
    visited = new Set<string>()
): string[] {
    visited.add(node);
    const order = [node];
    for (const neighbor of graph[node] ?? []) {
        if (!visited.has(neighbor)) {
            order.push(...dfsRecursive(graph, neighbor, visited));
        }
    }
    return order;
}

function dfsIterative(graph: Record<string, string[]>, start: string): string[] {
    const visited = new Set<string>();
    const stack = [start];
    const order: string[] = [];

    while (stack.length) {
        const node = stack.pop()!;
        if (!visited.has(node)) {
            visited.add(node);
            order.push(node);
            for (const neighbor of [...(graph[node] ?? [])].reverse()) {
                if (!visited.has(neighbor)) stack.push(neighbor);
            }
        }
    }
    return order;
}
```

</TabItem>
</Tabs>

**When to use DFS:**
- Cycle detection in directed/undirected graphs
- Finding connected components
- Maze solving (explore to dead end, backtrack)
- Generating topological orderings
- Tree traversals (see [Data Structures](../data_structures.mdx))

---

### 4. Cycle Detection with DFS

In a **directed** graph, a cycle exists if DFS reaches a node that's currently being processed (it's in the current recursion stack, not just visited).

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
// Returns true if directed graph has a cycle
FUNCTION has_cycle(graph: AdjacencyList) -> Bool
    visited   ← SET {}    // Fully processed nodes
    rec_stack ← SET {}    // Nodes in current DFS path

    FOR each node IN graph DO
        IF node NOT IN visited THEN
            IF dfs_cycle(graph, node, visited, rec_stack) THEN
                RETURN TRUE
            END IF
        END IF
    END FOR
    RETURN FALSE
END FUNCTION

FUNCTION dfs_cycle(graph, node, visited, rec_stack) -> Bool
    ADD node TO visited
    ADD node TO rec_stack

    FOR each neighbor IN graph[node] DO
        IF neighbor IN rec_stack THEN
            RETURN TRUE    // Back edge — cycle found!
        END IF
        IF neighbor NOT IN visited THEN
            IF dfs_cycle(graph, neighbor, visited, rec_stack) THEN
                RETURN TRUE
            END IF
        END IF
    END FOR

    REMOVE node FROM rec_stack    // Done processing this path
    RETURN FALSE
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def has_cycle(graph: dict) -> bool:
    visited = set()
    rec_stack = set()

    def dfs(node: str) -> bool:
        visited.add(node)
        rec_stack.add(node)
        for neighbor in graph.get(node, []):
            if neighbor in rec_stack:
                return True
            if neighbor not in visited and dfs(neighbor):
                return True
        rec_stack.discard(node)
        return False

    return any(dfs(node) for node in graph if node not in visited)

dag   = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}
cycle = {"A": ["B"], "B": ["C"], "C": ["A"]}
print(has_cycle(dag))   # False
print(has_cycle(cycle)) # True
```

</TabItem>
</Tabs>

---

### 5. Topological Sort — Kahn's Algorithm (BFS-based)

**Topological sort** orders the nodes of a **directed acyclic graph (DAG)** such that every edge points forward — no node comes before its prerequisites.

**Use case:** Task scheduling, dependency resolution (npm install, make), course prerequisites.

```
Dependencies:
  A → C        (A must come before C)
  B → C, D     (B must come before C and D)
  C → E

Valid topological order: A, B, C, D, E  (or B, A, C, D, E)
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
// Kahn's Algorithm — BFS-based topological sort
FUNCTION topological_sort(graph: AdjacencyList) -> List<Vertex>
    // Count incoming edges for each node
    in_degree ← MAP { each node: 0 }
    FOR each node IN graph DO
        FOR each neighbor IN graph[node] DO
            in_degree[neighbor] ← in_degree[neighbor] + 1
        END FOR
    END FOR

    // Start with all nodes that have no incoming edges
    queue  ← QUEUE [ all nodes where in_degree[node] == 0 ]
    result ← []

    WHILE queue is NOT EMPTY DO
        node ← DEQUEUE from queue
        APPEND node TO result
        FOR each neighbor IN graph[node] DO
            in_degree[neighbor] ← in_degree[neighbor] - 1
            IF in_degree[neighbor] == 0 THEN
                ENQUEUE neighbor INTO queue
            END IF
        END FOR
    END WHILE

    // If result has fewer nodes than graph, there's a cycle
    IF length(result) != length(graph) THEN
        RETURN ERROR("Graph has a cycle — topological sort not possible")
    END IF
    RETURN result
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
from collections import deque

def topological_sort(graph: dict) -> list:
    in_degree = {node: 0 for node in graph}
    for node in graph:
        for neighbor in graph[node]:
            in_degree[neighbor] = in_degree.get(neighbor, 0) + 1

    queue = deque(node for node, d in in_degree.items() if d == 0)
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph.get(node, []):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if len(result) != len(graph):
        raise ValueError("Graph has a cycle")
    return result

graph = {"A": ["C"], "B": ["C", "D"], "C": ["E"], "D": [], "E": []}
print(topological_sort(graph))  # → ['A', 'B', 'C', 'D', 'E'] (one valid order)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function topologicalSort(graph: Record<string, string[]>): string[] {
    const inDegree: Record<string, number> = {};
    for (const node of Object.keys(graph)) inDegree[node] = 0;
    for (const [, neighbors] of Object.entries(graph)) {
        for (const n of neighbors) inDegree[n] = (inDegree[n] ?? 0) + 1;
    }

    const queue = Object.keys(graph).filter(n => inDegree[n] === 0);
    const result: string[] = [];

    while (queue.length) {
        const node = queue.shift()!;
        result.push(node);
        for (const neighbor of graph[node] ?? []) {
            if (--inDegree[neighbor] === 0) queue.push(neighbor);
        }
    }

    if (result.length !== Object.keys(graph).length) throw new Error("Cycle detected");
    return result;
}
```

</TabItem>
</Tabs>

---

### 6. BFS vs DFS — When to Use Which

| Goal | Use |
|------|-----|
| Shortest path in unweighted graph | **BFS** |
| Detect cycles (directed graph) | **DFS** (with recursion stack) |
| Topological sort | **BFS** (Kahn's) or DFS (post-order) |
| Explore all reachable nodes | Either |
| Solve a maze | **DFS** (explore paths to end) |
| Check if bipartite | **BFS** |
| Find connected components | Either |
| Tree traversal (pre/in/post order) | **DFS** |
| Level-order tree traversal | **BFS** |

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- 📺 **[NeetCode — Graph Algorithms (YouTube, FREE)](https://www.youtube.com/playlist?list=PLot-Xpze53ldV9xhr55QLJ04WcJEGoN0X)** — BFS, DFS, cycle detection with practical problems
- 📺 **[Abdul Bari — BFS and DFS (YouTube, FREE)](https://www.youtube.com/watch?v=pcKY4hjDrxk)** — Clear walkthrough with visual examples

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📖 **[Visualgo — Graph Traversal (FREE)](https://visualgo.net/en/dfsbfs)** — Animate BFS and DFS on custom graphs
- 📺 **[MIT 6.006 — Graph Algorithms (YouTube, FREE)](https://www.youtube.com/watch?v=s-CYnVz-uh4)** — Rigorous treatment of BFS/DFS and their properties

</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[LeetCode #200 — Number of Islands (FREE)](https://leetcode.com/problems/number-of-islands/)** — Classic BFS/DFS connected components
- 🎮 **[LeetCode #207 — Course Schedule (FREE)](https://leetcode.com/problems/course-schedule/)** — Cycle detection / topological sort
- 🎮 **[LeetCode #127 — Word Ladder (FREE)](https://leetcode.com/problems/word-ladder/)** — BFS shortest path
- 🎮 **[LeetCode #210 — Course Schedule II (FREE)](https://leetcode.com/problems/course-schedule-ii/)** — Return actual topological order

</TabItem>
</Tabs>

---

## ➡️ Next

→ [Pathfinding Algorithms](./pathfinding.md)
