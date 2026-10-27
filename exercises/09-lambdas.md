---
title: Lambdas and higher-order functions
section: Functional style
---
Functions are values in Kotlin, as in Python. The big upgrade over Python's `lambda`: Kotlin lambdas can hold multiple statements, and the last expression is the result.

```python
square = lambda x: x * x
apply_twice = lambda f, x: f(f(x))
apply_twice(square, 3)   # 81
```
```kotlin
val square = { x: Int -> x * x }
fun applyTwice(f: (Int) -> Int, x: Int) = f(f(x))
applyTwice(square, 3)   // 81
```

Function types are written `(ParamTypes) -> ReturnType`. Three shortcuts you will see constantly:

- A lambda with a single parameter can use the implicit name **`it`**.
- If the lambda is the **last argument**, it goes outside the parentheses (a *trailing lambda*).
- If it is the only argument, the parentheses disappear entirely.

```kotlin run
fun main() {
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.map({ n: Int -> n * 10 }))   // explicit
    println(numbers.map { it * 10 })             // idiomatic
    println(numbers.fold(0) { acc, n -> acc + n })   // trailing lambda after other args

    val shout = { s: String ->
        val upper = s.uppercase()    // multi-statement lambda
        "$upper!"
    }
    println(shout("hey"))
}
```

```habit
**`return` inside a lambda.** The lambda's last expression is its result, so you don't need `return`. A bare `return` does something else: inside `forEach { }` or `map { }` it returns from the whole enclosing *function*, and in a lambda stored in a variable it doesn't compile (*'return' is prohibited here*). To leave only the lambda early, use a labelled `return@forEach`.
```

## Your task

1. `applyTwice(x, f)` applies `f` to `x` and then to the result again.
2. `makeAdder(n)` returns a function that adds `n` to its argument (a closure, as in Python).
3. `containsEven(numbers)` returns whether any number is even. Use the list's `any` function with a trailing lambda.

```hint
`f(f(x))`
```
```hint
The return type `(Int) -> Int` is a function, so return a lambda: `{ x -> x + n }` or `{ it + n }`.
```
```hint
`numbers.any { it % 2 == 0 }`
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

//sampleStart
fun applyTwice(x: Int, f: (Int) -> Int): Int = TODO()

fun makeAdder(n: Int): (Int) -> Int = TODO()

fun containsEven(numbers: List<Int>): Boolean = TODO()
//sampleEnd

class LambdaTest {
    @Test fun twice() = assertEquals(81, applyTwice(3) { it * it })
    @Test fun twiceAdd() = assertEquals(13, applyTwice(3) { it + 5 })
    @Test fun adder() = assertEquals(15, makeAdder(5)(10))
    @Test fun adderIndependent() {
        val add2 = makeAdder(2)
        val add100 = makeAdder(100)
        assertEquals(7, add2(5))
        assertEquals(105, add100(5))
    }
    @Test fun hasEven() = assertTrue(containsEven(listOf(1, 3, 4)))
    @Test fun noEven() = assertFalse(containsEven(listOf(1, 3, 5)))
    @Test fun emptyInput() = assertFalse(containsEven(emptyList()))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

//sampleStart
fun applyTwice(x: Int, f: (Int) -> Int): Int = f(f(x))

fun makeAdder(n: Int): (Int) -> Int = { it + n }

fun containsEven(numbers: List<Int>): Boolean = numbers.any { it % 2 == 0 }
//sampleEnd

class LambdaTest {
    @Test fun twice() = assertEquals(81, applyTwice(3) { it * it })
    @Test fun twiceAdd() = assertEquals(13, applyTwice(3) { it + 5 })
    @Test fun adder() = assertEquals(15, makeAdder(5)(10))
    @Test fun adderIndependent() {
        val add2 = makeAdder(2)
        val add100 = makeAdder(100)
        assertEquals(7, add2(5))
        assertEquals(105, add100(5))
    }
    @Test fun hasEven() = assertTrue(containsEven(listOf(1, 3, 4)))
    @Test fun noEven() = assertFalse(containsEven(listOf(1, 3, 5)))
    @Test fun emptyInput() = assertFalse(containsEven(emptyList()))
}
```
