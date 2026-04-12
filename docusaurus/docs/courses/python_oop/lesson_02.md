# Lesson 02 — Inheritance and Composition

**Course:** Python: OOP · **Lesson:** 2 of 5 · **Time:** ~60 minutes

← [Lesson 01](lesson_01.md) · [Course Index](index.md) · [Lesson 03 →](lesson_03.md)

---

## Inheritance — "is a" Relationships

Inheritance lets a class reuse and extend another class. Use it when one thing genuinely **is a** specialised version of another.

```python
class Animal:
    def __init__(self, name: str, sound: str):
        self.name = name
        self.sound = sound

    def speak(self) -> str:
        return f"{self.name} says {self.sound}!"

    def __str__(self) -> str:
        return f"{type(self).__name__}({self.name!r})"


class Dog(Animal):
    def __init__(self, name: str):
        super().__init__(name, "woof")   # Call parent __init__

    def fetch(self, item: str) -> str:
        return f"{self.name} fetches the {item}!"


class GuideDog(Dog):
    def __init__(self, name: str, owner: str):
        super().__init__(name)
        self.owner = owner

    def guide(self) -> str:
        return f"{self.name} guides {self.owner} safely."


rex = Dog("Rex")
lassie = GuideDog("Lassie", "Alice")

print(rex.speak())       # Rex says woof!
print(lassie.speak())    # Lassie says woof!   — inherited from Animal
print(lassie.fetch("ball"))  # Lassie fetches the ball!  — inherited from Dog
print(lassie.guide())    # Lassie guides Alice safely.

print(isinstance(lassie, GuideDog))  # True
print(isinstance(lassie, Dog))       # True  — lassie IS a Dog
print(isinstance(lassie, Animal))    # True  — lassie IS an Animal
```

---

## Method Overriding

Override a parent method by defining it again in the child:

```python
class Shape:
    def area(self) -> float:
        raise NotImplementedError("Subclasses must implement area()")

    def describe(self) -> str:
        return f"{type(self).__name__} with area {self.area():.2f}"


class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:       # Override
        return 3.14159 * self.radius ** 2


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:       # Override
        return self.width * self.height


shapes = [Circle(5), Rectangle(4, 6), Circle(3)]
for shape in shapes:
    print(shape.describe())
# Circle with area 78.54
# Rectangle with area 24.00
# Circle with area 28.27
```

---

## Composition — "has a" Relationships

Composition means a class **contains** an instance of another class.
Prefer composition over inheritance when the relationship is "has a", not "is a".

```python
class Engine:
    def __init__(self, horsepower: int):
        self.horsepower = horsepower

    def start(self) -> str:
        return f"Engine ({self.horsepower}hp) started."


class Car:
    def __init__(self, make: str, model: str, horsepower: int):
        self.make = make
        self.model = model
        self.engine = Engine(horsepower)   # ← Car HAS an Engine

    def start(self) -> str:
        return f"{self.make} {self.model}: {self.engine.start()}"


golf = Car("VW", "Golf", 110)
print(golf.start())   # VW Golf: Engine (110hp) started.
```

**Inheritance vs Composition:**

```
Dog is an Animal          → inheritance ✅
Car has an Engine         → composition ✅
Car is an Engine          → inheritance ❌ — wrong relationship
PaymentProcessor is a DB  → inheritance ❌ — wrong relationship
```

---

## ✏️ Try It #1

Model a fleet of vehicles with:

- `Vehicle` base class: `make`, `model`, `year`, `fuel_type`
- `Car(Vehicle)`: adds `num_doors` (default 4)
- `Truck(Vehicle)`: adds `payload_tonnes`
- Both should override `__str__` to return a formatted description

```python
car = Car("Toyota", "Corolla", 2022, "petrol", num_doors=4)
truck = Truck("Volvo", "FH", 2021, "diesel", payload_tonnes=20)
print(car)    # 2022 Toyota Corolla (petrol, 4 doors)
print(truck)  # 2021 Volvo FH (diesel, 20t payload)
```

<details>
<summary>Show answer</summary>

```python
class Vehicle:
    def __init__(self, make: str, model: str, year: int, fuel_type: str):
        self.make = make
        self.model = model
        self.year = year
        self.fuel_type = fuel_type

class Car(Vehicle):
    def __init__(self, make, model, year, fuel_type, num_doors: int = 4):
        super().__init__(make, model, year, fuel_type)
        self.num_doors = num_doors

    def __str__(self) -> str:
        return f"{self.year} {self.make} {self.model} ({self.fuel_type}, {self.num_doors} doors)"

class Truck(Vehicle):
    def __init__(self, make, model, year, fuel_type, payload_tonnes: float):
        super().__init__(make, model, year, fuel_type)
        self.payload_tonnes = payload_tonnes

    def __str__(self) -> str:
        return f"{self.year} {self.make} {self.model} ({self.fuel_type}, {self.payload_tonnes}t payload)"

car = Car("Toyota", "Corolla", 2022, "petrol")
truck = Truck("Volvo", "FH", 2021, "diesel", 20)
print(car)
print(truck)
```

</details>

---

## Abstract Base Classes

Use `ABC` to enforce that subclasses implement certain methods:

```python
from abc import ABC, abstractmethod

class Notification(ABC):
    @abstractmethod
    def send(self, message: str) -> bool:
        """Send a notification. Return True on success."""

    def notify(self, message: str) -> None:
        success = self.send(message)
        status = "✅ sent" if success else "❌ failed"
        print(f"[{type(self).__name__}] {status}: {message}")


class EmailNotification(Notification):
    def __init__(self, address: str):
        self.address = address

    def send(self, message: str) -> bool:
        print(f"  → Emailing {self.address}")
        return True   # Simulate success


class SMSNotification(Notification):
    def __init__(self, number: str):
        self.number = number

    def send(self, message: str) -> bool:
        print(f"  → Texting {self.number}")
        return True


# Notification()  ← TypeError: Can't instantiate abstract class
email = EmailNotification("alice@example.com")
sms = SMSNotification("07700 123456")

email.notify("Your order has shipped.")
sms.notify("Your order has shipped.")
```

---

## ✏️ Try It #2

Build a `PaymentProcessor` ABC with an abstract `charge(amount)` method.
Implement `CreditCardProcessor` and `PayPalProcessor`.
Both should print what they're doing and return `True`.

Write a function `process_payment(processor, amount)` that calls `charge()` and prints the result.

<details>
<summary>Show answer</summary>

```python
from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def charge(self, amount: float) -> bool:
        """Charge the given amount. Return True on success."""

class CreditCardProcessor(PaymentProcessor):
    def __init__(self, card_number: str):
        self.card_number = card_number[-4:]  # Store last 4 digits only

    def charge(self, amount: float) -> bool:
        print(f"  Charging £{amount:.2f} to card ending {self.card_number}")
        return True

class PayPalProcessor(PaymentProcessor):
    def __init__(self, email: str):
        self.email = email

    def charge(self, amount: float) -> bool:
        print(f"  Charging £{amount:.2f} via PayPal ({self.email})")
        return True

def process_payment(processor: PaymentProcessor, amount: float) -> None:
    success = processor.charge(amount)
    print("Payment successful!" if success else "Payment failed.")

card = CreditCardProcessor("4111111111111234")
paypal = PayPalProcessor("alice@example.com")
process_payment(card, 49.99)
process_payment(paypal, 49.99)
```

</details>

---

## Summary

| Concept | Use when |
|---------|---------|
| Inheritance | Class B "is a" specialised version of class A |
| `super()` | Call a parent class method from a child |
| Override | Redefine a parent method in the child |
| Composition | Class A "has a" class B — prefer for flexibility |
| `ABC` + `@abstractmethod` | Enforce a required interface in subclasses |

---

## ✅ Lesson Checklist

- [ ] Can create a class hierarchy using inheritance
- [ ] Can use `super()` to call parent `__init__`
- [ ] Know when to prefer composition over inheritance
- [ ] Can define and implement an abstract base class
- [ ] Completed both Try It exercises

---

## ➡️ Next Lesson

→ [Lesson 03 — Dunder Methods](lesson_03.md)
