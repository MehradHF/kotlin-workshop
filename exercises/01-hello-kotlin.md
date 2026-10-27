---
title: Hello, Kotlin
section: Basics
---
Kotlin is statically typed: every function declares its parameter and return types, and the compiler checks them (think `mypy --strict`, but enforced). Blocks use `{ }` instead of indentation, and semicolons are optional.

```python
def add(a: int, b: int) -> int:
    return a + b
```
```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}
```

Types come **after** the name (`a: Int`), like Python annotations. When a function is a single expression you can drop the braces and `return`, and Kotlin infers the return type:

```python
def double(x): return x * 2
```
```kotlin
fun double(x: Int) = x * 2
```

```habit
**Forgetting `return` in a `{ }` body.** A function with braces returns nothing unless you write `return`: `fun add(a: Int, b: Int): Int { a + b }` fails with *Missing return statement*. Either add `return`, or use the expression form `= a + b`.
```

Every program starts at `main`, like `if __name__ == "__main__"`. Press the play button to run this one:

```kotlin run
fun main() {
    println("Hello, Kotlin!")
}
```

## Your task

Implement both functions. `TODO()` is a placeholder that throws, which is why the tests fail until you replace it. Press **Run** under the editor to check your work.

```hint
`fun hello(): String = "..."` is enough. Use double quotes: single quotes are for single characters in Kotlin.
```
```hint
For `add`, use the `+` operator on the two parameters.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun hello(): String = TODO()

fun add(a: Int, b: Int): Int = TODO()
//sampleEnd

class HelloTest {
    @Test fun helloReturnsGreeting() = assertEquals("Hello, Kotlin!", hello())
    @Test fun addsNumbers() = assertEquals(7, add(3, 4))
    @Test fun addsNegatives() = assertEquals(-1, add(2, -3))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun hello(): String = "Hello, Kotlin!"

fun add(a: Int, b: Int): Int = a + b
//sampleEnd

class HelloTest {
    @Test fun helloReturnsGreeting() = assertEquals("Hello, Kotlin!", hello())
    @Test fun addsNumbers() = assertEquals(7, add(3, 4))
    @Test fun addsNegatives() = assertEquals(-1, add(2, -3))
}
```
