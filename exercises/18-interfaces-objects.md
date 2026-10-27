---
title: Interfaces, objects and companions
section: Modelling data
---
Three Python idioms get dedicated keywords in Kotlin.

**Interfaces** replace `ABC` / `Protocol`. A class implements one with `: Interface` and marks each method `override`. Interfaces can have default method bodies.

**`object`** declares a singleton: the class and its only instance in one go. Think of a module-level instance, or the Python module itself holding state.

**`companion object`** holds what Python puts in `@classmethod` / `@staticmethod`: factories and constants that belong to the class, not an instance.

```python
class Greeter(Protocol):
    def greet(self, name: str) -> str: ...

class Counter:                       # module-level singleton
    _count = 0
    @classmethod
    def next(cls): cls._count += 1; return cls._count

class Temperature:
    def __init__(self, celsius): self.celsius = celsius
    @classmethod
    def from_fahrenheit(cls, f): return cls((f - 32) * 5 / 9)
```
```kotlin
interface Greeter {
    fun greet(name: String): String
}

object Counter {
    private var count = 0
    fun next(): Int = ++count
}

class Temperature private constructor(val celsius: Double) {
    companion object {
        fun fromFahrenheit(f: Double) = Temperature((f - 32) * 5 / 9)
    }
}
```

Callers use `Counter.next()` and `Temperature.fromFahrenheit(212.0)`: no instance, no `new`. This is also how Spring beans end up as singletons, but there the framework manages them.

Remember: classes are final unless marked `open`, and interface methods are always overridable.

```kotlin run
interface Shape { val name: String; fun describe() = "I am a $name" }   // default body
class Square : Shape { override val name = "square" }

fun main() = println(Square().describe())
```

```habit
**Relying on duck typing.** A class with a matching `greet` method is not a `Greeter`: it must say so with `: Greeter` and mark the method `override`. Kotlin interfaces are *nominal*, unlike `Protocol`, which matches on shape. The upside: rename an interface method and the compiler points at every class that no longer matches.
```

## Your task

Everything is declared; replace the `TODO()`s.

1. `FormalGreeter.greet(name)` returns `"Good day, Ada."` style text.
2. `Counter.next()` returns `1`, then `2`, then `3`, and so on.
3. `Temperature.fromFahrenheit(f)` converts to Celsius using `(f - 32) * 5 / 9`.

```hint
`override fun greet(name: String) = "Good day, $name."`
```
```hint
`return ++count`, or `count += 1` followed by `return count`.
```
```hint
Call the private constructor from inside the companion: `Temperature((f - 32) * 5 / 9)`.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

interface Greeter {
    fun greet(name: String): String
}

//sampleStart
class FormalGreeter : Greeter {
    override fun greet(name: String): String = TODO()
}

object Counter {
    private var count = 0

    fun next(): Int = TODO()
}

class Temperature private constructor(val celsius: Double) {
    companion object {
        fun fromFahrenheit(f: Double): Temperature = TODO()
    }
}
//sampleEnd

class ObjectsTest {
    @Test fun greeter() {
        val g: Greeter = FormalGreeter()
        assertEquals("Good day, Ada.", g.greet("Ada"))
    }
    @Test fun counter() = assertEquals(listOf(1, 2, 3), List(3) { Counter.next() })
    @Test fun freezing() = assertEquals(0.0, Temperature.fromFahrenheit(32.0).celsius)
    @Test fun boiling() = assertEquals(100.0, Temperature.fromFahrenheit(212.0).celsius)
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

interface Greeter {
    fun greet(name: String): String
}

//sampleStart
class FormalGreeter : Greeter {
    override fun greet(name: String): String = "Good day, $name."
}

object Counter {
    private var count = 0

    fun next(): Int = ++count
}

class Temperature private constructor(val celsius: Double) {
    companion object {
        fun fromFahrenheit(f: Double): Temperature = Temperature((f - 32) * 5 / 9)
    }
}
//sampleEnd

class ObjectsTest {
    @Test fun greeter() {
        val g: Greeter = FormalGreeter()
        assertEquals("Good day, Ada.", g.greet("Ada"))
    }
    @Test fun counter() = assertEquals(listOf(1, 2, 3), List(3) { Counter.next() })
    @Test fun freezing() = assertEquals(0.0, Temperature.fromFahrenheit(32.0).celsius)
    @Test fun boiling() = assertEquals(100.0, Temperature.fromFahrenheit(212.0).celsius)
}
```
