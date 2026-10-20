---
title: Sealed classes and exhaustive when
section: Modelling data
---
A `sealed` type has a **closed set of subtypes**, all known at compile time. It is like a Python `Union[Circle, Rect]` or an enum whose cases carry different data. The payoff: a `when` over it needs no `else`, and if you add a new case later the compiler points at every `when` you forgot to update.

```python
Shape = Union[Circle, Rectangle]

def area(s: Shape) -> float:
    match s:
        case Circle(r):       return math.pi * r * r
        case Rectangle(w, h): return w * h
```
```kotlin
sealed interface Shape
data class Circle(val radius: Double) : Shape
data class Rectangle(val w: Double, val h: Double) : Shape

fun area(s: Shape): Double = when (s) {
    is Circle -> Math.PI * s.radius * s.radius
    is Rectangle -> s.w * s.h
}   // no else needed: the compiler knows these are all the cases
```

This is how Kotlin code usually models "result or error" without exceptions, and the states of a workflow:

```kotlin run
sealed interface Result
data class Success(val value: Int) : Result
data class Failure(val reason: String) : Result

fun parse(text: String): Result =
    text.toIntOrNull()?.let { Success(it) } ?: Failure("'$text' is not a number")

fun main() {
    for (input in listOf("12", "x")) {
        when (val r = parse(input)) {
            is Success -> println("got ${r.value}")
            is Failure -> println("failed: ${r.reason}")
        }
    }
}
```

## Your task

The `PaymentMethod` hierarchy is given. Implement:

1. `fee(payment)`: the processing fee in cents. Cards pay 2% of the amount (rounded down), PayPal pays a flat `30`, bank transfers pay `0`. Write a `when` **without** an `else` branch.
2. `describe(payment)`: `"Card ending 4242"`, `"PayPal: ada@example.com"` or `"Bank transfer"`.

```hint
For the card fee use integer arithmetic: `payment.amount * 2 / 100`.
```
```hint
Each branch is `is Card -> ...`. Inside it `payment` is smart-cast, so `payment.last4` works.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

sealed interface PaymentMethod
data class Card(val last4: String, val amount: Int) : PaymentMethod
data class PayPal(val email: String) : PaymentMethod
data object BankTransfer : PaymentMethod

//sampleStart
fun fee(payment: PaymentMethod): Int = TODO()

fun describe(payment: PaymentMethod): String = TODO()
//sampleEnd

class SealedTest {
    @Test fun cardFee() = assertEquals(20, fee(Card("4242", 1000)))
    @Test fun cardFeeRoundsDown() = assertEquals(1, fee(Card("4242", 99)))
    @Test fun paypalFee() = assertEquals(30, fee(PayPal("ada@example.com")))
    @Test fun bankFee() = assertEquals(0, fee(BankTransfer))
    @Test fun describeCard() = assertEquals("Card ending 4242", describe(Card("4242", 1)))
    @Test fun describePaypal() = assertEquals("PayPal: ada@example.com", describe(PayPal("ada@example.com")))
    @Test fun describeBank() = assertEquals("Bank transfer", describe(BankTransfer))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

sealed interface PaymentMethod
data class Card(val last4: String, val amount: Int) : PaymentMethod
data class PayPal(val email: String) : PaymentMethod
data object BankTransfer : PaymentMethod

//sampleStart
fun fee(payment: PaymentMethod): Int = when (payment) {
    is Card -> payment.amount * 2 / 100
    is PayPal -> 30
    is BankTransfer -> 0
}

fun describe(payment: PaymentMethod): String = when (payment) {
    is Card -> "Card ending ${payment.last4}"
    is PayPal -> "PayPal: ${payment.email}"
    is BankTransfer -> "Bank transfer"
}
//sampleEnd

class SealedTest {
    @Test fun cardFee() = assertEquals(20, fee(Card("4242", 1000)))
    @Test fun cardFeeRoundsDown() = assertEquals(1, fee(Card("4242", 99)))
    @Test fun paypalFee() = assertEquals(30, fee(PayPal("ada@example.com")))
    @Test fun bankFee() = assertEquals(0, fee(BankTransfer))
    @Test fun describeCard() = assertEquals("Card ending 4242", describe(Card("4242", 1)))
    @Test fun describePaypal() = assertEquals("PayPal: ada@example.com", describe(PayPal("ada@example.com")))
    @Test fun describeBank() = assertEquals("Bank transfer", describe(BankTransfer))
}
```
