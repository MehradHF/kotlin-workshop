---
title: Exceptions and preconditions
section: Idiomatic Kotlin
---
Exceptions work as in Python, with two differences: there are **no checked exceptions** (you never have to declare or catch anything), and `try` is an **expression** that returns a value.

```python
try:
    value = int(text)
except ValueError:
    value = None

if amount <= 0:
    raise ValueError("amount must be positive")
```
```kotlin
val value = try { text.toInt() } catch (e: NumberFormatException) { null }

require(amount > 0) { "amount must be positive" }
```

Kotlin ships small helpers for the common "raise if wrong" checks:

| Call | Throws | Use for |
|---|---|---|
| `require(cond) { msg }` | `IllegalArgumentException` | validating **arguments** |
| `check(cond) { msg }` | `IllegalStateException` | validating object **state** |
| `error(msg)` | `IllegalStateException` | "this should never happen" |
| `value ?: error(msg)` | | unwrap a nullable or fail |

Tests use `assertFailsWith<SomeException> { ... }`, which is `pytest.raises`.

```kotlin run
fun divide(a: Int, b: Int): Int {
    require(b != 0) { "divisor must not be zero" }
    return a / b
}

fun main() {
    println(runCatching { divide(1, 0) }.exceptionOrNull()?.message)
    val port = try { "80x".toInt() } catch (e: NumberFormatException) { 8080 }
    println(port)
}
```

```habit
**try/except as the normal way to check.** "Easier to ask forgiveness than permission" is idiomatic Python, but in Kotlin exceptions are for real errors. The standard library has a null-returning version for the common cases: `toIntOrNull()`, `getOrNull(i)`, `firstOrNull { }`, and map lookups with `[]`. Handle the `null` with `?:`.
```

## Your task

1. `safeDivide(a, b)`: `a / b`, or `null` when `b` is zero. Use `try`/`catch` for `ArithmeticException` as an expression (integer division by zero throws it).
2. `withdraw(balance, amount)`: returns the new balance. The amount must be positive (`require`), and you can't withdraw more than the balance (`check`, message `"Insufficient funds"`).
3. `parsePort(text)`: the port number as `Int` if the text is a number in `1..65535`, otherwise throw with `error("Invalid port: $text")`.

```hint
`try { a / b } catch (e: ArithmeticException) { null }`
```
```hint
`require(amount > 0)` then `check(amount <= balance) { "Insufficient funds" }`, then `return balance - amount`.
```
```hint
`text.toIntOrNull()?.takeIf { it in 1..65535 } ?: error("Invalid port: $text")`. `takeIf` returns the value only when the condition holds.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun safeDivide(a: Int, b: Int): Int? = TODO()

fun withdraw(balance: Int, amount: Int): Int = TODO()

fun parsePort(text: String): Int = TODO()
//sampleEnd

class ExceptionsTest {
    @Test fun divide() = assertEquals(3, safeDivide(7, 2))
    @Test fun divideByZero() = assertNull(safeDivide(7, 0))
    @Test fun withdrawOk() = assertEquals(70, withdraw(100, 30))
    @Test fun withdrawNegative() { assertFailsWith<IllegalArgumentException> { withdraw(100, -5) } }
    @Test fun withdrawTooMuch() {
        val e = assertFailsWith<IllegalStateException> { withdraw(10, 50) }
        assertEquals("Insufficient funds", e.message)
    }
    @Test fun portOk() = assertEquals(8080, parsePort("8080"))
    @Test fun portNotNumber() {
        val e = assertFailsWith<IllegalStateException> { parsePort("abc") }
        assertEquals("Invalid port: abc", e.message)
    }
    @Test fun portOutOfRange() { assertFailsWith<IllegalStateException> { parsePort("70000") } }
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun safeDivide(a: Int, b: Int): Int? = try {
    a / b
} catch (e: ArithmeticException) {
    null
}

fun withdraw(balance: Int, amount: Int): Int {
    require(amount > 0) { "amount must be positive" }
    check(amount <= balance) { "Insufficient funds" }
    return balance - amount
}

fun parsePort(text: String): Int =
    text.toIntOrNull()?.takeIf { it in 1..65535 } ?: error("Invalid port: $text")
//sampleEnd

class ExceptionsTest {
    @Test fun divide() = assertEquals(3, safeDivide(7, 2))
    @Test fun divideByZero() = assertNull(safeDivide(7, 0))
    @Test fun withdrawOk() = assertEquals(70, withdraw(100, 30))
    @Test fun withdrawNegative() { assertFailsWith<IllegalArgumentException> { withdraw(100, -5) } }
    @Test fun withdrawTooMuch() {
        val e = assertFailsWith<IllegalStateException> { withdraw(10, 50) }
        assertEquals("Insufficient funds", e.message)
    }
    @Test fun portOk() = assertEquals(8080, parsePort("8080"))
    @Test fun portNotNumber() {
        val e = assertFailsWith<IllegalStateException> { parsePort("abc") }
        assertEquals("Invalid port: abc", e.message)
    }
    @Test fun portOutOfRange() { assertFailsWith<IllegalStateException> { parsePort("70000") } }
}
```
