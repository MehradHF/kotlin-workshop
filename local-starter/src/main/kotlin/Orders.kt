data class OrderLine(val sku: String, val quantity: Int, val unitPriceCents: Int)
data class Order(val id: String, val customer: String?, val lines: List<OrderLine>)

// Paste your capstone solution over the four functions below, then run the tests.

fun Order.totalCents(): Int = TODO()

fun revenueByCustomer(orders: List<Order>): Map<String, Int> = TODO()

fun topCustomer(orders: List<Order>): String? = TODO()

fun parseLine(raw: String): OrderLine? = TODO()
