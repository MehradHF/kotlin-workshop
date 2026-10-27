---
title: Ranges, loops and destructuring
section: Collections
---
Kotlin has only two loops that matter: `for (x in something)` and `while`. Ranges replace `range()`, and `withIndex()`/`zip()` replace `enumerate()`/`zip()`.

```python
for i in range(1, 6): ...
for i in range(10, 0, -2): ...
for i, name in enumerate(names): ...
for a, b in zip(xs, ys): ...
for key, value in d.items(): ...
```
```kotlin
for (i in 1..5) { ... }              // 1..5 includes 5
for (i in 10 downTo 1 step 2) { ... }
for ((i, name) in names.withIndex()) { ... }
for ((a, b) in xs.zip(ys)) { ... }
for ((key, value) in map) { ... }
```

Careful: `1..5` is **inclusive** (Python's `range(1, 6)`). To exclude the end use `until`: `0 until n` is `range(n)`. Also useful: `x in 1..9` as a condition, like `1 <= x <= 9`.

The `(a, b)` syntax is *destructuring*, like tuple unpacking. It works on `Pair`, `Map.Entry`, and any data class: `val (name, age) = person`.

```kotlin run
fun main() {
    for (i in 0 until 3) print("$i ")           // 0 1 2
    println()
    for ((i, c) in "abc".withIndex()) print("$i$c ")   // 0a 1b 2c
    println()
    val (first, second) = Pair("x", "y")
    println("$first $second")
}
```

```habit
**`for i in range(len(xs))`.** Loop over the elements directly (`for (x in xs)`), or use `withIndex()` when you need the index too. If you really want only the indices, `xs.indices` is the safe spelling of `0 until xs.size`.
```

## Your task

1. `fizzBuzz(n)`: a list for `1..n`: `"FizzBuzz"` for multiples of 15, `"Fizz"` for multiples of 3, `"Buzz"` for multiples of 5, otherwise the number as a string. Loop with a range and use `when`.
2. `indexed(items)`: `["a", "b"]` becomes `["0:a", "1:b"]`. Use `withIndex()`.
3. `pairSums(xs, ys)`: add the elements pairwise (`zip`), stopping at the shorter list.

```hint
`(1..n).map { i -> when { i % 15 == 0 -> "FizzBuzz" ... else -> i.toString() } }`
```
```hint
`items.withIndex().map { (i, item) -> "$i:$item" }`: destructuring works in lambda parameters too.
```
```hint
`xs.zip(ys).map { (x, y) -> x + y }`, or `xs.zip(ys) { x, y -> x + y }`.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun fizzBuzz(n: Int): List<String> = TODO()

fun indexed(items: List<String>): List<String> = TODO()

fun pairSums(xs: List<Int>, ys: List<Int>): List<Int> = TODO()
//sampleEnd

class RangesTest {
    @Test fun fizz() = assertEquals(
        listOf("1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"),
        fizzBuzz(15),
    )
    @Test fun fizzZero() = assertEquals(emptyList(), fizzBuzz(0))
    @Test fun withIndex() = assertEquals(listOf("0:a", "1:b", "2:c"), indexed(listOf("a", "b", "c")))
    @Test fun sums() = assertEquals(listOf(11, 22, 33), pairSums(listOf(1, 2, 3), listOf(10, 20, 30)))
    @Test fun sumsUneven() = assertEquals(listOf(5), pairSums(listOf(2), listOf(3, 4, 5)))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun fizzBuzz(n: Int): List<String> = (1..n).map { i ->
    when {
        i % 15 == 0 -> "FizzBuzz"
        i % 3 == 0 -> "Fizz"
        i % 5 == 0 -> "Buzz"
        else -> i.toString()
    }
}

fun indexed(items: List<String>): List<String> = items.withIndex().map { (i, item) -> "$i:$item" }

fun pairSums(xs: List<Int>, ys: List<Int>): List<Int> = xs.zip(ys).map { (x, y) -> x + y }
//sampleEnd

class RangesTest {
    @Test fun fizz() = assertEquals(
        listOf("1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"),
        fizzBuzz(15),
    )
    @Test fun fizzZero() = assertEquals(emptyList(), fizzBuzz(0))
    @Test fun withIndex() = assertEquals(listOf("0:a", "1:b", "2:c"), indexed(listOf("a", "b", "c")))
    @Test fun sums() = assertEquals(listOf(11, 22, 33), pairSums(listOf(1, 2, 3), listOf(10, 20, 30)))
    @Test fun sumsUneven() = assertEquals(listOf(5), pairSums(listOf(2), listOf(3, 4, 5)))
}
```
