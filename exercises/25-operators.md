---
title: Operator overloading
section: Idiomatic Kotlin
---
Python's dunder methods (`__add__`, `__lt__`, `__getitem__`, `__call__`) are `operator fun` in Kotlin. The operator keyword is the opt-in: only functions marked `operator` with the right name can be used with the symbol.

| Python | Kotlin |
|---|---|
| `__add__` | `operator fun plus(other)` |
| `__mul__` | `operator fun times(other)` |
| `__getitem__` | `operator fun get(i)` |
| `__contains__` | `operator fun contains(x)` |
| `__lt__` etc. | implement `Comparable<T>` and `operator fun compareTo` |
| `__call__` | `operator fun invoke(...)` |

```python
@dataclass(frozen=True, order=True)
class Money:
    cents: int
    def __add__(self, other): return Money(self.cents + other.cents)
    def __mul__(self, n): return Money(self.cents * n)

Money(100) + Money(50)
```
```kotlin
data class Money(val cents: Int) : Comparable<Money> {
    operator fun plus(other: Money) = Money(cents + other.cents)
    operator fun times(n: Int) = Money(cents * n)
    override operator fun compareTo(other: Money) = cents.compareTo(other.cents)
}

Money(100) + Money(50)
```

Once `compareTo` exists, `<`, `>`, `<=` and `>=` all work, plus `sorted()`, `maxOrNull()`, `coerceAtLeast` and so on.

```kotlin run
class Matrix(val rows: List<List<Int>>) {
    operator fun get(r: Int, c: Int) = rows[r][c]     // matrix[0, 1]
    operator fun contains(x: Int) = rows.any { x in it }
}

fun main() {
    val m = Matrix(listOf(listOf(1, 2), listOf(3, 4)))
    println(m[1, 0])      // 3
    println(4 in m)       // true
}
```

## Your task

Finish `Money`:

1. `plus`: adds two amounts.
2. `times`: multiplies by an `Int`.
3. `compareTo`: orders by cents. `Money(100) < Money(200)` must be true.

```hint
`operator fun plus(other: Money) = Money(cents + other.cents)`
```
```hint
`cents.compareTo(other.cents)` returns a negative number, zero or positive, exactly what `compareTo` expects.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
data class Money(val cents: Int) : Comparable<Money> {
    operator fun plus(other: Money): Money = TODO()

    operator fun times(n: Int): Money = TODO()

    override operator fun compareTo(other: Money): Int = TODO()
}
//sampleEnd

class OperatorsTest {
    @Test fun add() = assertEquals(Money(150), Money(100) + Money(50))
    @Test fun multiply() = assertEquals(Money(300), Money(100) * 3)
    @Test fun less() = assertTrue(Money(100) < Money(200))
    @Test fun notLess() = assertFalse(Money(200) < Money(100))
    @Test fun greaterOrEqual() = assertTrue(Money(200) >= Money(200))
    @Test fun sortingWorks() =
        assertEquals(listOf(Money(1), Money(5), Money(9)), listOf(Money(9), Money(1), Money(5)).sorted())
    @Test fun sumWithOperators() = assertEquals(Money(60), listOf(Money(10), Money(20), Money(30)).fold(Money(0)) { a, b -> a + b })
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
data class Money(val cents: Int) : Comparable<Money> {
    operator fun plus(other: Money): Money = Money(cents + other.cents)

    operator fun times(n: Int): Money = Money(cents * n)

    override operator fun compareTo(other: Money): Int = cents.compareTo(other.cents)
}
//sampleEnd

class OperatorsTest {
    @Test fun add() = assertEquals(Money(150), Money(100) + Money(50))
    @Test fun multiply() = assertEquals(Money(300), Money(100) * 3)
    @Test fun less() = assertTrue(Money(100) < Money(200))
    @Test fun notLess() = assertFalse(Money(200) < Money(100))
    @Test fun greaterOrEqual() = assertTrue(Money(200) >= Money(200))
    @Test fun sortingWorks() =
        assertEquals(listOf(Money(1), Money(5), Money(9)), listOf(Money(9), Money(1), Money(5)).sorted())
    @Test fun sumWithOperators() = assertEquals(Money(60), listOf(Money(10), Money(20), Money(30)).fold(Money(0)) { a, b -> a + b })
}
```
