---
title: map, filter and friends
section: Collections
---
Kotlin has no list comprehensions. Instead, collections have chainable functions that take lambdas. After a week you stop missing comprehensions: pipelines read top to bottom.

```python
[x * x for x in nums if x % 2 == 0]
{w: len(w) for w in words}
```
```kotlin
nums.filter { it % 2 == 0 }.map { it * it }
words.associateWith { it.length }
```

| Python | Kotlin |
|---|---|
| `[f(x) for x in xs]` | `xs.map { f(it) }` |
| `[x for x in xs if p(x)]` | `xs.filter { p(it) }` |
| `{k: v for ...}` | `xs.associate { k to v }` or `associateWith` / `associateBy` |
| `set(xs)` | `xs.toSet()` |
| `[y for x in xs for y in x]` | `xs.flatMap { it }` or `xs.flatten()` |
| `xs[:3]` | `xs.take(3)` |

```kotlin run
fun main() {
    val words = listOf("kotlin", "is", "fun", "and", "concise")
    println(words.filter { it.length > 3 }.map { it.uppercase() })
    println(words.associateWith { it.length })
    println(words.take(2))
}
```

## Your task

1. `evenSquares(nums)`: the squares of the even numbers, in the original order.
2. `shout(words)`: keep words longer than 3 letters, uppercase them and add `"!"`, e.g. `"kotlin"` becomes `"KOTLIN!"`.
3. `lengths(words)`: a map from each word to its length.

```hint
`nums.filter { it % 2 == 0 }.map { it * it }`
```
```hint
Inside `map` you can build the string with a template: `"${it.uppercase()}!"`.
```
```hint
`words.associateWith { it.length }`
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun evenSquares(nums: List<Int>): List<Int> = TODO()

fun shout(words: List<String>): List<String> = TODO()

fun lengths(words: List<String>): Map<String, Int> = TODO()
//sampleEnd

class MapFilterTest {
    @Test fun squares() = assertEquals(listOf(4, 16, 36), evenSquares(listOf(1, 2, 3, 4, 5, 6)))
    @Test fun squaresNone() = assertEquals(emptyList(), evenSquares(listOf(1, 3)))
    @Test fun shouting() = assertEquals(listOf("KOTLIN!", "CONCISE!"), shout(listOf("kotlin", "is", "fun", "concise")))
    @Test fun lens() = assertEquals(mapOf("hi" to 2, "there" to 5), lengths(listOf("hi", "there")))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun evenSquares(nums: List<Int>): List<Int> = nums.filter { it % 2 == 0 }.map { it * it }

fun shout(words: List<String>): List<String> =
    words.filter { it.length > 3 }.map { "${it.uppercase()}!" }

fun lengths(words: List<String>): Map<String, Int> = words.associateWith { it.length }
//sampleEnd

class MapFilterTest {
    @Test fun squares() = assertEquals(listOf(4, 16, 36), evenSquares(listOf(1, 2, 3, 4, 5, 6)))
    @Test fun squaresNone() = assertEquals(emptyList(), evenSquares(listOf(1, 3)))
    @Test fun shouting() = assertEquals(listOf("KOTLIN!", "CONCISE!"), shout(listOf("kotlin", "is", "fun", "concise")))
    @Test fun lens() = assertEquals(mapOf("hi" to 2, "there" to 5), lengths(listOf("hi", "there")))
}
```
