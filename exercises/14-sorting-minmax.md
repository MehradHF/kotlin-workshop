---
title: Sorting, min and max
section: Collections
---
`sorted(key=...)` becomes `sortedBy { }`. The most important difference from Python: `max`/`min` on an empty collection does not raise. The `...OrNull` versions return `null`, which the type system makes you handle.

```python
sorted(staff, key=lambda e: e.salary, reverse=True)
sorted(staff, key=lambda e: (e.dept, -e.salary))
max(staff, key=lambda e: e.salary, default=None)
```
```kotlin
staff.sortedByDescending { it.salary }
staff.sortedWith(compareBy({ it.dept }, { -it.salary }))
staff.maxByOrNull { it.salary }
```

| Python | Kotlin |
|---|---|
| `sorted(xs)` | `xs.sorted()` |
| `sorted(xs, reverse=True)` | `xs.sortedDescending()` |
| `sorted(xs, key=k)` | `xs.sortedBy { k }` |
| `xs.sort()` (in place) | `mutableList.sort()` |
| `max(xs, key=k)` | `xs.maxByOrNull { k }` |
| `max(xs)` | `xs.maxOrNull()` |
| `xs[:n]` | `xs.take(n)` |

```kotlin run
fun main() {
    val words = listOf("pear", "fig", "banana", "kiwi")
    println(words.sortedBy { it.length })
    println(words.sortedWith(compareBy({ it.length }, { it })))   // by length, then alphabetically
    println(words.maxByOrNull { it.length })                       // banana
    println(emptyList<String>().maxByOrNull { it.length })         // null
}
```

```habit
**Negating a sort key to reverse it.** `(e.dept, -e.salary)` translates directly for numbers, but you can't negate a string. Build the comparator instead: `compareBy<Employee> { it.dept }.thenByDescending { it.name }`. It reads better, too.
```

## Your task

1. `topEarner(es)`: the employee with the highest salary, or `null` if the list is empty.
2. `topNames(es, n)`: names of the `n` highest-paid employees, highest first.
3. `byDeptThenPay(es)`: employees sorted by department name, and within a department by salary descending.

```hint
`es.maxByOrNull { it.salary }`
```
```hint
`es.sortedByDescending { it.salary }.take(n).map { it.name }`
```
```hint
`es.sortedWith(compareBy({ it.dept }, { -it.salary }))`. Negating the salary sorts it in descending order.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

data class Employee(val name: String, val dept: String, val salary: Int)

val staff = listOf(
    Employee("Ada", "Eng", 120),
    Employee("Bob", "Ops", 90),
    Employee("Cy", "Eng", 100),
    Employee("Di", "Ops", 95),
)

//sampleStart
fun topEarner(es: List<Employee>): Employee? = TODO()

fun topNames(es: List<Employee>, n: Int): List<String> = TODO()

fun byDeptThenPay(es: List<Employee>): List<Employee> = TODO()
//sampleEnd

class SortingTest {
    @Test fun top() = assertEquals("Ada", topEarner(staff)?.name)
    @Test fun topOfNothing() = assertNull(topEarner(emptyList()))
    @Test fun topTwo() = assertEquals(listOf("Ada", "Cy"), topNames(staff, 2))
    @Test fun topMoreThanExist() = assertEquals(listOf("Ada", "Cy", "Di", "Bob"), topNames(staff, 10))
    @Test fun sorted() = assertEquals(listOf("Ada", "Cy", "Di", "Bob"), byDeptThenPay(staff).map { it.name })
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

data class Employee(val name: String, val dept: String, val salary: Int)

val staff = listOf(
    Employee("Ada", "Eng", 120),
    Employee("Bob", "Ops", 90),
    Employee("Cy", "Eng", 100),
    Employee("Di", "Ops", 95),
)

//sampleStart
fun topEarner(es: List<Employee>): Employee? = es.maxByOrNull { it.salary }

fun topNames(es: List<Employee>, n: Int): List<String> =
    es.sortedByDescending { it.salary }.take(n).map { it.name }

fun byDeptThenPay(es: List<Employee>): List<Employee> =
    es.sortedWith(compareBy({ it.dept }, { -it.salary }))
//sampleEnd

class SortingTest {
    @Test fun top() = assertEquals("Ada", topEarner(staff)?.name)
    @Test fun topOfNothing() = assertNull(topEarner(emptyList()))
    @Test fun topTwo() = assertEquals(listOf("Ada", "Cy"), topNames(staff, 2))
    @Test fun topMoreThanExist() = assertEquals(listOf("Ada", "Cy", "Di", "Bob"), topNames(staff, 10))
    @Test fun sorted() = assertEquals(listOf("Ada", "Cy", "Di", "Bob"), byDeptThenPay(staff).map { it.name })
}
```
