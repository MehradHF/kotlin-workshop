---
title: Classes and data classes
section: Classes
---
A Kotlin class declares its constructor and properties in one line. There is no `self`, no `__init__`, and no `new` when creating instances.

```python
class Rectangle:
    def __init__(self, width: int, height: int):
        self.width = width
        self.height = height

    @property
    def area(self) -> int:
        return self.width * self.height

r = Rectangle(3, 4)
```
```kotlin
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = width * height
}

val r = Rectangle(3, 4)
```

`val`/`var` in the constructor turns a parameter into a property. A `get()` after a property makes it computed on every access, like `@property`.

For classes that mainly hold data, add the `data` keyword. You get `equals`, `hashCode`, `toString` and `copy` for free, like `@dataclass(frozen=True)`. This is what most Spring request/response objects look like.

```python
@dataclass(frozen=True)
class Point:
    x: int
    y: int

p2 = replace(p, x=5)
```
```kotlin
data class Point(val x: Int, val y: Int)

val p2 = p.copy(x = 5)
```

`frozen=True` makes instances read-only (and hashable), which is what `val` properties give you in Kotlin. Because neither can be changed in place, you make a modified copy instead: `replace` in Python, `copy` in Kotlin.

Two more things Python developers trip over: classes are **final by default** (you must write `open` to allow inheritance), and members are **public by default**.

```kotlin run
data class Point(val x: Int, val y: Int)

fun main() {
    val a = Point(1, 2)
    println(a)                        // Point(x=1, y=2)
    println(a == Point(1, 2))         // true: compares contents, not identity
    println(a.copy(y = 10))           // Point(x=1, y=10)
}
```

```habit
**Underscore names and getter methods.** `_balance` is just a name in Kotlin, and nothing stops callers using it. Mark it `private` and the compiler enforces it. Don't write `get_balance()`-style methods either: a `val balance` property already is the getter, and callers read `account.balance`.
```

## Your task

1. Finish `Rectangle`: `area` is `width * height`, and `scaled(factor)` returns a **new** `Rectangle` with both sides multiplied.
2. `Point` is a plain class, so two equal points are not `==`. Make it a `data class`.
3. `moveRight(p)` returns a copy of the point with `x` increased by 1. Use `copy`.

```hint
`val area: Int get() = width * height`, or even `val area get() = width * height`.
```
```hint
For `scaled`, return `Rectangle(width * factor, height * factor)`.
```
```hint
Just add the word `data` in front of `class Point`.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int get() = TODO()

    fun scaled(factor: Int): Rectangle = TODO()
}

class Point(val x: Int, val y: Int)

fun moveRight(p: Point): Point = TODO()
//sampleEnd

class ClassesTest {
    @Test fun area() = assertEquals(12, Rectangle(3, 4).area)
    @Test fun scaled() {
        val r = Rectangle(2, 3).scaled(2)
        assertEquals(4, r.width)
        assertEquals(6, r.height)
    }
    @Test fun dataClassEquality() = assertEquals(Point(1, 2), Point(1, 2))
    @Test fun dataClassToString() = assertEquals("Point(x=1, y=2)", Point(1, 2).toString())
    @Test fun move() = assertEquals(Point(6, 2), moveRight(Point(5, 2)))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int get() = width * height

    fun scaled(factor: Int): Rectangle = Rectangle(width * factor, height * factor)
}

data class Point(val x: Int, val y: Int)

fun moveRight(p: Point): Point = p.copy(x = p.x + 1)
//sampleEnd

class ClassesTest {
    @Test fun area() = assertEquals(12, Rectangle(3, 4).area)
    @Test fun scaled() {
        val r = Rectangle(2, 3).scaled(2)
        assertEquals(4, r.width)
        assertEquals(6, r.height)
    }
    @Test fun dataClassEquality() = assertEquals(Point(1, 2), Point(1, 2))
    @Test fun dataClassToString() = assertEquals("Point(x=1, y=2)", Point(1, 2).toString())
    @Test fun move() = assertEquals(Point(6, 2), moveRight(Point(5, 2)))
}
```
