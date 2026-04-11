# Lesson 04 — Repeating Yourself: Loops

**Course:** Python: Zero to Hero · **Lesson:** 4 of 12 · **Time:** ~60 minutes

← [Lesson 03](lesson_03.md) · [Course Index](index.md) · [Lesson 05 →](lesson_05.md)

---

## Why Loops?

Without loops, repeating an action means copying code. With loops, you write it once.

```python
# Without a loop — brittle and tedious
print("Counting: 1")
print("Counting: 2")
print("Counting: 3")

# With a loop — clean and scalable
for i in range(1, 4):
    print(f"Counting: {i}")
```

Python has two types of loop: `for` and `while`.

---

## The for Loop

`for` loops iterate over a **sequence** — a list, string, range, or any iterable.

```python
# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
# apple
# banana
# cherry

# Iterate over a string (character by character)
for char in "hello":
    print(char)

# Iterate over a range of numbers
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):     # 1, 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2): # 0, 2, 4, 6, 8  (step of 2)
    print(i)
```

---

## range() in Detail

```python
range(stop)           # 0 to stop-1
range(start, stop)    # start to stop-1
range(start, stop, step)  # start to stop-1, stepping by step

list(range(5))           # [0, 1, 2, 3, 4]
list(range(1, 6))        # [1, 2, 3, 4, 5]
list(range(10, 0, -2))   # [10, 8, 6, 4, 2]  — count down
```

---

## The while Loop

`while` repeats as long as a condition is `True`. Use it when you don't know how many iterations you'll need.

```python
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1   # = count + 1

# Waiting for valid input
while True:
    answer = input("Type 'yes' or 'no': ")
    if answer in ("yes", "no"):
        break    # Exit the loop
    print("Invalid input — try again.")

print(f"You chose: {answer}")
```

!!! warning "Infinite loops"
    A `while` loop that never reaches `False` runs forever.
    Always make sure the condition can become `False`, or use `break`.
    Press **Ctrl+C** to stop a running program.

---

## break and continue

```python
# break — exit the loop immediately
for i in range(10):
    if i == 5:
        break
    print(i)
# Prints 0 1 2 3 4 — stops at 5

# continue — skip the rest of the current iteration
for i in range(10):
    if i % 2 == 0:   # Skip even numbers
        continue
    print(i)
# Prints 1 3 5 7 9
```

---

## ✏️ Try It #1

Print a multiplication table for 7 (7×1 through 7×12):

```
7 x 1 = 7
7 x 2 = 14
...
7 x 12 = 84
```

<details>
<summary>Show answer</summary>

```python
for i in range(1, 13):
    print(f"7 x {i} = {7 * i}")
```

</details>

---

## Useful Loop Patterns

### enumerate() — loop with index

```python
fruits = ["apple", "banana", "cherry"]

# Without enumerate — clunky
for i in range(len(fruits)):
    print(f"{i}: {fruits[i]}")

# With enumerate — clean
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# Start index at 1
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")
# 1. apple
# 2. banana
# 3. cherry
```

### zip() — loop over two lists together

```python
names = ["Alice", "Bob", "Carol"]
scores = [95, 87, 92]

for name, score in zip(names, scores):
    print(f"{name}: {score}")
# Alice: 95
# Bob: 87
# Carol: 92
```

### List comprehension — build a list from a loop

```python
# The long way
squares = []
for i in range(1, 6):
    squares.append(i ** 2)

# List comprehension — same result, one line
squares = [i ** 2 for i in range(1, 6)]
print(squares)   # [1, 4, 9, 16, 25]

# With a filter
even_squares = [i ** 2 for i in range(1, 11) if i % 2 == 0]
print(even_squares)   # [4, 16, 36, 64, 100]
```

---

## Nested Loops

```python
# Multiplication table — row x col
for row in range(1, 4):
    for col in range(1, 4):
        print(f"{row * col:3}", end="")   # :3 = pad to 3 chars wide
    print()   # Newline after each row

#  1  2  3
#  2  4  6
#  3  6  9
```

Keep nesting shallow — deeply nested loops are hard to read.

---

## ✏️ Try It #2

Write a number-guessing game:

- Pick a secret number (just hardcode `secret = 7`)
- Loop until the user guesses correctly
- After each wrong guess, tell them if they're too high or too low
- Print how many guesses it took

```
Guess the number (1-10): 5
Too low!
Guess the number (1-10): 9
Too high!
Guess the number (1-10): 7
Correct! You got it in 3 guesses.
```

<details>
<summary>Show answer</summary>

```python
secret = 7
guesses = 0

while True:
    guess = int(input("Guess the number (1-10): "))
    guesses += 1
    if guess < secret:
        print("Too low!")
    elif guess > secret:
        print("Too high!")
    else:
        print(f"Correct! You got it in {guesses} guesses.")
        break
```

</details>

---

## Summary

| Concept | Use when |
|---------|---------|
| `for` | You know the sequence to iterate over |
| `while` | You repeat until a condition changes |
| `break` | Exit the loop early |
| `continue` | Skip to the next iteration |
| `enumerate()` | You need the index AND the value |
| `zip()` | Loop over two sequences in parallel |
| List comprehension | Build a new list from an existing sequence |

---

## ✅ Lesson Checklist

- [ ] Can use `for` to iterate over lists, strings, and ranges
- [ ] Can use `while` for condition-based repetition
- [ ] Know when to use `break` and `continue`
- [ ] Can use `enumerate()` and `zip()`
- [ ] Can write a simple list comprehension
- [ ] Completed both Try It exercises

---

## ➡️ Next Lesson

→ [Lesson 05 — Organising Data](lesson_05.md)
