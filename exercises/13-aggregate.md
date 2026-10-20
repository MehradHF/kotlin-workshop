---
title: sum, count, fold and any/all
section: Collections
---
Aggregation is where Kotlin reads closest to English. Most of these replace a small loop or a generator expression inside `sum()`, `any()` or `all()`.

```python
total = sum(e.salary for e in staff)
rich = sum(1 for e in staff if e.salary > 100)
anyone = any("sql" in e.skills for e in staff)
everyone = all(e.salary > 50 for e in staff)
product = functools.reduce(lambda a, b: a * b, nums, 1)
```
```kotlin
val total = staff.sumOf { it.salary }
val rich = staff.count { it.salary > 100 }
val anyone = staff.any { "sql" in it.skills }
val everyone = staff.all { it.salary > 50 }
val product = nums.fold(1) { acc, n -> acc * n }
```

- `x in collection` is Kotlin's `in` too.
- `fold(initial) { acc, item -> ... }` is `functools.reduce` with the initial value first. `reduce { acc, item -> ... }` uses the first element as the start and fails on an empty list; prefer `fold`.
- `none { }` is the opposite of `any { }`.

```kotlin run
fun main() {
    val nums = listOf(3, 1, 4, 1, 5)
    println(nums.sum())                     // 14
    println(nums.sumOf { it * 2 })          // 28
    println(nums.count { it > 2 })          // 3
    println(nums.fold(1) { acc, n -> acc * n })   // 60
    println(nums.none { it > 10 })          // true
}
```

## Your task

Employees are given again. Implement:

1. `totalPayroll(es)`: the sum of all salaries.
2. `countHighEarners(es, threshold)`: how many earn **more than** `threshold`.
3. `anyoneKnows(es, skill)`: whether anyone has that skill.
4. `everyoneEarnsAtLeast(es, minimum)`: whether all salaries are `>= minimum`.
5. `product(nums)`: the product of the numbers using `fold`. The product of an empty list is `1`.

```hint
`es.sumOf { it.salary }`
```
```hint
`es.count { ... }`, `es.any { skill in it.skills }`, `es.all { ... }`
```
```hint
`nums.fold(1) { acc, n -> acc * n }`
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

data class Employee(val name: String, val dept: String, val salary: Int, val skills: List<String>)

val staff = listOf(
    Employee("Ada", "Eng", 120, listOf("kotlin", "sql")),
    Employee("Bob", "Ops", 90, listOf("bash", "sql")),
    Employee("Cy", "Eng", 100, listOf("python")),
    Employee("Di", "Ops", 95, emptyList()),
)

//sampleStart
fun totalPayroll(es: List<Employee>): Int = TODO()

fun countHighEarners(es: List<Employee>, threshold: Int): Int = TODO()

fun anyoneKnows(es: List<Employee>, skill: String): Boolean = TODO()

fun everyoneEarnsAtLeast(es: List<Employee>, minimum: Int): Boolean = TODO()

fun product(nums: List<Int>): Int = TODO()
//sampleEnd

class AggregateTest {
    @Test fun payroll() = assertEquals(405, totalPayroll(staff))
    @Test fun payrollEmpty() = assertEquals(0, totalPayroll(emptyList()))
    @Test fun highEarners() = assertEquals(2, countHighEarners(staff, 95))
    @Test fun knows() = assertTrue(anyoneKnows(staff, "python"))
    @Test fun nobodyKnows() = assertFalse(anyoneKnows(staff, "cobol"))
    @Test fun allAtLeast() = assertTrue(everyoneEarnsAtLeast(staff, 90))
    @Test fun notAllAtLeast() = assertFalse(everyoneEarnsAtLeast(staff, 91))
    @Test fun prod() = assertEquals(24, product(listOf(1, 2, 3, 4)))
    @Test fun prodEmpty() = assertEquals(1, product(emptyList()))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

data class Employee(val name: String, val dept: String, val salary: Int, val skills: List<String>)

val staff = listOf(
    Employee("Ada", "Eng", 120, listOf("kotlin", "sql")),
    Employee("Bob", "Ops", 90, listOf("bash", "sql")),
    Employee("Cy", "Eng", 100, listOf("python")),
    Employee("Di", "Ops", 95, emptyList()),
)

//sampleStart
fun totalPayroll(es: List<Employee>): Int = es.sumOf { it.salary }

fun countHighEarners(es: List<Employee>, threshold: Int): Int = es.count { it.salary > threshold }

fun anyoneKnows(es: List<Employee>, skill: String): Boolean = es.any { skill in it.skills }

fun everyoneEarnsAtLeast(es: List<Employee>, minimum: Int): Boolean = es.all { it.salary >= minimum }

fun product(nums: List<Int>): Int = nums.fold(1) { acc, n -> acc * n }
//sampleEnd

class AggregateTest {
    @Test fun payroll() = assertEquals(405, totalPayroll(staff))
    @Test fun payrollEmpty() = assertEquals(0, totalPayroll(emptyList()))
    @Test fun highEarners() = assertEquals(2, countHighEarners(staff, 95))
    @Test fun knows() = assertTrue(anyoneKnows(staff, "python"))
    @Test fun nobodyKnows() = assertFalse(anyoneKnows(staff, "cobol"))
    @Test fun allAtLeast() = assertTrue(everyoneEarnsAtLeast(staff, 90))
    @Test fun notAllAtLeast() = assertFalse(everyoneEarnsAtLeast(staff, 91))
    @Test fun prod() = assertEquals(24, product(listOf(1, 2, 3, 4)))
    @Test fun prodEmpty() = assertEquals(1, product(emptyList()))
}
```
