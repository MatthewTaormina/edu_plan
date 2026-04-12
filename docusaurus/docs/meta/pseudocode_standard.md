---
title: Pseudocode Standard
---

# Pseudocode Standard

**Location:** `docs/meta/pseudocode_standard.md`

> This document defines the pseudocode dialect used throughout this repo.
> All concept explanations should use this standard so a learner of **any** language can read them.
> Language-specific syntax belongs in **tabbed code blocks** after the pseudocode explanation.

---

## Philosophy

Pseudocode in this repo has three rules:

1. **Readable aloud** ΓÇö any programmer should be able to read it out loud and understand it
2. **Unambiguous** ΓÇö no two readers should interpret a line differently
3. **Whiteboard-friendly** ΓÇö it's what you'd write if explaining on a whiteboard

There is **one exception**: if a concept is inherently language-specific (e.g., Rust's borrow checker, Python's GIL), use that language and label it.

---

## Syntax Reference

### Keywords

All keywords are `UPPERCASE` to visually separate them from identifiers.

| Keyword | Meaning |
|---------|---------|
| `FUNCTION` | Define a reusable block of code |
| `RETURN` | Exit function and give back a value |
| `IF` / `ELSE IF` / `ELSE` | Conditional branching |
| `WHILE` | Loop while condition is true |
| `FOR` / `IN` | Iterate over a collection |
| `FOREACH` | Iterate over items where index isn't needed |
| `BREAK` | Exit the current loop |
| `CONTINUE` | Skip to next loop iteration |
| `CLASS` | Define a data type with fields and methods |
| `NEW` | Create an instance of a class |
| `NULL` | Absence of a value (None/nil/null) |
| `TRUE` / `FALSE` | Boolean literals |
| `AND` / `OR` / `NOT` | Logical operators |
| `THROW` | Raise an error |
| `TRY` / `CATCH` / `FINALLY` | Error handling |
| `IMPORT` | Reference external module |

---

### Types (Optional Annotations)

Types are optional but encouraged for clarity on function signatures and variable declarations.

```
// Without types ΓÇö valid
FUNCTION add(a, b)
    RETURN a + b

// With types ΓÇö preferred for teaching
FUNCTION add(a: Int, b: Int) -> Int
    RETURN a + b
```

**Common type names:**

| Pseudocode Type | Equivalent in... |
|----------------|-----------------|
| `Int` | `int` (Python), `i32/i64` (Rust), `number` (TS), `int` (C/Java) |
| `Float` | `float` (Python), `f64` (Rust), `number` (TS), `double` (Java) |
| `String` | `str` (Python), `String` (Rust/Java), `string` (TS) |
| `Bool` | `bool` (Python/Rust), `boolean` (TS/Java) |
| `List&lt;T&gt;` | `list[T]` (Python), `Vec&lt;T&gt;` (Rust), `T[]` (TS), `ArrayList&lt;T&gt;` (Java) |
| `Map&lt;K, V&gt;` | `dict[K,V]` (Python), `HashMap&lt;K,V&gt;` (Rust), `Map&lt;K,V&gt;` (TS) |
| `Optional&lt;T&gt;` | `T | None` (Python), `Option&lt;T&gt;` (Rust), `T | null` (TS) |
| `Any` | Any type (use sparingly) |

---

### Assignment

Use `ΓåÉ` for assignment to distinguish from equality comparison `==`.  
Plain `=` is also acceptable when context is obvious.

```
x ΓåÉ 10
name ΓåÉ "Alice"
items ΓåÉ NEW List<String>
```

---

### Functions

```
FUNCTION functionName(param1: Type, param2: Type) -> ReturnType
    // body ΓÇö indented with 4 spaces
    RETURN value

// With default parameter
FUNCTION greet(name: String, greeting: String = "Hello") -> String
    RETURN greeting + ", " + name + "!"
```

---

### Conditionals

```
IF condition THEN
    // body
ELSE IF other_condition THEN
    // body
ELSE
    // body
END IF
```

Short form (single-line, only when obvious):
```
IF x > 0 THEN RETURN "positive"
```

---

### Loops

```
// While loop
WHILE condition DO
    // body
END WHILE

// Count-based for loop
FOR i FROM 0 TO n - 1 DO
    // body
END FOR

// Iterating over a collection
FOREACH item IN collection DO
    // body
END FOREACH

// Iterating with index
FOR i FROM 0 TO length(collection) - 1 DO
    item ΓåÉ collection[i]
    // body
END FOR
```

---

### Classes

```
CLASS Node<T>
    value: T
    next: Optional<Node<T>> ΓåÉ NULL

    FUNCTION constructor(value: T)
        self.value ΓåÉ value
        self.next ΓåÉ NULL
    END

    FUNCTION toString() -> String
        RETURN "Node(" + self.value + ")"
    END
END CLASS

// Instantiation
node ΓåÉ NEW Node(42)
```

---

### Error Handling

```
TRY
    result ΓåÉ divide(a, b)
CATCH DivisionByZeroError AS e
    PRINT "Error: " + e.message
FINALLY
    PRINT "Cleanup runs always"
END TRY

// Throwing
FUNCTION divide(a: Int, b: Int) -> Int
    IF b == 0 THEN
        THROW DivisionByZeroError("Cannot divide by zero")
    END IF
    RETURN a / b
END FUNCTION
```

---

### Built-in Operations

Use natural language for operations where the implementation varies:

```
length(collection)      // number of elements
append(list, item)      // add to end
prepend(list, item)     // add to front  
remove(list, item)      // remove first occurrence
contains(collection, x) // true if x is in collection
sort(list)              // sort in ascending order
keys(map)               // all keys of a map
values(map)             // all values of a map
```

---

### Comments

```
// Single-line comment

/*
   Multi-line comment
   for longer explanations
*/

// NOTE: Use "NOTE:" for important caveats
// TODO: Use "TODO:" for exercises left to the reader
```

---

## Full Example ΓÇö Linked List Insert

```
CLASS Node<T>
    value: T
    next: Optional<Node<T>> ΓåÉ NULL
END CLASS

CLASS LinkedList<T>
    head: Optional<Node<T>> ΓåÉ NULL
    size: Int ΓåÉ 0

    FUNCTION append(value: T) -> Void
        new_node ΓåÉ NEW Node(value)

        IF self.head == NULL THEN
            self.head ΓåÉ new_node
        ELSE
            current ΓåÉ self.head
            WHILE current.next != NULL DO
                current ΓåÉ current.next    // walk to end
            END WHILE
            current.next ΓåÉ new_node
        END IF

        self.size ΓåÉ self.size + 1
    END FUNCTION

    FUNCTION contains(value: T) -> Bool
        current ΓåÉ self.head
        WHILE current != NULL DO
            IF current.value == value THEN
                RETURN TRUE
            END IF
            current ΓåÉ current.next
        END WHILE
        RETURN FALSE
    END FUNCTION
END CLASS
```

---

## When to Use Pseudocode vs. Real Code

| Situation | Use |
|-----------|-----|
| Explaining a concept or algorithm | Γ£à Pseudocode first |
| Showing language-specific syntax | Γ£à Tabbed real code |
| Assignments / exercises | Γ£à Tabbed real code (show in 2ΓÇô3 languages) |
| Language-specific behavior (ownership, GIL, etc.) | Γ£à That language only, labeled |
| Very short obvious snippets | Either is fine |

---

## Tabbed Multi-Language Block Template

In MkDocs Material, use `===` tabs for multi-language examples.
Always include **Pseudocode** as the first tab, then the most relevant languages.

````markdown
=== "Pseudocode"
    ```
    FUNCTION example(x: Int) -> Int
        RETURN x * 2
    END FUNCTION
    ```

=== "Python"
    ```python
    def example(x: int) -> int:
        return x * 2
    ```

=== "TypeScript"
    ```typescript
    function example(x: number): number {
        return x * 2;
    }
    ```

=== "Rust"
    ```rust
    fn example(x: i32) -> i32 {
        x * 2
    }
    ```

=== "C"
    ```c
    int example(int x) {
        return x * 2;
    }
    ```
````

**Language tab order convention:** `Pseudocode ΓåÆ Python ΓåÆ TypeScript ΓåÆ Rust ΓåÆ C/C++ ΓåÆ Java/Kotlin ΓåÆ C#`  
Only include tabs that are meaningfully different or add useful context. Don't add a tab just to have it.

