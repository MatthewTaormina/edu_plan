import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Backtracking

**Section:** Algorithms › Backtracking · **Prerequisite:** [Greedy Algorithms](./greedy.md)

> **Who needs this:** Anyone solving constraint satisfaction problems — puzzles, combinatorics, game AI. Backtracking is the systematic approach for problems where you must explore many possibilities but can prune invalid branches early. It powers Sudoku solvers, chess engines (at the base level), scheduling systems, and compiler type-checkers.

---

## 🎯 Learning Objectives

- [ ] State the three-step backtracking pattern: choose → explore → unchoose
- [ ] Implement N-Queens using backtracking
- [ ] Implement a Sudoku solver using backtracking
- [ ] Generate all subsets and permutations of a set
- [ ] Recognize when to prune a branch (constraint violation)

---

## 📖 Concepts

### 1. The Backtracking Pattern

Backtracking is **exhaustive search with smart pruning**. At each step you:

1. **Choose:** Pick a candidate for the current decision point
2. **Explore:** Recurse deeper with this choice applied
3. **Unchoose (backtrack):** Undo the choice and try the next candidate

```
FUNCTION backtrack(state, choices):
    IF state is a complete solution THEN
        record(state)
        RETURN

    FOR each choice IN valid_choices(state) DO
        make(choice)              // Step 1: Choose
        backtrack(state, choices) // Step 2: Explore
        undo(choice)              // Step 3: Unchoose
    END FOR
```

The key insight: **as soon as a partial state violates a constraint, stop exploring that branch.** This pruning transforms brute-force search from O(n!) to something tractable for many practical inputs.

---

### 2. Generating All Subsets

**Problem:** Given a set of distinct integers, return all possible subsets (the power set).

```
Input: [1, 2, 3]
Output: [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]

At each element, two choices: include or exclude.
Decision tree (include=Y, exclude=N):
        []
    Y /    N \
   [1]      []
  Y/ N\   Y/ N\
[1,2][1][2] []
...
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION subsets(nums: List<Int>) -> List<List<Int>>
    result ← [[]]   // Start with empty subset
    current ← []

    FUNCTION backtrack(start: Int) -> Void
        FOR i FROM start TO length(nums) - 1 DO
            APPEND nums[i] TO current
            APPEND copy(current) TO result  // Record current subset
            backtrack(i + 1)                // Explore further
            REMOVE last element FROM current // Unchoose
        END FOR
    END FUNCTION

    backtrack(0)
    RETURN result
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def subsets(nums: list[int]) -> list[list[int]]:
    result = [[]]
    current = []

    def backtrack(start: int) -> None:
        for i in range(start, len(nums)):
            current.append(nums[i])          # Choose
            result.append(current.copy())    # Record
            backtrack(i + 1)                 # Explore
            current.pop()                    # Unchoose

    backtrack(0)
    return result

print(subsets([1, 2, 3]))
# [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function subsets(nums: number[]): number[][] {
    const result: number[][] = [[]];
    const current: number[] = [];

    function backtrack(start: number): void {
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);
            result.push([...current]);
            backtrack(i + 1);
            current.pop();
        }
    }

    backtrack(0);
    return result;
}
```

</TabItem>
</Tabs>

---

### 3. N-Queens Problem

**Problem:** Place N queens on an N×N chessboard so that no two queens threaten each other (no shared row, column, or diagonal).

```
4-Queens solution (one valid):
. Q . .
. . . Q
Q . . .
. . Q .

Columns used: 1, 3, 0, 2
```

**Pruning:** Before placing a queen in (row, col), check:
- No other queen in the same column
- No other queen on the same diagonal (|row1-row2| == |col1-col2|)

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION solve_n_queens(n: Int) -> List<List<String>>
    results    ← []
    queens     ← []   // queens[row] = column of queen in that row
    cols       ← SET {}
    diag1      ← SET {}  // (row - col) is constant along \ diagonal
    diag2      ← SET {}  // (row + col) is constant along / diagonal

    FUNCTION backtrack(row: Int) -> Void
        IF row == n THEN
            results.append(build_board(queens, n))
            RETURN
        END IF

        FOR col FROM 0 TO n - 1 DO
            IF col IN cols OR (row-col) IN diag1 OR (row+col) IN diag2 THEN
                CONTINUE    // Pruning — this placement is invalid
            END IF

            // Choose
            ADD col TO cols; ADD (row-col) TO diag1; ADD (row+col) TO diag2
            queens.append(col)

            backtrack(row + 1)   // Explore next row

            // Unchoose
            REMOVE col FROM cols; REMOVE (row-col) FROM diag1; REMOVE (row+col) FROM diag2
            queens.pop()
        END FOR
    END FUNCTION

    backtrack(0)
    RETURN results
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def solve_n_queens(n: int) -> list[list[str]]:
    results = []
    queens = []        # queens[row] = col
    cols = set()
    diag1 = set()     # row - col
    diag2 = set()     # row + col

    def backtrack(row: int) -> None:
        if row == n:
            board = []
            for col in queens:
                board.append('.' * col + 'Q' + '.' * (n - col - 1))
            results.append(board)
            return

        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue  # Pruning

            # Choose
            cols.add(col); diag1.add(row - col); diag2.add(row + col)
            queens.append(col)

            backtrack(row + 1)  # Explore

            # Unchoose
            cols.discard(col); diag1.discard(row - col); diag2.discard(row + col)
            queens.pop()

    backtrack(0)
    return results

solutions = solve_n_queens(4)
print(f"Found {len(solutions)} solutions")  # Found 2 solutions
for sol in solutions:
    for row in sol:
        print(row)
    print()
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function solveNQueens(n: number): string[][] {
    const results: string[][] = [];
    const queens: number[] = [];
    const cols = new Set<number>();
    const diag1 = new Set<number>();
    const diag2 = new Set<number>();

    function backtrack(row: number): void {
        if (row === n) {
            results.push(queens.map(col => '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1)));
            return;
        }
        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
            cols.add(col); diag1.add(row - col); diag2.add(row + col);
            queens.push(col);
            backtrack(row + 1);
            queens.pop();
            cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
        }
    }

    backtrack(0);
    return results;
}
```

</TabItem>
</Tabs>

---

### 4. Sudoku Solver

**Problem:** Fill a 9×9 grid so every row, column, and 3×3 box contains digits 1–9 exactly once.

```
Strategy:
1. Find the next empty cell
2. Try digits 1–9; skip any that violate constraints
3. Recurse to fill the next empty cell
4. If no digit works, backtrack to the previous cell
```

<Tabs>
<TabItem value="pseudo" label="Pseudocode">

```pseudocode
FUNCTION solve_sudoku(board: 9x9 Grid) -> Bool
    FOR row FROM 0 TO 8 DO
        FOR col FROM 0 TO 8 DO
            IF board[row][col] == EMPTY THEN
                FOR digit FROM 1 TO 9 DO
                    IF is_valid(board, row, col, digit) THEN
                        board[row][col] ← digit          // Choose
                        IF solve_sudoku(board) THEN
                            RETURN TRUE                  // Solution found
                        END IF
                        board[row][col] ← EMPTY          // Unchoose (backtrack)
                    END IF
                END FOR
                RETURN FALSE    // No digit worked — backtrack further
            END IF
        END FOR
    END FOR
    RETURN TRUE    // All cells filled — solution complete!
END FUNCTION

FUNCTION is_valid(board, row, col, digit) -> Bool
    // Check row
    IF digit IN board[row] THEN RETURN FALSE
    // Check column
    IF digit IN column col of board THEN RETURN FALSE
    // Check 3x3 box
    box_row ← (row / 3) * 3
    box_col ← (col / 3) * 3
    IF digit IN board[box_row..box_row+2][box_col..box_col+2] THEN RETURN FALSE
    RETURN TRUE
END FUNCTION
```

</TabItem>
<TabItem value="python" label="Python">

```python
def solve_sudoku(board: list[list[int]]) -> bool:
    """Solves in-place. Returns True if solved, False if unsolvable."""

    def is_valid(row: int, col: int, digit: int) -> bool:
        # Row check
        if digit in board[row]:
            return False
        # Column check
        if any(board[r][col] == digit for r in range(9)):
            return False
        # 3×3 box check
        br, bc = (row // 3) * 3, (col // 3) * 3
        return not any(board[br + dr][bc + dc] == digit
                       for dr in range(3) for dc in range(3))

    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:  # Empty cell
                for digit in range(1, 10):
                    if is_valid(row, col, digit):
                        board[row][col] = digit
                        if solve_sudoku(board):
                            return True
                        board[row][col] = 0  # Backtrack
                return False  # No valid digit — backtrack further

    return True  # All cells filled
```

</TabItem>
</Tabs>

---

### 5. Subset Sum (Decision Version)

**Problem:** Given a list of integers and a target, does any subset sum to the target?

```
nums = [3, 1, 4, 2, 2]   target = 6
Solution: {4, 2} or {3, 1, 2} → True
```

<Tabs>
<TabItem value="python" label="Python">

```python
def subset_sum(nums: list[int], target: int) -> bool:
    def backtrack(index: int, remaining: int) -> bool:
        if remaining == 0:
            return True   # Found a valid subset
        if index >= len(nums) or remaining < 0:
            return False  # Pruning: past end or overshot

        # Choose: include nums[index]
        if backtrack(index + 1, remaining - nums[index]):
            return True

        # Skip: exclude nums[index]
        return backtrack(index + 1, remaining)

    return backtrack(0, target)

print(subset_sum([3, 1, 4, 2, 2], 6))   # True
print(subset_sum([3, 1, 4, 2, 2], 11))  # False
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
function subsetSum(nums: number[], target: number): boolean {
    function backtrack(idx: number, remaining: number): boolean {
        if (remaining === 0) return true;
        if (idx >= nums.length || remaining < 0) return false;
        return backtrack(idx + 1, remaining - nums[idx]) ||
               backtrack(idx + 1, remaining);
    }
    return backtrack(0, target);
}
```

</TabItem>
</Tabs>

:::note DP vs Backtracking for Subset Sum
This backtracking solution is O(2ⁿ) worst case. The **optimization version** (minimum subsets, count of subsets) is solved with DP in O(n × target) time. Backtracking is appropriate for the **decision version** when you also need to enumerate solutions.
:::

---

### 6. Backtracking Complexity

Backtracking is exponential in the worst case — that's inherent to the problem class. The art is in **tight pruning**:

| Problem | Without pruning | With pruning |
|---------|----------------|-------------|
| N-Queens | O(N!) | O(N!) worst but far fewer nodes visited |
| Sudoku | O(9^81) | Typically solves in microseconds |
| Subset sum | O(2ⁿ) | O(2ⁿ) worst, but early exits help |

Good backtracking implementations track constraints with efficient data structures (sets, bitboards) so each validity check is O(1), not O(n).

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- 📺 **[NeetCode — Backtracking (YouTube, FREE)](https://www.youtube.com/watch?v=A80YzvNwqXA)** — Template approach with subsets, permutations, and combinations
- 📺 **[Back to Back SWE — N Queens (YouTube, FREE)](https://www.youtube.com/watch?v=wGbuCyNpxIg)** — The classic interview problem explained thoroughly

</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📺 **[Abdul Bari — Backtracking (YouTube, FREE)](https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O)** — Theoretical grounding for backtracking
- 📖 **[Visualgo — Backtracking (FREE)](https://visualgo.net/)** — Animated tree of recursive calls

</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[LeetCode #78 — Subsets (FREE)](https://leetcode.com/problems/subsets/)** — The entry point
- 🎮 **[LeetCode #46 — Permutations (FREE)](https://leetcode.com/problems/permutations/)** — All orderings
- 🎮 **[LeetCode #51 — N-Queens (FREE)](https://leetcode.com/problems/n-queens/)** — Classic constraint problem
- 🎮 **[LeetCode #37 — Sudoku Solver (FREE)](https://leetcode.com/problems/sudoku-solver/)** — Apply backtracking end-to-end

</TabItem>
</Tabs>
