---
title: Sequences (Kotlin's generators)
section: Collections
---
`map`, `filter` and friends on a `List` are **eager**: each step builds a whole new list. A `Sequence` is the lazy version, like a Python generator or iterator: values are produced one at a time, only as needed. Use it for infinite streams or very large pipelines.

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

list(itertools.islice(fibonacci(), 8))
```
```kotlin
fun fibonacci(): Sequence<Long> = sequence {
    var a = 0L
    var b = 1L
    while (true) {
        yield(a)
        val next = a + b
        a = b
        b = next
    }
}

fibonacci().take(8).toList()
```

`sequence { ... yield(x) ... }` is the generator builder. Other ways to get a sequence: `list.asSequence()` and `generateSequence(seed) { next }`. Intermediate operations (`map`, `filter`, `take`) stay lazy; a terminal one like `toList()`, `first()` or `sum()` runs the pipeline.

```kotlin run
fun main() {
    val firstSquaresOver50 = generateSequence(1) { it + 1 }   // 1, 2, 3, ... (infinite)
        .map { it * it }
        .filter { it > 50 }
        .take(3)
        .toList()
    println(firstSquaresOver50)   // [64, 81, 100]
}
```

```habit
**Expecting `map` and `filter` to be lazy.** In Python 3, `map()`, `filter()` and generator expressions are lazy. In Kotlin, `map` and `filter` on a `List` are **eager**: `list.map { ... }.first()` runs the lambda on every element first. Call `asSequence()` when you want the Python behaviour.
```

## Your task

1. `fibonacci()` returns the infinite sequence `0, 1, 1, 2, 3, 5, 8, ...` using the `sequence { yield }` builder.
2. `firstSquaresAbove(limit, count)` returns the first `count` perfect squares greater than `limit`, built from `generateSequence`.

```hint
Copy the shape of the lesson's example, but keep the loop going forever inside `sequence { ... }`: the caller decides when to stop with `take`.
```
```hint
`generateSequence(1) { it + 1 }.map { it * it }.filter { it > limit }.take(count).toList()`
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun fibonacci(): Sequence<Long> = TODO()

fun firstSquaresAbove(limit: Int, count: Int): List<Int> = TODO()
//sampleEnd

class SequencesTest {
    @Test fun fib() = assertEquals(listOf(0L, 1, 1, 2, 3, 5, 8, 13), fibonacci().take(8).toList())
    @Test fun fibIsLazy() = assertEquals(55L, fibonacci().drop(10).first())
    @Test fun squares() = assertEquals(listOf(64, 81, 100), firstSquaresAbove(50, 3))
    @Test fun squaresNone() = assertEquals(emptyList(), firstSquaresAbove(50, 0))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun fibonacci(): Sequence<Long> = sequence {
    var a = 0L
    var b = 1L
    while (true) {
        yield(a)
        val next = a + b
        a = b
        b = next
    }
}

fun firstSquaresAbove(limit: Int, count: Int): List<Int> =
    generateSequence(1) { it + 1 }
        .map { it * it }
        .filter { it > limit }
        .take(count)
        .toList()
//sampleEnd

class SequencesTest {
    @Test fun fib() = assertEquals(listOf(0L, 1, 1, 2, 3, 5, 8, 13), fibonacci().take(8).toList())
    @Test fun fibIsLazy() = assertEquals(55L, fibonacci().drop(10).first())
    @Test fun squares() = assertEquals(listOf(64, 81, 100), firstSquaresAbove(50, 3))
    @Test fun squaresNone() = assertEquals(emptyList(), firstSquaresAbove(50, 0))
}
```
