---
title: "Capstone: processing orders"
section: Putting it together
---
Time to combine what you have learned. This is the kind of code a backend service has between "parse the request" and "return the response": data classes, nullable fields, collection pipelines, extension functions and safe parsing.

Here is the model (given in the editor):

```kotlin
data class OrderLine(val sku: String, val quantity: Int, val unitPriceCents: Int)
data class Order(val id: String, val customer: String?, val lines: List<OrderLine>)
```

## Your task

1. **`Order.totalCents()`** (an extension function): the sum of `quantity * unitPriceCents` over all lines.
2. **`revenueByCustomer(orders)`**: total cents per customer. Orders whose `customer` is `null` are grouped under `"guest"`.
3. **`topCustomer(orders)`**: the name of the customer with the highest revenue (guests count as `"guest"`), or `null` when there are no orders.
4. **`parseLine(raw)`**: parse text like `"WIDGET:3:250"` (`sku:quantity:unitPriceCents`) into an `OrderLine`. Anything else (wrong number of parts, non-numeric numbers, quantity below 1) returns `null`.

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
`val parts = raw.split(":")`. Check `parts.size == 3` and convert the numbers with `toIntOrNull()`. Use `?: return null` to bail out early on every failure, like a Python early `return None`.
```

```kotlin starter
import org.junit.Test
import kotlin.test.*

data class OrderLine(val sku: String, val quantity: Int, val unitPriceCents: Int)
data class Order(val id: String, val customer: String?, val lines: List<OrderLine>)

//sampleStart
fun Order.totalCents(): Int = TODO()

fun revenueByCustomer(orders: List<Order>): Map<String, Int> = TODO()

fun topCustomer(orders: List<Order>): String? = TODO()

fun parseLine(raw: String): OrderLine? = TODO()
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
    @Test fun validLine() = assertEquals(OrderLine("WIDGET", 3, 250), parseLine("WIDGET:3:250"))
    @Test fun wrongParts() = assertNull(parseLine("WIDGET:3"))
    @Test fun notNumbers() = assertNull(parseLine("W:x:250"))
    @Test fun priceNotNumber() = assertNull(parseLine("W:3:free"))
    @Test fun zeroQuantity() = assertNull(parseLine("W:0:250"))
}
```
```kotlin solution
import org.junit.Test
import kotlin.test.*

data class OrderLine(val sku: String, val quantity: Int, val unitPriceCents: Int)
data class Order(val id: String, val customer: String?, val lines: List<OrderLine>)

//sampleStart
fun Order.totalCents(): Int = lines.sumOf { it.quantity * it.unitPriceCents }

fun revenueByCustomer(orders: List<Order>): Map<String, Int> =
    orders
        .groupBy { it.customer ?: "guest" }
        .mapValues { (_, customerOrders) -> customerOrders.sumOf { it.totalCents() } }

fun topCustomer(orders: List<Order>): String? =
    revenueByCustomer(orders).entries.maxByOrNull { it.value }?.key

fun parseLine(raw: String): OrderLine? {
    val parts = raw.split(":")
    if (parts.size != 3) return null
    val quantity = parts[1].toIntOrNull() ?: return null
    val price = parts[2].toIntOrNull() ?: return null
    if (quantity < 1) return null
    return OrderLine(parts[0], quantity, price)
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
    @Test fun validLine() = assertEquals(OrderLine("WIDGET", 3, 250), parseLine("WIDGET:3:250"))
    @Test fun wrongParts() = assertNull(parseLine("WIDGET:3"))
    @Test fun notNumbers() = assertNull(parseLine("W:x:250"))
    @Test fun priceNotNumber() = assertNull(parseLine("W:3:free"))
    @Test fun zeroQuantity() = assertNull(parseLine("W:0:250"))
}
```
