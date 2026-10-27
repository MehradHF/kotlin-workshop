---
title: Default and named arguments
section: Basics
---
Defaults and keyword arguments work almost exactly like Python. The difference: in Kotlin **any** parameter can be passed by name (no `*` marker needed), and there is no `**kwargs`. Instead you use overloads and defaults.

```python
def greet(name, greeting="Hello", punctuation="!"):
    return f"{greeting}, {name}{punctuation}"

greet("Ada", punctuation="?")
```
```kotlin
fun greet(name: String, greeting: String = "Hello", punctuation: String = "!") =
    "$greeting, $name$punctuation"

greet("Ada", punctuation = "?")
```

The standard library uses this heavily. For example `joinToString` has `separator`, `prefix`, `postfix`, `limit`... all with defaults:

```kotlin run
fun main() {
    val items = listOf("a", "b", "c")
    println(items.joinToString())                                   // a, b, c
    println(items.joinToString(separator = "|", prefix = "<", postfix = ">"))
}
```

```habit
**The `None` default trick.** Python evaluates `def f(items=[])` only once, so you learned to write `items=None` and create the list inside the function. Kotlin evaluates defaults on every call, so `fun f(items: MutableList<Int> = mutableListOf())` gets a fresh list each time. Write the real default directly.
```

## Your task

1. Implement `greet` with the defaults shown above.
2. `joinOptions(options)` should return the items as `"[a, b]"`: use `joinToString` with named `prefix` and `postfix` arguments.

```hint
Give each parameter a default with `= value` in the signature.
```
```hint
`options.joinToString(prefix = "[", postfix = "]")`. The default separator is already `", "`.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun greet(name: String, greeting: String = "", punctuation: String = ""): String = TODO()

fun joinOptions(options: Collection<String>): String = TODO()
//sampleEnd

class ArgsTest {
    @Test fun defaults() = assertEquals("Hello, Ada!", greet("Ada"))
    @Test fun overridePunctuation() = assertEquals("Hello, Ada?", greet("Ada", punctuation = "?"))
    @Test fun anyOrderWhenNamed() = assertEquals("Hi, Bob!", greet(greeting = "Hi", name = "Bob"))
    @Test fun join() = assertEquals("[a, b, c]", joinOptions(listOf("a", "b", "c")))
    @Test fun joinEmpty() = assertEquals("[]", joinOptions(emptyList()))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun greet(name: String, greeting: String = "Hello", punctuation: String = "!"): String =
    "$greeting, $name$punctuation"

fun joinOptions(options: Collection<String>): String =
    options.joinToString(prefix = "[", postfix = "]")
//sampleEnd

class ArgsTest {
    @Test fun defaults() = assertEquals("Hello, Ada!", greet("Ada"))
    @Test fun overridePunctuation() = assertEquals("Hello, Ada?", greet("Ada", punctuation = "?"))
    @Test fun anyOrderWhenNamed() = assertEquals("Hi, Bob!", greet(greeting = "Hi", name = "Bob"))
    @Test fun join() = assertEquals("[a, b, c]", joinOptions(listOf("a", "b", "c")))
    @Test fun joinEmpty() = assertEquals("[]", joinOptions(emptyList()))
}
```
