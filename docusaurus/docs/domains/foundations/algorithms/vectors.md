import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Vector Algorithms

**Section:** Algorithms › Vector Algorithms · **Prerequisite:** [Search Algorithms](./search.md), [Data Structures](../data_structures.mdx)

> **Who needs this:** AI engineers, backend engineers building search features, anyone working with embeddings, recommendations, semantic search, or clustering. Vectors are the data structure behind every modern AI system — understanding how to search and cluster them is now a core skill.

---

## 🎯 Learning Objectives

- [ ] Understand what a vector/embedding is and how it encodes meaning
- [ ] Implement cosine similarity, dot product, and Euclidean distance
- [ ] Understand exact (brute-force) nearest-neighbour search and its cost
- [ ] Understand how Approximate Nearest Neighbour (ANN) indexes work conceptually
- [ ] Implement k-Means clustering from scratch
- [ ] Understand DBSCAN and when to prefer it over k-Means
- [ ] Choose the right algorithm for a given similarity or clustering problem

---

## 📖 Concepts

### 1. What Is a Vector?

A **vector** is an ordered list of numbers that represents a point in high-dimensional space.

```
word "cat"  → [0.21, -0.83, 0.44, 0.12, ...]   (768 numbers)
word "dog"  → [0.19, -0.79, 0.51, 0.10, ...]   (768 numbers)
word "car"  → [-0.42, 0.33, -0.17, 0.88, ...]  (768 numbers)
```

**The key insight:** vectors that are geometrically close represent things that are semantically similar. "cat" and "dog" are close; "car" is far away.

A vector produced by a machine learning model to capture meaning is called an **embedding**. Text, images, audio, and code can all be embedded into vectors.

| Where you see vectors | What they represent |
|----------------------|---------------------|
| LLM semantic search | Sentences/paragraphs encoded by a language model |
| Image similarity | Visual features extracted by a CNN |
| Recommendations | User preferences and item features |
| Anomaly detection | System metrics or log patterns |
| Fraud detection | Transaction behaviour fingerprints |

---

### 2. Similarity Metrics

Before you can search or cluster vectors, you need to measure how similar two vectors are.

#### Cosine Similarity

Measures the **angle** between two vectors — ignores magnitude, focuses on direction. This is the most common metric for text embeddings.

```
range: [-1, 1]   1 = identical direction   0 = orthogonal   -1 = opposite
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION cosine_similarity(a: Vector, b: Vector) -> Float
    dot    ← 0
    mag_a  ← 0
    mag_b  ← 0

    FOR i FROM 0 TO length(a) - 1 DO
        dot   ← dot   + a[i] * b[i]
        mag_a ← mag_a + a[i] * a[i]
        mag_b ← mag_b + b[i] * b[i]
    END FOR

    IF mag_a == 0 OR mag_b == 0 THEN RETURN 0

    RETURN dot / (sqrt(mag_a) * sqrt(mag_b))
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
import math

def cosine_similarity(a: list[float], b: list[float]) -> float:
    dot   = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(y * y for y in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)

# In practice: use numpy (vectorised, 100x faster)
import numpy as np

def cosine_similarity_np(a: np.ndarray, b: np.ndarray) -> float:
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

a = np.array([0.21, -0.83, 0.44, 0.12])
b = np.array([0.19, -0.79, 0.51, 0.10])
c = np.array([-0.42, 0.33, -0.17, 0.88])

print(f"cat ↔ dog: {cosine_similarity_np(a, b):.4f}")   # high ~0.99
print(f"cat ↔ car: {cosine_similarity_np(a, c):.4f}")   # lower ~-0.60
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
        dot  += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }
    if (magA === 0 || magB === 0) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

const cat = [0.21, -0.83, 0.44, 0.12];
const dog = [0.19, -0.79, 0.51, 0.10];
const car = [-0.42, 0.33, -0.17, 0.88];

console.log(cosineSimilarity(cat, dog).toFixed(4)); // high
console.log(cosineSimilarity(cat, car).toFixed(4)); // low
```

</TabItem>
</Tabs>

#### Dot Product Similarity

The **raw dot product** (no normalisation). Faster than cosine, but sensitive to vector magnitude — only correct when vectors are already normalised to unit length. Many modern embedding models (OpenAI `text-embedding-3-*`) output unit-normalised vectors, so dot product equals cosine similarity and is preferred for speed.

```python
import numpy as np

def dot_product(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b))

# Equivalent to cosine_similarity when ||a|| == ||b|| == 1
```

#### Euclidean Distance

Measures the **straight-line distance** between two points. Lower = more similar (opposite sign to cosine similarity).

```
range: [0, ∞)   0 = identical   larger = farther apart
```

```python
import numpy as np

def euclidean_distance(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.linalg.norm(a - b))
```

**Which metric to use:**

| Metric | Use when |
|--------|----------|
| Cosine similarity | Text embeddings, varying-length content, direction matters more than magnitude |
| Dot product | Pre-normalised embeddings (unit vectors) — fastest option |
| Euclidean distance | Image features, coordinates, continuous features where scale matters |

---

### 3. Exact Nearest Neighbour Search (Brute Force)

Given a query vector, find the most similar vector in a dataset by comparing against every stored vector.

**Time:** O(n · d) — n vectors, d dimensions.  
**Acceptable for:** up to ~100K vectors. Unusable at millions.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION knn_brute(query: Vector, vectors: List<Vector>, k: Int) -> List<(Int, Float)>
    // Returns k nearest neighbours as (index, similarity) pairs
    scores ← NEW List<(Int, Float)>

    FOR i FROM 0 TO length(vectors) - 1 DO
        sim ← cosine_similarity(query, vectors[i])
        APPEND (i, sim) TO scores
    END FOR

    SORT scores BY similarity DESCENDING
    RETURN scores[0..k-1]
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
import numpy as np

def knn_brute(
    query: np.ndarray,
    vectors: np.ndarray,   # shape: (n, d)
    k: int = 5
) -> list[tuple[int, float]]:
    """Return k nearest neighbours as (index, similarity) pairs."""
    # Batch cosine similarity: dot product when vectors are L2-normalised
    # Normalise query and vectors first for cosine similarity
    query_norm = query / (np.linalg.norm(query) + 1e-10)
    norms = np.linalg.norm(vectors, axis=1, keepdims=True) + 1e-10
    vectors_norm = vectors / norms

    similarities = vectors_norm @ query_norm  # shape: (n,)
    top_k_idx = np.argsort(similarities)[::-1][:k]

    return [(int(i), float(similarities[i])) for i in top_k_idx]

# Example
np.random.seed(42)
corpus = np.random.randn(10_000, 128)   # 10K vectors, 128 dimensions
query  = np.random.randn(128)

results = knn_brute(query, corpus, k=5)
for idx, score in results:
    print(f"  [{idx}] similarity={score:.4f}")
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function knnBrute(
    query: number[],
    vectors: number[][],
    k: number
): Array<{ index: number; similarity: number }> {
    const qNorm = Math.sqrt(query.reduce((s, x) => s + x * x, 0)) || 1;
    const qUnit = query.map(x => x / qNorm);

    const scored = vectors.map((vec, index) => {
        const vNorm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0)) || 1;
        const similarity = vec.reduce((s, x, i) => s + (x / vNorm) * qUnit[i], 0);
        return { index, similarity };
    });

    return scored.sort((a, b) => b.similarity - a.similarity).slice(0, k);
}
```

</TabItem>
</Tabs>

---

### 4. Approximate Nearest Neighbour (ANN) — Conceptual

At scale (millions of vectors), exact search is too slow. **ANN indexes** trade a small amount of accuracy for massive speed gains — typically returning results 50–100x faster while finding 95–99% of the true nearest neighbours.

You don't implement ANN from scratch (just as you don't implement a B-Tree). You use a library. Understanding the concept explains why these are used in production.

#### HNSW (Hierarchical Navigable Small World)

The dominant ANN algorithm (2016). Builds a multi-layer graph where the top layers have long-range connections (fast traversal) and bottom layers have short-range connections (fine-grained search). Query: start at top layer, greedily navigate toward query, descend layers, return closest candidates.

```
Query Performance: O(log n) average
Index Build: O(n log n)
Recall: ~95–99% (tunable vs. speed tradeoff)
```

```python
# In production: use a vector database or FAISS — never implement HNSW manually
import faiss
import numpy as np

d = 128            # dimension
n = 100_000        # vectors

vectors = np.random.randn(n, d).astype(np.float32)
faiss.normalize_L2(vectors)   # normalise for cosine similarity

# Build HNSW index
index = faiss.IndexHNSWFlat(d, 32)   # 32 = connections per node (M)
index.add(vectors)

# Query
query = np.random.randn(1, d).astype(np.float32)
faiss.normalize_L2(query)
distances, indices = index.search(query, k=5)
print(indices)   # top-5 nearest neighbours
```

#### IVF (Inverted File Index)

Partitions vectors into clusters (using k-Means), then only searches the nearest clusters during query. Faster to build than HNSW, better for very large datasets (billions of vectors).

**Production vector databases** (Pinecone, Weaviate, Qdrant, pgvector) handle indexing automatically — you choose the metric and they manage the ANN index.

---

### 5. k-Means Clustering

Partitions n vectors into k groups where each vector belongs to the cluster with the nearest centroid. **Unsupervised** — you don't need labels.

**Algorithm:**
1. Initialise k centroids randomly (or with k-Means++)
2. Assign each vector to its nearest centroid
3. Recompute each centroid as the mean of its assigned vectors
4. Repeat 2–3 until centroids stop moving (convergence)

**Time:** O(n · k · d · iterations) — linear in n, practical for millions with small k.

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION kmeans(vectors: List<Vector>, k: Int, max_iter: Int = 100) -> (List<Vector>, List<Int>)
    // Returns (centroids, assignments)
    n ← length(vectors)

    // 1. Random initialisation
    centroids ← random_sample(vectors, k)

    FOR _ FROM 1 TO max_iter DO
        // 2. Assignment step
        assignments ← NEW List<Int> of size n
        FOR i FROM 0 TO n - 1 DO
            best_c   ← 0
            best_dist ← infinity
            FOR c FROM 0 TO k - 1 DO
                d ← euclidean_distance(vectors[i], centroids[c])
                IF d < best_dist THEN
                    best_dist ← d
                    best_c    ← c
                END IF
            END FOR
            assignments[i] ← best_c
        END FOR

        // 3. Update step
        new_centroids ← NEW List<Vector> of size k (all zeros)
        counts        ← NEW List<Int> of size k (all zeros)
        FOR i FROM 0 TO n - 1 DO
            c ← assignments[i]
            new_centroids[c] ← new_centroids[c] + vectors[i]
            counts[c] ← counts[c] + 1
        END FOR
        FOR c FROM 0 TO k - 1 DO
            IF counts[c] > 0 THEN
                new_centroids[c] ← new_centroids[c] / counts[c]
            END IF
        END FOR

        IF new_centroids == centroids THEN BREAK   // Converged
        centroids ← new_centroids
    END FOR

    RETURN (centroids, assignments)
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
import numpy as np

def kmeans(
    vectors: np.ndarray,   # (n, d)
    k: int,
    max_iter: int = 100,
    seed: int = 42
) -> tuple[np.ndarray, np.ndarray]:
    """Returns (centroids shape (k,d), assignments shape (n,))"""
    rng = np.random.default_rng(seed)
    n = len(vectors)

    # k-Means++ initialisation: spread initial centroids out
    idx = [rng.integers(n)]
    for _ in range(k - 1):
        dists = np.min(
            np.linalg.norm(vectors[:, None] - vectors[idx], axis=2), axis=1
        ) ** 2
        idx.append(rng.choice(n, p=dists / dists.sum()))
    centroids = vectors[idx].copy()   # (k, d)

    for iteration in range(max_iter):
        # Assignment: each vector → nearest centroid
        # Vectorised: (n,k) distance matrix
        diffs = vectors[:, None, :] - centroids[None, :, :]   # (n, k, d)
        dists = np.linalg.norm(diffs, axis=2)                  # (n, k)
        assignments = np.argmin(dists, axis=1)                 # (n,)

        # Update: recompute centroids
        new_centroids = np.array([
            vectors[assignments == c].mean(axis=0) if (assignments == c).any()
            else centroids[c]
            for c in range(k)
        ])

        if np.allclose(centroids, new_centroids):
            print(f"Converged at iteration {iteration + 1}")
            break
        centroids = new_centroids

    return centroids, assignments

# Example: cluster 2D points
np.random.seed(42)
cluster_a = np.random.randn(100, 2) + [2, 2]
cluster_b = np.random.randn(100, 2) + [-2, -2]
cluster_c = np.random.randn(100, 2) + [2, -2]
data = np.vstack([cluster_a, cluster_b, cluster_c])

centroids, labels = kmeans(data, k=3)
print(f"Centroids:\n{centroids.round(2)}")
print(f"Cluster sizes: {[(labels == i).sum() for i in range(3)]}")

# In production: sklearn is optimised and handles edge cases
from sklearn.cluster import KMeans
km = KMeans(n_clusters=3, n_init='auto', random_state=42)
km.fit(data)
print(km.cluster_centers_.round(2))
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function kmeans(
    vectors: number[][],
    k: number,
    maxIter = 100
): { centroids: number[][]; assignments: number[] } {
    const n = vectors.length;
    const d = vectors[0].length;

    // Random initialisation
    const indices = [...Array(n).keys()].sort(() => Math.random() - 0.5).slice(0, k);
    let centroids = indices.map(i => [...vectors[i]]);

    let assignments = new Array(n).fill(0);

    for (let iter = 0; iter < maxIter; iter++) {
        // Assignment step
        const newAssign = vectors.map(vec => {
            let bestC = 0, bestDist = Infinity;
            for (let c = 0; c < k; c++) {
                const dist = Math.sqrt(
                    vec.reduce((s, x, i) => s + (x - centroids[c][i]) ** 2, 0)
                );
                if (dist < bestDist) { bestDist = dist; bestC = c; }
            }
            return bestC;
        });

        // Update step
        const newCentroids = Array.from({ length: k }, () => new Array(d).fill(0));
        const counts = new Array(k).fill(0);
        newAssign.forEach((c, i) => {
            vectors[i].forEach((x, j) => { newCentroids[c][j] += x; });
            counts[c]++;
        });
        newCentroids.forEach((centroid, c) => {
            if (counts[c] > 0) centroid.forEach((_, j) => { centroid[j] /= counts[c]; });
        });

        const converged = JSON.stringify(newCentroids) === JSON.stringify(centroids);
        centroids = newCentroids;
        assignments = newAssign;
        if (converged) break;
    }

    return { centroids, assignments };
}
```

</TabItem>
</Tabs>

:::tip[Research Question 🔍]
k-Means has a known weakness: the result depends on the initial random centroid placement. What is **k-Means++** initialisation and how does it mitigate this? Why does k-Means struggle with clusters of very different sizes or non-spherical shapes?
:::

---

### 6. DBSCAN — Density-Based Clustering

**Density-Based Spatial Clustering of Applications with Noise.** Unlike k-Means, you don't specify k — clusters emerge from density. Points in sparse regions are labelled as **noise** (outliers).

**Two parameters:**
- `epsilon (ε)` — neighbourhood radius: how close points must be to be "neighbours"
- `min_samples` — minimum neighbours to be a "core point"

**Three point types:**
- **Core point** — has ≥ `min_samples` neighbours within ε
- **Border point** — within ε of a core point, but not a core point itself
- **Noise point** — not reachable from any core point

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION dbscan(vectors: List<Vector>, epsilon: Float, min_samples: Int) -> List<Int>
    // Returns cluster labels (-1 = noise)
    n      ← length(vectors)
    labels ← array of n values, all -1 (unvisited)
    cluster_id ← 0

    FOR i FROM 0 TO n - 1 DO
        IF labels[i] != -1 THEN CONTINUE   // Already visited

        neighbours ← range_query(vectors, i, epsilon)

        IF length(neighbours) < min_samples THEN
            labels[i] ← -1   // Noise (may change if reached by another core point)
            CONTINUE
        END IF

        // Start new cluster
        labels[i] ← cluster_id
        seed_set ← neighbours \ {i}

        WHILE seed_set is not empty DO
            j ← pop from seed_set
            IF labels[j] == -1 THEN labels[j] ← cluster_id   // Noise → border
            IF labels[j] != -1 THEN CONTINUE                  // Already assigned

            labels[j] ← cluster_id
            neighbours_j ← range_query(vectors, j, epsilon)
            IF length(neighbours_j) >= min_samples THEN
                seed_set ← seed_set ∪ neighbours_j
            END IF
        END WHILE

        cluster_id ← cluster_id + 1
    END FOR

    RETURN labels
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
import numpy as np

def dbscan(
    vectors: np.ndarray,
    epsilon: float,
    min_samples: int
) -> np.ndarray:
    """Returns cluster labels. -1 = noise."""
    n = len(vectors)
    labels = np.full(n, -2)   # -2 = unvisited
    cluster_id = 0

    def range_query(idx: int) -> list[int]:
        dists = np.linalg.norm(vectors - vectors[idx], axis=1)
        return list(np.where(dists <= epsilon)[0])

    for i in range(n):
        if labels[i] != -2:
            continue

        neighbours = range_query(i)

        if len(neighbours) < min_samples:
            labels[i] = -1   # noise
            continue

        labels[i] = cluster_id
        seed_set = set(neighbours) - {i}

        while seed_set:
            j = seed_set.pop()
            if labels[j] == -1:
                labels[j] = cluster_id   # noise → border point
            if labels[j] != -2:
                continue
            labels[j] = cluster_id
            n_j = range_query(j)
            if len(n_j) >= min_samples:
                seed_set.update(n_j)

        cluster_id += 1

    return labels

# Example: two blobs + outliers
np.random.seed(42)
cluster_a = np.random.randn(80, 2) + [0, 0]
cluster_b = np.random.randn(80, 2) + [5, 5]
noise     = np.random.uniform(-4, 9, (20, 2))
data = np.vstack([cluster_a, cluster_b, noise])

labels = dbscan(data, epsilon=0.8, min_samples=5)
unique, counts = np.unique(labels, return_counts=True)
for lbl, cnt in zip(unique, counts):
    name = "noise" if lbl == -1 else f"cluster {lbl}"
    print(f"  {name}: {cnt} points")

# In production: sklearn (much faster for large datasets)
from sklearn.cluster import DBSCAN
db = DBSCAN(eps=0.8, min_samples=5)
labels = db.fit_predict(data)
```

</TabItem>
</Tabs>

:::tip[Research Question 🔍]
How do you choose `epsilon` for DBSCAN? (Hint: k-distance graph.) What happens if `epsilon` is too large? Too small? Why does DBSCAN outperform k-Means on ring-shaped or elongated clusters?
:::

---

### 7. Algorithm Selection Guide

| Scenario | Algorithm | Notes |
|----------|-----------|-------|
| "Is this sentence similar to that one?" | Cosine similarity | Single comparison |
| "Find the 10 most similar documents" — up to ~100K | Brute-force kNN | Simple, exact |
| "Find similar items in 1M+ vector collection" | ANN (HNSW/IVF via FAISS, pgvector) | Use a library |
| "Group these documents into topics" — know number of groups | k-Means | Fast, scalable |
| "Find clusters without knowing how many" | DBSCAN | Handles noise, arbitrary shapes |
| "Find anomalies / outliers in embeddings" | DBSCAN | Noise points = outliers |
| "Content-based recommendations" | kNN on embeddings | Each user/item is a vector |

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- 📺 **[3Blue1Brown — Vectors, what even are they? (YouTube, FREE)](https://www.youtube.com/watch?v=fNk_zzaMoSs)** — Visual intuition for what a vector is
- 📚 **[Andrej Karpathy — A Recipe for Training Neural Networks (FREE)](http://karpathy.github.io/2019/04/25/recipe/)** — Covers embeddings and how vectors encode meaning
- 📚 **[Pinecone — What is a Vector Database? (FREE)](https://www.pinecone.io/learn/vector-database/)** — Practical context for ANN in production

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📺 **[StatQuest — k-Means Clustering (YouTube, FREE)](https://www.youtube.com/watch?v=4b5d3muPQmA)** — Clear visual walkthrough with intuition
- 📺 **[StatQuest — DBSCAN (YouTube, FREE)](https://www.youtube.com/watch?v=RDZUdRSDOok)** — Visual explanation of density-based clustering
- 📚 **[FAISS Documentation (FREE)](https://faiss.ai/)** — Production ANN library from Meta

</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[LeetCode #973 — K Closest Points to Origin (FREE)](https://leetcode.com/problems/k-closest-points-to-origin/)** — kNN on 2D points
- 🎮 **[Kaggle — Customer Segmentation with k-Means (FREE)](https://www.kaggle.com/datasets/vjchoudhary7/customer-segmentation-tutorial-in-python)** — Real dataset, real clustering task
- 🛠️ **Build: semantic search over your own documents** — Embed 100 docs with `sentence-transformers`, query with cosine kNN

</TabItem>
</Tabs>

---

## 🏗️ Assignment — Semantic Document Search

Build a mini semantic search engine over a small document collection.

**Stack:** Python + `sentence-transformers` + `numpy` (no external vector DB — build the search yourself)

- [ ] Load 50–100 text snippets (Wikipedia intros, your own notes, anything)
- [ ] Embed each with `SentenceTransformer('all-MiniLM-L6-v2')` (free, runs locally, 384-dim vectors)
- [ ] Store embeddings as a `numpy` array
- [ ] Implement brute-force cosine kNN search
- [ ] Accept a query string, embed it, return top-5 most similar documents
- [ ] Time a search over 10K random vectors and note the ms cost
- [ ] **Stretch:** Cluster the embeddings with k-Means (k=5–10), label each cluster by inspecting its members — what topics emerge?

```python
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')

docs = ["Python is a high-level programming language.", "Docker containers isolate processes.", ...]
embeddings = model.encode(docs, normalize_embeddings=True)   # (n, 384)

query = "how do I package a Python app?"
q_vec = model.encode([query], normalize_embeddings=True)
scores = embeddings @ q_vec.T   # cosine similarity (vectors are normalised)
top5 = np.argsort(scores.flatten())[::-1][:5]
for i in top5:
    print(f"  [{scores[i][0]:.3f}] {docs[i]}")
```

---

## ✅ Milestone Checklist

- [ ] Can explain the difference between cosine similarity and Euclidean distance and when to use each
- [ ] Can implement brute-force kNN from scratch (no libraries)
- [ ] Can explain why ANN is necessary at scale and name one algorithm (HNSW or IVF)
- [ ] Can implement k-Means from scratch including the k-Means++ initialisation step
- [ ] Can explain when DBSCAN is a better choice than k-Means
- [ ] Have completed the semantic search assignment and committed it to GitHub

---

## 🏆 Section Complete

> **You can now work with vectors — the data structure that powers all modern AI.**
>
> Every LLM application, recommendation system, and semantic search tool you build will use these algorithms. You understand what's happening inside the vector database.

**Log this in your kanban:** Move `foundations/algorithms/vectors` to ✅ Done.
