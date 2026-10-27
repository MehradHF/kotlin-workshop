---
title: Lists, sets and maps
section: Collections
---
Kotlin separates **read-only** and **mutable** collections at the type level. `listOf(...)` gives a `List` you can read but not change; `mutableListOf(...)` gives a `MutableList`. Same for `setOf`/`mutableSetOf` and `mapOf`/`mutableMapOf`. Prefer the read-only ones and build new collections instead of mutating.

```python
nums = [1, 2, 3]
nums.append(4)
ages = {"ada": 36}
ages["linus"] = 28
```
```kotlin
val nums = listOf(1, 2, 3)          // read-only
val more = nums + 4                 // new list [1, 2, 3, 4]
val ages = mutableMapOf("ada" to 36)
ages["linus"] = 28
```

`"ada" to 36` creates a `Pair`. Indexing with `[]` works on lists and maps. Reading a map key that may not exist returns **`null`** (a `V?`), not a `KeyError`, so you combine it with `?:`:

```python
count = counts.get(word, 0)
```
```kotlin
val count = counts[word] ?: 0
```

```kotlin run
fun main() {
    val ages = mapOf("ada" to 36, "linus" to 28)
    println(ages["ada"])             // 36
    println(ages["grace"])           // null
    println(ages["grace"] ?: -1)     // -1
    for ((name, age) in ages) println("$name is $age")   // unpacks like .items()
}
```

```habit
**Thinking `val` makes the contents immutable.** `val items = mutableListOf(1)` still allows `items.add(2)`: `val` only stops the *variable* from pointing at another list. Whether the collection itself can change comes from its type, `List` versus `MutableList`, a bit like `tuple` versus `list`.
```

## Your task

1. `wordCounts(words)` counts how many times each word occurs (like `collections.Counter`). Use a `mutableMapOf<String, Int>()`, a `for` loop and `?: 0`. (We will meet a one-liner for this later.)
2. `withItem(list, item)` returns a **new** list with `item` added at the end. The input is read-only, so you can't call `add`: use `+`.

```hint
`for (word in words) { counts[word] = (counts[word] ?: 0) + 1 }`, then return `counts`.
```
```hint
`list + item`
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun wordCounts(words: List<String>): Map<String, Int> = TODO()

fun withItem(list: List<String>, item: String): List<String> = TODO()
//sampleEnd

class CollectionsBasicsTest {
    @Test fun counts() =
        assertEquals(mapOf("a" to 3, "b" to 1, "c" to 2), wordCounts(listOf("a", "b", "a", "c", "a", "c")))
    @Test fun countsEmpty() = assertEquals(emptyMap(), wordCounts(emptyList()))
    @Test fun addItem() = assertEquals(listOf("x", "y", "z"), withItem(listOf("x", "y"), "z"))
    @Test fun originalUntouched() {
        val original = listOf("x")
        withItem(original, "y")
        assertEquals(listOf("x"), original)
    }
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun wordCounts(words: List<String>): Map<String, Int> {
    val counts = mutableMapOf<String, Int>()
    for (word in words) {
        counts[word] = (counts[word] ?: 0) + 1
    }
    return counts
}

fun withItem(list: List<String>, item: String): List<String> = list + item
//sampleEnd

class CollectionsBasicsTest {
    @Test fun counts() =
        assertEquals(mapOf("a" to 3, "b" to 1, "c" to 2), wordCounts(listOf("a", "b", "a", "c", "a", "c")))
    @Test fun countsEmpty() = assertEquals(emptyMap(), wordCounts(emptyList()))
    @Test fun addItem() = assertEquals(listOf("x", "y", "z"), withItem(listOf("x", "y"), "z"))
    @Test fun originalUntouched() {
        val original = listOf("x")
        withItem(original, "y")
        assertEquals(listOf("x"), original)
    }
}
```
