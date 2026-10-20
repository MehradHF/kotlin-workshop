---
title: "Capstone: processing orders"
section: Putting it together
---
Time to combine what you have learned. This is the kind of code a backend service has between "parse the request" and "return the response": data classes, nullable fields, collection pipelines, extension functions and a `sealed` result.

Here is the model (given in the editor):

```kotlin
data class OrderLine(val sku: String, val quantity: Int, val unitPriceCents: Int)
data class Order(val id: String, val customer: String?, val lines: List<OrderLine>)

sealed interface ParsedLine
data class ValidLine(val line: OrderLine) : ParsedLine
data class InvalidLine(val raw: String) : ParsedLine
```

## Your task

1. **`Order.totalCents()`** (an extension function): the sum of `quantity * unitPriceCents` over all lines.
2. **`revenueByCustomer(orders)`**: total cents per customer. Orders whose `customer` is `null` are grouped under `"guest"`.
3. **`topCustomer(orders)`**: the name of the customer with the highest revenue (guests count as `"guest"`), or `null` when there are no orders.
4. **`parseLine(raw)`**: parse text like `"WIDGET:3:250"` (`sku:quantity:unitPriceCents`) into a `ValidLine`. Anything else (wrong number of parts, non-numeric numbers, quantity below 1) becomes `InvalidLine(raw)`.

```hint
`lines.sumOf { it.quantity * it.unitPriceCents }`
```
```hint
`orders.groupBy { it.customer ?: "guest" }` gives `Map<String, List<Order>>`; then `mapValues { (_, os) -> os.sumOf { it.totalCents() } }`.
```
```hint
Take the `maxByOrNull` of `revenueByCustomer(orders).entries` by value, then ask for its `key`: `?.key`.
```
```hint
`val parts = raw.split(":")`. Check `parts.size == 3`, convert with `toIntOrNull()`, and fall back to `InvalidLine(raw)` for every failure. A chain of `?:` returns keeps it short, or use a `when`.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

data class OrderLine(val sku: String, val quantity: Int, val unitPriceCents: Int)
data class Order(val id: String, val customer: String?, val lines: List<OrderLine>)

sealed interface ParsedLine
data class ValidLine(val line: OrderLine) : ParsedLine
data class InvalidLine(val raw: String) : ParsedLine

//sampleStart
fun Order.totalCents(): Int = TODO()

fun revenueByCustomer(orders: List<Order>): Map<String, Int> = TODO()

fun topCustomer(orders: List<Order>): String? = TODO()

fun parseLine(raw: String): ParsedLine = TODO()
//sampleEnd

class OrdersTest {
    private val orders = listOf(
        Order("o1", "ada", listOf(OrderLine("A", 2, 500), OrderLine("B", 1, 250))),   // 1250
        Order("o2", "bob", listOf(OrderLine("A", 1, 500))),                           // 500
        Order("o3", null, listOf(OrderLine("C", 3, 100))),                            // 300
        Order("o4", "ada", listOf(OrderLine("B", 4, 250))),                           // 1000
    )

    @Test fun total() = assertEquals(1250, orders[0].totalCents())
    @Test fun totalOfEmptyOrder() = assertEquals(0, Order("x", "ada", emptyList()).totalCents())
    @Test fun revenue() = assertEquals(mapOf("ada" to 2250, "bob" to 500, "guest" to 300), revenueByCustomer(orders))
    @Test fun top() = assertEquals("ada", topCustomer(orders))
    @Test fun topOfNothing() = assertNull(topCustomer(emptyList()))
    @Test fun validLine() = assertEquals(ValidLine(OrderLine("WIDGET", 3, 250)), parseLine("WIDGET:3:250"))
    @Test fun wrongParts() = assertEquals(InvalidLine("WIDGET:3"), parseLine("WIDGET:3"))
    @Test fun notNumbers() = assertEquals(InvalidLine("W:x:250"), parseLine("W:x:250"))
    @Test fun zeroQuantity() = assertEquals(InvalidLine("W:0:250"), parseLine("W:0:250"))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

data class OrderLine(val sku: String, val quantity: Int, val unitPriceCents: Int)
data class Order(val id: String, val customer: String?, val lines: List<OrderLine>)

sealed interface ParsedLine
data class ValidLine(val line: OrderLine) : ParsedLine
data class InvalidLine(val raw: String) : ParsedLine

//sampleStart
fun Order.totalCents(): Int = lines.sumOf { it.quantity * it.unitPriceCents }

fun revenueByCustomer(orders: List<Order>): Map<String, Int> =
    orders
        .groupBy { it.customer ?: "guest" }
        .mapValues { (_, customerOrders) -> customerOrders.sumOf { it.totalCents() } }

fun topCustomer(orders: List<Order>): String? =
    revenueByCustomer(orders).entries.maxByOrNull { it.value }?.key

fun parseLine(raw: String): ParsedLine {
    val parts = raw.split(":")
    if (parts.size != 3) return InvalidLine(raw)
    val quantity = parts[1].toIntOrNull() ?: return InvalidLine(raw)
    val price = parts[2].toIntOrNull() ?: return InvalidLine(raw)
    if (quantity < 1) return InvalidLine(raw)
    return ValidLine(OrderLine(parts[0], quantity, price))
}
//sampleEnd

class OrdersTest {
    private val orders = listOf(
        Order("o1", "ada", listOf(OrderLine("A", 2, 500), OrderLine("B", 1, 250))),   // 1250
        Order("o2", "bob", listOf(OrderLine("A", 1, 500))),                           // 500
        Order("o3", null, listOf(OrderLine("C", 3, 100))),                            // 300
        Order("o4", "ada", listOf(OrderLine("B", 4, 250))),                           // 1000
    )

    @Test fun total() = assertEquals(1250, orders[0].totalCents())
    @Test fun totalOfEmptyOrder() = assertEquals(0, Order("x", "ada", emptyList()).totalCents())
    @Test fun revenue() = assertEquals(mapOf("ada" to 2250, "bob" to 500, "guest" to 300), revenueByCustomer(orders))
    @Test fun top() = assertEquals("ada", topCustomer(orders))
    @Test fun topOfNothing() = assertNull(topCustomer(emptyList()))
    @Test fun validLine() = assertEquals(ValidLine(OrderLine("WIDGET", 3, 250)), parseLine("WIDGET:3:250"))
    @Test fun wrongParts() = assertEquals(InvalidLine("WIDGET:3"), parseLine("WIDGET:3"))
    @Test fun notNumbers() = assertEquals(InvalidLine("W:x:250"), parseLine("W:x:250"))
    @Test fun zeroQuantity() = assertEquals(InvalidLine("W:0:250"), parseLine("W:0:250"))
}
```
