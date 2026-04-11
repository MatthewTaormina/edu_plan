# Lesson 01 — Classes and Objects

**Course:** Python: OOP · **Lesson:** 1 of 5 · **Time:** ~90 minutes

[Course Index](index.md) · [Lesson 02 →](lesson_02.md)

---

## What is a Class?

A class is a **blueprint** for creating objects. An object bundles related data (attributes)
and behaviour (methods) together.

```python
# Without a class — data is scattered
name = "Alice"
age = 30
city = "London"

def greet_user(name, age):
    return f"Hi, I'm {name}, {age} years old."

# With a class — data and behaviour live together
class User:
    def __init__(self, name, age, city):
        self.name = name
        self.age = age
        self.city = city

    def greet(self):
        return f"Hi, I'm {self.name}, {self.age} years old."

alice = User("Alice", 30, "London")
print(alice.greet())   # Hi, I'm Alice, 30 years old.
print(alice.name)      # Alice
```

---

## `__init__` and `self`

```python
class BankAccount:
    def __init__(self, owner: str, balance: float = 0.0):
        """Called automatically when an object is created."""
        self.owner = owner         # Instance attribute
        self.balance = balance     # Instance attribute

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount

    def withdraw(self, amount: float) -> None:
        if amount > self.balance:
            raise ValueError(f"Insufficient funds: have £{self.balance:.2f}")
        self.balance -= amount

    def __str__(self) -> str:
        """Human-readable string representation."""
        return f"BankAccount({self.owner}: £{self.balance:.2f})"

    def __repr__(self) -> str:
        """Developer-friendly representation."""
        return f"BankAccount(owner={self.owner!r}, balance={self.balance})"

# Create objects (instances)
account = BankAccount("Alice", 1000.0)
account.deposit(250)
account.withdraw(100)
print(account)           # BankAccount(Alice: £1150.00)  — uses __str__
print(repr(account))     # BankAccount(owner='Alice', balance=1150.0)
```

`self` is the object itself. Python passes it automatically — you don't provide it when calling methods.

---

## Class Attributes vs Instance Attributes

```python
class Dog:
    species = "Canis familiaris"   # Class attribute — shared by ALL instances

    def __init__(self, name: str, breed: str):
        self.name = name           # Instance attribute — unique to each object
        self.breed = breed

rex = Dog("Rex", "German Shepherd")
fido = Dog("Fido", "Labrador")

print(rex.species)    # Canis familiaris  — from class
print(fido.species)   # Canis familiaris  — same value
print(rex.name)       # Rex               — unique to rex
print(fido.name)      # Fido              — unique to fido

Dog.species = "Changed"   # Changes for ALL instances
```

---

## ✏️ Try It #1

Create a `Rectangle` class with:
- `width` and `height` attributes
- `area()` method → returns `width * height`
- `perimeter()` method → returns `2 * (width + height)`
- `is_square()` method → returns `True` if width equals height
- A useful `__str__` representation

```
rect = Rectangle(4, 6)
print(rect)           # Rectangle(4 x 6)
print(rect.area())    # 24
print(rect.perimeter())  # 20
print(rect.is_square())  # False
```

<details>
<summary>Show answer</summary>

```python
class Rectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)

    def is_square(self) -> bool:
        return self.width == self.height

    def __str__(self) -> str:
        return f"Rectangle({self.width} x {self.height})"

rect = Rectangle(4, 6)
print(rect)
print(rect.area())
print(rect.perimeter())
print(rect.is_square())
```

</details>

---

## Inheritance

A class can **inherit** from another class, gaining all its attributes and methods:

```python
class Animal:
    def __init__(self, name: str, sound: str):
        self.name = name
        self.sound = sound

    def speak(self) -> str:
        return f"{self.name} says {self.sound}!"

class Dog(Animal):   # Dog inherits from Animal
    def __init__(self, name: str):
        super().__init__(name, "woof")   # Call parent __init__

    def fetch(self, item: str) -> str:
        return f"{self.name} fetches the {item}!"

class Cat(Animal):
    def __init__(self, name: str):
        super().__init__(name, "meow")

    def purr(self) -> str:
        return f"{self.name} purrs..."

rex = Dog("Rex")
print(rex.speak())       # Rex says woof!  — inherited from Animal
print(rex.fetch("ball")) # Rex fetches the ball!  — Dog-specific

whiskers = Cat("Whiskers")
print(whiskers.speak())  # Whiskers says meow!
print(whiskers.purr())   # Whiskers purrs...
```

**`isinstance()` check:**
```python
print(isinstance(rex, Dog))     # True
print(isinstance(rex, Animal))  # True  — rex IS an Animal
print(isinstance(rex, Cat))     # False
```

---

## Dataclasses — Modern Python OOP

> **Tool:** `dataclasses` · **Introduced:** Python 3.7 (2018) · **Status:** 🟢 Modern

For classes that mainly hold data, dataclasses reduce boilerplate:

```python
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class Product:
    name: str
    price: float
    in_stock: bool = True
    tags: list[str] = field(default_factory=list)  # ← mutable default

# dataclass automatically generates __init__, __repr__, __eq__
laptop = Product("Laptop", 999.99, tags=["electronics", "computing"])
print(laptop)
# Product(name='Laptop', price=999.99, in_stock=True, tags=['electronics', 'computing'])

# Equality check works automatically
p1 = Product("Laptop", 999.99)
p2 = Product("Laptop", 999.99)
print(p1 == p2)   # True

# Frozen dataclass — immutable (like a tuple with named fields)
@dataclass(frozen=True)
class Point:
    x: float
    y: float

origin = Point(0, 0)
# origin.x = 1  ← FrozenInstanceError
```

Use `@dataclass` when your class is primarily a data container.
Use a regular class when it has significant behaviour.

---

## ✏️ Try It #2

Build a simple contact book using a `Contact` dataclass and a `ContactBook` class:

- `Contact`: `name`, `email`, `phone` (optional, default `None`)
- `ContactBook`: stores contacts, can add, find by name, list all

```python
book = ContactBook()
book.add(Contact("Alice", "alice@example.com", "07700 123456"))
book.add(Contact("Bob", "bob@example.com"))

found = book.find("Alice")
print(found)   # Contact(name='Alice', email='alice@example.com', phone='07700 123456')

book.list_all()
# 1. Alice <alice@example.com>
# 2. Bob <bob@example.com>
```

<details>
<summary>Show answer</summary>

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class Contact:
    name: str
    email: str
    phone: Optional[str] = None

class ContactBook:
    def __init__(self):
        self._contacts: list[Contact] = []

    def add(self, contact: Contact) -> None:
        self._contacts.append(contact)

    def find(self, name: str) -> Optional[Contact]:
        for contact in self._contacts:
            if contact.name.lower() == name.lower():
                return contact
        return None

    def list_all(self) -> None:
        for i, contact in enumerate(self._contacts, start=1):
            print(f"{i}. {contact.name} <{contact.email}>")

book = ContactBook()
book.add(Contact("Alice", "alice@example.com", "07700 123456"))
book.add(Contact("Bob", "bob@example.com"))
print(book.find("Alice"))
book.list_all()
```

</details>

---

## Summary

| Concept | What you learned |
|---------|-----------------|
| `class` | Blueprint for creating objects |
| `__init__` | Called on creation; set instance attributes |
| `self` | Reference to the object itself |
| `__str__` / `__repr__` | Human / developer string representations |
| Inheritance | `class Dog(Animal)` — reuse and extend |
| `super()` | Call parent class methods |
| `@dataclass` | Modern way to create data-holding classes — reduces boilerplate |

---

## ✅ Lesson Checklist

- [ ] Can create a class with `__init__`, methods, and `__str__`
- [ ] Understand the difference between class and instance attributes
- [ ] Can use inheritance and `super()`
- [ ] Can create a dataclass with default values
- [ ] Completed both Try It exercises

---

## ➡️ Next Lesson

→ [Lesson 02 — Inheritance and Composition](lesson_02.md)
