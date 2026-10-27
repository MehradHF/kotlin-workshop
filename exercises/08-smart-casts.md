---
title: Type checks and smart casts
section: Null safety
---
`is` is Kotlin's `isinstance`. The nice part: after the check, the compiler **smart-casts** the variable, so you can use it as the narrower type without casting. Null checks work the same way.

```python
def describe(x: object) -> str:
    if isinstance(x, str):
        return f"string of length {len(x)}"
    if isinstance(x, list):
        return f"list of {len(x)}"
    return "unknown"
```
```kotlin
fun describe(x: Any): String = when (x) {
    is String -> "string of length ${x.length}"   // x is a String here
    is List<*> -> "list of ${x.size}"
    else -> "unknown"
}
```

`Any` is Kotlin's `object`: the root of all non-null types (`Any?` also allows null). `List<*>` means "a list of anything".

Smart casts also work with plain `if` and with `&&`:

```kotlin run
fun lengthIfLong(s: Any?): Int =
    if (s is String && s.length > 3) s.length else -1   // s is String on the right of &&

fun main() {
    println(lengthIfLong("hello"))   // 5
    println(lengthIfLong(42))        // -1
    println(lengthIfLong(null))      // -1
}
```

```habit
**Accepting anything and checking types at runtime.** A Python function often takes whatever it is given and inspects it with `isinstance`. In Kotlin, declare the type you actually need (`String`, `List<Int>`, an interface) and let the compiler reject wrong calls. `Any` plus `is` checks is for the rare input that really is mixed, such as parsed JSON.
```

## Your task

Implement `describe(x)`:

| Input | Result |
|---|---|
| an `Int` | `"Int: "` followed by the number doubled |
| a `String` | `"String of length "` followed by its length |
| a `List` | `"List of size "` followed by its size |
| anything else (including `null`) | `"Unknown"` |

```hint
Use `when (x)` with `is Int ->`, `is String ->`, `is List<*> ->` and `else ->`. Inside each branch `x` already has that type.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun describe(x: Any?): String = TODO()
//sampleEnd

class SmartCastTest {
    @Test fun int() = assertEquals("Int: 42", describe(21))
    @Test fun string() = assertEquals("String of length 5", describe("hello"))
    @Test fun list() = assertEquals("List of size 3", describe(listOf(1, 2, 3)))
    @Test fun other() = assertEquals("Unknown", describe(3.14))
    @Test fun nullValue() = assertEquals("Unknown", describe(null))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun describe(x: Any?): String = when (x) {
    is Int -> "Int: ${x * 2}"
    is String -> "String of length ${x.length}"
    is List<*> -> "List of size ${x.size}"
    else -> "Unknown"
}
//sampleEnd

class SmartCastTest {
    @Test fun int() = assertEquals("Int: 42", describe(21))
    @Test fun string() = assertEquals("String of length 5", describe("hello"))
    @Test fun list() = assertEquals("List of size 3", describe(listOf(1, 2, 3)))
    @Test fun other() = assertEquals("Unknown", describe(3.14))
    @Test fun nullValue() = assertEquals("Unknown", describe(null))
}
```
