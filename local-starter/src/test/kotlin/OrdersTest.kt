import kotlin.test.*

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
