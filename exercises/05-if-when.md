---
title: if and when are expressions
section: Basics
---
In Kotlin, `if` and `when` **return a value**. That replaces Python's ternary (`a if c else b`) and covers most of what `match` does, with less ceremony. There is no `elif`: you write `else if`.

```python
label = "big" if n > 100 else "small"

match code:
    case 200: msg = "ok"
    case 404: msg = "missing"
    case _:   msg = "other"
```
```kotlin
val label = if (n > 100) "big" else "small"

val msg = when (code) {
    200 -> "ok"
    404 -> "missing"
    else -> "other"
}
```

`when` branches can test ranges (`in 1..9`), several values (`1, 2, 3 ->`), or types (`is String ->`). With no subject, each branch is just a boolean condition, like an `if / elif` chain:

```kotlin run
fun main() {
    val temp = 25
    val feel = when {
        temp < 0 -> "freezing"
        temp < 15 -> "cold"
        temp in 15..25 -> "pleasant"
        else -> "hot"
    }
    println(feel)
}
```

## Your task

1. `grade(score)`: 90 and above is `"A"`, 80-89 is `"B"`, 70-79 is `"C"`, anything lower is `"F"`. Use `when` with ranges.
2. `biggest(a, b)` returns the larger number using an `if` **expression** (no `return` inside the branches).

```hint
`when { score >= 90 -> "A" ... }` or `when (score) { in 80..89 -> "B" ... }`: either style works.
```
```hint
`fun biggest(a: Int, b: Int) = if (a > b) a else b`
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun grade(score: Int): String = TODO()

fun biggest(a: Int, b: Int): Int = TODO()
//sampleEnd

class WhenTest {
    @Test fun a() = assertEquals("A", grade(95))
    @Test fun aBoundary() = assertEquals("A", grade(90))
    @Test fun b() = assertEquals("B", grade(89))
    @Test fun c() = assertEquals("C", grade(70))
    @Test fun f() = assertEquals("F", grade(12))
    @Test fun biggestFirst() = assertEquals(9, biggest(9, 3))
    @Test fun biggestSecond() = assertEquals(9, biggest(3, 9))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun grade(score: Int): String = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    score >= 70 -> "C"
    else -> "F"
}

fun biggest(a: Int, b: Int): Int = if (a > b) a else b
//sampleEnd

class WhenTest {
    @Test fun a() = assertEquals("A", grade(95))
    @Test fun aBoundary() = assertEquals("A", grade(90))
    @Test fun b() = assertEquals("B", grade(89))
    @Test fun c() = assertEquals("C", grade(70))
    @Test fun f() = assertEquals("F", grade(12))
    @Test fun biggestFirst() = assertEquals(9, biggest(9, 3))
    @Test fun biggestSecond() = assertEquals(9, biggest(3, 9))
}
```
