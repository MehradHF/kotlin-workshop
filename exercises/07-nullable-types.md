---
title: Nullable types
section: Null safety
---
This is Kotlin's biggest everyday difference from Python. A normal type **cannot hold `null`** (Kotlin's `None`). To allow it, add `?`. The compiler then forces you to handle the null case, so `NullPointerException`s mostly disappear (think `Optional[str]` with a type checker that actually refuses to compile).

```python
def city_of(person: Optional[Person]) -> str:
    if person is not None and person.address is not None:
        return person.address.city or "unknown"
    return "unknown"
```
```kotlin
fun cityOf(person: Person?): String =
    person?.address?.city ?: "unknown"
```

Three operators to learn:

| Operator | Meaning | Python-ish equivalent |
|---|---|---|
| `x?.length` | safe call: `null` if `x` is null | `x.length if x is not None else None` |
| `x ?: "default"` | Elvis: default when the left side is null | `x if x is not None else "default"` |
| `x!!` | "trust me, not null": throws if wrong | avoid it |

Parsing is a good example. Python's `int("abc")` raises. Kotlin offers a version that returns `null` instead:

```kotlin run
fun main() {
    println("42".toIntOrNull())       // 42
    println("abc".toIntOrNull())      // null
    val name: String? = null
    println(name?.length)             // null
    println(name?.length ?: 0)        // 0
}
```

## Your task

`Person`, `Address` and their nullable fields are given (classes are covered in the previous exercise).

1. `lengthOrZero(s)`: the length of `s`, or `0` if it is null.
2. `cityOf(person)`: the person's city, or `"unknown"` if the person, the address or the city is null. One expression with `?.` and `?:`.
3. `parseAge(text)`: the age as an `Int`, or `null` if it is not a number.

```hint
`s?.length ?: 0`
```
```hint
`person?.address?.city ?: "unknown"`
```
```hint
`text.toIntOrNull()`. The return type `Int?` already allows null.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

data class Address(val city: String?)
data class Person(val name: String, val address: Address?)

//sampleStart
fun lengthOrZero(s: String?): Int = TODO()

fun cityOf(person: Person?): String = TODO()

fun parseAge(text: String): Int? = TODO()
//sampleEnd

class NullableTest {
    @Test fun lengthOfString() = assertEquals(3, lengthOrZero("abc"))
    @Test fun lengthOfNull() = assertEquals(0, lengthOrZero(null))
    @Test fun city() = assertEquals("Berlin", cityOf(Person("Ada", Address("Berlin"))))
    @Test fun noPerson() = assertEquals("unknown", cityOf(null))
    @Test fun noAddress() = assertEquals("unknown", cityOf(Person("Ada", null)))
    @Test fun noCity() = assertEquals("unknown", cityOf(Person("Ada", Address(null))))
    @Test fun validAge() = assertEquals(42, parseAge("42"))
    @Test fun invalidAge() = assertNull(parseAge("forty-two"))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

data class Address(val city: String?)
data class Person(val name: String, val address: Address?)

//sampleStart
fun lengthOrZero(s: String?): Int = s?.length ?: 0

fun cityOf(person: Person?): String = person?.address?.city ?: "unknown"

fun parseAge(text: String): Int? = text.toIntOrNull()
//sampleEnd

class NullableTest {
    @Test fun lengthOfString() = assertEquals(3, lengthOrZero("abc"))
    @Test fun lengthOfNull() = assertEquals(0, lengthOrZero(null))
    @Test fun city() = assertEquals("Berlin", cityOf(Person("Ada", Address("Berlin"))))
    @Test fun noPerson() = assertEquals("unknown", cityOf(null))
    @Test fun noAddress() = assertEquals("unknown", cityOf(Person("Ada", null)))
    @Test fun noCity() = assertEquals("unknown", cityOf(Person("Ada", Address(null))))
    @Test fun validAge() = assertEquals(42, parseAge("42"))
    @Test fun invalidAge() = assertNull(parseAge("forty-two"))
}
```
