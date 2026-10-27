---
title: groupBy, partition and flatMap
section: Collections
---
The functions you would reach for `defaultdict`, `itertools.groupby` or a loop with two lists to do.

```python
by_dept = defaultdict(list)
for e in staff:
    by_dept[e.dept].append(e.name)

high, low = [], []
for e in staff:
    (high if e.salary > 100 else low).append(e)

skills = {s for e in staff for s in e.skills}
```
```kotlin
val byDept = staff.groupBy({ it.dept }, { it.name })

val (high, low) = staff.partition { it.salary > 100 }

val skills = staff.flatMap { it.skills }.toSet()
```

- `groupBy { key }` gives `Map<Key, List<Item>>`. The two-lambda form also transforms each item.
- `partition { cond }` returns a `Pair` of two lists (matching, not matching). You can destructure it as above.
- `flatMap { list }` maps and then flattens one level.
- `associate { key to value }` builds a map; later keys win on duplicates.

```kotlin run
data class Employee(val name: String, val dept: String, val salary: Int)

fun main() {
    val staff = listOf(Employee("Ada", "Eng", 120), Employee("Bob", "Ops", 90), Employee("Cy", "Eng", 100))
    println(staff.groupBy { it.dept }.mapValues { (_, es) -> es.size })   // {Eng=2, Ops=1}
    println(staff.map { it.name }.groupingBy { it.length }.eachCount())
}
```

```habit
**`setdefault` and `if key not in d`.** When you really do need to fill a mutable map step by step, `map.getOrPut(key) { mutableListOf() }.add(item)` is the `setdefault` / `defaultdict` idiom. But first check whether `groupBy` or `associate` builds the whole map in one go.
```

## Your task

The `Employee` data class and a `staff` list are given at the top. Implement:

1. `namesByDept(es)`: `Map<String, List<String>>` from department to employee names.
2. `splitByPay(es, threshold)`: a `Pair` of (employees earning **more than** the threshold, everyone else).
3. `salaryByName(es)`: map from name to salary.
4. `uniqueSkills(es)`: the set of all skills across everyone.

```hint
`es.groupBy({ it.dept }, { it.name })`
```
```hint
`es.partition { it.salary > threshold }` already returns the right `Pair`.
```
```hint
`es.associate { it.name to it.salary }`
```
```hint
`es.flatMap { it.skills }.toSet()`
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
fun namesByDept(es: List<Employee>): Map<String, List<String>> = TODO()

fun splitByPay(es: List<Employee>, threshold: Int): Pair<List<Employee>, List<Employee>> = TODO()

fun salaryByName(es: List<Employee>): Map<String, Int> = TODO()

fun uniqueSkills(es: List<Employee>): Set<String> = TODO()
//sampleEnd

class GroupTest {
    @Test fun byDept() = assertEquals(mapOf("Eng" to listOf("Ada", "Cy"), "Ops" to listOf("Bob", "Di")), namesByDept(staff))
    @Test fun split() {
        val (high, low) = splitByPay(staff, 95)
        assertEquals(listOf("Ada", "Cy"), high.map { it.name })
        assertEquals(listOf("Bob", "Di"), low.map { it.name })
    }
    @Test fun salaries() = assertEquals(mapOf("Ada" to 120, "Bob" to 90, "Cy" to 100, "Di" to 95), salaryByName(staff))
    @Test fun skills() = assertEquals(setOf("kotlin", "sql", "bash", "python"), uniqueSkills(staff))
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
fun namesByDept(es: List<Employee>): Map<String, List<String>> = es.groupBy({ it.dept }, { it.name })

fun splitByPay(es: List<Employee>, threshold: Int): Pair<List<Employee>, List<Employee>> =
    es.partition { it.salary > threshold }

fun salaryByName(es: List<Employee>): Map<String, Int> = es.associate { it.name to it.salary }

fun uniqueSkills(es: List<Employee>): Set<String> = es.flatMap { it.skills }.toSet()
//sampleEnd

class GroupTest {
    @Test fun byDept() = assertEquals(mapOf("Eng" to listOf("Ada", "Cy"), "Ops" to listOf("Bob", "Di")), namesByDept(staff))
    @Test fun split() {
        val (high, low) = splitByPay(staff, 95)
        assertEquals(listOf("Ada", "Cy"), high.map { it.name })
        assertEquals(listOf("Bob", "Di"), low.map { it.name })
    }
    @Test fun salaries() = assertEquals(mapOf("Ada" to 120, "Bob" to 90, "Cy" to 100, "Di" to 95), salaryByName(staff))
    @Test fun skills() = assertEquals(setOf("kotlin", "sql", "bash", "python"), uniqueSkills(staff))
}
```
