---
title: Scope functions (let, apply, also)
section: Idiomatic Kotlin
---
Python has no direct equivalent of these, but you will see them in every Kotlin codebase. They are small standard-library functions that run a block on an object. You mostly need three:

| Function | Inside the block the object is | Returns | Typical use |
|---|---|---|---|
| `x.let { ... }` | `it` | the block's result | do something **if not null**, or transform a value |
| `x.apply { ... }` | `this` | the object itself | configure/initialise an object |
| `x.also { ... }` | `it` | the object itself | side effects like logging |

```python
if email is not None:
    message = f"Email: {email}"
else:
    message = "No email"

config = {}
config["env"] = "prod"
config["debug"] = "false"
```
```kotlin
val message = email?.let { "Email: $it" } ?: "No email"

val config = mutableMapOf<String, String>().apply {
    this["env"] = "prod"
    this["debug"] = "false"
}
```

`?.let { }` is the most common pattern: the block runs only when the value is non-null, and inside it `it` is non-null.

```kotlin run
fun main() {
    val name: String? = "kotlin"
    name?.let { println("Length is ${it.length}") }       // runs
    val missing: String? = null
    missing?.let { println("never printed") }              // skipped

    val sb = StringBuilder().apply {
        append("a")
        append("b")
    }
    println(sb)    // ab
}
```

## Your task

1. `describeEmail(email)`: `"Email: ada@example.com"` or `"No email"` when null. Use `?.let` and `?:`.
2. `defaultConfig()`: a `MutableMap<String, String>` containing `env=prod` and `debug=false`, built with `apply`.
3. `csvLine(values)`: join `values` with commas into a `StringBuilder` using `apply` and a `for` loop (no `joinToString`!), returning the final `String`. Make sure there is no trailing comma.

```hint
`email?.let { "Email: $it" } ?: "No email"`
```
```hint
`mutableMapOf<String, String>().apply { this["env"] = "prod"; ... }`. You can also write `put("env", "prod")`.
```
```hint
Inside `apply`, loop with `for ((i, v) in values.withIndex())` and append a comma only when `i > 0`. Finish with `.toString()`.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun describeEmail(email: String?): String = TODO()

fun defaultConfig(): MutableMap<String, String> = TODO()

fun csvLine(values: List<String>): String = TODO()
//sampleEnd

class ScopeFunctionsTest {
    @Test fun withEmail() = assertEquals("Email: ada@example.com", describeEmail("ada@example.com"))
    @Test fun withoutEmail() = assertEquals("No email", describeEmail(null))
    @Test fun config() = assertEquals(mapOf("env" to "prod", "debug" to "false"), defaultConfig())
    @Test fun configIsMutable() {
        val c = defaultConfig()
        c["extra"] = "1"
        assertEquals(3, c.size)
    }
    @Test fun csv() = assertEquals("a,b,c", csvLine(listOf("a", "b", "c")))
    @Test fun csvSingle() = assertEquals("a", csvLine(listOf("a")))
    @Test fun csvEmpty() = assertEquals("", csvLine(emptyList()))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun describeEmail(email: String?): String = email?.let { "Email: $it" } ?: "No email"

fun defaultConfig(): MutableMap<String, String> = mutableMapOf<String, String>().apply {
    this["env"] = "prod"
    this["debug"] = "false"
}

fun csvLine(values: List<String>): String = StringBuilder().apply {
    for ((i, v) in values.withIndex()) {
        if (i > 0) append(",")
        append(v)
    }
}.toString()
//sampleEnd

class ScopeFunctionsTest {
    @Test fun withEmail() = assertEquals("Email: ada@example.com", describeEmail("ada@example.com"))
    @Test fun withoutEmail() = assertEquals("No email", describeEmail(null))
    @Test fun config() = assertEquals(mapOf("env" to "prod", "debug" to "false"), defaultConfig())
    @Test fun configIsMutable() {
        val c = defaultConfig()
        c["extra"] = "1"
        assertEquals(3, c.size)
    }
    @Test fun csv() = assertEquals("a,b,c", csvLine(listOf("a", "b", "c")))
    @Test fun csvSingle() = assertEquals("a", csvLine(listOf("a")))
    @Test fun csvEmpty() = assertEquals("", csvLine(emptyList()))
}
```
