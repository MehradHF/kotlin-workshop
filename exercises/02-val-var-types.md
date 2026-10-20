---
title: val, var and types
section: Basics
---
Python has one kind of variable. Kotlin has two: `val` (read-only, assigned once) and `var` (reassignable). Prefer `val`: you will see it almost everywhere in real Kotlin code.

```python
name = "Ada"
count = 0
count += 1
```
```kotlin
val name = "Ada"   // can't be reassigned
var count = 0      // can
count += 1
```

You rarely write types on local variables: the compiler infers them (`count` is an `Int`). But the types are fixed. This fails to compile: `count = "one"`.

Numbers need more care than in Python. `Int` and `Double` are different types, and Kotlin **never converts between them silently**. Convert explicitly:

```python
ratio = 3 / 4          # 0.75
whole = 3 // 4         # 0
```
```kotlin
val whole = 3 / 4                  // 0, Int / Int is integer division
val ratio = 3.toDouble() / 4       // 0.75
```

```kotlin run
fun main() {
    val a = 7
    val b = 2
    println(a / b)                 // 3
    println(a.toDouble() / b)      // 3.5
    println(a % b)                 // 1
}
```

## Your task

1. `percent(part, total)` returns what percentage `part` is of `total`, as a `Double`. Careful: integer division would give `0` for `percent(1, 4)`.
2. `isEven(n)` returns `true` for even numbers. Use `%`.

```hint
Convert before dividing: `part.toDouble() / total * 100`.
```
```hint
`n % 2 == 0` is already a Boolean expression, so `fun isEven(n: Int) = n % 2 == 0` works.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun percent(part: Int, total: Int): Double = TODO()

fun isEven(n: Int): Boolean = TODO()
//sampleEnd

class NumbersTest {
    @Test fun quarter() = assertEquals(25.0, percent(1, 4))
    @Test fun half() = assertEquals(50.0, percent(3, 6))
    @Test fun evens() = assertTrue(isEven(10) && isEven(0) && isEven(-4))
    @Test fun odds() = assertFalse(isEven(7) || isEven(-3))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun percent(part: Int, total: Int): Double = part.toDouble() / total * 100

fun isEven(n: Int): Boolean = n % 2 == 0
//sampleEnd

class NumbersTest {
    @Test fun quarter() = assertEquals(25.0, percent(1, 4))
    @Test fun half() = assertEquals(50.0, percent(3, 6))
    @Test fun evens() = assertTrue(isEven(10) && isEven(0) && isEven(-4))
    @Test fun odds() = assertFalse(isEven(7) || isEven(-3))
}
```
