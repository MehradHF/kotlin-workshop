---
title: Extension functions
section: Idiomatic Kotlin
---
You can add a function to **any** existing type, including types you don't own such as `String` or `List`, without subclassing. In Python you would monkey-patch or write a free function `is_palindrome(s)`. Kotlin lets you call it as `s.isPalindrome()` and stays type-safe: it is just a static function with a nicer call syntax, so nothing is modified at runtime.

```python
def is_palindrome(s: str) -> bool:
    return s == s[::-1]

is_palindrome("racecar")
```
```kotlin
fun String.isPalindrome(): Boolean = this == this.reversed()

"racecar".isPalindrome()
```

Inside the function, `this` is the receiver (the object before the dot), and you can omit it: `this.reversed()` is just `reversed()`.

Extensions are everywhere in the standard library: `map`, `filter`, `toIntOrNull` and `joinToString` are all extensions. Spring code often defines extensions for mapping between layers, e.g. `fun OrderEntity.toDto() = OrderDto(...)`.

```kotlin run
fun Int.squared() = this * this
fun List<Int>.average2(): Double = sum().toDouble() / size

fun main() {
    println(5.squared())                    // 25
    println(listOf(1, 2, 6).average2())     // 3.0
}
```

```habit
**Monkey-patching.** An extension doesn't change the class: it only adds call syntax in code that imports it. It can't replace existing behaviour either. If the class already has a member with the same signature, the member always wins, and the compiler warns *This extension is shadowed by a member*.
```

## Your task

Write three extension functions (the signature, including the receiver type, is given):

1. `String.isPalindrome()`: ignoring case, `"Racecar"` is a palindrome.
2. `List<Int>.secondOrNull()`: the second element, or `null` if there is none.
3. `Int.isPrime()`: `true` for primes. 0, 1 and negative numbers are not prime.

```hint
`lowercase()` normalises case, and `reversed()` works on strings.
```
```hint
`getOrNull(1)` returns null instead of throwing when the index is out of range.
```
```hint
`n > 1 && (2 until n).none { n % it == 0 }`. In the extension, `this` plays the role of `n`.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun String.isPalindrome(): Boolean = TODO()

fun List<Int>.secondOrNull(): Int? = TODO()

fun Int.isPrime(): Boolean = TODO()
//sampleEnd

class ExtensionsTest {
    @Test fun palindrome() = assertTrue("racecar".isPalindrome())
    @Test fun palindromeCaseInsensitive() = assertTrue("Racecar".isPalindrome())
    @Test fun notPalindrome() = assertFalse("kotlin".isPalindrome())
    @Test fun second() = assertEquals(20, listOf(10, 20, 30).secondOrNull())
    @Test fun secondMissing() = assertNull(listOf(10).secondOrNull())
    @Test fun secondOfEmpty() = assertNull(emptyList<Int>().secondOrNull())
    @Test fun primes() = assertEquals(listOf(2, 3, 5, 7, 11), (0..12).filter { it.isPrime() })
    @Test fun negative() = assertFalse((-7).isPrime())
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun String.isPalindrome(): Boolean = lowercase() == lowercase().reversed()

fun List<Int>.secondOrNull(): Int? = getOrNull(1)

fun Int.isPrime(): Boolean = this > 1 && (2 until this).none { this % it == 0 }
//sampleEnd

class ExtensionsTest {
    @Test fun palindrome() = assertTrue("racecar".isPalindrome())
    @Test fun palindromeCaseInsensitive() = assertTrue("Racecar".isPalindrome())
    @Test fun notPalindrome() = assertFalse("kotlin".isPalindrome())
    @Test fun second() = assertEquals(20, listOf(10, 20, 30).secondOrNull())
    @Test fun secondMissing() = assertNull(listOf(10).secondOrNull())
    @Test fun secondOfEmpty() = assertNull(emptyList<Int>().secondOrNull())
    @Test fun primes() = assertEquals(listOf(2, 3, 5, 7, 11), (0..12).filter { it.isPrime() })
    @Test fun negative() = assertFalse((-7).isPrime())
}
```
