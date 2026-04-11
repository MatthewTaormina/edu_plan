# Lesson 03 — Getting Input and Making Decisions

**Course:** Python: Zero to Hero · **Lesson:** 3 of 12 · **Time:** ~60 minutes

← [Lesson 02](lesson_02.md) · [Course Index](index.md) · [Lesson 04 →](lesson_04.md)

---

## Getting Input from the User

`input()` pauses the program and waits for the user to type something and press Enter.
It **always returns a string** — even if they type a number.

```python
name = input("What is your name? ")
print(f"Hello, {name}!")

age_str = input("How old are you? ")
age = int(age_str)   # Convert to int before doing maths
print(f"Next year you will be {age + 1}.")
```

!!! warning "input() always returns str"
    ```python
    value = input("Enter a number: ")  # User types 5
    print(value + 1)    # ❌ TypeError: can only concatenate str to str
    print(int(value) + 1)  # ✅ 6
    ```

---

## Making Decisions — if / elif / else

```python
age = int(input("How old are you? "))

if age >= 18:
    print("You can vote.")
elif age >= 16:
    print("You can drive (in some places).")
else:
    print("You're still a minor.")
```

Rules:
- `if` is always first
- `elif` is optional, can have as many as you need
- `else` is optional, must be last
- **Indentation is mandatory** — Python uses 4 spaces, not curly braces

---

## Comparison Operators

```python
x = 10

print(x == 10)   # True  — equal to
print(x != 5)    # True  — not equal to
print(x > 5)     # True  — greater than
print(x < 5)     # False — less than
print(x >= 10)   # True  — greater than or equal
print(x <= 10)   # True  — less than or equal

# Strings are compared alphabetically
print("apple" < "banana")   # True
print("zebra" > "ant")      # True
```

---

## Logical Operators

Combine multiple conditions with `and`, `or`, `not`:

```python
age = 25
has_ticket = True

# and — both must be True
if age >= 18 and has_ticket:
    print("You can enter the event.")

# or — at least one must be True
temperature = 35
raining = False
if temperature > 30 or raining:
    print("Stay indoors.")

# not — inverts the condition
logged_in = False
if not logged_in:
    print("Please log in first.")
```

**Short-circuit evaluation:**
- `and` stops at the first `False`
- `or` stops at the first `True`

---

## Truthy and Falsy

In Python, anything can be used in a condition. Most things are truthy.

```python
# Falsy values — everything else is truthy
False
None
0        # int zero
0.0      # float zero
""       # empty string
[]       # empty list
{}       # empty dict
()       # empty tuple

# Examples
name = ""
if name:
    print(f"Hello, {name}")
else:
    print("Name is empty")   # This runs

count = 0
if not count:
    print("Nothing to count")  # This runs
```

---

## ✏️ Try It #1

Write a program that:
1. Asks for a number
2. Prints whether it's positive, negative, or zero

```
Enter a number: -5
-5 is negative.
```

<details>
<summary>Show answer</summary>

```python
number = int(input("Enter a number: "))

if number > 0:
    print(f"{number} is positive.")
elif number < 0:
    print(f"{number} is negative.")
else:
    print("The number is zero.")
```

</details>

---

## Nested Conditions

Conditions can be nested — but keep nesting shallow (max 2–3 levels):

```python
username = input("Username: ")
password = input("Password: ")

if username == "admin":
    if password == "secret":
        print("Access granted.")
    else:
        print("Wrong password.")
else:
    print("Unknown user.")
```

A cleaner pattern using `and`:
```python
if username == "admin" and password == "secret":
    print("Access granted.")
else:
    print("Access denied.")
```

---

## One-line Conditions (Ternary)

For simple cases, Python has a compact conditional expression:

```python
age = 20
status = "adult" if age >= 18 else "minor"
print(status)   # adult

# Equivalent to:
if age >= 18:
    status = "adult"
else:
    status = "minor"
```

Use sparingly — readability matters more than brevity.

---

## ✏️ Try It #2

Write a simple login checker:

1. Ask for a username and password
2. If username is `"learner"` and password is `"python123"`, print `"Welcome back!"`
3. If username is right but password is wrong, print `"Wrong password."`
4. Otherwise print `"User not found."`

<details>
<summary>Show answer</summary>

```python
username = input("Username: ")
password = input("Password: ")

if username == "learner":
    if password == "python123":
        print("Welcome back!")
    else:
        print("Wrong password.")
else:
    print("User not found.")
```

</details>

---

## Summary

| Concept | What you learned |
|---------|-----------------|
| `input()` | Always returns `str` — convert before doing maths |
| `if/elif/else` | Make branching decisions; indentation is syntax |
| Comparison ops | `==`, `!=`, `<`, `>`, `<=`, `>=` |
| Logical ops | `and`, `or`, `not` |
| Truthy/falsy | Empty values (`""`, `0`, `[]`, `None`) are falsy |
| Ternary | `x if condition else y` — for simple one-liners |

---

## ✅ Lesson Checklist

- [ ] Can get and convert user input
- [ ] Can write if/elif/else chains
- [ ] Can combine conditions with and/or/not
- [ ] Understand truthy and falsy values
- [ ] Completed both Try It exercises

---

## ➡️ Next Lesson

→ [Lesson 04 — Repeating Yourself: Loops](lesson_04.md)
