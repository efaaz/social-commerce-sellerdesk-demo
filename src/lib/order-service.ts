import type {
  CreateOrderInput,
  DeliveryCharges,
  Order,
  OrderStatus,
  Product,
} from "@/types";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { createId } from "@/lib/utils";

export type CreateOrderResult =
  | { success: true; order: Order }
  | { success: false; error: string };

export type TransitionResult =
  | { success: true; orders: Order[]; products: Product[]; message: string }
  | { success: false; error: string };

export function createOrder(
  input: CreateOrderInput,
  products: Product[],
  deliveryCharges: DeliveryCharges,
): CreateOrderResult {
  if (
    !input.customerName.trim() ||
    !input.phone.trim() ||
    !input.address.trim()
  ) {
    return {
      success: false,
      error: "Add the customer's name, phone number, and delivery address.",
    };
  }
  if (
    input.deliveryArea !== "INSIDE_DHAKA" &&
    input.deliveryArea !== "OUTSIDE_DHAKA"
  ) {
    return { success: false, error: "Choose a delivery area for this order." };
  }
  if (
    !input.items.length ||
    input.items.some(
      (item) =>
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1,
    )
  ) {
    return {
      success: false,
      error: "Choose a product and a valid quantity for every order item.",
    };
  }

  // Aggregate quantities for each product to handle cases where the same product is added multiple times

  const quantities = getQuantitiesFromItems(input.items);

  // Validate that each product exists and has enough stock for the requested quantity
  const orderItems: Order["items"] = [];

  for (const [productId, quantity] of quantities) {
    const product = products.find((candidate) => candidate.id === productId);
    if (!product)
      return {
        success: false,
        error: "A selected product no longer exists. Review the order.",
      };
    if (quantity > product.stock) {
      return {
        success: false,
        error: `Only ${product.stock} unit(s) of ${product.name} are available.`,
      };
    }
    orderItems.push({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      price: product.price,
      costPrice: product.costPrice,
      quantity,
    });
  }
  // Validate the delivery charge for the selected area
  const deliveryCharge = deliveryCharges[input.deliveryArea];
  if (!Number.isInteger(deliveryCharge) || deliveryCharge < 0) {
    return {
      success: false,
      error: "The delivery charge is invalid. Update it in Settings.",
    };
  }

  const itemSubtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    success: true,
    order: {
      id: createId("SD"),
      customerName: input.customerName.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
      deliveryArea: input.deliveryArea,
      deliveryCharge,
      items: orderItems,
      total: itemSubtotal + deliveryCharge,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
  };
}

// Helper function to aggregate quantities from any list of items
function getQuantitiesFromItems(
  items: { productId: string; quantity: number }[],
): Map<string, number> {
  const quantities = new Map<string, number>();
  for (const item of items) {
    quantities.set(
      item.productId,
      (quantities.get(item.productId) ?? 0) + item.quantity,
    );
  }
  return quantities;
}

function getQuantitiesByProduct(order: Order): Map<string, number> {
  return getQuantitiesFromItems(order.items);
}

export function transitionOrderStatus(
  order: Order,
  nextStatus: OrderStatus,
  orders: Order[],
  products: Product[],
): TransitionResult {
  if (order.status === nextStatus) {
    return {
      success: true,
      orders,
      products,
      message: `Order is already ${ORDER_STATUS_LABELS[nextStatus].toLowerCase()}.`,
    };
  }
  if (order.status === "DELIVERED") {
    return {
      success: false,
      error: "Delivered orders are final in this demo.",
    };
  }
  if (order.status === "PENDING" && nextStatus === "DELIVERED") {
    return {
      success: false,
      error: "Confirm the order before marking it delivered.",
    };
  }
  if (order.status === "CONFIRMED" && nextStatus === "PENDING") {
    return {
      success: false,
      error:
        "A confirmed order cannot return to Pending. Cancel it to restore stock.",
    };
  }
  if (order.status === "CANCELLED" && nextStatus !== "CONFIRMED") {
    return {
      success: false,
      error: "A cancelled order can only be confirmed again.",
    };
  }

  let nextProducts = products;
  const quantities = getQuantitiesByProduct(order);

  if (nextStatus === "CONFIRMED") {
    const shortages = order.items.filter((item) => {
      const product = products.find(
        (candidate) => candidate.id === item.productId,
      );
      return (
        !product ||
        product.stock < (quantities.get(item.productId) ?? item.quantity)
      );
    });
    if (shortages.length) {
      return {
        success: false,
        error: `Not enough stock for ${shortages.map((item) => item.productName).join(", ")}.`,
      };
    }
    nextProducts = products.map((product) => {
      const quantity = quantities.get(product.id) ?? 0;
      return quantity
        ? { ...product, stock: product.stock - quantity }
        : product;
    });
  }

  if (nextStatus === "CANCELLED" && order.status === "CONFIRMED") {
    nextProducts = products.map((product) => {
      const quantity = quantities.get(product.id) ?? 0;
      return quantity
        ? { ...product, stock: product.stock + quantity }
        : product;
    });
  }

  const nextOrders = orders.map((candidate) =>
    candidate.id === order.id
      ? { ...candidate, status: nextStatus }
      : candidate,
  );

  return {
    success: true,
    orders: nextOrders,
    products: nextProducts,
    message: `Order ${order.id} marked ${ORDER_STATUS_LABELS[nextStatus].toLowerCase()}.`,
  };
}

export function getFilteredOrders(
  orders: Order[],
  searchTerm: string,
  statusFilter: "ALL" | OrderStatus,
): Order[] {
  const term = searchTerm.trim().toLowerCase();
  return [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .filter((order) => statusFilter === "ALL" || order.status === statusFilter)
    .filter(
      (order) =>
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.phone.toLowerCase().includes(term),
    );
}
