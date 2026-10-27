---
title: String templates
section: Basics
---
Kotlin's answer to f-strings: put `$name` or `${expression}` straight into a normal string. No `f` prefix needed.

```python
name, age = "Ada", 36
f"{name} is {age}, next year {age + 1}"
```
```kotlin
val name = "Ada"; val age = 36
"$name is $age, next year ${age + 1}"
```

Triple-quoted strings exist too (`"""..."""`), but they are **raw**: no escape sequences, and templates still work. They are handy for JSON, SQL and regexes. Use `.trimIndent()` to strip the shared leading whitespace.

```python
sql = """
    SELECT * FROM users
"""
```
```kotlin
val sql = """
    SELECT * FROM users
""".trimIndent()
```

```kotlin run
fun main() {
    val user = "Ada"
    println("Hello, $user! You have ${user.length} letters.")
    println("""She said "hi" and left\n""")   // \n is NOT an escape in a raw string
}
```

```habit
**Single quotes for strings.** `'hi'` does not compile (*Too many characters in a character literal*): single quotes make a `Char`, exactly one character. Strings always use double quotes, so `"it's"` needs no escaping.
```

## Your task

1. `summary(name, age)` returns `"Ada is 36, next year 37"` style text.
2. `jsonOf(name)` returns the JSON text `{"name": "Ada"}`. Use a raw string so you don't need to escape the quotes.

```hint
`"$name is $age, next year ${age + 1}"`
```
```hint
`"""{"name": "$name"}"""`: the closing `"""` can directly follow the `}`.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun summary(name: String, age: Int): String = TODO()

fun jsonOf(name: String): String = TODO()
//sampleEnd

class StringsTest {
    @Test fun summaryText() = assertEquals("Ada is 36, next year 37", summary("Ada", 36))
    @Test fun summaryOtherPerson() = assertEquals("Linus is 9, next year 10", summary("Linus", 9))
    @Test fun json() = assertEquals("{\"name\": \"Grace\"}", jsonOf("Grace"))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun summary(name: String, age: Int): String = "$name is $age, next year ${age + 1}"

fun jsonOf(name: String): String = """{"name": "$name"}"""
//sampleEnd

class StringsTest {
    @Test fun summaryText() = assertEquals("Ada is 36, next year 37", summary("Ada", 36))
    @Test fun summaryOtherPerson() = assertEquals("Linus is 9, next year 10", summary("Linus", 9))
    @Test fun json() = assertEquals("{\"name\": \"Grace\"}", jsonOf("Grace"))
}
```
