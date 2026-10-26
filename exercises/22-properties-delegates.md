---
title: Properties, lazy and lateinit
section: Idiomatic Kotlin
hidden: true
---
You have already seen computed properties (`val area get() = ...`, Python's `@property`). Two more property features show up constantly in Spring code.

**`by lazy`** computes a value on first access and caches it, exactly like `functools.cached_property`.

**`lateinit var`** declares a non-null `var` that you promise to assign before first use (for example by a framework, or in a test setup). Reading it too early throws. It is Kotlin's escape hatch from "every non-null property must be initialised in the constructor".

```python
class Report:
    @cached_property
    def summary(self):
        print("computing...")
        return expensive()

    @property
    def full_name(self):
        return f"{self.first} {self.last}"
```
```kotlin
class Report {
    val summary: String by lazy {
        println("computing...")
        expensive()
    }

    val fullName: String
        get() = "$first $last"
}
```

The difference between a getter and `by lazy`: a getter runs on **every** read; `lazy` runs its block once.

```kotlin run
class Demo {
    val every get() = println("getter ran")
    val once by lazy { println("lazy ran"); 42 }
    lateinit var name: String
}

fun main() {
    val d = Demo()
    d.every; d.every          // prints twice
    println(d.once); println(d.once)   // computed once, printed twice
    d.name = "set later"
    println(d.name)
}
```

## Your task

Two small classes with `TODO()`s:

1. `User.fullName` is `"first last"`, computed from the other properties (a custom getter).
2. `Report.summary` must be computed **once**, no matter how many times it is read. The starter uses a getter that recomputes every time. Change it to `by lazy`. `computations` counts how often the block ran.

```hint
`val fullName: String get() = "$first $last"`
```
```hint
`val summary: String by lazy { computations++; "report #$computations" }`: `by lazy` takes a lambda and caches its result.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
class User(val first: String, val last: String) {
    val fullName: String = TODO()
}

class Report {
    var computations = 0
        private set

    val summary: String
        get() {
            computations++
            return "report #$computations"
        }
}
//sampleEnd

class PropertiesTest {
    @Test fun fullName() = assertEquals("Ada Lovelace", User("Ada", "Lovelace").fullName)
    @Test fun lazyComputesOnce() {
        val r = Report()
        assertEquals("report #1", r.summary)
        assertEquals("report #1", r.summary)
        assertEquals(1, r.computations)
    }
    @Test fun lazyDoesNotComputeUntilAsked() = assertEquals(0, Report().computations)
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
class User(val first: String, val last: String) {
    val fullName: String
        get() = "$first $last"
}

class Report {
    var computations = 0
        private set

    val summary: String by lazy {
        computations++
        "report #$computations"
    }
}
//sampleEnd

class PropertiesTest {
    @Test fun fullName() = assertEquals("Ada Lovelace", User("Ada", "Lovelace").fullName)
    @Test fun lazyComputesOnce() {
        val r = Report()
        assertEquals("report #1", r.summary)
        assertEquals("report #1", r.summary)
        assertEquals(1, r.computations)
    }
    @Test fun lazyDoesNotComputeUntilAsked() = assertEquals(0, Report().computations)
}
```
