---
title: Generics
section: Idiomatic Kotlin
---
Generics are Python's `TypeVar` and `Generic[T]`, except the compiler enforces them rather than an optional type checker. A type parameter goes in angle brackets, and you can bound it (`T : Comparable<T>`) to say "any type that can be ordered", which is how `sorted()` knows it can compare things.

```python
T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, item: T): self.item = item

N = TypeVar("N", bound=SupportsLessThan)
def bigger(a: N, b: N) -> N:
    return a if a > b else b
```
```kotlin
class Box<T>(val item: T)

fun <T : Comparable<T>> bigger(a: T, b: T): T = if (a > b) a else b
```

Notice that a generic function declares its type parameter **before** the name: `fun <T> name(...)`. The compiler infers `T` from the call, so you rarely write it out: `bigger(1, 2)` and `bigger("a", "b")` just work.

```kotlin run
class Box<T>(val item: T) {
    fun <R> map(f: (T) -> R) = Box(f(item))
}

fun main() {
    val b = Box(21)
    println(b.map { it * 2 }.item)            // 42
    println(b.map { "n=$it" }.item)           // n=21
}
```

## Your task

1. Implement the generic `Stack<T>` backed by a `MutableList<T>`: `push(item)`, `pop()` (returns the top item or `null` if empty), `peek()` (same but doesn't remove it) and `size`.
2. Implement `bigger(a, b)`, bounded by `Comparable`, returning the larger value for any comparable type.

```hint
`items.removeLastOrNull()` removes and returns the last element, or null. `items.lastOrNull()` only looks.
```
```hint
For `size` write `val size: Int get() = items.size`. For `bigger`: `if (a > b) a else b` works because `T : Comparable<T>` gives you `>`.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
class Stack<T> {
    private val items = mutableListOf<T>()

    val size: Int get() = TODO()

    fun push(item: T) { TODO() }

    fun pop(): T? = TODO()

    fun peek(): T? = TODO()
}

fun <T : Comparable<T>> bigger(a: T, b: T): T = TODO()
//sampleEnd

class GenericsTest {
    @Test fun stackOfInts() {
        val s = Stack<Int>()
        s.push(1); s.push(2)
        assertEquals(2, s.size)
        assertEquals(2, s.peek())
        assertEquals(2, s.pop())
        assertEquals(1, s.pop())
        assertNull(s.pop())
    }
    @Test fun stackOfStrings() {
        val s = Stack<String>()
        s.push("a")
        assertEquals("a", s.peek())
        assertEquals(1, s.size)
    }
    @Test fun emptyStack() {
        val s = Stack<Double>()
        assertNull(s.peek())
        assertEquals(0, s.size)
    }
    @Test fun biggerInts() = assertEquals(9, bigger(3, 9))
    @Test fun biggerStrings() = assertEquals("pear", bigger("apple", "pear"))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
class Stack<T> {
    private val items = mutableListOf<T>()

    val size: Int get() = items.size

    fun push(item: T) { items.add(item) }

    fun pop(): T? = items.removeLastOrNull()

    fun peek(): T? = items.lastOrNull()
}

fun <T : Comparable<T>> bigger(a: T, b: T): T = if (a > b) a else b
//sampleEnd

class GenericsTest {
    @Test fun stackOfInts() {
        val s = Stack<Int>()
        s.push(1); s.push(2)
        assertEquals(2, s.size)
        assertEquals(2, s.peek())
        assertEquals(2, s.pop())
        assertEquals(1, s.pop())
        assertNull(s.pop())
    }
    @Test fun stackOfStrings() {
        val s = Stack<String>()
        s.push("a")
        assertEquals("a", s.peek())
        assertEquals(1, s.size)
    }
    @Test fun emptyStack() {
        val s = Stack<Double>()
        assertNull(s.peek())
        assertEquals(0, s.size)
    }
    @Test fun biggerInts() = assertEquals(9, bigger(3, 9))
    @Test fun biggerStrings() = assertEquals("pear", bigger("apple", "pear"))
}
```
