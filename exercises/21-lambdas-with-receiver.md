---
title: Lambdas with receiver (builders and DSLs)
section: Idiomatic Kotlin
---
A normal lambda receives its input as a parameter: `(Person) -> Unit` gets a `person` (or `it`) and you write `it.name = "Ada"`. A **lambda with receiver** has the type `Person.() -> Unit`. Inside it the object is `this`, and you can drop the `this.`: you just write `name = "Ada"`, as if the lambda were a method of `Person`.

You already used these: `apply` is declared as `fun <T> T.apply(block: T.() -> Unit): T`, and `buildString { append("a") }` works the same way.

```python
# Python has no equivalent. The closest is passing the object in and using it explicitly:
def build_request(configure):
    req = Request()
    configure(req)
    return req

build_request(lambda r: setattr(r, "url", "/orders"))   # awkward: every line needs "r."
```
```kotlin
fun request(configure: Request.() -> Unit): Request {
    val req = Request()
    req.configure()          // call the lambda *on* req
    return req
}

request { url = "/orders" }  // no "it." or "req." needed
```

The recipe to write your own builder has three steps:

1. Take a parameter of type `Receiver.() -> Unit`.
2. Create the receiver object.
3. Run the lambda on it (`receiver.block()`) and return the result.

Trailing-lambda syntax then makes calls look like configuration blocks. That is how Kotlin DSLs are built: Gradle's `build.gradle.kts`, Spring's `router { }` and `beans { }`, and `mockMvc.get("/orders") { ... }` in tests. You will meet them in the Spring part.

```kotlin run
class Request {
    var url = ""
    var retries = 0
}

fun request(configure: Request.() -> Unit): String {
    val req = Request()
    req.configure()
    return "GET ${req.url} (retries=${req.retries})"
}

fun main() {
    println(request { url = "/orders"; retries = 3 })     // GET /orders (retries=3)
    println(request { url = "/health" })                    // GET /health (retries=0)
    println(buildString { append("built "); append("by lambda with receiver") })
}
```

## Your task

The classes `Person`, `PersonBuilder` and `Ul` are given. Write three functions that take a lambda with receiver:

1. `buildPerson { name = "Ada"; age = 36 }` creates a `PersonBuilder`, runs the lambda on it and returns the built `Person`.
2. `myApply`: re-implement the standard `apply` yourself. It runs `block` on the receiver and returns the receiver.
3. `ul { li("a"); li("b") }` returns the HTML `<ul><li>a</li><li>b</li></ul>`. Create an `Ul`, run the lambda on it and return its `render()`.

```hint
`val builder = PersonBuilder()`, then `builder.block()`, then `return builder.build()`.
```
```hint
In `myApply` the receiver is `this`, so `block()` or `this.block()` both run the lambda on it. Return `this`.
```
```hint
`ul` has the same shape as `buildPerson`: only the receiver class and the final call (`render()` instead of `build()`) differ.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

data class Person(val name: String, val age: Int)

class PersonBuilder {
    var name = ""
    var age = 0

    fun build() = Person(name, age)
}

class Ul {
    private val items = mutableListOf<String>()

    fun li(text: String) { items += "<li>$text</li>" }

    fun render() = "<ul>${items.joinToString("")}</ul>"
}

//sampleStart
fun buildPerson(block: PersonBuilder.() -> Unit): Person = TODO()

fun <T> T.myApply(block: T.() -> Unit): T = TODO()

fun ul(block: Ul.() -> Unit): String = TODO()
//sampleEnd

class ReceiverTest {
    @Test fun builder() {
        val p = buildPerson {
            name = "Ada"
            age = 36
        }
        assertEquals(Person("Ada", 36), p)
    }
    @Test fun builderKeepsDefaults() = assertEquals(Person("", 0), buildPerson { })
    @Test fun myApplyReturnsReceiver() {
        val sb = StringBuilder().myApply { append("hi") }
        assertEquals("hi", sb.toString())
    }
    @Test fun myApplyOnList() = assertEquals(listOf(1, 2), mutableListOf<Int>().myApply { add(1); add(2) })
    @Test fun htmlList() = assertEquals("<ul><li>a</li><li>b</li></ul>", ul { li("a"); li("b") })
    @Test fun htmlEmptyList() = assertEquals("<ul></ul>", ul { })
    @Test fun htmlWithLoop() = assertEquals(
        "<ul><li>1</li><li>2</li><li>3</li></ul>",
        ul { for (i in 1..3) li(i.toString()) },
    )
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

data class Person(val name: String, val age: Int)

class PersonBuilder {
    var name = ""
    var age = 0

    fun build() = Person(name, age)
}

class Ul {
    private val items = mutableListOf<String>()

    fun li(text: String) { items += "<li>$text</li>" }

    fun render() = "<ul>${items.joinToString("")}</ul>"
}

//sampleStart
fun buildPerson(block: PersonBuilder.() -> Unit): Person {
    val builder = PersonBuilder()
    builder.block()
    return builder.build()
}

fun <T> T.myApply(block: T.() -> Unit): T {
    block()
    return this
}

fun ul(block: Ul.() -> Unit): String {
    val list = Ul()
    list.block()
    return list.render()
}
//sampleEnd

class ReceiverTest {
    @Test fun builder() {
        val p = buildPerson {
            name = "Ada"
            age = 36
        }
        assertEquals(Person("Ada", 36), p)
    }
    @Test fun builderKeepsDefaults() = assertEquals(Person("", 0), buildPerson { })
    @Test fun myApplyReturnsReceiver() {
        val sb = StringBuilder().myApply { append("hi") }
        assertEquals("hi", sb.toString())
    }
    @Test fun myApplyOnList() = assertEquals(listOf(1, 2), mutableListOf<Int>().myApply { add(1); add(2) })
    @Test fun htmlList() = assertEquals("<ul><li>a</li><li>b</li></ul>", ul { li("a"); li("b") })
    @Test fun htmlEmptyList() = assertEquals("<ul></ul>", ul { })
    @Test fun htmlWithLoop() = assertEquals(
        "<ul><li>1</li><li>2</li><li>3</li></ul>",
        ul { for (i in 1..3) li(i.toString()) },
    )
}
```
