fun main() {
    val raw = listOf("WIDGET:3:250", "GADGET:1:1999", "not a line")
    val lines = raw.mapNotNull { parseLine(it) }
    val order = Order("o1", "ada", lines)
    println("Parsed ${lines.size} of ${raw.size} lines")
    println("Total: ${order.totalCents()} cents")
}
