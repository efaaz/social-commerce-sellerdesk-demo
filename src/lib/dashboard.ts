import type { Order, Product } from "@/types";

export function getDashboardMetrics(
  products: Product[],
  orders: Order[],
  now = new Date(),
) {
  const todayKey = now.toDateString();
  const todayOrders = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === todayKey,
  );
  const todayDelivered = todayOrders.filter(
    (order) => order.status === "DELIVERED",
  );
  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  );
  const todaySales = todayDelivered.reduce(
    (sum, order) => sum + order.total,
    0,
  );

  // Calculate estimated profit by summing up the profit from each delivered order using the formula: profit = (price - costPrice) * quantity for each item in the order
  const estimatedProfit = deliveredOrders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (itemSum, item) =>
          itemSum + (item.price - item.costPrice) * item.quantity,
        0,
      ),
    0,
  );

  // Identify products with low stock (5 or fewer units)
  const lowStockProducts = products.filter((product) => product.stock <= 5);
  const pendingCount = orders.filter(
    (order) => order.status === "PENDING",
  ).length;
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - index));
    const value = deliveredOrders
      .filter(
        (order) =>
          new Date(order.createdAt).toDateString() === date.toDateString(),
      )
      .reduce((sum, order) => sum + order.total, 0);
    return {
      label: date.toLocaleDateString("en-BD", { weekday: "short" }),
      value,
    };
  });

  return {
    todayOrders,
    todaySales,
    todayDeliveredCount: todayDelivered.length,
    deliveredOrders,
    estimatedProfit,
    lowStockProducts,
    pendingCount,
    weeklyData,
    chartMax: Math.max(...weeklyData.map((day) => day.value), 1000),
  };
}
